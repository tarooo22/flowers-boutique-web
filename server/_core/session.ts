import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import type { Request, Response } from "express";
import { parse as parseCookieHeader } from "cookie";
import { authSessions, users, type User } from "../../drizzle/schema";
import { COOKIE_NAME } from "../../shared/const";
import { getDb } from "../db";
import { getSessionCookieOptions } from "./cookies";

export const AUTH_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_PATTERN = /^v1\.[A-Za-z0-9_-]{43}$/;

export type StoredAuthSession = {
  tokenHash: string;
  userId: number;
  expiresAt: Date;
  revokedAt: Date | null;
  user: User;
};

export interface AuthSessionStore {
  create(record: {
    tokenHash: string;
    userId: number;
    expiresAt: Date;
    createdAt: Date;
    lastUsedAt: Date;
  }): Promise<void>;
  find(tokenHash: string): Promise<StoredAuthSession | null>;
  touch(tokenHash: string, at: Date): Promise<void>;
  revoke(tokenHash: string, at: Date): Promise<void>;
}

const databaseSessionStore: AuthSessionStore = {
  async create(record) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    await db.insert(authSessions).values(record);
  },

  async find(tokenHash) {
    const db = await getDb();
    if (!db) return null;

    const rows = await db
      .select({ session: authSessions, user: users })
      .from(authSessions)
      .innerJoin(users, eq(authSessions.userId, users.id))
      .where(and(eq(authSessions.tokenHash, tokenHash), isNull(authSessions.revokedAt)))
      .limit(1);

    const row = rows[0];
    return row ? { ...row.session, user: row.user } : null;
  },

  async touch(tokenHash, at) {
    const db = await getDb();
    if (!db) return;
    await db
      .update(authSessions)
      .set({ lastUsedAt: at })
      .where(and(eq(authSessions.tokenHash, tokenHash), isNull(authSessions.revokedAt)));
  },

  async revoke(tokenHash, at) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    await db
      .update(authSessions)
      .set({ revokedAt: at })
      .where(and(eq(authSessions.tokenHash, tokenHash), isNull(authSessions.revokedAt)));
  },
};

type SessionDependencies = {
  store?: AuthSessionStore;
  now?: () => Date;
  tokenFactory?: () => string;
  ttlMs?: number;
};

function tokenHash(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function generateOpaqueToken(): string {
  return `v1.${randomBytes(32).toString("base64url")}`;
}

export function isValidSessionTokenFormat(token: string | undefined | null): token is string {
  return typeof token === "string" && TOKEN_PATTERN.test(token);
}

export async function createAuthSession(
  userId: number,
  dependencies: SessionDependencies = {},
): Promise<string> {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("A valid authenticated user is required");
  }

  const store = dependencies.store ?? databaseSessionStore;
  const now = dependencies.now?.() ?? new Date();
  const token = dependencies.tokenFactory?.() ?? generateOpaqueToken();
  if (!isValidSessionTokenFormat(token)) {
    throw new Error("Session token factory returned an invalid token");
  }

  await store.create({
    tokenHash: tokenHash(token),
    userId,
    expiresAt: new Date(now.getTime() + (dependencies.ttlMs ?? AUTH_SESSION_TTL_MS)),
    createdAt: now,
    lastUsedAt: now,
  });

  return token;
}

export async function authenticateSessionToken(
  token: string | undefined | null,
  dependencies: SessionDependencies = {},
): Promise<User | null> {
  if (!isValidSessionTokenFormat(token)) return null;

  const store = dependencies.store ?? databaseSessionStore;
  const now = dependencies.now?.() ?? new Date();
  const hash = tokenHash(token);
  const session = await store.find(hash);

  if (!session || session.revokedAt) return null;
  if (session.expiresAt.getTime() <= now.getTime()) {
    await store.revoke(hash, now);
    return null;
  }

  await store.touch(hash, now);
  return session.user;
}

export async function revokeAuthSession(
  token: string | undefined | null,
  dependencies: SessionDependencies = {},
): Promise<void> {
  if (!isValidSessionTokenFormat(token)) return;
  const store = dependencies.store ?? databaseSessionStore;
  const now = dependencies.now?.() ?? new Date();
  await store.revoke(tokenHash(token), now);
}

export function getAuthSessionToken(req: Request): string | undefined {
  const cookies = parseCookieHeader(req.headers.cookie ?? "");
  return cookies[COOKIE_NAME];
}

export async function issueAuthSession(
  req: Request,
  res: Response,
  userId: number,
  dependencies: SessionDependencies = {},
): Promise<string> {
  const token = await createAuthSession(userId, dependencies);
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: dependencies.ttlMs ?? AUTH_SESSION_TTL_MS,
  });
  return token;
}

export async function destroyAuthSession(
  req: Request,
  res: Response,
  dependencies: SessionDependencies = {},
): Promise<void> {
  const token = getAuthSessionToken(req);
  try {
    await revokeAuthSession(token, dependencies);
  } finally {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, cookieOptions);
  }
}
