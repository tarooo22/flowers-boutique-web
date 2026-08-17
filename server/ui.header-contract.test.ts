import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Amelie-first public storefront contract", () => {
  it("uses a clean-room header shell while retaining all primary commerce behaviors", async () => {
    const navbar = await read("client/src/components/Navbar.tsx");

    expect(navbar).toContain('className={`am-header ${scrolled ? "is-scrolled" : ""}`}');
    expect(navbar).toContain('className="am-announcement"');
    expect(navbar).toContain('className="am-primary-nav"');
    expect(navbar).toContain('className="am-brand__wordmark"');
    expect(navbar).toContain('className="am-icon-button am-cart-button"');
    expect(navbar).toContain("const primaryLinks = links;");
    expect(navbar).toContain('"/contact"');
    expect(navbar).toContain('href="/wishlist"');
    expect(navbar).toContain("onClick={openDrawer}");
    expect(navbar).toContain("setLanguage(\"ka\")");
    expect(navbar).toContain("setLanguage(\"en\")");
  });

  it("keeps accessible skip, search, account, mobile menu and quick-navigation surfaces", async () => {
    const [navbar, mobileNav] = await Promise.all([
      read("client/src/components/Navbar.tsx"),
      read("client/src/components/mobile/MobileBottomNav.tsx"),
    ]);

    expect(navbar).toContain('className="am-skip-link" href="#main-content"');
    expect(navbar).toContain('className="am-search-dialog"');
    expect(navbar).toContain('className="am-account-menu"');
    expect(navbar).toContain('className="am-mobile-menu"');
    expect(navbar).toContain("<MobileBottomNav />");
    expect(mobileNav).toContain('className="am-mobile-quick-nav"');
    expect(mobileNav).toContain('"/catalog"');
    expect(mobileNav).toContain('"/wishlist"');
    expect(mobileNav).toContain("onClick={openDrawer}");
  });

  it("retains the target main landmark and public route shell", async () => {
    const [app, home] = await Promise.all([read("client/src/App.tsx"), read("client/src/pages/Home.tsx")]);

    expect(app).toContain('main.id = "main-content"');
    expect(home).toContain('<div className="am-site" ref={revealRootRef}>');
    expect(home).toContain('<main id="main-content" className="am-home">');
    expect(home).toContain("<Navbar />");
    expect(home).toContain("<CartDrawer />");
    expect(home).toContain("<Footer />");
  });

  it("replaces legacy Home composition with the measured hero-to-commerce-to-services structure", async () => {
    const home = await read("client/src/pages/Home.tsx");
    const order = [
      'className="am-home-hero zip-home-hero"',
      'className="zip-home-marquee"',
      'className="am-occasion am-reveal"',
      'productRail(firstRail',
      'className="am-promo-banner am-reveal"',
      'className="zip-home-reward am-reveal"',
      'productRail(secondRail',
      'productRail(thirdRail',
      'className="am-services am-reveal"',
      'className="am-journal am-reveal"',
    ];
    let position = -1;
    for (const expected of order) {
      const next = home.indexOf(expected);
      expect(next).toBeGreaterThan(position);
      position = next;
    }

    for (const removedClass of ["p1-home-trust", "p1-category-gallery", "p1-home-delivery", "p1-home-contact"]) {
      expect(home).not.toContain(removedClass);
    }
  });

  it("keeps Home product/category queries, cart callback and SEO contracts intact", async () => {
    const home = await read("client/src/pages/Home.tsx");

    expect(home).toContain("trpc.products.list.useQuery()");
    expect(home).toContain("trpc.categories.list.useQuery()");
    expect(home).toContain("addToCart({");
    expect(home).toContain("openDrawer();");
    expect(home).toContain("useSEO({");
    expect(home).toContain("generateOrganizationSchema()");
    expect(home).toContain("generateLocalBusinessSchema()");
    expect(home).toContain('href="/catalog"');
    expect(home).toContain('href="/bouquet-builder"');
  });

  it("keeps the shared ProductCard localized, media-safe and action-complete in the new geometry", async () => {
    const card = await read("client/src/components/product/ProductCard.tsx");

    expect(card).toContain('className={`am-product-card ${isAvailable ? "" : "is-unavailable"} ${className}`.trim()}');
    expect(card).toContain('import FlowerImage from "@/components/FlowerImage"');
    expect(card).toContain("getProductName(product, language)");
    expect(card).toContain('₾${amount.toLocaleString("ka-GE"');
    expect(card).toContain('href={`/product/${product.id}`}');
    expect(card).toContain('className="am-product-card__wish"');
    expect(card).toContain('className="am-product-card__action"');
    expect(card).toContain('data-availability={isAvailable ? "available" : "unavailable"}');
    expect(card).toContain("const needsSelection = variants.length > 0;");
    expect(card).toContain("onClick={() => onAdd(product)}");
  });

  it("keeps Catalog discovery controls, URL state, product behavior and progressive card reveal intact", async () => {
    const catalog = await read("client/src/pages/Catalog.tsx");

    expect(catalog).toContain('className="fb-catalog-intro p3-catalog-amelie-hero zip-catalog-hero"');
    expect(catalog).toContain('className="p3-catalog-amelie-hero__meta" aria-live="polite"');
    expect(catalog).toContain('p3-catalog-amelie-filters ${filtersOpen ? "is-open" : ""}');
    expect(catalog).toContain('className="fb-catalog-grid p3-catalog-amelie-grid"');
    expect(catalog).toContain('className="p3-catalog-amelie-card"');
    expect(catalog).toContain('querySelectorAll<HTMLElement>(".p3-catalog-amelie-card")');
    expect(catalog).toContain('"IntersectionObserver" in window');
    expect(catalog).toContain('window.history.replaceState');
    expect(catalog).toContain("trpc.products.catalog.useQuery");
    expect(catalog).toContain("addToCart({");
    expect(catalog).toContain("<ProductCard");
  });

  it("keeps Product Detail gallery, selected variant, cart CTA and canonical delivery context intact", async () => {
    const detail = await read("client/src/pages/ProductDetail.tsx");

    expect(detail).toContain('import { DELIVERY_FEE_GEL, FREE_DELIVERY_THRESHOLD_GEL } from "@shared/checkoutPolicy";');
    expect(detail).toContain('className="fb-product-gallery p3-product-amelie-gallery"');
    expect(detail).toContain('className="p3-product-amelie-purchase-card zip-product-purchase-card"');
    expect(detail).toContain('className="fb-product-add p3-product-amelie-primary-cta"');
    expect(detail).toContain('className="p3-product-amelie-delivery-note"');
    expect(detail).toContain('className="fb-product-sticky p3-product-amelie-sticky"');
    expect(detail).toContain("setSelectedVariantId(variant.id)");
    expect(detail).toContain("onClick={addProduct}");
    expect(detail).toContain("addToCart({");
    expect(detail).toContain('href={`/contact?product=${product.id}`}');
    expect(detail).toContain('selectedVariant?.available === false');
  });

  it("keeps the Catalog and Product Detail additive visual layers token-led and reduced-motion safe", async () => {
    const styles = await read("client/src/index.css");

    for (const selector of [
      ".p3-catalog-amelie-hero",
      ".p3-catalog-amelie-grid",
      ".p3-catalog-amelie-card",
      ".p3-product-amelie-gallery",
      ".p3-product-amelie-purchase-card",
      ".p3-product-amelie-sticky",
    ]) {
      expect(styles).toContain(selector);
    }
    expect(styles).toContain("var(--fb-token-coral)");
    expect(styles).toContain("var(--fb-token-botanical)");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps the rebuilt footer data-owned and policy/account-safe", async () => {
    const footer = await read("client/src/components/Footer.tsx");

    expect(footer).toContain('className="am-footer"');
    expect(footer).toContain('className="am-footer__wordmark"');
    expect(footer).toContain("siteContact.phone");
    expect(footer).toContain("siteContact.email");
    expect(footer).toContain('href="/terms"');
    expect(footer).toContain('href="/privacy"');
    expect(footer).toContain("user?.role === \"admin\"");
  });

  it("keeps visual ownership in the Amelie-first stylesheet and preserves reduced-motion protections", async () => {
    const styles = await read("client/src/styles/amelie-rebuild.css");

    for (const selector of [
      ".am-header",
      ".am-home-hero",
      ".am-product-card__media",
      ".am-footer__main",
      ".am-mobile-quick-nav",
    ]) {
      expect(styles).toContain(selector);
    }
    expect(styles).toContain("@media (max-width: 767px)");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
