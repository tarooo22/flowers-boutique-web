import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("catalog and product discovery polish contracts", () => {
  it("keeps the Wave 3 responsive, focus-visible, and reduced-motion safeguards", async () => {
    const css = await readFile(
      path.join(process.cwd(), "client/src/index.css"),
      "utf8",
    );

    expect(css).toContain("/* === MASTER PLAN WAVE 3: Catalog and product discovery refinement === */");
    expect(css).toContain(".p2-catalog-page .fb-filter-trigger:focus-visible,");
    expect(css).toContain(".p2-catalog-page .fb-catalog-state {");
    expect(css).toContain("@media (max-width: 360px) {");
    expect(css).toContain("@media (prefers-reduced-motion: reduce) {");
    expect(css).toContain(".fb-product-perks {");
  });

  it("keeps product-media and option controls semantically selected and quantity-announced", async () => {
    const source = await readFile(
      path.join(process.cwd(), "client/src/pages/ProductDetail.tsx"),
      "utf8",
    );

    expect(source).toContain("aria-pressed={wishlisted}");
    expect(source).toContain("aria-pressed={displayImage === image}");
    expect(source).toContain("aria-pressed={selected}");
    expect(source).toContain('id="product-quantity" aria-live="polite"');
  });
});
