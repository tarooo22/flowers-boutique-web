import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const logo = readFileSync(new URL("./Logo.tsx", import.meta.url), "utf8");
const footer = readFileSync(new URL("./Footer.tsx", import.meta.url), "utf8");

describe("Locale-aware brand wordmark", () => {
  it("uses the approved Georgian lockup and an English lockup from the shared locale state", () => {
    expect(logo).toContain("useI18n");
    expect(logo).toContain('lang === "ka"');
    expect(logo).toContain("ყვავილების");
    expect(logo).toContain("ბუტიკი");
    expect(logo).toContain("Flower's");
    expect(logo).toContain("Boutique");
    expect(logo).toContain("Flower's Boutique — home");
  });

  it("reuses the shared logo in the inverse Footer treatment", () => {
    expect(footer).toContain('import { Logo } from "./Logo"');
    expect(footer).toContain('<Logo tone="light" />');
  });
});
