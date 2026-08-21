import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./route.ts", import.meta.url), "utf8");

describe("Flower Circle API access contract", () => {
  it("returns only the current session user's private real-order summary", () => {
    expect(source).toContain("getProductionSessionUser");
    expect(source).toContain("getFlowerCircleSummary(user)");
    expect(source).toContain("{ summary: null }");
    expect(source).toContain('"Cache-Control": "private, no-store"');
    expect(source).toContain('export const dynamic = "force-dynamic"');
  });
});
