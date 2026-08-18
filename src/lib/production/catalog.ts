import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";
import type { Category, Product, ProductVariant } from "@/types";
import { categories, getProductionDb, productImages, products } from "@/lib/production/db";

type CurrentVariant = {
  id?: string;
  colorNameKa?: string;
  colorNameEn?: string;
  imageUrl?: string;
  priceMin?: number | string;
  available?: boolean;
  isDefault?: boolean;
};

type ProductRow = typeof products.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;

function money(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function adapterSlug(productId: number): string {
  return `product-${productId}`;
}

export function readProductId(slug: string): number | null {
  const match = /^(?:product-)?(\d+)$/.exec(slug);
  const id = match ? Number(match[1]) : NaN;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function variantsFor(row: ProductRow): ProductVariant[] {
  const source = Array.isArray(row.variants) ? (row.variants as CurrentVariant[]) : [];
  const mapped = source
    .filter((variant) => variant.available !== false)
    .map((variant, index) => ({
      id: variant.id ?? `variant-${index + 1}`,
      label: variant.colorNameKa || variant.colorNameEn || `ვარიანტი ${index + 1}`,
      priceDelta: Math.max(0, money(variant.priceMin) - money(row.priceMin)),
    }));

  return mapped.length ? mapped : [{ id: "standard", label: "სტანდარტი", priceDelta: 0 }];
}

function mapProduct(row: ProductRow, category: CategoryRow | undefined, gallery: string[]): Product {
  const categorySlug = category?.slug || "catalog";
  const imageList = [...new Set([row.imageUrl, ...gallery].filter((url): url is string => Boolean(url)))];
  return {
    id: String(row.id),
    slug: adapterSlug(row.id),
    name: row.nameKa || row.nameEn,
    subtitle: row.nameEn || undefined,
    price: money(row.priceMin),
    compareAt: row.priceMax && money(row.priceMax) > money(row.priceMin) ? money(row.priceMax) : undefined,
    images: imageList,
    category: categorySlug,
    sourceUnitType: row.unitType ?? undefined,
    tags: [categorySlug, row.featured ? "featured" : ""].filter(Boolean),
    colors: [],
    description: row.descriptionKa || row.descriptionEn || "",
    care: [],
    variants: variantsFor(row),
    available: row.isAvailable !== false,
    bestseller: row.featured === true,
    isNew: false,
  };
}

async function imageMapFor(productIds: number[]) {
  if (!productIds.length) return new Map<number, string[]>();
  let rows: Array<typeof productImages.$inferSelect> = [];
  try {
    rows = await getProductionDb()
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(asc(productImages.sortOrder));
  } catch (error) {
    const code = (error as { cause?: { code?: string } }).cause?.code;
    if (code !== "ER_NO_SUCH_TABLE") throw error;
  }
  return rows.reduce((map, image) => {
    map.set(image.productId, [...(map.get(image.productId) ?? []), image.imageUrl]);
    return map;
  }, new Map<number, string[]>());
}

export async function listLiveProducts(limit?: number): Promise<Product[]> {
  const rows = await getProductionDb()
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.published, true), eq(products.isAvailable, true)));
  const selected = typeof limit === "number" ? rows.slice(0, limit) : rows;
  const galleries = await imageMapFor(selected.map((row) => row.product.id));
  return selected.map((row) => mapProduct(row.product, row.category ?? undefined, galleries.get(row.product.id) ?? []));
}

export async function listLiveCategories(): Promise<Category[]> {
  const rows = await getProductionDb().select().from(categories).orderBy(asc(categories.nameKa));
  const productRows = await getProductionDb()
    .select({ categoryId: products.categoryId })
    .from(products)
    .where(and(eq(products.published, true), eq(products.isAvailable, true)));
  const counts = productRows.reduce((map, product) => {
    map.set(product.categoryId, (map.get(product.categoryId) ?? 0) + 1);
    return map;
  }, new Map<number, number>());
  return rows.map((category) => ({
    id: category.slug,
    name: category.nameKa || category.nameEn,
    slug: category.slug,
    blurb: category.descriptionKa || category.descriptionEn || "",
    count: counts.get(category.id) ?? 0,
  }));
}

export async function getLiveProductBySlug(slug: string): Promise<Product | null> {
  const id = readProductId(slug);
  if (!id) return null;
  const rows = await getProductionDb()
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.id, id), eq(products.published, true)))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  const galleries = await imageMapFor([row.product.id]);
  return mapProduct(row.product, row.category ?? undefined, galleries.get(row.product.id) ?? []);
}

export async function getLiveRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await listLiveProducts();
  return all.filter((candidate) => candidate.id !== product.id && candidate.category === product.category).slice(0, limit);
}
