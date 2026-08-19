import { describe, expect, it } from "vitest";
import { localizedCategoryName } from "@/lib/categoryLabels";

describe("localizedCategoryName", () => {
  it("replaces legacy raw database category keys with the active localized label", () => {
    expect(
      localizedCategoryName(
        { id: "bouquet", name: "category.bouquet", slug: "bouquet", blurb: "", count: 64 },
        (key) => (key === "category.bouquet" ? "Bouquets" : key),
      ),
    ).toBe("Bouquets");
  });

  it("keeps a server-provided label when a future category lacks a translation", () => {
    expect(
      localizedCategoryName(
        { id: "future-category", name: "Future flowers", slug: "future-category", blurb: "", count: 0 },
        (key) => key,
      ),
    ).toBe("Future flowers");
  });
});
