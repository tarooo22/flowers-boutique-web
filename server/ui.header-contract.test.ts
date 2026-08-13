import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const navbarPath = path.join(
  projectRoot,
  "client/src/components/Navbar.tsx"
);
const appPath = path.join(projectRoot, "client/src/App.tsx");
const homePath = path.join(projectRoot, "client/src/pages/Home.tsx");
const footerPath = path.join(projectRoot, "client/src/components/Footer.tsx");
const cartPath = path.join(projectRoot, "client/src/pages/Cart.tsx");
const cartDrawerPath = path.join(
  projectRoot,
  "client/src/components/CartDrawer.tsx"
);
const wishlistPath = path.join(projectRoot, "client/src/pages/Wishlist.tsx");
const checkoutPath = path.join(projectRoot, "client/src/pages/Checkout.tsx");
const adminPath = path.join(projectRoot, "client/src/pages/Admin.tsx");
const profilePath = path.join(projectRoot, "client/src/pages/Profile.tsx");
const loginPath = path.join(projectRoot, "client/src/pages/Login.tsx");
const registerPath = path.join(projectRoot, "client/src/pages/Register.tsx");
const productCardPath = path.join(
  projectRoot,
  "client/src/components/product/ProductCard.tsx"
);
const flowerImagePath = path.join(
  projectRoot,
  "client/src/components/FlowerImage.tsx"
);
const headerStylesPath = path.join(
  projectRoot,
  "client/src/styles/header-refinement.css"
);

describe("storefront header contract", () => {
  it("uses a typography-led wordmark while preserving catalogue, account and cart actions", async () => {
    const navbar = await readFile(navbarPath, "utf8");

    expect(navbar).toContain('className="p1-brand__wordmark"');
    expect(navbar).toContain('import { BrandWordmark } from "@/components/BrandWordmark"');
    expect(navbar).toContain("BrandWordmark");
    expect(navbar).not.toContain("p1-brand__mark");
    expect(navbar).toContain('["/catalog", ka ? "კატალოგი" : "Catalog"]');
    expect(navbar).toContain('href="/wishlist"');
    expect(navbar).toContain("onClick={openDrawer}");
  });

  it("retains keyboard-visible focus treatment and responsive wordmark sizing", async () => {
    const styles = await readFile(headerStylesPath, "utf8");

    expect(styles).toContain(".p1-brand:focus-visible");
    expect(styles).toContain("@media (max-width: 960px)");
    expect(styles).toContain("@media (max-width: 767px)");
  });

  it("keeps the 21st-inspired navigation and product-media refinement scoped to the existing boutique system", async () => {
    const styles = await readFile(
      path.join(projectRoot, "client/src/index.css"),
      "utf8"
    );

    expect(styles).toContain("Phase 3 · 21st-inspired boutique refinement");
    expect(styles).toContain(".p1-header__nav a::after");
    expect(styles).toContain(".p1-header__nav a.is-active::after");
    expect(styles).toContain(".p1-app--commerce .fb-product-gallery__main::after");
    expect(styles).toContain(".p1-app--commerce .fb-product-gallery__thumbs button.is-active::after");
    expect(styles).toContain(
      ".p1-app--commerce :is(input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"range\"]), textarea, select):focus"
    );
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps header controls at a 44px minimum touch target", async () => {
    const styles = await readFile(headerStylesPath, "utf8");

    expect(styles).toContain(".p1-icon-button,");
    expect(styles).toContain(".p1-account-button {");
    expect(styles).toContain("min-inline-size: 44px");
    expect(styles).toContain("min-block-size: 44px");
    expect(styles).toContain(".p1-language button {");
  });

  it("keeps the storefront skip link, landmark target, and labelled navigation controls", async () => {
    const [app, navbar, styles] = await Promise.all([
      readFile(appPath, "utf8"),
      readFile(navbarPath, "utf8"),
      readFile(headerStylesPath, "utf8"),
    ]);

    expect(navbar).toContain('className="p1-skip-link" href="#main-content"');
    expect(app).toContain('document.querySelector("main")');
    expect(app).toContain('main.id = "main-content"');
    expect(navbar).toContain("aria-label={ka ? \"მთავარი ნავიგაცია\"");
    expect(navbar).toContain("aria-label={ka ? \"მობილური ნავიგაცია\"");
    expect(navbar).toContain("aria-label={ka ? \"მენიუს გახსნა\"");
    expect(styles).toContain("outline: 2px solid var(--accent-primary)");
  });

  it("keeps footer branding typography-led without removing contact or policy routes", async () => {
    const footer = await readFile(footerPath, "utf8");

    expect(footer).toContain('className="p1-footer__wordmark"');
    expect(footer).not.toContain("flowers-boutique-logo-192.webp");
    expect(footer).toContain("siteContact.phone");
    expect(footer).toContain('href="/terms"');
    expect(footer).toContain('href="/privacy"');
  });

  it("uses the shared image-state renderer for both cart and source-unavailable products", async () => {
    const [cart, cartDrawer, wishlist, flowerImage] = await Promise.all([
      readFile(cartPath, "utf8"),
      readFile(cartDrawerPath, "utf8"),
      readFile(wishlistPath, "utf8"),
      readFile(flowerImagePath, "utf8"),
    ]);

    expect(cart).toContain('import FlowerImage from "@/components/FlowerImage"');
    expect(cart).toContain("<FlowerImage src={imageForItem(item)}");
    expect(cart).not.toContain('<img src={imageForItem(item)}');
    expect(cartDrawer).toContain('import FlowerImage from "@/components/FlowerImage"');
    expect(cartDrawer).toContain("<BouquetCartPreview bouquetData={item.customData} />");
    expect(cartDrawer).toContain("<FlowerImage");
    expect(cartDrawer).toContain("src={imageForItem(item)}");
    expect(cartDrawer).not.toContain("'სურათი' : 'Image'");
    expect(wishlist).toContain('import FlowerImage from "@/components/FlowerImage"');
    expect(wishlist).toContain("src={item.imageUrl}");
    expect(wishlist).toContain("imageUrl: item.imageUrl || undefined");
    expect(flowerImage).toContain("src?: string | null");
    expect(flowerImage).toContain("if (!src || failed)");
    expect(flowerImage).toContain('src={src}');
    expect(flowerImage).toContain("სურათი მიუწვდომელია");
  });

  it("keeps the reusable product card localised, media-safe, and action-complete", async () => {
    const productCard = await readFile(productCardPath, "utf8");

    expect(productCard).toContain('import FlowerImage from "@/components/FlowerImage"');
    expect(productCard).toContain('className={`p1-product-card ${isAvailable ? "" : "is-unavailable"}`}');
    expect(productCard).toContain("src={product.imageUrl}");
    expect(productCard).toContain('₾${amount.toLocaleString("ka-GE"');
    expect(productCard).toContain('href={`/product/${product.id}`}');
    expect(productCard).toContain('className="p1-product-card__wish"');
    expect(productCard).toContain('className="p1-product-card__action"');
  });

  it("keeps checkout order summaries non-visual, so a mapped product URL cannot create an image fallback there", async () => {
    const checkout = await readFile(checkoutPath, "utf8");

    expect(checkout).toContain("const cart = getCart();");
    expect(checkout).toContain("setCartItems(cart);");
    expect(checkout).toContain("{cartItems.map((item, idx) => (");
    expect(checkout).toContain("{item.name} × {item.quantity}");
    expect(checkout).not.toContain("<img");
    expect(checkout).not.toContain("FlowerImage");
  });

  it("keeps the unauthenticated admin state readable at mobile widths without weakening access control", async () => {
    const admin = await readFile(adminPath, "utf8");

    expect(admin).toContain('if (!isAuthenticated || user?.role !== "admin")');
    expect(admin).toContain("w-full overflow-x-hidden px-5 py-10");
    expect(admin).toContain("max-w-full break-words");
    expect(admin).toContain("max-w-md text-[#666]");
  });

  it("uses Georgian category names in the admin filter when Georgian is active", async () => {
    const admin = await readFile(adminPath, "utf8");

    expect(admin).toContain(
      'language === "ka" ? cat.nameKa || cat.nameEn : cat.nameEn || cat.nameKa'
    );
    expect(admin).toContain("setFilterCategory(");
  });

  it("uses the same Georgian-first category fallback in admin table and mobile cards", async () => {
    const admin = await readFile(adminPath, "utf8");

    expect(
      admin.split("product.category?.nameKa || product.category?.nameEn")
    ).toHaveLength(3);
    expect(
      admin.split("product.category?.nameEn || product.category?.nameKa")
    ).toHaveLength(3);
  });

  it("retains distinct responsive product table and mobile-card layouts", async () => {
    const admin = await readFile(adminPath, "utf8");

    expect(admin).toContain('className="hidden md:block bg-white rounded-xl');
    expect(admin).toContain('className="md:hidden grid grid-cols-1 gap-4"');
    expect(admin).toContain('className="flex gap-2 flex-wrap"');
    expect(admin).toContain("min-w-[120px]");
    expect(admin).toContain("min-w-[100px]");
    expect(admin).toContain("min-w-[80px]");
  });

  it("localises the admin header secondary label while retaining the Flower’s Boutique brand", async () => {
    const admin = await readFile(adminPath, "utf8");

    expect(admin).toContain("FLOWER’S BOUTIQUE · მართვის ცენტრი");
    expect(admin).toContain("FLOWER’S BOUTIQUE · CONTROL ROOM");
    expect(admin).toContain('language === "ka"');
  });

  it("uses the restrained shared surface for profile information without changing account actions", async () => {
    const [profile, styles] = await Promise.all([
      readFile(profilePath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(profile).toContain('className="fb-profile-info-card"');
    expect(profile).toContain('className="fb-profile-info-card__label"');
    expect(profile).not.toContain('bg-[#D4AF37]/5');
    expect(profile).toContain("setIsEditing(true)");
    expect(styles).toContain(".fb-profile-info-card {");
    expect(styles).toContain("background: var(--surface-soft);");
  });

  it("keeps Login and Register primary actions on the boutique dusty-rose CTA hierarchy", async () => {
    const [login, register] = await Promise.all([
      readFile(loginPath, "utf8"),
      readFile(registerPath, "utf8"),
    ]);

    for (const page of [login, register]) {
      expect(page).toContain("auth-submit--boutique");
      expect(page).toContain('backgroundColor: "#8b5f68"');
      expect(page).toContain(
        '"linear-gradient(135deg, #9f6b7b 0%, #84525f 100%)"'
      );
      expect(page).toContain('color: "#fff"');
    }
  });

  it("keeps mobile navigation semantically active and preserves the shared 44px safe-area layer", async () => {
    const [navbar, styles] = await Promise.all([
      readFile(navbarPath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(navbar).toContain('aria-current={location === "/" ? "page" : undefined}');
    expect(navbar).toContain('aria-current={isActive(href) ? "page" : undefined}');
    expect(styles).toContain("Phase 5 · mobile-first shared refinement");
    expect(styles).toContain("--p3-mobile-control: 44px");
    expect(styles).toContain("body.has-p1-bottom-nav");
    expect(styles).toContain("env(safe-area-inset-bottom)");
    expect(styles).toContain(".p1-mobile-menu__links a.is-active");
    expect(styles).toContain("overflow-x: clip");
  });

  it("keeps mobile checkout grouping and admin chrome presentation-only", async () => {
    const [checkout, admin, styles] = await Promise.all([
      readFile(checkoutPath, "utf8"),
      readFile(adminPath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(checkout).toContain("fb-checkout-section");
    expect(checkout).toContain("fb-checkout-delivery-option");
    expect(checkout).toContain("fb-checkout-address-grid");
    expect(checkout).toContain("fb-checkout-summary");
    expect(admin).toContain('className="fb-admin-tabs mb-8 overflow-x-auto"');
    expect(styles).toContain("Phase 5b · route-specific phone refinement");
    expect(styles).toContain(".p1-app--checkout .fb-checkout-address-grid");
    expect(styles).toContain(".p1-app--admin .fb-admin-tabs");
    expect(styles).toContain(".p1-app--builder [role=\"tablist\"]");
  });

  it("keeps the homepage hero's editorial media transition load-aware and reduced-motion safe", async () => {
    const [home, styles] = await Promise.all([
      readFile(homePath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(home).toContain('className="p1-hero p1-hero--editorial"');
    expect(home).toContain("const [heroImageReady, setHeroImageReady] = useState(false)");
    expect(home).toContain('className={`p1-hero__media ${heroImageReady ? "is-loaded" : ""}`}');
    expect(home).toContain("onLoad={() => setHeroImageReady(true)}");
    expect(home).toContain('className="p1-hero__image"');
    expect(styles).toContain("Phase 6 · Homepage editorial hero refinement");
    expect(styles).toContain(".p1-hero--editorial .p1-hero__media::before");
    expect(styles).toContain(".p1-hero--editorial .p1-hero__media.is-loaded .p1-hero__image");
    expect(styles).toContain(".p1-hero--editorial .p1-hero__image {");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
