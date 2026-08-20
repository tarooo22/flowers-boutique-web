import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AdminDashboard.tsx", import.meta.url), "utf8");

describe("Operational Admin panel contract", () => {
  it("keeps the reference-inspired manager hierarchy and live management capability surfaces", () => {
    expect(source).toContain("Flower&rsquo;s Boutique · Operations");
    expect(source).toContain("ადმინისტრირების პანელი");
    expect(source).toContain("პროდუქტები");
    expect(source).toContain("კატეგორიები");
    expect(source).toContain("შეკვეთები");
    expect(source).toContain("ბანერები");
    expect(source).toContain("პარამეტრები");
    expect(source).toContain("Set fulfilment status");
    expect(source).toContain("ძებნა…");
    expect(source).toContain("Saving status…");
  });

  it("retains real legacy product create, edit and confirmation-gated delete workflows", () => {
    expect(source).toContain("+ ახალი პროდუქტი");
    expect(source).toContain("პროდუქტის რედაქტირება");
    expect(source).toContain("Delete this product from the catalog? This cannot be undone.");
    expect(source).toContain("/api/admin/products");
  });

  it("does not expose the unsupported order deletion action", () => {
    expect(source).not.toContain("Delete order");
    expect(source).not.toContain("removeOrder");
    expect(source).not.toContain("/api/admin/orders?id=");
  });
});
