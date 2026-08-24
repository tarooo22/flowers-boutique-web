import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const tabsSource = readFileSync(new URL("./BuilderTabs.tsx", import.meta.url), "utf8");
const visualSource = readFileSync(new URL("./VisualBuilder.tsx", import.meta.url), "utf8");

describe("builder catalog identity contract", () => {
  it("passes canonical catalog flower keys into both builders without legacy fallback data", () => {
    expect(tabsSource).toContain("<VisualBuilder flowers={aiFlowers} />");
    expect(tabsSource).toContain("<AIBouquet flowers={aiFlowers} />");
    expect(tabsSource).not.toContain("builderFlowers");
    expect(tabsSource).not.toContain("legacyBuilderFlowers");
  });

  it("persists the selected Visual Builder flower keys unchanged for server canonical validation", () => {
    expect(visualSource).toContain(".map((f) => ({ key: f.key, quantity: counts[f.key] ?? 0 }))");
    expect(visualSource).toContain('t("builder.catalogUnavailable")');
  });
});
