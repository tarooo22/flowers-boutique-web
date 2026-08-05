import { describe, expect, it } from "vitest";
import type { Request, Response } from "express";
import type { User } from "../drizzle/schema";
import { COOKIE_NAME } from "../shared/const";
import { sdk } from "./_core/sdk";
import {
  authenticateSessionToken,
  createAuthSession,
  destroyAuthSession,
  issueAuthSession,
  type AuthSessionStore,
  type StoredAuthSession,
} from "./_core/session";

const customer: User = {
  id: 7,
  openId: null,
  name: "Customer",
  email: "customer@example.com",
  phone: null,
  passwordHash: null,
  loginMethod: "native",
  role: "customer",
  createdAt: new Date(0),
  updatedAt: new Date(0),
  lastSignedIn: new Date(0),
};

class MemorySessionStore implements AuthSessionStore {
  records = new Map<string, StoredAuthSession>();

  async create(record: Omit<StoredAuthSession, "revokedAt" | "user">) {
    this.records.set(record.tokenHash, { ...record, revokedAt: null, user: customer });
  }

  async find(tokenHash: string) {
    return this.records.get(tokenHash) ?? null;
  }

  async touch(_tokenHash: string, _at: Date) {}

  async revoke(tokenHash: string, at: Date) {
    const record = this.records.get(tokenHash);
    if (record) this.records.set(tokenHash, { ...record, revokedAt: at });
  }
}

const fixedToken = `v1.${"A".repeat(43)}`;

describe("opaque authentication sessions", () => {
  it("rejects a modified session cookie", async () => {
    const store = new MemorySessionStore();
    await createAuthSession(customer.id, { store, tokenFactory: () => fixedToken });

    const modified = `${fixedToken.slice(0, -1)}B`;
    await expect(authenticateSessionToken(modified, { store })).resolves.toBeNull();
  });

  it("does not accept an arbitrary userId cookie", async () => {
    const request = { headers: { cookie: "userId=1" } } as Request;
    await expect(sdk.authenticateRequest(request)).rejects.toThrow();
  });

  it("rejects an expired session", async () => {
    const store = new MemorySessionStore();
    await createAuthSession(customer.id, {
      store,
      tokenFactory: () => fixedToken,
      now: () => new Date(1_000),
      ttlMs: 1_000,
    });

    await expect(
      authenticateSessionToken(fixedToken, { store, now: () => new Date(2_001) }),
    ).resolves.toBeNull();
  });

  it("login session issuance creates a secure HttpOnly cookie", async () => {
    const store = new MemorySessionStore();
    const cookieCalls: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];
    const request = { protocol: "https", headers: {} } as Request;
    const response = {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        cookieCalls.push({ name, value, options });
      },
    } as unknown as Response;

    const token = await issueAuthSession(request, response, customer.id, {
      store,
      tokenFactory: () => fixedToken,
    });

    expect(token).toBe(fixedToken);
    expect(cookieCalls).toHaveLength(1);
    expect(cookieCalls[0]).toMatchObject({
      name: COOKIE_NAME,
      value: fixedToken,
      options: {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      },
    });
    expect(cookieCalls[0]?.options.maxAge).toBeGreaterThan(0);
    await expect(authenticateSessionToken(token, { store })).resolves.toMatchObject({ id: customer.id });
  });

  it("logout revokes the server-side session and clears the cookie", async () => {
    const store = new MemorySessionStore();
    await createAuthSession(customer.id, { store, tokenFactory: () => fixedToken });
    const cleared: string[] = [];
    const request = {
      protocol: "https",
      headers: { cookie: `${COOKIE_NAME}=${fixedToken}` },
    } as Request;
    const response = {
      clearCookie: (name: string) => cleared.push(name),
    } as unknown as Response;

    await destroyAuthSession(request, response, { store });

    expect(cleared).toEqual([COOKIE_NAME]);
    await expect(authenticateSessionToken(fixedToken, { store })).resolves.toBeNull();
  });
});
