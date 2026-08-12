import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const tokenPath = path.join(process.cwd(), "client/src/index.css");

function relativeLuminance(hex: string) {
  const channels = hex
    .replace("#", "")
    .match(/.{2}/g)
    ?.map((part) => Number.parseInt(part, 16) / 255);

  if (!channels || channels.length !== 3) {
    throw new Error(`Expected a six-digit hex colour, received ${hex}`);
  }

  const [red, green, blue] = channels.map(channel =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: string, second: string) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort(
    (a, b) => b - a
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe("storefront contrast contract", () => {
  it("keeps header and footer text/icon tokens at WCAG AA contrast on their light surfaces", async () => {
    const css = await readFile(tokenPath, "utf8");
    const accent = css.match(/--accent-primary:\s*(#[0-9a-fA-F]{6});/)?.[1];
    const focusRing = css.match(/--focus-ring:\s*(#[0-9a-fA-F]{6});/)?.[1];

    expect(accent).toBeDefined();
    expect(focusRing).toBeDefined();
    expect(contrastRatio("#282828", "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#44413f", "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(accent!, "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(accent!, "#faf9f7")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#ffffff", accent!)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(focusRing!, "#ffffff")).toBeGreaterThanOrEqual(3);
  });
});
