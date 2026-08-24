import { NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { getAdminOrderSummary } from "@/lib/production/adminOrders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  if ((await getProductionSessionUser())?.role !== "admin") return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const params = new URL(request.url).searchParams;
  return NextResponse.json(await getAdminOrderSummary({ dateFrom: params.get("dateFrom") ?? undefined, dateTo: params.get("dateTo") ?? undefined }), { headers });
}
