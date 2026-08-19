import { describe, expect, it } from "vitest";
import { searchProducts } from "@/lib/productSearch";
import type { Product } from "@/types";

const liveProducts = [
  {
    id: "420001",
    slug: "product-420001",
    name: "სიყვარულის თაიგული",
    subtitle: "Bouquet of Love",
    description: "Fresh garden roses",
    category: "bouquet",
    images: ["/manus-storage/love.jpg"],
    price: 250,
    tags: ["bouquet", "featured"],
    colors: ["Pink"],
    care: [],
    variants: [{ id: "standard", label: "სტანდარტი", priceDelta: 0 }],
    available: true,
    bestseller: true,
    isNew: false,
  },
  {
    id: "180002",
    slug: "product-180002",
    name: "ლილია",
    subtitle: "Lily",
    description: "Single stem lily",
    category: "single-stems",
    images: ["/manus-storage/lily.jpg"],
    price: 25,
    tags: ["single-stems"],
    colors: ["White"],
    care: [],
    variants: [{ id: "standard", label: "სტანდარტი", priceDelta: 0 }],
    available: true,
    bestseller: false,
    isNew: false,
  },
] satisfies Product[];

describe("searchProducts", () => {
  it("searches the active product list and keeps its live product links", () => {
    const result = searchProducts(liveProducts, "lily");
    expect(result.map((product) => product.slug)).toEqual(["product-180002"]);
  });

  it("searches Georgian names case-insensitively and returns no results for blank input", () => {
    expect(searchProducts(liveProducts, "სიყვარულის")).toHaveLength(1);
    expect(searchProducts(liveProducts, "   ")).toEqual([]);
  });
});
