import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const catalog = readFileSync(new URL("./CatalogView.tsx", import.meta.url), "utf8");
const productCard = readFileSync(new URL("../ui/ProductCard.tsx", import.meta.url), "utf8");

describe("Catalog mobile overflow boundaries", () => {
  it("lets the main grid shrink inside the viewport and constrains pagination locally", () => {
    expect(catalog).toContain("grid min-w-0 grid-cols-[minmax(0,1fr)]");
    expect(catalog).toContain('<div className="min-w-0">');
    expect(catalog).toContain('className="grid min-w-0 grid-cols-2');
    expect(catalog).toContain('className="mt-12 max-w-full overflow-x-auto px-1"');
  });

  it("allows long localized product names to wrap rather than widening product grid tracks", () => {
    expect(catalog).toContain('className="min-w-0"');
    expect(productCard).toContain("group flex min-w-0 flex-col");
    expect(productCard).toContain("break-words text-[12.5px]");
  });
});
