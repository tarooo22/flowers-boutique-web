import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("ZIP-derived shared storefront system contract", () => {
  it("loads the clean-room visual system after legacy public layers and before Builder-specific rules", async () => {
    const main = await read("client/src/main.tsx");

    const sharedLayer = main.indexOf('import "./styles/zip-reference-system.css";');
    expect(sharedLayer).toBeGreaterThan(main.indexOf('import "./styles/amelie-rebuild.css";'));
    expect(sharedLayer).toBeLessThan(main.indexOf('import "./styles/bouquet-builder-editorial.css";'));
  });

  it("defines a token-led cream, coral and charcoal foundation with responsive/reduced-motion support", async () => {
    const styles = await read("client/src/styles/zip-reference-system.css");

    for (const token of [
      "--zip-page: #fbf7ee",
      "--zip-surface: #ffffff",
      "--zip-ink: #1a1a1a",
      "--zip-action: #ff5a3c",
      "--zip-footer: #1a1a1a",
      "--zip-container: 1280px",
      "--zip-gutter: 24px",
    ]) {
      expect(styles).toContain(token);
    }

    for (const selector of [
      ".am-header",
      ".am-primary-nav",
      ".am-search-dialog",
      ".am-product-card__media",
      ".am-footer__main",
      "@media (max-width: 860px)",
      "@media (max-width: 620px)",
      "@media (prefers-reduced-motion: reduce)",
    ]) {
      expect(styles).toContain(selector);
    }
  });

  it("leaves shared navigation, cart, language, account and search behaviors owned by the existing component", async () => {
    const navbar = await read("client/src/components/Navbar.tsx");

    for (const behavior of [
      "const { openDrawer } = useCartDrawer();",
      "const { user, loading, logout } = useAuth();",
      "const { language, setLanguage } = useLanguage();",
      "navigate(query ? `/catalog?search=${encodeURIComponent(query)}` : \"/catalog\");",
      "setLanguage(\"ka\")",
      "setLanguage(\"en\")",
      "onClick={openDrawer}",
      "<MobileBottomNav />",
      "<ContactSheet open={contactOpen}",
    ]) {
      expect(navbar).toContain(behavior);
    }
  });

  it("leaves the data-owned ProductCard actions and Footer legal/contact/account entries intact", async () => {
    const [card, footer] = await Promise.all([
      read("client/src/components/product/ProductCard.tsx"),
      read("client/src/components/Footer.tsx"),
    ]);

    for (const behavior of [
      "getProductName(product, language)",
      "localStorage.setItem(key",
      "onClick={() => onAdd(product)}",
      'href={`/product/${product.id}`}',
      'data-availability={isAvailable ? "available" : "unavailable"}',
    ]) {
      expect(card).toContain(behavior);
    }

    for (const protectedEntry of [
      "siteContact.phone",
      "siteContact.email",
      'href="/terms"',
      'href="/privacy"',
      'user?.role === "admin"',
    ]) {
      expect(footer).toContain(protectedEntry);
    }
  });

  it("uses the ZIP-derived Home rhythm while retaining slideshow, product query, Builder and contact behavior", async () => {
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

    for (const protectedBehavior of [
      "trpc.products.list.useQuery()",
      "trpc.categories.list.useQuery()",
      "addToCart({",
      "openDrawer();",
      'href="/bouquet-builder"',
      "siteContact.whatsapp",
      "setCurrentSlide(index)",
    ]) {
      expect(home).toContain(protectedBehavior);
    }
  });

  it("adds Catalog's ZIP-derived collection search without changing URL, filters, products query or quick add", async () => {
    const catalog = await read("client/src/pages/Catalog.tsx");
    const styles = await read("client/src/styles/zip-home-catalog.css");

    for (const expected of [
      'className="fb-catalog-intro p3-catalog-amelie-hero zip-catalog-hero"',
      'className="zip-catalog-hero__search"',
      'id="catalog-hero-search"',
      'className="fb-page-shell fb-catalog-layout zip-catalog-layout"',
      'className="fb-catalog-results p3-catalog-amelie-results zip-catalog-results"',
      "window.history.replaceState",
      "trpc.products.catalog.useQuery(catalogInput)",
      "setSelectedCategoryId",
      "setAvailability",
      "setSort",
      "onAdd={addProduct}",
    ]) {
      expect(catalog).toContain(expected);
    }

    for (const selector of [
      ".zip-home-hero",
      ".zip-home-marquee",
      ".zip-home-reward",
      ".zip-catalog-hero",
      ".zip-catalog-layout",
      ".zip-catalog-results",
    ]) {
      expect(styles).toContain(selector);
    }
  });

  it("keeps Product Detail's gallery, variants, quantity, cart, wishlist and SEO contracts inside the ZIP-derived shell", async () => {
    const detail = await read("client/src/pages/ProductDetail.tsx");

    for (const expected of [
      'zip-product-page min-h-screen',
      'zip-product-layout',
      'zip-product-purchase-card',
      'zip-product-information',
      'zip-product-related',
      "trpc.products.byId.useQuery",
      "setSelectedVariantId(variant.id)",
      "setQuantity((value)",
      "addToCart({ productId: product.id",
      "trackAddToCart",
      "trackAddToWishlist",
      "generateProductSchema",
    ]) {
      expect(detail).toContain(expected);
    }
  });

  it("keeps Cart and Checkout presentation isolated from order, delivery and communication workflows", async () => {
    const [cart, checkout, styles] = await Promise.all([
      read("client/src/pages/Cart.tsx"),
      read("client/src/pages/Checkout.tsx"),
      read("client/src/styles/zip-home-catalog.css"),
    ]);

    for (const expected of [
      'p2-cart-page zip-cart-page',
      "updateCartItemQuantity",
      "removeFromCart",
      "trpc.orders.create.useMutation()",
      'submitOrder("whatsapp")',
      'submitOrder("messenger")',
    ]) {
      expect(cart).toContain(expected);
    }

    for (const expected of [
      'fb-checkout-page zip-checkout-page',
      "MapPinSelector",
      "CompactGeorgianCalendar",
      "DeliveryTimeSlots",
      "handleWhatsApp",
      "handleMessenger",
    ]) {
      expect(checkout).toContain(expected);
    }

    for (const selector of [
      ".zip-product-page",
      ".zip-cart-page",
      ".zip-checkout-page",
      ".auth-page .auth-card",
      ".fb-info-page__card",
    ]) {
      expect(styles).toContain(selector);
    }
  });

  it("extends the system to protected Admin and payment-status routes without changing their access/polling contracts", async () => {
    const [admin, payment, styles] = await Promise.all([
      read("client/src/pages/Admin.tsx"),
      read("client/src/pages/PaymentSuccess.tsx"),
      read("client/src/styles/zip-home-catalog.css"),
    ]);

    expect(admin).toContain('className="admin-page p2-admin-page');
    expect(payment).toContain("trpc.payments.getPaymentStatus.useQuery");
    expect(payment).toContain("refetchInterval");
    expect(payment).toContain('navigate("/profile")');

    for (const selector of [".admin-page", ".p1-app--status", ".admin-page .fb-admin-tabs"]) {
      expect(styles).toContain(selector);
    }
  });
});
