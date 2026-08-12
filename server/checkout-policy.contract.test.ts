import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  DELIVERY_FEE_GEL,
  FREE_DELIVERY_THRESHOLD_GEL,
  getDeliveryFeeGEL,
  formatDeliveryFeeGEL,
} from "../shared/checkoutPolicy";

const read = (relativePath: string) =>
  readFileSync(new URL(relativePath, import.meta.url), "utf8");

describe("shared checkout and delivery policy", () => {
  it("defines the master-prompt delivery policy in one shared module", () => {
    expect(DELIVERY_FEE_GEL).toBe(5);
    expect(FREE_DELIVERY_THRESHOLD_GEL).toBe(150);
    expect(getDeliveryFeeGEL("delivery", 149.99)).toBe(5);
    expect(getDeliveryFeeGEL("delivery", 150)).toBe(0);
    expect(getDeliveryFeeGEL("pickup", 0)).toBe(0);
    expect(formatDeliveryFeeGEL("delivery", 149.99)).toBe("5 ₾");
    expect(formatDeliveryFeeGEL("delivery", 150)).toContain("უფასო");
  });

  it("reuses the same policy in client copy and canonical payment calculation", () => {
    const checkout = read("../client/src/pages/Checkout.tsx");
    const delivery = read("../client/src/pages/Delivery.tsx");
    const paymentSecurity = read("./paymentSecurity.ts");

    expect(checkout).toMatch(/from ["']@shared\/checkoutPolicy["']/);
    expect(delivery).toMatch(/from ["']@shared\/checkoutPolicy["']/);
    expect(paymentSecurity).toMatch(/getDeliveryFeeGEL/);
    expect(paymentSecurity).not.toMatch(/deliveryFeeMinor\s*=\s*1000/);
  });

  it("persists only canonical payment fields in both order mutations", () => {
    const routers = read("./routers.ts");

    // The router delegates both order-entry paths to one server-authoritative
    // helper; the helper itself owns the canonical payment calculation.
    expect(routers).toMatch(/async function canonicalizeOrderItems\([\s\S]*?return calculateCanonicalPayment\(/);
    expect(routers.match(/const payment = await canonicalizeOrderItems\(/g)).toHaveLength(2);
    expect(routers).toMatch(/items,\n\s*totalPrice,\n\s*fulfillmentType:[^\n]*,\n\s*deliveryFee: payment\.deliveryFee/);
    expect(routers).toMatch(/const totalPrice = payment\.finalTotal/);
    expect(routers).not.toMatch(/totalPrice:\s*input\.totalPrice/);
  });
});
