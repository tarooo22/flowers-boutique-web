import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./route.ts", import.meta.url), "utf8");

describe("Admin products pagination and bulk contract", () => {
  it("requires an admin session and returns an explicitly paginated page", () => {
    expect(source).toContain("isProductionAdmin");
    expect(source).toContain("pageSize");
    expect(source).toContain("listProductionAdminProductsPage");
    expect(source).toContain('"Cache-Control": "private, no-store"');
  });

  it("limits bulk mutation to a bounded whitelist and unique IDs", () => {
    expect(source).toContain('operation === "bulk"');
    expect(source).toContain("const allowed");
    expect(source).toContain("slice(0, 48)");
    expect(source).toContain("const bulkPatch = body.patch");
    expect(source).toContain('"available", "published", "bestseller", "categoryId"');
  });
});
