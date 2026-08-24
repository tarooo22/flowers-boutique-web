import { NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { addAdminOrderNote } from "@/lib/production/adminOrders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getProductionSessionUser(); if (user?.role !== "admin") return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const body = await request.json().catch(() => ({})) as { note?: unknown; idempotencyKey?: unknown };
  if (typeof body.note !== "string" || typeof body.idempotencyKey !== "string" || body.idempotencyKey.length < 12) return NextResponse.json({ error: "invalid_input" }, { status: 400, headers });
  try { return NextResponse.json(await addAdminOrderNote({ publicOrderId: (await context.params).id, note: body.note, actorUserId: user.id, idempotencyKey: body.idempotencyKey }), { headers }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "invalid_input" }, { status: 400, headers }); }
}
