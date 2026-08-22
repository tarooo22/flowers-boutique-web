import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./LanguageSelector.tsx", import.meta.url), "utf8");

describe("Mobile language selector", () => {
  it("remains visible, keyboard-dismissible and touch-sized on mobile", () => {
    expect(source).not.toContain("hidden sm:block");
    expect(source).toContain("h-11 min-w-11");
    expect(source).toContain('e.key === "Escape"');
    expect(source).toContain("min-h-11 w-full");
  });
});
