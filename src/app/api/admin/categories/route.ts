import { NextResponse } from "next/server";
import { createProductionAdminCategory, deleteProductionAdminCategory, listProductionAdminCategories, updateProductionAdminCategory } from "@/lib/production/admin";
import { isProductionAdmin } from "@/lib/production/auth";

export const runtime = "nodejs";

async function guard() {
  if (await isProductionAdmin()) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function slug(value: unknown) {
  return text(value, 120).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function categoryInput(body: Record<string, unknown>) {
  const nameKa = text(body.nameKa, 255);
  const nameEn = text(body.nameEn, 255);
  const categorySlug = slug(body.slug || nameEn);
  if (!nameKa || !nameEn || !categorySlug) return null;
  return { nameKa, nameEn, slug: categorySlug, descriptionKa: text(body.descriptionKa, 2000), descriptionEn: text(body.descriptionEn, 2000) };
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json({ categories: await listProductionAdminCategories() });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const input = categoryInput((await request.json().catch(() => ({}))) as Record<string, unknown>);
  if (!input) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const existing = await listProductionAdminCategories();
  if (existing.some((category) => category.slug === input.slug)) return NextResponse.json({ error: "slug_in_use" }, { status: 409 });
  await createProductionAdminCategory(input);
  return NextResponse.json({ categories: await listProductionAdminCategories() }, { status: 201 });
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = Number(body.id);
  const input = categoryInput(body);
  if (!Number.isSafeInteger(id) || id <= 0 || !input) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const existing = await listProductionAdminCategories();
  if (existing.some((category) => category.id !== String(id) && category.slug === input.slug)) return NextResponse.json({ error: "slug_in_use" }, { status: 409 });
  await updateProductionAdminCategory(id, input);
  return NextResponse.json({ categories: await listProductionAdminCategories() });
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  try {
    await deleteProductionAdminCategory(id);
  } catch (error) {
    if (error instanceof Error && error.message === "category_in_use") return NextResponse.json({ error: "category_in_use" }, { status: 409 });
    throw error;
  }
  return NextResponse.json({ categories: await listProductionAdminCategories() });
}
