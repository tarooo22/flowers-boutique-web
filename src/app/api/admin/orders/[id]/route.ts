import { NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { getAdminOrderDetail, transitionAdminOrder, type AdminOrderStatus } from "@/lib/production/adminOrders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
const statuses = ["new", "confirmed", "delivering", "completed", "cancelled"] as const;
const errorStatus: Record<string, number> = { order_not_found: 404, invalid_input: 400, invalid_transition: 409, revision_conflict: 409, cancellation_reason_required: 400 };

async function actor() { const user = await getProductionSessionUser(); return user?.role === "admin" ? user : null; }

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await actor())) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  try { return NextResponse.json(await getAdminOrderDetail((await context.params).id), { headers }); }
  catch (error) { const key = error instanceof Error ? error.message : "invalid_input"; return NextResponse.json({ error: key }, { status: errorStatus[key] ?? 400, headers }); }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await actor(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const body = await request.json().catch(() => ({})) as { status?: unknown; revision?: unknown; reason?: unknown; idempotencyKey?: unknown };
  if (!statuses.includes(body.status as AdminOrderStatus) || !Number.isSafeInteger(body.revision) || typeof body.idempotencyKey !== "string" || body.idempotencyKey.length < 12) return NextResponse.json({ error: "invalid_input" }, { status: 400, headers });
  try {
    const detail = await transitionAdminOrder({ publicOrderId: (await context.params).id, status: body.status as AdminOrderStatus, revision: body.revision as number, reason: typeof body.reason === "string" ? body.reason : undefined, actorUserId: user.id, idempotencyKey: body.idempotencyKey });
    return NextResponse.json(detail, { headers });
  } catch (error) { const key = error instanceof Error ? error.message : "invalid_input"; return NextResponse.json({ error: key }, { status: errorStatus[key] ?? 400, headers }); }
}
