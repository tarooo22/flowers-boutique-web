import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { translations } from "@/lib/translations";

const source = readFileSync(new URL("./CheckoutView.tsx", import.meta.url), "utf8");
const checkoutKeys = [
  "checkout.stepContact",
  "checkout.stepMethod",
  "checkout.stepDate",
  "checkout.stepRecipient",
  "checkout.stepPersonalize",
  "checkout.stepConfirm",
  "checkout.summary",
  "checkout.submitConfirm",
] as const;

describe("Checkout staged presentation contract", () => {
  it("retains the order submit, cart handoff and required field names", () => {
    expect(source).toContain('fetch("/api/orders"');
    expect(source).toContain("clearCart()");
    for (const field of ["name", "email", "phone", "address", "city", "date", "time", "notes"]) {
      expect(source).toContain(`name="${field}"`);
    }
  });

  it("uses the reference-inspired six-step flow, sticky summary and complete localized labels", () => {
    expect(source).toContain("function CheckoutStep");
    expect(source).toContain("function DeliveryCalendar");
    expect(source).toContain('name="fulfillment"');
    expect(source).toContain('name="cardMessage"');
    expect(source).toContain("studio_pickup");
    expect(source).toContain("recipientMode");
    expect(source).toContain("lg:sticky lg:top-24");
    expect(source).toContain("useI18n");
    for (const key of checkoutKeys) {
      expect(translations.en[key]).toBeTruthy();
      expect(translations.ka[key]).toBeTruthy();
      expect(translations.ru[key]).toBeTruthy();
    }
  });
});
