import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./route.ts", import.meta.url), "utf8");

describe("Gift reminders private API contract", () => {
  it("uses session identity, private caching and validates date-only reminder input", () => {
    expect(source).toContain("getProductionSessionUser");
    expect(source).toContain('"Cache-Control": "private, no-store"');
    expect(source).toContain("reminderDate");
    expect(source).toContain("customerGiftReminders.userId");
  });

  it("does not activate a notification sender or provider", () => {
    expect(source).not.toContain("sendEmail");
    expect(source).not.toContain("sendSms");
    expect(source).not.toContain("fetch(\"https://");
  });
});
