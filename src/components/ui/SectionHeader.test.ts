import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { translations } from "@/lib/translations";

const source = readFileSync(new URL("./SectionHeader.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../layout/SiteChrome.tsx", import.meta.url), "utf8");

describe("storefront keyboard-navigation contract", () => {
  it("offers a main-content skip target and section-specific CTA names", () => {
    expect(shell).toContain('href="#main"');
    expect(shell).toContain('className="skip-link"');
    expect(shell).toContain('t("common.skipToContent")');
    expect(source).toContain('aria-label={t("common.viewAllSection", { section: title })}');
    for (const locale of [translations.en, translations.ka, translations.ru]) {
      expect(locale["common.viewAllSection"]).toContain("{section}");
      expect(locale["common.skipToContent"]).toBeTruthy();
    }
  });
});
