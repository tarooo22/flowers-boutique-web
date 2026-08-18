import { products } from "@/data/products";
import { categories, categoryById } from "@/data/categories";
import type { CategoryId, Product, ProductVariant, SortKey } from "@/types";

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getByTag(tag: string, limit?: number): Product[] {
  const list = products.filter((p) => p.tags.includes(tag));
  return limit ? list.slice(0, limit) : list;
}

export function getByCategory(category: CategoryId, limit?: number): Product[] {
  const list = products.filter((p) => p.category === category);
  return limit ? list.slice(0, limit) : list;
}

export function getBestsellers(limit = 8): Product[] {
  return products.filter((p) => p.bestseller).slice(0, limit);
}

export function getRelated(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, limit);
}

export function variantPrice(product: Product, variantId: string): number {
  const v = product.variants.find((x) => x.id === variantId);
  return product.price + (v?.priceDelta ?? 0);
}

export function defaultVariant(product: Product): ProductVariant {
  return product.variants[0];
}

/** All unique colours across the catalog, for filter chips. */
export function allColors(): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.colors.forEach((c) => set.add(c)));
  return [...set].sort();
}

export const priceBounds = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};

export interface CatalogFilters {
  category?: CategoryId | "all";
  tag?: string;
  query?: string;
  colors?: string[];
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: SortKey;
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => Number(b.bestseller) - Number(a.bestseller),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  newest: (a, b) => Number(b.isNew) - Number(a.isNew),
};

export function filterProducts(filters: CatalogFilters): Product[] {
  const {
    category = "all",
    tag,
    query = "",
    colors = [],
    maxPrice,
    inStockOnly = false,
    sort = "featured",
  } = filters;

  const q = query.trim().toLowerCase();

  const result = products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (tag && !p.tags.includes(tag)) return false;
    if (inStockOnly && !p.available) return false;
    if (typeof maxPrice === "number" && p.price > maxPrice) return false;
    if (colors.length && !colors.some((c) => p.colors.includes(c))) return false;
    if (q) {
      const hay = `${p.name} ${p.subtitle ?? ""} ${p.colors.join(" ")} ${
        categoryById[p.category]?.name ?? ""
      }`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return result.sort(sorters[sort]);
}

export { products, categories, categoryById };
