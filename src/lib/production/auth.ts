import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { authSessions, getProductionDb, users } from "@/lib/production/db";
import bcryptjs from "bcryptjs";

const SESSION_COOKIE = "app_session_id";
const TOKEN_PATTERN = /^v1\.[A-Za-z0-9_-]{43}$/;

export type ProductionSessionUser = typeof users.$inferSelect;

function hashToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export async function getProductionSessionUser(): Promise<ProductionSessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !TOKEN_PATTERN.test(token)) return null;
  const rows = await getProductionDb()
    .select({ session: authSessions, user: users })
    .from(authSessions)
    .innerJoin(users, eq(authSessions.userId, users.id))
    .where(and(eq(authSessions.tokenHash, hashToken(token)), isNull(authSessions.revokedAt)))
    .limit(1);
  const row = rows[0];
  if (!row || new Date(row.session.expiresAt).getTime() <= Date.now()) return null;
  return row.user;
}

export async function isProductionAdmin() {
  return (await getProductionSessionUser())?.role === "admin";
}

function sanitizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase().slice(0, 320) : "";
}

function sanitizeText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function issueSession(userId: number) {
  const token = `v1.${randomBytes(32).toString("base64url")}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await getProductionDb().insert(authSessions).values({ tokenHash: hashToken(token), userId, expiresAt });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function registerProductionCustomer(input: { name?: unknown; email?: unknown; password?: unknown }) {
  const name = sanitizeText(input.name, 120);
  const email = sanitizeEmail(input.email);
  const password = typeof input.password === "string" ? input.password : "";
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) throw new Error("invalid_registration");
  const db = getProductionDb();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) throw new Error("email_in_use");
  const hash = await bcryptjs.hash(password, 10);
  const result = await db.insert(users).values({
    openId: `native_${randomBytes(12).toString("hex")}`,
    name,
    email,
    passwordHash: hash,
    loginMethod: "native",
    role: "user",
  });
  const id = Number(result[0]?.insertId);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error("registration_failed");
  await issueSession(id);
}

export async function loginProductionCustomer(input: { email?: unknown; password?: unknown }) {
  const email = sanitizeEmail(input.email);
  const password = typeof input.password === "string" ? input.password : "";
  const row = (await getProductionDb().select().from(users).where(eq(users.email, email)).limit(1))[0];
  if (!row?.passwordHash || !(await bcryptjs.compare(password, row.passwordHash))) throw new Error("invalid_credentials");
  await issueSession(row.id);
  return row.role;
}

export async function logoutProductionCustomer() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token && TOKEN_PATTERN.test(token)) {
    await getProductionDb().update(authSessions).set({ revokedAt: new Date() }).where(eq(authSessions.tokenHash, hashToken(token)));
  }
  (await cookies()).delete(SESSION_COOKIE);
}
