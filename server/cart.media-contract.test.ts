import { describe, expect, it } from "vitest";
import { normalizeCart } from "../client/src/lib/cartUtils";

describe("cart product-media contract", () => {
  it("preserves a persistent mapped product image URL when cart entries are normalized", () => {
    const mappedImageUrl = "/manus-storage/img_7342_d834be50_8ce2f03f.webp";
    const cart = normalizeCart([
      {
        productId: 60001,
        name: "პიონი",
        price: 15,
        quantity: 1,
        unitType: "single stem",
        imageUrl: mappedImageUrl,
      },
    ]);

    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: 60001,
      imageUrl: mappedImageUrl,
    });
  });

  it("retains a mapped image URL as optional cart metadata for non-visual checkout summaries", () => {
    const mappedImageUrl = "/manus-storage/img_checkout_60001.webp";
    const [cartItem] = normalizeCart([
      {
        productId: 60001,
        name: "პიონი",
        price: 15,
        quantity: 2,
        unitType: "single stem",
        imageUrl: mappedImageUrl,
      },
    ]);

    expect(cartItem.imageUrl).toBe(mappedImageUrl);
    expect(cartItem.name).toBe("პიონი");
    expect(cartItem.quantity).toBe(2);
  });
});
