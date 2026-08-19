import { describe, expect, it } from "vitest";
import { authFeedback } from "@/lib/authFeedback";

describe("authFeedback", () => {
  it("gives a safe, actionable message for expected registration failures", () => {
    expect(authFeedback("email_in_use", false)).toMatch(/sign in instead/i);
    expect(authFeedback("invalid_registration", false)).toMatch(/at least 8 characters/i);
  });

  it("does not disclose which field failed for invalid credentials", () => {
    expect(authFeedback("invalid_credentials", true)).toBe("The email or password is incorrect. Please try again.");
  });
});
