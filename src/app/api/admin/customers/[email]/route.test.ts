import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./route.ts", import.meta.url), "utf8");

describe("Admin CRM-light customer summary contract", () => {
  it("is admin-gated, private and only aggregates customer order context", () => {
    expect(source).toContain("isProductionAdmin");
    expect(source).toContain('"Cache-Control": "private, no-store"');
    expect(source).toContain("orderCount");
    expect(source).toContain("totalSpend");
    expect(source).not.toContain("customerAddresses");
  });
});
