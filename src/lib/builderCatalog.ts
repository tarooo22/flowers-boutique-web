import type { Product } from "@/types";

export type CatalogBuilderFlower = {
  key: string;
  name: string;
  price: number;
  asset: string;
};

export const INDIVIDUAL_FLOWERS_CATEGORY = "single-stems";

const FLOWER_FALLBACK_ASSET =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23fbf7f0'/%3E%3Cpath d='M50 81V48M50 48C30 48 23 31 33 22C43 13 50 27 50 37C50 27 57 13 67 22C77 31 70 48 50 48' fill='none' stroke='%23c95b49' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E";

/**
 * Keep the AI selector in sync with the public catalog. Any published,
 * available product placed in the Single Stems category appears automatically.
 */
export function catalogFlowersForAIBouquet(products: Product[]): CatalogBuilderFlower[] {
  return products
    .filter(
      (product) =>
        product.category === INDIVIDUAL_FLOWERS_CATEGORY &&
        product.available !== false,
    )
    .map((product) => ({
      key: `catalog-${product.id}`,
      name: product.name,
      price: product.price,
      asset: product.images[0] || FLOWER_FALLBACK_ASSET,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "ka"));
}
