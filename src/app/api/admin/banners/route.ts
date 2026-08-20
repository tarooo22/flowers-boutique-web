import { NextResponse } from "next/server";
import { createProductionAdminBanner, deleteProductionAdminBanner, listProductionAdminBanners, updateProductionAdminBanner, type AdminBannerInput } from "@/lib/production/admin";
import { isProductionAdmin } from "@/lib/production/auth";

export const runtime = "nodejs";

async function guard() {
  if (await isProductionAdmin()) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function inputFrom(value: Record<string, unknown>): AdminBannerInput | null {
  const titleKa = typeof value.titleKa === "string" ? value.titleKa.trim() : "";
  const titleEn = typeof value.titleEn === "string" ? value.titleEn.trim() : "";
  const ctaHref = typeof value.ctaHref === "string" ? value.ctaHref.trim() : "/catalog";
  const imageUrl = typeof value.imageUrl === "string" ? value.imageUrl.trim() : "";
  const imageKey = typeof value.imageKey === "string" ? value.imageKey.trim() : "";
  if (!titleKa || !titleEn || !imageUrl || !imageKey || (ctaHref && (!ctaHref.startsWith("/") || ctaHref.startsWith("//")))) return null;
  if (!imageUrl.startsWith("/manus-storage/") || !imageKey.startsWith("admin-media/")) return null;
  return {
    placement: value.placement === "homepage" ? "homepage" : "homepage",
    titleKa, titleEn,
    subtitleKa: typeof value.subtitleKa === "string" ? value.subtitleKa.trim() : "",
    subtitleEn: typeof value.subtitleEn === "string" ? value.subtitleEn.trim() : "",
    ctaLabelKa: typeof value.ctaLabelKa === "string" ? value.ctaLabelKa.trim() : "",
    ctaLabelEn: typeof value.ctaLabelEn === "string" ? value.ctaLabelEn.trim() : "",
    ctaHref,
    imageUrl,
    imageKey,
    active: value.active === true,
    sortOrder: typeof value.sortOrder === "number" && Number.isSafeInteger(value.sortOrder) && value.sortOrder >= 0 && value.sortOrder <= 99 ? value.sortOrder : 0,
  };
}

export async function GET() {
  const denied = await guard(); if (denied) return denied;
  return NextResponse.json({ banners: await listProductionAdminBanners() });
}

export async function POST(request: Request) {
  const denied = await guard(); if (denied) return denied;
  const input = inputFrom((await request.json().catch(() => ({}))) as Record<string, unknown>);
  if (!input) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await createProductionAdminBanner(input);
  return NextResponse.json({ banners: await listProductionAdminBanners() }, { status: 201 });
}

export async function PATCH(request: Request) {
  const denied = await guard(); if (denied) return denied;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = typeof body.id === "string" ? Number(body.id) : 0;
  const input = inputFrom(body);
  if (!Number.isSafeInteger(id) || id <= 0 || !input) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await updateProductionAdminBanner(id, input);
  return NextResponse.json({ banners: await listProductionAdminBanners() });
}

export async function DELETE(request: Request) {
  const denied = await guard(); if (denied) return denied;
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await deleteProductionAdminBanner(id);
  return NextResponse.json({ banners: await listProductionAdminBanners() });
}
