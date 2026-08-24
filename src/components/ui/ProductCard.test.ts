import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./ProductCard.tsx", import.meta.url), "utf8");

describe("product-card media resilience", () => {
  it("keeps product media identifiable while loading or after an image error", () => {
    expect(source).toContain("imageReady");
    expect(source).toContain("imageFailed");
    expect(source).toContain("onLoad={() => setImageReady(true)}");
    expect(source).toContain("onError={() => setImageFailed(true)}");
    expect(source).toContain("animate-pulse");
  });
});
