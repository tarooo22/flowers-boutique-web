import { NextResponse } from "next/server";
import { listLiveProducts } from "@/lib/production/catalog";
import { searchProducts } from "@/lib/productSearch";
import { takePublicRequest } from "@/lib/server/publicRequestGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = takePublicRequest(request, "catalog-search", { limit: 30, windowMs: 60_000 });
  if (!guard.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(guard.retryAfterSeconds), "Cache-Control": "no-store" } });
  const query = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  if (query.length < 2) return NextResponse.json({ products: [] }, { headers: { "Cache-Control": "no-store" } });
  const products = searchProducts(await listLiveProducts(), query).slice(0, 6);
  return NextResponse.json({ products }, { headers: { "Cache-Control": "no-store" } });
}
