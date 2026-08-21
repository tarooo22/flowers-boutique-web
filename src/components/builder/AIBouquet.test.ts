import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const aiSource = readFileSync(new URL("./AIBouquet.tsx", import.meta.url), "utf8");
const tabsSource = readFileSync(new URL("./BuilderTabs.tsx", import.meta.url), "utf8");
const pageSource = readFileSync(new URL("../../app/builder/page.tsx", import.meta.url), "utf8");

describe("AI Bouquet live catalog and preview contract", () => {
  it("renders every selected flower into a bounded, clipped preview cell", () => {
    expect(aiSource).toContain("absolute inset-[9%] grid min-h-0");
    expect(aiSource).toContain("gridTemplateColumns");
    expect(aiSource).toContain('gridAutoRows: "minmax(0, 1fr)"');
    expect(aiSource).toContain("selected.map((f) =>");
    expect(aiSource).not.toContain("selected.slice(0, 8)");
    expect(aiSource).toContain("overflow-hidden rounded-[18px]");
    expect(aiSource).toContain('data-testid="ai-composition-preview"');
  });

  it("feeds the AI picker from the live catalog while preserving the legacy Visual Builder list", () => {
    expect(pageSource).toContain("listLiveProducts()");
    expect(pageSource).toContain("catalogFlowersForAIBouquet(products)");
    expect(tabsSource).toContain("const aiPickerFlowers = aiFlowers.length ? aiFlowers : legacyBuilderFlowers");
    expect(tabsSource).toContain("<AIBouquet flowers={aiPickerFlowers} />");
    expect(tabsSource).toContain("<VisualBuilder flowers={legacyBuilderFlowers} />");
  });
});
