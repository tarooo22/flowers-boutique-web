import { NextResponse } from "next/server";
import { isProductionAdmin } from "@/lib/production/auth";
import { listProductionAdminOrders, updateProductionOrderStatus } from "@/lib/production/admin";

export const runtime = "nodejs";

const STATUSES = ["new", "confirmed", "delivering", "completed", "cancelled"] as const;

async function guard() {
  if (await isProductionAdmin()) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json({ orders: await listProductionAdminOrders() });
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as {
    id?: unknown;
    status?: unknown;
  };
  const id = typeof body.id === "string" ? body.id : "";
  const status = body.status as typeof STATUSES[number];

  if (!id || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  await updateProductionOrderStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  return NextResponse.json({ error: "order_deletion_disabled" }, { status: 405 });
}
