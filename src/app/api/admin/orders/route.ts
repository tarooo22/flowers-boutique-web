import { NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { listAdminOrderQueue } from "@/lib/production/adminOrders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cacheHeaders = { "Cache-Control": "private, no-store" };

async function guard() {
  const user = await getProductionSessionUser();
  if (user?.role === "admin") return user;
  return null;
}

export async function GET(request: Request) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: cacheHeaders });
  const params = new URL(request.url).searchParams;
  const queue = await listAdminOrderQueue({
    cursor: params.get("cursor") ?? undefined, limit: Number(params.get("limit") ?? 25), q: params.get("q") ?? undefined,
    status: (params.get("status") ?? "all") as any, dateFrom: params.get("dateFrom") ?? undefined, dateTo: params.get("dateTo") ?? undefined,
    deliveryWindow: (params.get("deliveryWindow") ?? "all") as any, sort: (params.get("sort") ?? "priority") as any,
  });
  return NextResponse.json(queue, { headers: cacheHeaders });
}

export async function PATCH(request: Request) {
  return NextResponse.json({ error: "use_order_detail_endpoint" }, { status: 405, headers: cacheHeaders });
}

export async function DELETE(request: Request) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: cacheHeaders });
  return NextResponse.json({ error: "order_deletion_disabled" }, { status: 405, headers: cacheHeaders });
}
