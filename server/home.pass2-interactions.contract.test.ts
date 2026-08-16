import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const source = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Homepage Pass 2 protected interaction controls", () => {
  it("preserves header navigation, search, language and cart-drawer control hooks", async () => {
    const navbar = await source("client/src/components/Navbar.tsx");

    for (const route of ["/catalog", "/bouquet-builder", "/about", "/contact"]) {
      expect(navbar).toContain(`"${route}"`);
    }
    expect(navbar).toContain('onClick={() => setLanguage("ka")}');
    expect(navbar).toContain('onClick={() => setLanguage("en")}');
    expect(navbar).toContain("onClick={() => setSearchOpen(true)}");
    expect(navbar).toContain("navigate(query ? `/catalog?search=${encodeURIComponent(query)}` : \"/catalog\")");
    expect(navbar).toContain("onClick={openDrawer}");
  });

  it("preserves quick-add, pre-footer contact and mobile quick-nav interactions", async () => {
    const [home, card, mobileNav] = await Promise.all([
      source("client/src/pages/Home.tsx"),
      source("client/src/components/product/ProductCard.tsx"),
      source("client/src/components/mobile/MobileBottomNav.tsx"),
    ]);

    expect(card).toContain("onClick={() => onAdd(product)}");
    expect(card).toContain("const canQuickAdd = Boolean(onAdd && isAvailable && !needsSelection);");
    expect(home).toContain("href={phoneHref}");
    expect(home).toContain("href={siteContact.whatsapp}");
    expect(home.indexOf('className="am-contact-band"')).toBeLessThan(home.indexOf("<Footer />"));
    expect(home).toContain('className="am-contact-band__availability"');
    expect(home).toContain('am-contact-band__action am-contact-band__action--call');
    expect(home).toContain('am-contact-band__action am-contact-band__action--whatsapp');
    expect(mobileNav).toContain('"/catalog"');
    expect(mobileNav).toContain('"/wishlist"');
    expect(mobileNav).toContain("onClick={openDrawer}");
  });
});
