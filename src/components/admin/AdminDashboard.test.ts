import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AdminDashboard.tsx", import.meta.url), "utf8");

describe("Restored Admin panel contract", () => {
  it("keeps the legacy Admin panel tabs and live management capability surfaces", () => {
    expect(source).toContain("Admin Panel");
    expect(source).toContain("Orders");
    expect(source).toContain("Products");
    expect(source).toContain("Categories");
    expect(source).toContain("Banners");
    expect(source).toContain("Settings");
    expect(source).toContain("Set fulfilment status");
    expect(source).toContain("Search…");
    expect(source).toContain("Saving status…");
  });

  it("does not expose the unsupported order deletion action", () => {
    expect(source).not.toContain("Delete order");
    expect(source).not.toContain("removeOrder");
    expect(source).not.toContain("/api/admin/orders?id=");
  });
});
