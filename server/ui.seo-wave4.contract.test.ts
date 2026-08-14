import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFileSync(path.join(projectRoot, relativePath), "utf8");

const seoPages = [
  "client/src/pages/FlowerDeliveryTbilisi.tsx",
  "client/src/pages/FlowerShopTbilisi.tsx",
  "client/src/pages/BirthdayFlowers.tsx",
  "client/src/pages/RoseBouquets.tsx",
  "client/src/pages/LilyBouquets.tsx",
  "client/src/pages/SprayRoses.tsx",
].map(read);

describe("Wave 4 SEO public-page consistency contract", () => {
  const styles = read("client/src/index.css");

  it("uses the shared editorial hook without changing individual SEO page structure", () => {
    for (const page of seoPages) {
      expect(page).toContain('className="fb-seo-page min-h-screen bg-white"');
    }
  });

  it("does not reintroduce an unsupported hour-based delivery guarantee", () => {
    for (const page of seoPages) {
      expect(page).not.toContain("2 საათში");
      expect(page).not.toContain("within 2 hours");
      expect(page).not.toContain("Fast Delivery");
    }
  });

  it("preserves delivery coverage wording rather than promising unverified speed", () => {
    const delivery = seoPages[0];
    const birthday = seoPages[2];
    const rose = seoPages[3];
    const lily = seoPages[4];
    const sprayRose = seoPages[5];
    expect(delivery).toContain("მიტანას თბილისის მასშტაბით");
    expect(delivery).toContain("delivery across Tbilisi");
    expect(birthday).toContain("მიტანა ხელმისაწვდომია თბილისის მასშტაბით");
    expect(rose).toContain("მიტანა ხელმისაწვდომია თბილისის მასშტაბით");
    expect(lily).toContain("მიტანა ხელმისაწვდომია თბილისის მასშტაბით");
    expect(sprayRose).toContain("მიტანა ხელმისაწვდომია თბილისის მასშტაბით");
  });

  it("keeps the Flower Shop breadcrumb as one accessible link rather than nested anchors", () => {
    const flowerShop = seoPages[1];
    expect(flowerShop).toContain('Link href="/" className="hover:text-gray-900"');
    expect(flowerShop).not.toContain('<Link href="/">\n              <a');
  });

  it("keeps focus visibility, responsive heading balance, and motion preference safeguards", () => {
    expect(styles).toContain(".fb-seo-page .group:focus-visible");
    expect(styles).toContain(".fb-seo-page > section:first-of-type h1");
    expect(styles).toContain("text-wrap: balance;");
    expect(styles).toContain("@media (prefers-reduced-motion: no-preference)");
  });
});
