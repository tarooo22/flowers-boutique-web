import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./MessengerChat.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("./SiteChrome.tsx", import.meta.url), "utf8");

describe("Messenger contact entry point", () => {
  it("opens only the configured business inbox with an accessible, touch-sized trigger", () => {
    expect(source).toContain("brand.social.messenger");
    expect(source).toContain('target="_blank"');
    expect(source).toContain('rel="noopener noreferrer"');
    expect(source).toContain('aria-label={t("chat.messengerAria")}');
    expect(source).toContain("h-12 min-w-12");
  });

  it("is composed by the public shell and therefore excluded from Admin", () => {
    expect(shell).toContain("<MessengerChat />");
    expect(shell).toContain('pathname.startsWith("/admin")');
  });
});
