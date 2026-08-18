import { describe, expect, it } from "vitest";
import { journalPosts } from "@/data/journal";

describe("journal editorial image mapping", () => {
  it("uses one bespoke managed-storage image for every public journal post", () => {
    expect(journalPosts).toHaveLength(3);
    expect(new Set(journalPosts.map((post) => post.image)).size).toBe(journalPosts.length);

    for (const post of journalPosts) {
      expect(post.image).toMatch(/^\/manus-storage\/fb-journal-(care|peony|colour)-v2_[a-f0-9]{8}\.jpg$/);
    }
  });

  it("does not regress to the inherited editorial image assets that could fail optimization", () => {
    const inheritedEditorialAssets = ["shot-1", "studio-5", "editorial-mixed", "editorial-roses"];

    for (const post of journalPosts) {
      expect(inheritedEditorialAssets.some((asset) => post.image.includes(asset))).toBe(false);
    }
  });
});
