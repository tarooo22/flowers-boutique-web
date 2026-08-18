import { NextResponse } from "next/server";
import { isProductionAdmin } from "@/lib/production/auth";
import { listProductionAdminProducts, productionAdminStats, updateProductionProduct } from "@/lib/production/admin";

export const runtime = "nodejs";

async function guard() {
  if (await isProductionAdmin()) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const [products, stats] = await Promise.all([listProductionAdminProducts(), productionAdminStats()]);
  return NextResponse.json({ products, stats });
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as {
    id?: unknown;
    price?: unknown;
    available?: unknown;
    bestseller?: unknown;
  };

  const id = typeof body.id === "string" ? Number(body.id) : 0;
  if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof body.price === "number" && Number.isFinite(body.price) && body.price >= 0) {
    patch.price = Math.round(body.price);
  }
  if (typeof body.available === "boolean") patch.available = body.available;
  if (typeof body.bestseller === "boolean") patch.bestseller = body.bestseller;

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
  }

  await updateProductionProduct(id, patch);
  return NextResponse.json({ products: await listProductionAdminProducts() });
}
