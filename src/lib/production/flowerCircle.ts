import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { getProductionDb, orders } from "@/lib/production/db";
import { summarizeFlowerCircle } from "@/lib/production/flowerCircleLevels";

const ELIGIBLE_DELIVERY_STATUSES = ["confirmed", "delivering", "completed"];

export { summarizeFlowerCircle } from "@/lib/production/flowerCircleLevels";

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

  return summarizeFlowerCircle(Number(row?.eligibleSpend ?? 0), Number(row?.eligibleOrderCount ?? 0));
}
