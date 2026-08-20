import { describe, it, expect } from "vitest";
import {
  filterProducts,
  variantPrice,
  getProductBySlug,
  getByTag,
  getBestsellers,
  getRelated,
  allColors,
} from "@/lib/catalog";
import { products } from "@/data/products";
import { formatPrice, formatDate } from "@/lib/format";

describe("filterProducts", () => {
  it("returns the whole catalog with no filters", () => {
    expect(filterProducts({}).length).toBe(products.length);
  });

  it("filters by category", () => {
    const roses = filterProducts({ category: "roses" });
    expect(roses.length).toBeGreaterThan(0);
    expect(roses.every((p) => p.category === "roses")).toBe(true);
  });

  it("filters by occasion tag", () => {
    const romance = filterProducts({ tag: "romance" });
    expect(romance.every((p) => p.tags.includes("romance"))).toBe(true);
  });

  it("applies a max price ceiling", () => {
    const cheap = filterProducts({ maxPrice: 190 });
    expect(cheap.every((p) => p.price <= 190)).toBe(true);
  });

  it("matches a text query against name and colour", () => {
    const res = filterProducts({ query: "peony" });
    expect(res.length).toBeGreaterThan(0);
    expect(res.some((p) => /peony/i.test(p.name))).toBe(true);
  });

  it("intersects multiple colours (OR within colours)", () => {
    const res = filterProducts({ colors: ["Red"] });
    expect(res.every((p) => p.colors.includes("Red"))).toBe(true);
  });

  it("sorts by price ascending and descending", () => {
    const asc = filterProducts({ sort: "price-asc" }).map((p) => p.price);
    const desc = filterProducts({ sort: "price-desc" }).map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it("returns nothing for an impossible filter combination", () => {
    expect(filterProducts({ category: "roses", colors: ["Blue"] }).length).toBe(0);
  });
});

describe("variantPrice", () => {
  const product = products[0];

  it("returns the base price for the classic variant", () => {
    expect(variantPrice(product, "classic")).toBe(product.price);
  });

  it("adds the variant delta for larger sizes", () => {
    const grand = product.variants.find((v) => v.id === "grand")!;
    expect(variantPrice(product, "grand")).toBe(product.price + grand.priceDelta);
  });

  it("falls back to base price for an unknown variant", () => {
    expect(variantPrice(product, "does-not-exist")).toBe(product.price);
  });
});

describe("selectors", () => {
  it("looks up a product by slug", () => {
    expect(getProductBySlug("rosewood-romance")?.name).toBe("Rosewood Romance");
    expect(getProductBySlug("nope")).toBeUndefined();
  });

  it("returns only bestsellers, respecting the limit", () => {
    const best = getBestsellers(3);
    expect(best.length).toBeLessThanOrEqual(3);
    expect(best.every((p) => p.bestseller)).toBe(true);
  });

  it("returns tagged products up to a limit", () => {
    expect(getByTag("joy", 4).length).toBeLessThanOrEqual(4);
  });

  it("excludes the source product from related items", () => {
    const p = products[0];
    const related = getRelated(p, 4);
    expect(related.some((r) => r.id === p.id)).toBe(false);
    expect(related.length).toBe(4);
  });

  it("returns a sorted unique colour list", () => {
    const colors = allColors();
    expect(new Set(colors).size).toBe(colors.length);
    expect(colors).toEqual([...colors].sort());
  });
});

describe("formatting", () => {
  it("formats prices with the Lari symbol", () => {
    expect(formatPrice(240)).toBe("240 ₾");
    expect(formatPrice(199.6)).toBe("200 ₾");
  });

  it("formats ISO dates", () => {
    expect(formatDate("2026-08-02")).toBe("2 Aug 2026");
    expect(formatDate("2026-08-02", "ka")).toBe("2 აგვ 2026");
  });
});
