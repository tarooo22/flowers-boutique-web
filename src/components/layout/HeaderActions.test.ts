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
});
