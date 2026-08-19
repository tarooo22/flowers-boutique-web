import { describe, expect, it } from "vitest";
import { MAX_PER_FLOWER, MAX_STEMS, builderFlowers, ribbons, wrappers } from "@/data/builder";

describe("legacy custom bouquet builder contract", () => {
  it("retains the full nine-flower legacy selector for both builder modes", () => {
    expect(builderFlowers.map((flower) => flower.key)).toEqual([
      "rose",
      "sprayRose",
      "peony",
      "lily",
      "hydrangea",
      "eustoma",
      "alstroemeria",
      "sunflower",
      "moluccella",
    ]);
    expect(builderFlowers.every((flower) => flower.asset.startsWith("/manus-storage/builder-"))).toBe(true);
  });

  it("preserves visual bouquet constraints and styling choices", () => {
    expect(MAX_STEMS).toBe(36);
    expect(MAX_PER_FLOWER).toBe(24);
    expect(wrappers).toHaveLength(5);
    expect(ribbons.map((ribbon) => ribbon.id)).toContain("burgundy");
  });
});
