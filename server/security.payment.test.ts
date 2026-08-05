import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { Product } from "../drizzle/schema";
import {
  calculateCanonicalPayment,
  canonicalBOGAmounts,
  mapBOGStatus,
  resolveTrustedPaymentStatus,
  shouldApplyBOGCallbackUpdate,
} from "./paymentSecurity";

const product: Product = {
  id: 42,
  nameKa: "ტესტ ბუკეტი",
  nameEn: "Test bouquet",
  descriptionKa: null,
  descriptionEn: null,
  priceMin: "125.50",
  priceMax: "125.50",
  priceOnRequest: false,
  unitType: "bouquet",
  categoryId: 1,
  imageUrl: "/flower-assets/test.webp",
  imageKey: null,
  isRose: false,
  isAvailable: true,
  published: true,
  featured: false,
  variants: [
    {
      id: "large",
      colorNameKa: "წითელი",
      colorNameEn: "Red",
      colorHex: "#8b1e2d",
      imageUrl: "/flower-assets/test-large.webp",
      priceMin: "150.25",
      available: true,
    },
  ],
  bloomsPerStemMin: 1,
  bloomsPerStemMax: 1,
  stemDisplayRule: null,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

describe("canonical BOG payment pricing", () => {
  it("keeps PaymentSuccess read-only", () => {
    const source = readFileSync(
      new URL("../client/src/pages/PaymentSuccess.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toContain("payments.getPaymentStatus.useQuery");
    expect(source).not.toContain("updatePaymentStatus");
    expect(source).not.toContain("useMutation");
  });

  it("uses database price and ignores a manipulated client price", async () => {
    const selections = [
      { productId: 42, variantId: "large", quantity: 2, price: 0.01 },
    ] as any;
    const result = await calculateCanonicalPayment(selections, "delivery", async () => product);

    expect(result.items[0]).toMatchObject({
      productId: 42,
      productCode: "FB-000042",
      unitPrice: 150.25,
      lineTotal: 300.5,
      selectedVariantId: "large",
      itemType: "bouquet",
    });
    expect(result.subtotal).toBe(300.5);
    expect(result.deliveryFee).toBe(10);
    expect(result.finalTotal).toBe(310.5);
    expect(result.basketItems[0]?.totalPrice).toBe(300.5);
    expect(canonicalBOGAmounts(result)).toEqual({
      amount: 300.5,
      deliveryAmount: 10,
      basketItems: result.basketItems,
    });
  });

  it("rejects an invalid variant and unavailable product", async () => {
    await expect(
      calculateCanonicalPayment(
        [{ productId: 42, variantId: "missing", quantity: 1 }],
        "pickup",
        async () => product,
      ),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });

    await expect(
      calculateCanonicalPayment(
        [{ productId: 42, quantity: 1 }],
        "pickup",
        async () => ({ ...product, isAvailable: false }),
      ),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("maps trusted BOG statuses and keeps duplicate transitions stable", () => {
    expect(mapBOGStatus("completed")).toMatchObject({ localStatus: "paid", publicStatus: "paid" });
    expect(mapBOGStatus("rejected")).toMatchObject({ localStatus: "failed", publicStatus: "failed" });
    expect(mapBOGStatus("processing")).toMatchObject({ publicStatus: "processing" });
    expect(mapBOGStatus("created")).toMatchObject({ localStatus: "pending", publicStatus: "pending" });
    expect(resolveTrustedPaymentStatus("paid", "processing")).toBe("paid");
    expect(resolveTrustedPaymentStatus("paid", "rejected")).toBe("paid");
    expect(resolveTrustedPaymentStatus("failed", "created")).toBe("failed");
    expect(resolveTrustedPaymentStatus("cancelled", "processing")).toBe("cancelled");
    expect(resolveTrustedPaymentStatus("pending", "completed")).toBe("paid");
    expect(shouldApplyBOGCallbackUpdate("paid", "completed", true)).toBe(false);
    expect(shouldApplyBOGCallbackUpdate("paid", "processing", true)).toBe(false);
    expect(shouldApplyBOGCallbackUpdate("pending", "completed", true)).toBe(true);
  });
});
