import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const mediaRoute = readFileSync(new URL("./media/route.ts", import.meta.url), "utf8");
const categoryRoute = readFileSync(new URL("./categories/route.ts", import.meta.url), "utf8");
const productRoute = readFileSync(new URL("./products/route.ts", import.meta.url), "utf8");

describe("Admin expansion route contract", () => {
  it("keeps media upload behind the production admin guard with safe image limits", () => {
    expect(mediaRoute).toContain("isProductionAdmin");
    expect(mediaRoute).toContain("MAX_FILE_BYTES");
    expect(mediaRoute).toContain("ALLOWED_TYPES");
    expect(mediaRoute).toContain('formData.getAll("files")');
    expect(mediaRoute).toContain("v1/storage/presign/put");
    expect(mediaRoute).toContain("/manus-storage/${key}");
  });

  it("supports category CRUD while preserving referenced-category safety", () => {
    expect(categoryRoute).toContain("isProductionAdmin");
    expect(categoryRoute).toContain("createProductionAdminCategory");
    expect(categoryRoute).toContain("updateProductionAdminCategory");
    expect(categoryRoute).toContain("deleteProductionAdminCategory");
    expect(categoryRoute).toContain("category_in_use");
  });

  it("accepts only managed media keys in product galleries", () => {
    expect(productRoute).toContain("imageUrls");
    expect(productRoute).toContain('item.url.startsWith("/manus-storage/")');
    expect(productRoute).toContain('item.key.startsWith("admin-media/")');
  });
});
