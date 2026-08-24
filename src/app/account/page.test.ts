import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

describe("Private account indexing contract", () => {
  it("marks the authenticated account workspace as non-indexable", () => {
    expect(source).toContain('robots: { index: false, follow: false }');
    expect(source).toContain("getProductionSessionUser");
  });
});
