import "server-only";

import { and, desc, eq, gte, inArray, like, lte, or } from "drizzle-orm";
import { getProductionDb, orderOperationalEvents, orderOperationalMeta, orders } from "@/lib/production/db";
import { syncFlowerCircleOrderStatus } from "@/lib/production/flowerCircle";

export type AdminOrderStatus = "new" | "confirmed" | "delivering" | "completed" | "cancelled";
export type AdminOrderFilters = { cursor?: string; limit?: number; q?: string; status?: AdminOrderStatus | "all"; dateFrom?: string; dateTo?: string; deliveryWindow?: "all" | "today" | "due" | "overdue"; sort?: "priority" | "newest" | "oldest" };

const RAW_STATUSES: Record<AdminOrderStatus, string[]> = { new: ["new", ""], confirmed: ["awaiting_confirmation", "processing", "preparing"], delivering: ["courier"], completed: ["delivered"], cancelled: ["cancelled"] };
const TRANSITIONS: Record<AdminOrderStatus, AdminOrderStatus[]> = { new: ["confirmed", "cancelled"], confirmed: ["delivering", "cancelled"], delivering: ["completed", "cancelled"], completed: [], cancelled: [] };
const STATUS_RANK: Record<string, number> = { overdue: 0, due: 1, new: 2, today: 3, standard: 4, none: 5 };

function toNumber(value: unknown) { return Number(value ?? 0) || 0; }
function dashboardStatus(value: string | null): AdminOrderStatus { if (value === "delivered") return "completed"; if (value === "courier") return "delivering"; if (value === "cancelled") return "cancelled"; if (["awaiting_confirmation", "processing", "preparing"].includes(value ?? "")) return "confirmed"; return "new"; }
function publicId(order: { id: number; orderNumber: number | null }) { return `FLR-${order.orderNumber ?? order.id}`; }
function orderNumber(publicId: string) { const value = Number(publicId.replace(/^FLR-/, "")); if (!Number.isSafeInteger(value) || value <= 0) throw new Error("invalid_input"); return value; }
function validDate(value: string | undefined) { return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined; }
function tbilisiClock() { const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tbilisi", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()); const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00"; return { day: `${get("year")}-${get("month")}-${get("day")}`, minutes: Number(get("hour")) * 60 + Number(get("minute")) }; }
function riskFor(order: typeof orders.$inferSelect, status: AdminOrderStatus) { if (["completed", "cancelled"].includes(status)) return "none"; const now = tbilisiClock(); if (order.deliveryDate !== now.day) return status === "new" ? "new" : "standard"; const [hour, minute] = (order.deliveryTime ?? "").split(":").map(Number); if (!Number.isFinite(hour) || !Number.isFinite(minute)) return status === "new" ? "new" : "today"; const remaining = hour * 60 + minute - now.minutes; return remaining < 0 ? "overdue" : remaining <= 120 ? "due" : "today"; }

async function metaFor(orderIds: number[]) { const rows = orderIds.length ? await getProductionDb().select().from(orderOperationalMeta).where(inArray(orderOperationalMeta.orderId, orderIds)) : []; return new Map(rows.map((row) => [row.orderId, row])); }
function mapOrder(order: typeof orders.$inferSelect, meta?: typeof orderOperationalMeta.$inferSelect) {
  const status = dashboardStatus(order.deliveryStatus); const risk = riskFor(order, status);
  return { id: publicId(order), databaseId: order.id, createdAt: order.createdAt.toISOString(), status, revision: Number(meta?.revision ?? 0), priority: meta?.priority ?? "standard", risk, customer: { name: order.customerName, email: order.customerEmail ?? "", phone: order.customerPhone ?? "", recipient: order.recipientName ?? "", address: order.deliveryAddress ?? "", city: "თბილისი", date: order.deliveryDate ?? "", time: order.deliveryTime ?? "", notes: order.notes ?? "" }, items: Array.isArray(order.items) ? order.items.map((item: any) => ({ name: String(item.name ?? "Product"), quantity: toNumber(item.quantity) || 1, price: toNumber(item.unitPrice ?? item.price), image: typeof item.image === "string" ? item.image : undefined })) : [], subtotal: Math.max(0, toNumber(order.totalPrice) - toNumber(order.deliveryFee)), delivery: toNumber(order.deliveryFee), total: toNumber(order.totalPrice), flowerCircle: { eligible: ["processing", "courier", "delivered"].includes(order.deliveryStatus ?? ""), discount: toNumber(order.flowerCircleDiscount), earned: toNumber(order.flowerCircleEarned) } };
}
function conditionsFor(filters: AdminOrderFilters) {
  const conditions: any[] = []; const status = filters.status && filters.status !== "all" ? filters.status : undefined; const from = validDate(filters.dateFrom); const to = validDate(filters.dateTo); const query = filters.q?.trim().slice(0, 120);
  if (status) conditions.push(inArray(orders.deliveryStatus, RAW_STATUSES[status]));
  if (from) conditions.push(gte(orders.createdAt, new Date(`${from}T00:00:00.000Z`)));
  if (to) conditions.push(lte(orders.createdAt, new Date(`${to}T23:59:59.999Z`)));
  if (query) { const numeric = Number(query.replace(/^FLR-/, "")); const needle = `%${query}%`; conditions.push(or(like(orders.customerName, needle), like(orders.customerPhone, needle), like(orders.deliveryAddress, needle), ...(Number.isSafeInteger(numeric) ? [eq(orders.orderNumber, numeric)] : []))); }
  return conditions;
}

export async function listAdminOrderQueue(filters: AdminOrderFilters = {}) {
  const rows = await getProductionDb().select().from(orders).where(conditionsFor(filters).length ? and(...conditionsFor(filters)) : undefined).orderBy(desc(orders.createdAt), desc(orders.id));
  const mapped = rows.map((order) => mapOrder(order)); const meta = await metaFor(rows.map((order) => order.id)); const enriched = rows.map((order) => mapOrder(order, meta.get(order.id)));
  const allowedRisk = filters.deliveryWindow && filters.deliveryWindow !== "all" ? filters.deliveryWindow : null; const filtered = allowedRisk ? enriched.filter((order) => allowedRisk === "today" ? ["today", "due", "overdue"].includes(order.risk) : order.risk === allowedRisk) : enriched;
  const sorted = filters.sort === "oldest" ? [...filtered].reverse() : filters.sort === "newest" ? filtered : [...filtered].sort((left, right) => STATUS_RANK[left.risk] - STATUS_RANK[right.risk] || right.createdAt.localeCompare(left.createdAt));
  const limit = Math.max(10, Math.min(50, Number(filters.limit) || 25)); const offset = Math.max(0, Number(filters.cursor) || 0); const page = sorted.slice(offset, offset + limit); const nextCursor = offset + limit < sorted.length ? String(offset + limit) : null;
  return { orders: page, nextCursor, total: sorted.length };
}

export async function getAdminOrderSummary(filters: Pick<AdminOrderFilters, "dateFrom" | "dateTo"> = {}) {
  const rows = await getProductionDb().select().from(orders).where(conditionsFor(filters).length ? and(...conditionsFor(filters)) : undefined).orderBy(desc(orders.createdAt)); const meta = await metaFor(rows.map((order) => order.id)); const mapped = rows.map((order) => mapOrder(order, meta.get(order.id))); const active = mapped.filter((order) => order.status !== "cancelled"); const completed = mapped.filter((order) => order.status === "completed"); const trendMap = new Map<string, { day: string; orders: number; revenue: number }>();
  completed.forEach((order) => { const day = order.createdAt.slice(0, 10); const item = trendMap.get(day) ?? { day, orders: 0, revenue: 0 }; item.orders += 1; item.revenue += order.total; trendMap.set(day, item); });
  return { metrics: { netRevenue: active.reduce((sum, order) => sum + order.total, 0), completedOrders: completed.length, averageOrder: active.length ? active.reduce((sum, order) => sum + order.total, 0) / active.length : 0, newCount: mapped.filter((order) => order.risk === "new").length, dueCount: mapped.filter((order) => order.risk === "due").length, overdueCount: mapped.filter((order) => order.risk === "overdue").length, flowerCircleEarned: active.reduce((sum, order) => sum + order.flowerCircle.earned, 0), flowerCircleRedeemed: active.reduce((sum, order) => sum + order.flowerCircle.discount, 0) }, trend: [...trendMap.values()].sort((a, b) => a.day.localeCompare(b.day)).slice(-14), statusMix: (["new", "confirmed", "delivering", "completed", "cancelled"] as AdminOrderStatus[]).map((status) => ({ status, count: mapped.filter((order) => order.status === status).length })) };
}

export async function getAdminOrderDetail(publicOrderId: string) {
  const row = (await getProductionDb().select().from(orders).where(eq(orders.orderNumber, orderNumber(publicOrderId))).limit(1))[0]; if (!row) throw new Error("order_not_found"); const meta = (await getProductionDb().select().from(orderOperationalMeta).where(eq(orderOperationalMeta.orderId, row.id)).limit(1))[0]; const events = await getProductionDb().select().from(orderOperationalEvents).where(eq(orderOperationalEvents.orderId, row.id)).orderBy(desc(orderOperationalEvents.createdAt), desc(orderOperationalEvents.id)); const status = dashboardStatus(row.deliveryStatus);
  return { order: mapOrder(row, meta), allowedTransitions: TRANSITIONS[status], timeline: [{ id: "created", type: "created", fromStatus: null, toStatus: status, reason: null, note: "შეკვეთა შეიქმნა", actorUserId: null, createdAt: row.createdAt.toISOString() }, ...events.map((event) => ({ id: String(event.id), type: event.eventType, fromStatus: event.fromStatus, toStatus: event.toStatus, reason: event.reason, note: event.note, actorUserId: event.actorUserId, createdAt: event.createdAt.toISOString() }))] };
}

export async function transitionAdminOrder(input: { publicOrderId: string; status: AdminOrderStatus; actorUserId: number; revision: number; reason?: string; idempotencyKey: string }) {
  const targetNumber = orderNumber(input.publicOrderId); const reason = input.reason?.trim().slice(0, 255) || null; const database = getProductionDb();
  await database.transaction(async (tx) => { const duplicate = (await tx.select({ id: orderOperationalEvents.id }).from(orderOperationalEvents).where(eq(orderOperationalEvents.idempotencyKey, input.idempotencyKey)).limit(1))[0]; if (duplicate) return; const row = (await tx.select().from(orders).where(eq(orders.orderNumber, targetNumber)).limit(1))[0]; if (!row) throw new Error("order_not_found"); const current = dashboardStatus(row.deliveryStatus); if (!TRANSITIONS[current].includes(input.status)) throw new Error("invalid_transition"); if (input.status === "cancelled" && !reason) throw new Error("cancellation_reason_required"); const meta = (await tx.select().from(orderOperationalMeta).where(eq(orderOperationalMeta.orderId, row.id)).limit(1))[0]; const revision = Number(meta?.revision ?? 0); if (revision !== input.revision) throw new Error("revision_conflict"); if (!meta) await tx.insert(orderOperationalMeta).values({ orderId: row.id, revision: 0 }); const deliveryStatus: Record<AdminOrderStatus, string> = { new: "new", confirmed: "processing", delivering: "courier", completed: "delivered", cancelled: "cancelled" }; await tx.update(orders).set({ deliveryStatus: deliveryStatus[input.status] }).where(eq(orders.id, row.id)); await tx.update(orderOperationalMeta).set({ revision: revision + 1 }).where(eq(orderOperationalMeta.orderId, row.id)); await tx.insert(orderOperationalEvents).values({ orderId: row.id, eventType: "status_changed", fromStatus: current, toStatus: input.status, reason, actorUserId: input.actorUserId, idempotencyKey: input.idempotencyKey }); await syncFlowerCircleOrderStatus(tx, row.id); });
  return getAdminOrderDetail(input.publicOrderId);
}

export async function addAdminOrderNote(input: { publicOrderId: string; note: string; actorUserId: number; idempotencyKey: string }) { const note = input.note.trim().slice(0, 1200); if (!note) throw new Error("invalid_note"); const row = (await getProductionDb().select().from(orders).where(eq(orders.orderNumber, orderNumber(input.publicOrderId))).limit(1))[0]; if (!row) throw new Error("order_not_found"); await getProductionDb().insert(orderOperationalEvents).values({ orderId: row.id, eventType: "internal_note", note, actorUserId: input.actorUserId, idempotencyKey: input.idempotencyKey }); return getAdminOrderDetail(input.publicOrderId); }
