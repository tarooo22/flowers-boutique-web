import { describe, expect, it } from "vitest";
import { catalogFlowersForAIBouquet } from "@/lib/builderCatalog";
import type { Product } from "@/types";

function product(overrides: Partial<Product>): Product {
  return {
    id: "100",
    slug: "product-100",
    name: "ტესტის ყვავილი",
    price: 12,
    images: ["/manus-storage/test-flower.png"],
    category: "single-stems",
    tags: [],
    colors: [],
    description: "",
    care: [],
    variants: [{ id: "standard", label: "სტანდარტი", priceDelta: 0 }],
    available: true,
    bestseller: false,
    isNew: false,
    ...overrides,
  };
}

describe("catalogFlowersForAIBouquet", () => {
  it("includes every available individual-flower catalog product with its live price and image", () => {
    const flowers = catalogFlowersForAIBouquet([
      product({ id: "1", name: "ვარდი", price: 15, images: ["/manus-storage/rose.png"] }),
      product({ id: "2", name: "ლილია", price: 20, images: ["/manus-storage/lily.png"] }),
      product({ id: "3", category: "bouquet", name: "მზა თაიგული" }),
      product({ id: "4", available: false, name: "გაყიდული ყვავილი" }),
    ]);

    expect(flowers).toHaveLength(2);
    expect(flowers).toEqual(
      expect.arrayContaining([
        { key: "catalog-1", name: "ვარდი", price: 15, asset: "/manus-storage/rose.png" },
        { key: "catalog-2", name: "ლილია", price: 20, asset: "/manus-storage/lily.png" },
      ]),
    );
  });

  it("keeps a new individual flower selectable even when its primary image has not been set", () => {
    const [flower] = catalogFlowersForAIBouquet([product({ images: [] })]);
    expect(flower.asset).toMatch(/^data:image\/svg\+xml/);
  });
});
