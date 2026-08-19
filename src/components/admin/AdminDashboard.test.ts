import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AdminDashboard.tsx", import.meta.url), "utf8");

describe("Admin manager workspace contract", () => {
  it("keeps the manager workspace capability surfaces and feedback states", () => {
    expect(source).toContain("manager workspace");
    expect(source).toContain("Set fulfilment status");
    expect(source).toContain("Products customers can buy");
    expect(source).toContain("Saving status…");
  });

  it("does not expose the unsupported order deletion action", () => {
    expect(source).not.toContain("Delete order");
    expect(source).not.toContain("removeOrder");
    expect(source).not.toContain("/api/admin/orders?id=");
  });
});
