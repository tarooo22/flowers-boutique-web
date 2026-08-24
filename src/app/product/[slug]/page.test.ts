import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

describe("Product SEO contract", () => {
  it("provides canonical social metadata and Product/Breadcrumb schema from live product values", () => {
    expect(source).toContain("alternates: { canonical");
    expect(source).toContain("summary_large_image");
    expect(source).toContain('"@type": "Product"');
    expect(source).toContain('"@type": "BreadcrumbList"');
    expect(source).toContain("product.available");
  });
});
