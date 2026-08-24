import { NextResponse } from "next/server";
import { listLiveProducts } from "@/lib/production/catalog";
import { takePublicRequest } from "@/lib/server/publicRequestGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requestedIds(request: Request) {
  return [...new Set((new URL(request.url).searchParams.get("ids") ?? "").split(",").map((value) => Number(value)).filter((value) => Number.isSafeInteger(value) && value > 0))].slice(0, 40);
}

export async function GET(request: Request) {
  const guard = takePublicRequest(request, "catalog-products", { limit: 60, windowMs: 60_000 });
  if (!guard.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(guard.retryAfterSeconds), "Cache-Control": "no-store" } });
  const ids = requestedIds(request);
  if (!ids.length) return NextResponse.json({ products: [] }, { headers: { "Cache-Control": "no-store" } });
  const products = (await listLiveProducts()).filter((product) => ids.includes(Number(product.id)));
  return NextResponse.json({ products }, { headers: { "Cache-Control": "no-store" } });
}
