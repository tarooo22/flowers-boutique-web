import { describe, expect, it } from "vitest";
import { postAuthDestination } from "@/lib/authRedirect";

describe("postAuthDestination", () => {
  it("uses the new account landing page when no internal destination was requested", () => {
    expect(postAuthDestination(null)).toBe("/account");
  });

  it("retains only safe internal destinations", () => {
    expect(postAuthDestination("/checkout")).toBe("/checkout");
    expect(postAuthDestination("https://example.test")).toBe("/account");
    expect(postAuthDestination("//example.test")).toBe("/account");
  });
});
