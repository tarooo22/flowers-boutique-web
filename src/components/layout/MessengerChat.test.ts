import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./MessengerChat.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("./SiteChrome.tsx", import.meta.url), "utf8");

describe("Inquiry handoff contact entry point", () => {
  it("provides a touch-sized, accessible form trigger and asks for the required contact details", () => {
    expect(source).toContain("brand.social.messenger");
    expect(source).toContain('aria-label={t("chat.messengerAria")}');
    expect(source).toContain("h-12 min-w-12");
    expect(source).toContain('autoComplete="name"');
    expect(source).toContain('autoComplete="tel"');
    expect(source).toContain("<textarea required");
  });

  it("prefills WhatsApp and copies the prepared message before opening Messenger", () => {
    expect(source).toContain("brand.whatsappHref}?text=${encodeURIComponent(inquiry)");
    expect(source).toContain("navigator.clipboard.writeText(value)");
    expect(source).toContain('handoff("messenger")');
    expect(source).toContain('setFeedback(t("chat.messengerCopied"))');
  });

  it("is composed by the public shell and therefore excluded from Admin", () => {
    expect(shell).toContain("<MessengerChat />");
    expect(shell).toContain('pathname.startsWith("/admin")');
  });
});
