import { describe, expect, it } from "vitest";
import { brand } from "@/config/brand";

describe("Verified storefront business contact configuration", () => {
  it("uses the current Facebook-verified phone, email and social profiles", () => {
    expect(brand.phone).toBe("+995 511 55 56 50");
    expect(brand.email).toBe("info.flowersboutique@gmail.com");
    expect(brand.social.instagram).toBe("https://instagram.com/myflowersboutique");
    expect(brand.social.facebook).toBe("https://www.facebook.com/flowersboutiques");
    expect(brand.social.messenger).toBe("https://m.me/flowersboutiques");
  });

  it("routes map and directions to the Vazisubani studio address", () => {
    expect(brand.address).toContain("ვაზისუბანი");
    expect(brand.addressFull).toContain("შანდორ პეტეფის ქ. N1");
    expect(brand.directionsUrl).toContain("Shandor%20Petefi%20Street%201");
  });
});
