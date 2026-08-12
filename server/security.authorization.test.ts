import { describe, expect, it } from "vitest";
import { router, protectedProcedure, adminProcedure } from "./_core/trpc";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

const securityRouter = router({
  profile: protectedProcedure.query(({ ctx }) => ({ userId: ctx.user.id })),
  admin: adminProcedure.query(({ ctx }) => ({ userId: ctx.user.id })),
});

function user(role: "user" | "admin", id: number): User {
  return {
    id,
    openId: null,
    name: role,
    email: `${role}@example.com`,
    phone: null,
    passwordHash: null,
    loginMethod: "native",
    role,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    lastSignedIn: new Date(0),
  };
}

function context(currentUser: User | null): TrpcContext {
  return { user: currentUser, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("canonical tRPC authorization", () => {
  it("rejects a missing session on protected procedures", async () => {
    await expect(securityRouter.createCaller(context(null)).profile()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("allows a normal user to access their protected profile", async () => {
    await expect(securityRouter.createCaller(context(user("user", 10))).profile()).resolves.toEqual({
      userId: 10,
    });
  });

  it("forbids a normal user from admin procedures", async () => {
    await expect(securityRouter.createCaller(context(user("user", 10))).admin()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("allows a verified admin to access admin procedures", async () => {
    await expect(securityRouter.createCaller(context(user("admin", 1))).admin()).resolves.toEqual({
      userId: 1,
    });
  });
});
