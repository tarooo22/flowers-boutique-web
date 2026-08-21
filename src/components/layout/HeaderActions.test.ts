import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./HeaderActions.tsx", import.meta.url), "utf8");

describe("Header profile navigation", () => {
  it("always routes an authenticated customer to Account and never role-routes the profile icon to Admin", () => {
    expect(source).toContain('href={customer ? "/account" : "/account/login"}');
    expect(source).not.toContain('isAdminRole(customer?.role)');
    expect(source).not.toContain('href={isAdminRole');
  });
});
