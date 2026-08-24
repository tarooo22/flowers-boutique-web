import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { isProductionAdmin } from "@/lib/production/auth";
import { getProductionDb, orders } from "@/lib/production/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(_: Request, { params }: { params: Promise<{ email: string }> }) {
  if (!await isProductionAdmin()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const email = decodeURIComponent((await params).email).trim().toLowerCase();
  if (!email || email.length > 254) return NextResponse.json({ error: "invalid_input" }, { status: 400, headers });
  const history = await getProductionDb().select({ id: orders.id, total: orders.totalPrice, status: orders.deliveryStatus, createdAt: orders.createdAt }).from(orders).where(eq(orders.customerEmail, email)).orderBy(desc(orders.createdAt)).limit(100);
  const completedStatuses = new Set(["delivered", "courier", "processing"]);
  const totalSpend = history.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  return NextResponse.json({ customer: { email, orderCount: history.length, completedOrderCount: history.filter((order) => completedStatuses.has(order.status ?? "")).length, totalSpend, lastOrderAt: history[0]?.createdAt?.toISOString() ?? null, lastStatus: history[0]?.status ?? null } }, { headers });
}
