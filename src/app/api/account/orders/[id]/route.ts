import { and, asc, eq, isNull, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { getProductionDb, orderOperationalEvents, orders } from "@/lib/production/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

function detailId(value: string) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getProductionSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const orderId = detailId((await context.params).id);
  if (!orderId) return NextResponse.json({ error: "invalid_order" }, { status: 400, headers });
  const email = user.email?.trim().toLowerCase() || null;
  const ownership = email ? or(eq(orders.userId, user.id), and(isNull(orders.userId), eq(orders.customerEmail, email))) : eq(orders.userId, user.id);
  const database = getProductionDb();
  const order = (await database.select({
    id: orders.id, orderNumber: orders.orderNumber, total: orders.totalPrice, subtotal: orders.subtotalBeforeBenefit,
    deliveryFee: orders.deliveryFee, status: orders.deliveryStatus, fulfillment: orders.fulfillmentType,
    createdAt: orders.createdAt, deliveryDate: orders.deliveryDate, deliveryTime: orders.deliveryTime,
    customerName: orders.customerName, customerEmail: orders.customerEmail, customerPhone: orders.customerPhone,
    recipientName: orders.recipientName, deliveryAddress: orders.deliveryAddress, notes: orders.notes, items: orders.items,
    flowerCircleDiscount: orders.flowerCircleDiscount, flowerCircleEarned: orders.flowerCircleEarned,
  }).from(orders).where(and(eq(orders.id, orderId), ownership)).limit(1))[0];
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404, headers });
  const events = await database.select({ id: orderOperationalEvents.id, eventType: orderOperationalEvents.eventType, fromStatus: orderOperationalEvents.fromStatus, toStatus: orderOperationalEvents.toStatus, reason: orderOperationalEvents.reason, createdAt: orderOperationalEvents.createdAt }).from(orderOperationalEvents).where(eq(orderOperationalEvents.orderId, order.id)).orderBy(asc(orderOperationalEvents.createdAt));
  const timeline = [{ id: `created-${order.id}`, eventType: "created", toStatus: "new", reason: null, createdAt: order.createdAt }, ...events].map((event) => ({ ...event, createdAt: event.createdAt.toISOString() }));
  return NextResponse.json({ order: {
    ...order, id: `FLR-${order.orderNumber ?? order.id}`, internalId: order.id, total: Number(order.total), subtotal: Number(order.subtotal ?? 0),
    deliveryFee: Number(order.deliveryFee ?? 0), flowerCircleDiscount: Number(order.flowerCircleDiscount ?? 0), flowerCircleEarned: Number(order.flowerCircleEarned ?? 0),
    createdAt: order.createdAt.toISOString(), items: Array.isArray(order.items) ? order.items : [], timeline,
  } }, { headers });
}
