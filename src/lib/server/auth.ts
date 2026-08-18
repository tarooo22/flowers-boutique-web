import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal admin session: a signed, httpOnly cookie.
 *
 * The password comes from ADMIN_PASSWORD and the signing key from
 * ADMIN_SESSION_SECRET. Both fall back to demo values so the panel is usable
 * out of the box locally — set real ones before exposing this anywhere.
 */

const COOKIE = "fb_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

const password = () => process.env.ADMIN_PASSWORD || "flowers-admin";
const secret = () => process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret";

/** true when the deployment is still using the built-in demo credentials */
export function usingDemoCredentials(): boolean {
  return !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  return safeEqual(input, password());
}

/** token format: <issuedAt>.<signature> */
export function createToken(): string {
  const issued = String(Date.now());
  return `${issued}.${sign(issued)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [issued, signature] = token.split(".");
  if (!issued || !signature) return false;
  if (!safeEqual(signature, sign(issued))) return false;
  const age = (Date.now() - Number(issued)) / 1000;
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
