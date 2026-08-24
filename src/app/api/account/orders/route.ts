import { and, desc, eq, isNull, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { flowerCircleLedger, getProductionDb, orders } from "@/lib/production/db";
import { getFlowerCircleSummary } from "@/lib/production/flowerCircle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getProductionSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  const email = user.email?.trim().toLowerCase() || null;
  const ownership = email ? or(eq(orders.userId, user.id), and(isNull(orders.userId), eq(orders.customerEmail, email))) : eq(orders.userId, user.id);
  const database = getProductionDb();
  const [recentOrders, ledger, summary] = await Promise.all([
    database.select({ id: orders.id, orderNumber: orders.orderNumber, total: orders.totalPrice, status: orders.deliveryStatus, createdAt: orders.createdAt, flowerCircleDiscount: orders.flowerCircleDiscount, flowerCircleEarned: orders.flowerCircleEarned }).from(orders).where(ownership).orderBy(desc(orders.createdAt)).limit(12),
    database.select({ id: flowerCircleLedger.id, orderId: flowerCircleLedger.orderId, type: flowerCircleLedger.type, amount: flowerCircleLedger.amount, note: flowerCircleLedger.note, createdAt: flowerCircleLedger.createdAt }).from(flowerCircleLedger).where(eq(flowerCircleLedger.userId, user.id)).orderBy(desc(flowerCircleLedger.createdAt)).limit(12),
    getFlowerCircleSummary(user),
  ]);
  return NextResponse.json({
    summary,
    orders: recentOrders.map((order) => ({ ...order, internalId: order.id, id: `FLR-${order.orderNumber ?? order.id}`, total: Number(order.total), flowerCircleDiscount: Number(order.flowerCircleDiscount ?? 0), flowerCircleEarned: Number(order.flowerCircleEarned ?? 0), createdAt: order.createdAt.toISOString() })),
    ledger: ledger.map((event) => ({ ...event, amount: Number(event.amount), createdAt: event.createdAt.toISOString() })),
  }, { headers: { "Cache-Control": "private, no-store" } });
}
