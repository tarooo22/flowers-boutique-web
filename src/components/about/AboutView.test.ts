import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AboutView.tsx", import.meta.url), "utf8");
const brand = readFileSync(new URL("../../config/brand.ts", import.meta.url), "utf8");
const translations = readFileSync(new URL("../../lib/translations.ts", import.meta.url), "utf8");

describe("About contact map contract", () => {
  it("keeps an accessible embedded map and external directions fallback alongside contact actions", () => {
    expect(source).toContain("title={`${brand.name} map`}");
    expect(source).toContain("src={brand.mapEmbedUrl}");
    expect(source).toContain("href={brand.directionsUrl}");
    expect(source).toContain('t("about.getDirections")');
    expect(source).toContain("WhatsApp");
  });

  it("keeps the address and map destinations centralized in brand configuration", () => {
    expect(brand).toContain("mapEmbedUrl");
    expect(brand).toContain("directionsUrl");
    expect(brand).toContain("12 Chavchavadze Avenue, Tbilisi 0179, Georgia");
  });

  it("uses the new studio-location message for the location-value card", () => {
    expect(translations).toContain('"about.value3Title": "გვიპოვე ვაკეში"');
    expect(translations).toContain("ჩავლჩავაძის გამზირზე");
    expect(translations).toContain('"about.value3Title": "Find us in Vake"');
  });
});
