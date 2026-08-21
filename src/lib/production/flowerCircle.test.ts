import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { calculateFlowerCircleRedemption, summarizeFlowerCircle } from "./flowerCircleLevels";

const serverSource = readFileSync(new URL("./flowerCircle.ts", import.meta.url), "utf8");

describe("Flower Circle real-order summary", () => {
  it("uses the capped 1/2/3/5 percent thresholds", () => {
    expect(summarizeFlowerCircle(0, 0)).toMatchObject({ currentLevelId: "first-bloom", benefitPercent: 1, nextLevelThreshold: 1500 });
    expect(summarizeFlowerCircle(1500, 2)).toMatchObject({ currentLevelId: "studio-friend", benefitPercent: 2, nextLevelThreshold: 4000 });
    expect(summarizeFlowerCircle(4000, 4)).toMatchObject({ currentLevelId: "season-regular", benefitPercent: 3, nextLevelThreshold: 8000 });
    expect(summarizeFlowerCircle(12000, 8)).toMatchObject({ currentLevelId: "inner-circle", benefitPercent: 5, nextLevelThreshold: null, progressPercent: 100 });
  });

  it("reports the exact remaining eligible spend for the next level", () => {
    expect(summarizeFlowerCircle(164, 1)).toMatchObject({ remainingToNextLevel: 1336, progressPercent: 10.9 });
  });

  it("caps redemption to the lower of available benefit and 30 percent of product subtotal", () => {
    expect(calculateFlowerCircleRedemption(100, 200, true)).toBe(60);
    expect(calculateFlowerCircleRedemption(20, 200, true)).toBe(20);
    expect(calculateFlowerCircleRedemption(20, 200, false)).toBe(0);
  });

  it("restricts persisted and legacy orders to the authenticated owner while excluding unconfirmed statuses", () => {
    expect(serverSource).toContain("eq(orders.userId, user.id)");
    expect(serverSource).toContain("isNull(orders.userId)");
    expect(serverSource).toContain("eq(orders.customerEmail, legacyEmail)");
    expect(serverSource).toContain('inArray(orders.deliveryStatus, ELIGIBLE_DELIVERY_STATUSES)');
    expect(serverSource).toContain('"processing", "courier", "delivered"');
  });
});
