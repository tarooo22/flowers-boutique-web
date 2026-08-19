import type { Product } from "@/types";

/** Client-safe, live-catalog search used by the global Search overlay. */
export function searchProducts(products: Product[], query: string): Product[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];

  return products.filter((product) => {
    const searchable = [
      product.name,
      product.subtitle ?? "",
      product.description,
      product.category,
      ...product.colors,
    ]
      .join(" ")
      .toLocaleLowerCase();
    return searchable.includes(normalized);
  });
}
