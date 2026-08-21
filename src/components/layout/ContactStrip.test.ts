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

  it("uses the centralized map and directions details in place of a decorative bouquet visual", () => {
    expect(source).toContain("brand.mapEmbedUrl");
    expect(source).toContain("brand.directionsUrl");
    expect(source).toContain("title={`${brand.name} map`}");
    expect(source).toContain('loading="lazy"');
    expect(source).toContain("PinIcon");
  });
});
