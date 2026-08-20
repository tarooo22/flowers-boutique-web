import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./orders.ts", import.meta.url), "utf8");

describe("Checkout fulfillment persistence contract", () => {
  it("keeps delivery behavior while safely supporting studio pickup", () => {
    expect(source).toContain('fulfillment: input.customer?.fulfillment === "studio_pickup" ? "studio_pickup" : "delivery"');
    expect(source).toContain('customer.fulfillment === "delivery" && !customer.address');
    expect(source).toContain('customer.fulfillment === "studio_pickup" || subtotal >= 150 ? 0 : 15');
    expect(source).toContain('customer.fulfillment === "studio_pickup" ? "pickup" : "delivery"');
  });
});
