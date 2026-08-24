import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./layout.tsx", import.meta.url), "utf8");

describe("Public storefront SEO contract", () => {
  it("uses the deployed canonical origin and complete social metadata baseline", () => {
    expect(source).toContain("https://flower-shop-jx9auvvz.manus.space");
    expect(source).toContain("metadataBase");
    expect(source).toContain("openGraph");
    expect(source).toContain("twitter");
    expect(source).toContain("canonical");
  });

  it("publishes Organization schema from the controlled brand configuration", () => {
    expect(source).toContain('"@type": "Florist"');
    expect(source).toContain("organizationSchema");
    expect(source).toContain("brand.social.instagram");
  });

  it("publishes a controlled Open Graph image and large social card", () => {
    expect(source).toContain("brand.socialImage");
    expect(source).toContain('card: "summary_large_image"');
  });
});
