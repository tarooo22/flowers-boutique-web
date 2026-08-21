import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { flowerCircleLedger, getProductionDb, orders } from "@/lib/production/db";
import { calculateFlowerCircleRedemption, summarizeFlowerCircle } from "@/lib/production/flowerCircleLevels";

/** Persisted delivery-status codes behind the Admin confirmed/delivering/completed labels. */
const ELIGIBLE_DELIVERY_STATUSES = ["processing", "courier", "delivered"];
const BENEFIT_REDEMPTION_CAP = 0.3;

export { summarizeFlowerCircle } from "@/lib/production/flowerCircleLevels";

export function money(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : 0;
}

export { calculateFlowerCircleRedemption } from "@/lib/production/flowerCircleLevels";

export async function getFlowerCircleBalance(userId: number) {
  const [row] = await getProductionDb().select({ balance: sql<string>`coalesce(sum(${flowerCircleLedger.amount}), 0)` }).from(flowerCircleLedger).where(and(eq(flowerCircleLedger.userId, userId), eq(flowerCircleLedger.status, "posted")));
  return money(row?.balance ?? 0);
}

/** Counts only the signed-in user's confirmed, delivering or completed store orders. */
export async function getFlowerCircleSummary(user: { id: number; email?: string | null }) {
  const legacyEmail = user.email?.trim().toLowerCase() || null;
  const ownership = legacyEmail
    ? or(eq(orders.userId, user.id), and(isNull(orders.userId), eq(orders.customerEmail, legacyEmail)))
    : eq(orders.userId, user.id);
  const [row] = await getProductionDb()
    .select({
      eligibleSpend: sql<string>`coalesce(sum(${orders.totalPrice}), 0)`,
      eligibleOrderCount: sql<number>`count(*)`,
    })
    .from(orders)
    .where(and(ownership, inArray(orders.deliveryStatus, ELIGIBLE_DELIVERY_STATUSES)));

  const base = summarizeFlowerCircle(Number(row?.eligibleSpend ?? 0), Number(row?.eligibleOrderCount ?? 0));
  return { ...base, availableBenefit: await getFlowerCircleBalance(user.id), redemptionCapPercent: BENEFIT_REDEMPTION_CAP * 100 };
}

/** Idempotently posts earn or reversal events after an order status transition. Call inside the status transaction. */
export async function syncFlowerCircleOrderStatus(tx: any, orderId: number) {
  const order = (await tx.select().from(orders).where(eq(orders.id, orderId)).limit(1))[0];
  if (!order?.userId) return;
  const isEligible = ELIGIBLE_DELIVERY_STATUSES.includes(order.deliveryStatus ?? "");
  const baseSubtotal = money(order.subtotalBeforeBenefit ?? (Number(order.totalPrice) - Number(order.deliveryFee)));
  const benefitRate = (await getFlowerCircleSummary({ id: order.userId, email: order.customerEmail })).benefitPercent;
  const earnedAmount = Math.round(baseSubtotal * benefitRate) / 100;

  if (isEligible) {
    await tx.insert(flowerCircleLedger).values({ userId: order.userId, orderId: order.id, eventKey: `earn:${order.id}`, type: "earn", amount: String(earnedAmount), benefitRate: String(benefitRate), note: "Eligible Flower Circle order" }).onDuplicateKeyUpdate({ set: { eventKey: sql`${flowerCircleLedger.eventKey}` } });
    await tx.update(orders).set({ flowerCircleEarned: String(earnedAmount) }).where(eq(orders.id, order.id));
    return;
  }

  const earned = (await tx.select().from(flowerCircleLedger).where(eq(flowerCircleLedger.eventKey, `earn:${order.id}`)).limit(1))[0];
  if (earned) {
    await tx.insert(flowerCircleLedger).values({ userId: order.userId, orderId: order.id, eventKey: `reversal:earn:${order.id}`, type: "reversal", amount: String(-money(earned.amount)), benefitRate: earned.benefitRate, note: "Order became ineligible" }).onDuplicateKeyUpdate({ set: { eventKey: sql`${flowerCircleLedger.eventKey}` } });
  }
  const redeemed = (await tx.select().from(flowerCircleLedger).where(eq(flowerCircleLedger.eventKey, `redeem:${order.id}`)).limit(1))[0];
  if (redeemed) {
    await tx.insert(flowerCircleLedger).values({ userId: order.userId, orderId: order.id, eventKey: `reversal:redeem:${order.id}`, type: "reversal", amount: String(money(redeemed.amount)), note: "Restored after cancelled or refunded order" }).onDuplicateKeyUpdate({ set: { eventKey: sql`${flowerCircleLedger.eventKey}` } });
  }
}
