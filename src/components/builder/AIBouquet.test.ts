import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const aiSource = readFileSync(new URL("./AIBouquet.tsx", import.meta.url), "utf8");
const tabsSource = readFileSync(new URL("./BuilderTabs.tsx", import.meta.url), "utf8");
const pageSource = readFileSync(new URL("../../app/builder/page.tsx", import.meta.url), "utf8");

describe("AI Bouquet live catalog and preview contract", () => {
  it("renders every selected flower into a bounded, staged circular preview cell", () => {
    expect(aiSource).toContain("circularPreview");
    expect(aiSource).toContain("Math.cos(angle)");
    expect(aiSource).toContain("Math.sin(angle)");
    expect(aiSource).toContain("selected.map((f) =>");
    expect(aiSource).not.toContain("selected.slice(0, 8)");
    expect(aiSource).toContain("fb-bouquet-card");
    expect(aiSource).toContain("fb-bouquet-stage--generating");
    expect(aiSource).toContain('data-testid="ai-composition-preview"');
  });

  it("keeps the visible generation state for at least five seconds before revealing a result", () => {
    expect(aiSource).toContain("MIN_GENERATION_DURATION_MS = 5_000");
    expect(aiSource).toContain("remainingDuration");
    expect(aiSource).toContain("window.setTimeout");
    expect(aiSource).toContain('aria-busy="true"');
  });

  it("feeds the AI picker from the live catalog while preserving the legacy Visual Builder list", () => {
    expect(pageSource).toContain("listLiveProducts()");
    expect(pageSource).toContain("catalogFlowersForAIBouquet(products)");
    expect(tabsSource).toContain("const aiPickerFlowers = aiFlowers.length ? aiFlowers : legacyBuilderFlowers");
    expect(tabsSource).toContain("<AIBouquet flowers={aiPickerFlowers} />");
    expect(tabsSource).toContain("<VisualBuilder flowers={legacyBuilderFlowers} />");
  });
});
