import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const source = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Amelie-first corrective Home contract", () => {
  it("replaces the legacy home hierarchy with the measured public commerce sequence", async () => {
    const home = await source("client/src/pages/Home.tsx");
    const sequence = [
      'className="am-home-hero"',
      'className="am-occasion am-reveal"',
      'productRail(firstRail',
      'productRail(secondRail',
      'productRail(thirdRail',
      'className="am-promo-banner am-reveal"',
      'className="am-services am-reveal"',
      'className="am-journal am-reveal"',
    ];

    let previous = -1;
    for (const item of sequence) {
      const next = home.indexOf(item);
      expect(next).toBeGreaterThan(previous);
      previous = next;
    }

    expect(home).not.toContain("p1-home-trust");
    expect(home).not.toContain("p1-category-gallery");
    expect(home).not.toContain("p1-home-delivery");
    expect(home).not.toContain("p1-home-contact");
  });

  it("retains Home data, SEO, cart and product-routing contracts", async () => {
    const home = await source("client/src/pages/Home.tsx");

    expect(home).toContain("trpc.products.list.useQuery()");
    expect(home).toContain("trpc.categories.list.useQuery()");
    expect(home).toContain("useSEO({");
    expect(home).toContain("generateOrganizationSchema()");
    expect(home).toContain("generateLocalBusinessSchema()");
    expect(home).toContain("addToCart({");
    expect(home).toContain("openDrawer();");
    expect(home).toContain("<CartDrawer />");
    expect(home).toContain("href=\"/catalog\"");
    expect(home).toContain("href=\"/bouquet-builder\"");
  });

  it("keeps every primary route surface accessible in the reconstructed header", async () => {
    const navbar = await source("client/src/components/Navbar.tsx");

    for (const route of ["/catalog", "/bouquet-builder", "/about", "/contact", "/wishlist", "/delivery"]) {
      expect(navbar).toContain(`"${route}"`);
    }
    expect(navbar).toContain("const primaryLinks = links;");
    expect(navbar).toContain("setLanguage(\"ka\")");
    expect(navbar).toContain("setLanguage(\"en\")");
    expect(navbar).toContain("onClick={openDrawer}");
    expect(navbar).toContain("setSearchOpen(true)");
    expect(navbar).toContain("setContactOpen(true)");
    expect(navbar).toContain("import MobileBottomNav");
    expect(navbar).toContain("<MobileBottomNav />");
    expect(navbar).toContain("am-mobile-menu__links");
  });

  it("keeps localization, wishlist, variant and cart action logic in the rebuilt card", async () => {
    const card = await source("client/src/components/product/ProductCard.tsx");

    expect(card).toContain("getProductName(product, language)");
    expect(card).toContain('const key = "flowers-boutique-wishlist"');
    expect(card).toContain("localStorage.getItem(key)");
    expect(card).toContain("const needsSelection = variants.length > 0;");
    expect(card).toContain("const canQuickAdd = Boolean(onAdd && isAvailable && !needsSelection);");
    expect(card).toContain("onClick={() => onAdd(product)}");
    expect(card).toContain('href={`/product/${product.id}`}');
    expect(card).toContain('className="am-product-card__wish"');
    expect(card).toContain('className="am-product-card__action"');
  });

  it("keeps the footer business links while replacing its visual ownership", async () => {
    const footer = await source("client/src/components/Footer.tsx");
    const styles = await source("client/src/styles/amelie-rebuild.css");

    expect(footer).toContain('className="am-footer"');
    expect(footer).toContain('href="/terms"');
    expect(footer).toContain('href="/privacy"');
    expect(footer).toContain("siteContact.phone");
    expect(footer).toContain("siteContact.email");
    expect(footer).toContain("user?.role === \"admin\"");
    expect(styles).toContain(".am-home-hero");
    expect(styles).toContain(".am-product-card__media");
    expect(styles).toContain(".am-footer__main");
  });

  it("keeps the contact quick actions as a distinct Home pre-footer section", async () => {
    const [home, footer, styles] = await Promise.all([
      source("client/src/pages/Home.tsx"),
      source("client/src/components/Footer.tsx"),
      source("client/src/styles/amelie-rebuild.css"),
    ]);

    const contactBand = home.indexOf('className="am-contact-band am-reveal"');
    expect(contactBand).toBeGreaterThan(-1);
    expect(contactBand).toBeLessThan(home.indexOf("<Footer />"));
    expect(home).toContain("siteContact.whatsapp");
    expect(home).toContain("phoneHref");
    expect(footer).not.toContain('className="am-contact-band"');
    expect(styles).toContain(".am-contact-band__actions");
  });

  it("retains mobile quick access while using the rebuilt public visual layer", async () => {
    const [mobileNav, styles] = await Promise.all([
      source("client/src/components/mobile/MobileBottomNav.tsx"),
      source("client/src/styles/amelie-rebuild.css"),
    ]);

    expect(mobileNav).toContain('className="am-mobile-quick-nav"');
    expect(mobileNav).toContain('"/catalog"');
    expect(mobileNav).toContain('"/wishlist"');
    expect(mobileNav).toContain("onClick={openDrawer}");
    expect(mobileNav).toContain("has-am-mobile-quick-nav");
    expect(styles).toContain(".am-mobile-quick-nav");
    expect(styles).toContain("@media (max-width: 767px)");
  });
});
