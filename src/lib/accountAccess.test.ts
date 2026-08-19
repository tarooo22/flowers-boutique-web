import { describe, expect, it } from "vitest";
import { isAdminRole } from "@/lib/accountAccess";

describe("isAdminRole", () => {
  it("only grants the manager surface to the explicit admin role", () => {
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("user")).toBe(false);
    expect(isAdminRole(null)).toBe(false);
  });
});
