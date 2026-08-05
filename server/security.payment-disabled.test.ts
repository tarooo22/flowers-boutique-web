import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import type { User } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";
import { getBogCardPaymentMode } from "./_core/env";
import { appRouter } from "./routers";
import {
  CARD_PAYMENT_UNAVAILABLE,
  disabledBOGCallbackHandler,
} from "./paymentAvailability";

function user(role: "customer" | "admin", id: number): User {
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
  return {
    user: currentUser,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const validPaymentInput = {
  customerName: "Test Customer",
  customerEmail: "test@example.com",
  customerPhone: "555123456",
  items: [{ productId: 1, quantity: 1 }],
  fulfillmentType: "pickup" as const,
};

describe("disabled BOG payment paths", () => {
  it("stays disabled even if an environment value attempts to enable it", () => {
    const previous = process.env.BOG_CARD_PAYMENT_MODE;
    process.env.BOG_CARD_PAYMENT_MODE = "public";
    try {
      expect(getBogCardPaymentMode()).toBe("disabled");
    } finally {
      if (previous === undefined) delete process.env.BOG_CARD_PAYMENT_MODE;
      else process.env.BOG_CARD_PAYMENT_MODE = previous;
    }
  });

  it("rejects guests before the protected create-order procedure", async () => {
    await expect(
      appRouter.createCaller(context(null)).payments.createBOGOrder(validPaymentInput),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it.each([
    ["customer", user("customer", 10)],
    ["admin", user("admin", 1)],
  ])("rejects an authenticated %s without DB or HTTP work", async (_label, currentUser) => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    try {
      await expect(
        appRouter.createCaller(context(currentUser)).payments.createBOGOrder(validPaymentInput),
      ).rejects.toMatchObject({
        code: "SERVICE_UNAVAILABLE",
        message: CARD_PAYMENT_UNAVAILABLE,
      });
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("keeps the checkout free of a card-payment action", () => {
    const source = readFileSync(
      new URL("../client/src/pages/Checkout.tsx", import.meta.url),
      "utf8",
    );
    expect(source).not.toContain("trpc.payments.createBOGOrder");
    expect(source).not.toContain("handleCardPayment");
    expect(source).not.toContain("VITE_BOG_CARD_PAYMENT_MODE");
    expect(source).not.toContain("<CreditCard");
  });

  it("keeps active server entry points disconnected from BOG HTTP helpers", () => {
    const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
    const indexSource = readFileSync(new URL("./_core/index.ts", import.meta.url), "utf8");
    const paymentBlock = routerSource.slice(
      routerSource.indexOf("payments: router"),
      routerSource.indexOf("// Admin order management"),
    );

    expect(paymentBlock).not.toContain("createCanonicalOrder(");
    expect(paymentBlock).not.toContain("createBOGOrder({");
    expect(routerSource).not.toContain("getBOGOrderStatus");
    expect(routerSource).not.toContain('from "./_core/bog"');
    expect(indexSource).not.toContain('from "./bog"');
  });

  it("returns a controlled disabled callback response without processing", () => {
    const response = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    disabledBOGCallbackHandler({} as Request, response);

    expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: CARD_PAYMENT_UNAVAILABLE,
    });
  });

  it("rejects admin reconciliation without reading or updating an order", async () => {
    await expect(
      appRouter.createCaller(context(user("admin", 1))).admin.orders.reconcileFromBOG({ orderId: 1 }),
    ).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      message: CARD_PAYMENT_UNAVAILABLE,
    });
  });

  it("keeps PaymentSuccess read-only", () => {
    const source = readFileSync(
      new URL("../client/src/pages/PaymentSuccess.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toContain("payments.getPaymentStatus.useQuery");
    expect(source).not.toContain("updatePaymentStatus");
    expect(source).not.toContain("useMutation");
  });
});
