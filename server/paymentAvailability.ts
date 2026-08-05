import { TRPCError } from "@trpc/server";
import type { Request, Response } from "express";

export const CARD_PAYMENT_UNAVAILABLE = "CARD_PAYMENT_UNAVAILABLE";

/**
 * Fail closed before any local order creation, OAuth request, or BOG HTTP call.
 */
export function rejectCardPaymentRequest(): never {
  throw new TRPCError({
    code: "SERVICE_UNAVAILABLE",
    message: CARD_PAYMENT_UNAVAILABLE,
  });
}

/**
 * The callback URL is reserved but deliberately performs no processing while
 * the BOG merchant integration is pending.
 */
export function disabledBOGCallbackHandler(_req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(503).json({
    success: false,
    error: CARD_PAYMENT_UNAVAILABLE,
  });
}
