import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./MobileNav.tsx", import.meta.url), "utf8");

describe("Mobile navigation action fallbacks", () => {
  it("keeps account and wishlist routes reachable from the menu drawer", () => {
    expect(source).toContain('href="/account"');
    expect(source).toContain('href="/favorites"');
    expect(source).toContain('min-h-11');
    expect(source).toContain('e.key === "Escape"');
    expect(source).toContain("setMobileNavOpen(false)");
    expect(source).toContain('aria-label="Close menu"');
  });
});
