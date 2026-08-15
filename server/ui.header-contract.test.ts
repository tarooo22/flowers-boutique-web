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
const catalogPath = path.join(projectRoot, "client/src/pages/Catalog.tsx");
const productDetailPath = path.join(projectRoot, "client/src/pages/ProductDetail.tsx");
const bouquetBuilderPath = path.join(
  projectRoot,
  "client/src/pages/AIBouquetBuilder.tsx"
);
const visualBouquetBuilderPath = path.join(
  projectRoot,
  "client/src/components/bouquet-builder/VisualBouquetBuilder.tsx"
);
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
const aiChatBoxPath = path.join(
  projectRoot,
  "client/src/components/AIChatBox.tsx"
);
const dashboardLayoutPath = path.join(
  projectRoot,
  "client/src/components/DashboardLayout.tsx"
);
const productCardPath = path.join(
  projectRoot,
  "client/src/components/product/ProductCard.tsx"
);
const flowerImagePath = path.join(
  projectRoot,
  "client/src/components/FlowerImage.tsx"
);
const georgianTranslationsPath = path.join(projectRoot, "client/src/i18n/ka.ts");
const englishTranslationsPath = path.join(projectRoot, "client/src/i18n/en.ts");
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

  it("keeps the header trust strip tied to the canonical delivery policy and usable at mobile widths", async () => {
    const [navbar, styles] = await Promise.all([
      readFile(navbarPath, "utf8"),
      readFile(headerStylesPath, "utf8"),
    ]);

    expect(navbar).toContain('from "@shared/checkoutPolicy"');
    expect(navbar).toContain("DELIVERY_FEE_GEL, FREE_DELIVERY_THRESHOLD_GEL");
    expect(navbar).toContain('className="p1-utility-strip"');
    expect(navbar).toContain('className="p1-utility-strip__delivery"');
    expect(navbar).toContain("მიწოდებისა და კონტაქტის ინფორმაცია");
    expect(styles).toContain("Competitive redesign — additive shared trust and navigation layer");
    expect(styles).toContain(".p1-header .p1-utility-strip a:focus-visible");
    expect(styles).toContain("@media (max-width: 640px)");
    expect(styles).toContain(".p1-header .p1-utility-strip a {");
    expect(styles).toContain("display: none;");
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
    expect(productCard).toContain('data-availability={isAvailable ? "available" : "unavailable"}');
    expect(productCard).toContain('id={`product-price-${product.id}`}');
    expect(productCard).toContain('aria-describedby={`product-price-${product.id}`}');
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

  it("keeps checkout communication actions accessible while an order request is processing", async () => {
    const checkout = await readFile(checkoutPath, "utf8");

    expect(checkout).toContain('className="fb-checkout-action-panel space-y-3" aria-live="polite" aria-busy={isProcessing}');
    expect(checkout).toContain('{isProcessing ? t.sendingRequest : t.whatsapp}');
    expect(checkout).toContain('{isProcessing ? t.sendingRequest : t.messenger}');
    expect(checkout).toContain('className="fb-checkout-channel-help" role="status"');
    expect(checkout).toContain('Loader2');
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

  it("keeps Login and Register password controls, inline errors, and pending labels accessible", async () => {
    const [login, register, styles] = await Promise.all([
      readFile(loginPath, "utf8"),
      readFile(registerPath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    for (const page of [login, register]) {
      expect(page).toContain('className="auth-password-field"');
      expect(page).toContain('type="button"');
      expect(page).toContain("aria-label={");
      expect(page).toContain("aria-invalid={Boolean(errors.");
      expect(page).toContain('role="alert"');
    }

    expect(login).toContain("loginMutation.isPending ? t.loggingIn");
    expect(register).toContain("registerMutation.isPending ? t.registering");
    expect(styles).toContain("Master Plan Wave 2 — auth form accessibility polish");
    expect(styles).toContain(".auth-password-field > button[type=\"button\"]");
    expect(styles).toContain("min-width: 44px");
    expect(styles).toContain(".auth-input:focus-visible");
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

  it("keeps catalog discovery controls linked, stateful, and motion-safe", async () => {
    const [catalog, styles] = await Promise.all([
      readFile(catalogPath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(catalog).toContain('aria-controls="catalog-filters"');
    expect(catalog).toContain('id="catalog-filters"');
    expect(catalog).toContain("aria-pressed={selectedCategoryId === null}");
    expect(catalog).toContain("aria-pressed={selectedCategoryId === category.id}");
    expect(catalog).toContain('data-has-active-filters={hasFilters ? "true" : "false"}');
    expect(catalog).toContain('className="fb-catalog-toolbar__count" role="status" aria-live="polite"');
    expect(catalog).toContain('className="fb-catalog-toolbar__context"');
    expect(styles).toContain("Competitive redesign P1 — additive catalog discovery rhythm, carousel preserved");
    expect(styles).toContain(".p2-catalog-page .fb-catalog-toolbar__context");
    expect(styles).toContain(".p2-catalog-page .fb-catalog-results[data-has-active-filters=\"true\"]");
    expect(styles).toContain(".p2-catalog-page .fb-catalog-collection-nav button:active");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps product-detail purchase context labelled, live, and motion-safe", async () => {
    const [productDetail, styles] = await Promise.all([
      readFile(productDetailPath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(productDetail).toContain('className="p2-product-page min-h-screen');
    expect(productDetail).toContain('aria-labelledby="product-title"');
    expect(productDetail).toContain('aria-label={ka ? "პროდუქტის ფოტოები" : "Product images"}');
    expect(productDetail).toContain('id="product-title"');
    expect(productDetail).toContain('id="product-price" className="fb-product-price-row" aria-live="polite"');
    expect(productDetail).toContain('id="product-availability"');
    expect(productDetail).toContain('aria-describedby="product-price product-availability"');
    expect(productDetail).toContain('aria-labelledby="related-products-title"');
    expect(styles).toContain("Competitive redesign P1 — additive product-detail purchase clarity");
    expect(styles).toContain(".p2-product-page .fb-product-copy h1");
    expect(styles).toContain(".p2-product-page .fb-product-add:active");
    expect(styles).toContain(".p2-product-page :is(.fb-product-add, .fb-product-inquiry");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps the bouquet builder journey labelled, live, and touch-safe without changing its cart flow", async () => {
    const [builder, visualBuilder, styles] = await Promise.all([
      readFile(bouquetBuilderPath, "utf8"),
      readFile(visualBouquetBuilderPath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(builder).toContain('className="p2-builder-page min-h-screen');
    expect(builder).toContain('className="p2-builder-main');
    expect(builder).toContain('className="p2-builder-intro p2-builder-journey');
    expect(builder).toContain('id="builder-page-title"');
    expect(builder).toContain('className="p2-builder-mode-switcher w-full"');
    expect(builder).toContain('className="p2-builder-tab-panel mt-0"');
    expect(visualBuilder).toContain('className="p2-builder-workspace');
    expect(visualBuilder).toContain('aria-labelledby="visual-preview-title"');
    expect(visualBuilder).toContain('className="p2-builder-summary');
    expect(visualBuilder).toContain('aria-atomic="true"');
    expect(visualBuilder).toContain('id="builder-total"');
    expect(visualBuilder).toContain('className="p2-builder-add-to-cart');
    expect(visualBuilder).toContain('aria-describedby="builder-total"');
    expect(styles).toContain("Competitive redesign B — builder journey refinement");
    expect(styles).toContain(
      ".p2-builder-page .p2-builder-add-to-cart:not(:disabled):active"
    );
    expect(styles).toContain("env(safe-area-inset-bottom)");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps the homepage hero's editorial media transition load-aware and reduced-motion safe", async () => {
    const [home, styles] = await Promise.all([
      readFile(homePath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(home).toContain('className="p1-hero p1-hero--editorial"');
    expect(home).toContain("const [currentSlide, setCurrentSlide] = useState(0)");
    expect(home).toContain("const [loadedHeroSlides, setLoadedHeroSlides] = useState<Set<number>>(() => new Set())");
    expect(home).toContain('className={`p1-hero__media ${idx === currentSlide ? "is-active" : ""} ${loadedHeroSlides.has(idx) ? "is-loaded" : ""}`}');
    expect(home).toContain("aria-hidden={idx !== currentSlide}");
    expect(home).toContain("setCurrentSlide((prev) => (prev + 1) % heroSlides.length)");
    expect(home).toContain("setLoadedHeroSlides((loaded) => {");
    expect(home).toContain('className="p1-hero__image"');
    expect(home).toContain('className="p1-hero__backdrop absolute inset-0 z-0"');
    expect(home).toContain('className="p1-hero__title text-4xl md:text-6xl lg:text-7xl');
    expect(home).toContain('className="p1-hero__actions flex flex-wrap items-center gap-4 pt-4"');
    expect(home).toContain('p1-hero__cta p1-hero__cta--primary');
    expect(home).toContain('p1-hero__cta p1-hero__cta--secondary');
    expect(home).toContain('className="p1-hero__indicators lg:col-span-4');
    expect(home).toContain('aria-pressed={idx === currentSlide}');
    expect(styles).toContain("Phase 6 · Homepage editorial hero refinement");
    expect(styles).toContain("Phase 10 · Home hero composition refinement");
    expect(styles).toContain(".p1-hero--editorial .p1-hero__media::before");
    expect(styles).toContain(".p1-hero--editorial .p1-hero__media.is-active");
    expect(styles).toContain(".p1-hero--editorial .p1-hero__media.is-active .p1-hero__image");
    expect(styles).toContain(".p1-hero--editorial .p1-hero__image {");
    expect(styles).toContain(".p1-hero--editorial .p1-hero__cta:active");
    expect(styles).toContain(".p1-hero--editorial .p1-hero__indicator:focus-visible");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps the homepage bouquet category gallery route-safe, bilingual, and free of photo-card backdrops", async () => {
    const [home, styles, georgian, english] = await Promise.all([
      readFile(homePath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
      readFile(georgianTranslationsPath, "utf8"),
      readFile(englishTranslationsPath, "utf8"),
    ]);

    expect(home).toContain("const categoryArtwork = [");
    expect(home).toContain('className="p1-category-gallery');
    expect(home).toContain('className={`p1-category-tile p1-category-tile--${index + 1}`}');
    expect(home).toContain('href={`/catalog?category=${category.id}`}');
    expect(home).toContain('src={categoryArtwork[index % categoryArtwork.length]}');
    expect(home).toContain('t("home.categories.intro")');
    expect(home).toContain('t("home.categories.explore")');
    expect(styles).toContain("Phase 7 · Homepage bouquet-category editorial gallery");
    expect(styles).toContain(".p1-category-tile {");
    expect(styles).toContain("background: transparent;");
    expect(styles).toContain(".p1-category-tile__visual {");
    expect(styles).toContain(".p1-category-gallery {");
    expect(styles).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
    expect(georgian).toContain('"home.categories.intro"');
    expect(georgian).toContain('"home.categories.explore"');
    expect(english).toContain('"home.categories.intro"');
    expect(english).toContain('"home.categories.explore"');
  });

  it("keeps the homepage new-arrivals grid scoped, action-complete, and reduced-motion safe", async () => {
    const [home, productCard, styles] = await Promise.all([
      readFile(homePath, "utf8"),
      readFile(productCardPath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(home).toContain('className="p1-product-grid p1-product-grid--signature"');
    expect(productCard).toContain('className="p1-product-card__wish"');
    expect(productCard).toContain('className="p1-product-card__action"');
    expect(styles).toContain("Homepage new-arrivals · 21st-informed product reveal treatment");
    expect(styles).toContain(".p1-signatures .p1-product-grid--signature .p1-product-card {");
    expect(styles).toContain(".p1-signatures .p1-product-grid--signature .p1-product-card::before");
    expect(styles).toContain(".p1-signatures .p1-product-grid--signature .p1-product-card:focus-within");
    expect(styles).toContain("@media (hover: hover) and (pointer: fine)");
    expect(styles).toContain(".p1-signatures .p1-product-grid--signature .p1-product-card__action");
    expect(styles).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
    expect(styles).toContain("min-height: 44px;");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps the homepage editorial flow semantic, action-oriented, and motion-safe", async () => {
    const [home, styles] = await Promise.all([
      readFile(homePath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(home).toContain('className="p1-home"');
    expect(home).toContain('p1-home-section p1-home-section--categories');
    expect(home).toContain('p1-home-section p1-home-section--signatures');
    expect(home).toContain('p1-home-section p1-home-section--builder');
    expect(home).toContain('p1-home-section p1-home-section--experiences');
    expect(home).toContain('p1-home-section p1-home-section--delivery');
    expect(home).toContain('p1-home-section p1-home-section--contact');
    expect(home).toContain('className="p1-category-tile__meta');
    expect(home).toContain('className="p1-home-primary-cta');
    expect(home).toContain('className="p1-home-contact__action');
    expect(home).toContain('className="p1-home-experience-card');
    expect(home).toContain('className="p1-home-delivery-step');
    expect(styles).toContain("Home Page follow-up · editorial flow refinement");
    expect(styles).toContain(".p1-home .p1-home-section--signatures::before");
    expect(styles).toContain(".p1-home .p1-category-tile__meta");
    expect(styles).toContain(".p1-home .p1-home-primary-cta:active");
    expect(styles).toContain(".p1-home .p1-home-experience-card");
    expect(styles).toContain(".p1-home .p1-home-delivery-step::before");
    expect(styles).toContain("@media (hover: hover) and (pointer: fine)");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps the Amelie-inspired Home editorial layer scoped, policy-aware, and reduced-motion safe", async () => {
    const [home, styles] = await Promise.all([
      readFile(homePath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(home).toContain("p1-amelie-discovery");
    expect(home).toContain("p1-amelie-collection");
    expect(home).toContain("p1-amelie-builder-section");
    expect(home).toContain("p1-amelie-experiences");
    expect(home).toContain("p1-amelie-delivery");
    expect(home).toContain("p1-amelie-contact-section");
    expect(home).toContain('className="p1-amelie-builder__steps"');
    expect(home).toContain('aria-label={ka ? "თაიგულის შექმნის ეტაპები"');
    expect(home).toContain('className="p1-amelie-delivery__policy');
    expect(home).toContain("DELIVERY_FEE_GEL");
    expect(home).toContain("FREE_DELIVERY_THRESHOLD_GEL");
    expect(styles).toContain("Home editorial convergence layer — additive only");
    expect(styles).toContain(".p1-amelie-discovery .p1-category-tile:hover");
    expect(styles).toContain(".p1-amelie-builder__steps");
    expect(styles).toContain(".p1-amelie-delivery__policy");
    expect(styles).toContain(".p1-amelie-contact-section .p1-home-contact");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("integrates archive-inspired reveal, trust, account, chat, and dashboard polish without replacing live flows", async () => {
    const [home, login, register, chat, dashboard, styles] = await Promise.all([
      readFile(homePath, "utf8"),
      readFile(loginPath, "utf8"),
      readFile(registerPath, "utf8"),
      readFile(aiChatBoxPath, "utf8"),
      readFile(dashboardLayoutPath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(home).toContain('ref={revealRootRef}');
    expect(home).toContain("IntersectionObserver");
    expect(home).toContain('className="p1-home-trust fb-archive-reveal"');
    expect(home).toContain("DELIVERY_FEE_GEL");
    expect(home).toContain("FREE_DELIVERY_THRESHOLD_GEL");
    expect(login).toContain('auth-card auth-card--glass');
    expect(register).toContain('auth-card auth-card--glass');
    expect(register).toContain('id="register-confirm-password"');
    expect(register).toContain('className="auth-password-toggle"');
    expect(chat).toContain('boutique-ai-chat__typing-dots');
    expect(chat).toContain('role="status"');
    expect(chat).toContain('boutique-ai-chat__empty-mark');
    expect(dashboard).toContain('className="dashboard-sidebar border-r-0"');
    expect(dashboard).toContain('data-active-route={isActive ? "true" : "false"}');
    expect(dashboard).toContain('aria-current={isActive ? "page" : undefined}');
    expect(styles).toContain("Redesign archive integration — additive motion, glass and gradient utilities.");
    expect(styles).toContain(".p1-home .fb-archive-reveal");
    expect(styles).toContain(".p1-home-trust");
    expect(styles).toContain(".auth-card.auth-card--glass");
    expect(styles).toContain(".boutique-ai-chat__typing-dots");
    expect(styles).toContain(".dashboard-sidebar__nav-button[data-active-route");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps the Amelie-inspired shared storefront shell route-safe, policy-aware, and motion-safe", async () => {
    const [navbar, footer, styles] = await Promise.all([
      readFile(navbarPath, "utf8"),
      readFile(footerPath, "utf8"),
      readFile(path.join(projectRoot, "client/src/index.css"), "utf8"),
    ]);

    expect(navbar).toContain("p1-header p1-header--atelier");
    expect(navbar).toContain('href="/delivery" className="p1-mobile-menu__delivery-link"');
    expect(navbar).toContain("DELIVERY_FEE_GEL, FREE_DELIVERY_THRESHOLD_GEL");
    expect(navbar).toContain("onClick={openDrawer}");
    expect(navbar).toContain('href="/wishlist"');
    expect(footer).toContain('className="p1-footer__eyebrow"');
    expect(footer).toContain('href="/delivery" className="p1-footer__delivery-cta"');
    expect(footer).toContain("siteContact.phone");
    expect(styles).toContain("Amelie-inspired storefront convergence — Wave 1 (append-only).");
    expect(styles).toContain(".p1-header--atelier .p1-header__nav a::after");
    expect(styles).toContain(".p1-mobile-menu__delivery-link");
    expect(styles).toContain(".p1-footer__delivery-cta");
    expect(styles).toContain("transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1)");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
