import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./HeaderActions.tsx", import.meta.url), "utf8");

describe("Header profile navigation", () => {
  it("always routes an authenticated customer to Account and never role-routes the profile icon to Admin", () => {
    expect(source).toContain('href="/account"');
    expect(source).toContain('href="/account/login"');
    expect(source).toContain('isAdminRole(customer.role)');
    expect(source).toContain('href="/admin"');
    expect(source).toContain('fetch("/api/auth/logout"');
    expect(source).toContain('aria-haspopup="menu"');
    expect(source).toContain('event.key === "Escape"');
  });

  it("keeps language and Account access visible with 44px mobile controls", () => {
    expect(source).toContain("<LanguageSelector />");
    expect(source).not.toContain('className="relative hidden sm:block"');
    expect(source).not.toContain('className="hidden sm:grid"');
    expect(source).toContain('className="h-11 w-11"');
  });

  it("retains the primary mobile header actions", () => {
    expect(source).toContain("setSearchOpen(true)");
    expect(source).toContain('href="/account/login"');
    expect(source).toContain('href="/favorites"');
    expect(source).toContain("onClick={openCart}");
  });
});
