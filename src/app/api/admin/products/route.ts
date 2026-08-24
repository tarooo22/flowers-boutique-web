import { NextResponse } from "next/server";
import { isProductionAdmin } from "@/lib/production/auth";
import { createProductionAdminProduct, deleteProductionAdminProduct, listProductionAdminCategories, listProductionAdminMedia, listProductionAdminProducts, listProductionAdminProductsPage, productionAdminStats, updateProductionAdminProduct } from "@/lib/production/admin";

export const runtime = "nodejs";

async function guard() {
  if (await isProductionAdmin()) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const query = new URL(request.url).searchParams;
  const page = Math.max(1, Number(query.get("page")) || 1);
  const pageSize = Math.min(48, Math.max(12, Number(query.get("pageSize")) || 24));
  const [productPage, stats, categories, media] = await Promise.all([listProductionAdminProductsPage(page, pageSize), productionAdminStats(), listProductionAdminCategories(), listProductionAdminMedia()]);
  return NextResponse.json({ ...productPage, stats, categories, media }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as {
    operation?: unknown;
    ids?: unknown;
    patch?: unknown;
    id?: unknown;
    nameKa?: unknown;
    nameEn?: unknown;
    descriptionKa?: unknown;
    descriptionEn?: unknown;
    price?: unknown;
    priceMax?: unknown;
    priceOnRequest?: unknown;
    unitType?: unknown;
    categoryId?: unknown;
    imageUrl?: unknown;
    imageUrls?: unknown;
    available?: unknown;
    published?: unknown;
    bestseller?: unknown;
  };

  const id = typeof body.id === "string" ? Number(body.id) : 0;

  const patch: Record<string, unknown> = {};
  for (const key of ["nameKa", "nameEn", "descriptionKa", "descriptionEn", "unitType", "imageUrl"] as const) {
    if (typeof body[key] === "string") patch[key] = body[key].trim();
  }
  if (typeof body.price === "number" && Number.isFinite(body.price) && body.price >= 0) {
    patch.price = Math.round(body.price);
  }
  if (typeof body.priceMax === "number" && Number.isFinite(body.priceMax) && body.priceMax >= 0) patch.priceMax = Math.round(body.priceMax);
  if (typeof body.categoryId === "number" && Number.isSafeInteger(body.categoryId) && body.categoryId > 0) patch.categoryId = body.categoryId;
  if (Array.isArray(body.imageUrls)) {
    const imageUrls = body.imageUrls
      .filter((item): item is { url: string; key: string } => Boolean(item) && typeof item === "object" && typeof (item as { url?: unknown }).url === "string" && typeof (item as { key?: unknown }).key === "string")
      .map((item) => ({ url: item.url.trim(), key: item.key.trim() }))
      .filter((item) => item.url.startsWith("/manus-storage/") && item.key.startsWith("admin-media/"))
      .slice(0, 8);
    patch.imageUrls = imageUrls;
  }
  if (typeof body.priceOnRequest === "boolean") patch.priceOnRequest = body.priceOnRequest;
  if (typeof body.available === "boolean") patch.available = body.available;
  if (typeof body.published === "boolean") patch.published = body.published;
  if (typeof body.bestseller === "boolean") patch.bestseller = body.bestseller;

  if (body.operation === "bulk" && body.patch && typeof body.patch === "object" && !Array.isArray(body.patch)) {
    const bulkPatch = body.patch as Record<string, unknown>;
    if (typeof bulkPatch.available === "boolean") patch.available = bulkPatch.available;
    if (typeof bulkPatch.published === "boolean") patch.published = bulkPatch.published;
    if (typeof bulkPatch.bestseller === "boolean") patch.bestseller = bulkPatch.bestseller;
    if (typeof bulkPatch.categoryId === "number" && Number.isSafeInteger(bulkPatch.categoryId) && bulkPatch.categoryId > 0) patch.categoryId = bulkPatch.categoryId;
  }

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
  }

  if (body.operation === "bulk") {
    const ids = Array.isArray(body.ids) ? [...new Set(body.ids.map((value) => Number(value)).filter((value) => Number.isSafeInteger(value) && value > 0))].slice(0, 48) : [];
    const allowed = Object.fromEntries(Object.entries(patch).filter(([key]) => ["available", "published", "bestseller", "categoryId"].includes(key)));
    if (!ids.length || !Object.keys(allowed).length) return NextResponse.json({ error: "invalid_bulk_input" }, { status: 400 });
    await Promise.all(ids.map((productId) => updateProductionAdminProduct(productId, allowed)));
    return NextResponse.json({ updated: ids.length }, { headers: { "Cache-Control": "private, no-store" } });
  }

  if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  await updateProductionAdminProduct(id, patch);
  return NextResponse.json({ products: await listProductionAdminProducts() });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const nameKa = typeof body.nameKa === "string" ? body.nameKa.trim() : "";
  const nameEn = typeof body.nameEn === "string" ? body.nameEn.trim() : "";
  const categoryId = typeof body.categoryId === "number" ? body.categoryId : 0;
  if (!nameKa || !nameEn || !Number.isSafeInteger(categoryId) || categoryId <= 0) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const parseNumber = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.round(value) : undefined;
  await createProductionAdminProduct({
    nameKa,
    nameEn,
    categoryId,
    descriptionKa: typeof body.descriptionKa === "string" ? body.descriptionKa.trim() : "",
    descriptionEn: typeof body.descriptionEn === "string" ? body.descriptionEn.trim() : "",
    price: parseNumber(body.price) ?? 0,
    priceMax: parseNumber(body.priceMax) ?? parseNumber(body.price) ?? 0,
    priceOnRequest: body.priceOnRequest === true,
    unitType: typeof body.unitType === "string" ? body.unitType.trim() : "single stem",
    imageUrl: typeof body.imageUrl === "string" ? body.imageUrl.trim() : undefined,
    imageUrls: Array.isArray(body.imageUrls) ? body.imageUrls
      .filter((item): item is { url: string; key: string } => Boolean(item) && typeof item === "object" && typeof (item as { url?: unknown }).url === "string" && typeof (item as { key?: unknown }).key === "string")
      .map((item) => ({ url: item.url.trim(), key: item.key.trim() }))
      .filter((item) => item.url.startsWith("/manus-storage/") && item.key.startsWith("admin-media/"))
      .slice(0, 8) : undefined,
    available: body.available !== false,
    published: body.published !== false,
    bestseller: body.bestseller === true,
  });
  return NextResponse.json({ products: await listProductionAdminProducts() }, { status: 201 });
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await deleteProductionAdminProduct(id);
  return NextResponse.json({ products: await listProductionAdminProducts() });
}
