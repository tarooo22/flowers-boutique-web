import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./ContactStrip.tsx", import.meta.url), "utf8");

describe("ContactStrip", () => {
  it("keeps the protected contact actions and renders live Tbilisi operating state", () => {
    expect(source).toContain("brand.phoneHref");
    expect(source).toContain("brand.whatsappHref");
    expect(source).toContain("getTbilisiStoreStatus");
    expect(source).toContain("formatTbilisiTime");
    expect(source).toContain("cs.closedNow");
    expect(source).toContain("role=\"status\"");
  });

  it("keeps the compact dark studio panel separate from the map on the About page", () => {
    expect(source).toContain("bg-[var(--ink)]");
    expect(source).toContain("Flower&rsquo;s Boutique · Tbilisi studio");
    expect(source).not.toContain("brand.mapEmbedUrl");
    expect(source).not.toContain("brand.directionsUrl");
  });
});
