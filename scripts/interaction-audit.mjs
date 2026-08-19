import { chromium } from "playwright";

const baseUrl = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function expectVisible(locator, message) {
  await locator.waitFor({ state: "visible", timeout: 12_000 });
  assert(await locator.isVisible(), message);
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH ?? "/usr/bin/chromium",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  const results = [];
  const runtimeErrors = [];
  const failedResources = [];
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) failedResources.push(`${response.status()} ${response.url()}`);
  });

  try {
    // Shared Header / Hero: internal navigation, cart overlay, language menu and Search are real client interactions.
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    const headerHrefs = await page.locator("header a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    for (const href of ["/", "/catalog", "/builder", "/about", "/rewards", "/account/login", "/favorites"]) {
      assert(headerHrefs.includes(href), `Header is missing the expected ${href} destination.`);
    }
    assert(await page.getByRole("link", { name: /Flower.?s Boutique/i }).first().getAttribute("href") === "/", "Header logo does not return home.");
    assert(await page.getByRole("link", { name: "Shop the catalog" }).getAttribute("href") === "/catalog", "Hero primary CTA does not resolve to Catalog.");
    await page.getByLabel("Cart", { exact: true }).click();
    await expectVisible(page.getByRole("dialog", { name: "Shopping cart" }), "Header Cart trigger did not open the cart drawer.");
    await page.keyboard.press("Escape");
    await page.getByRole("dialog", { name: "Shopping cart" }).waitFor({ state: "hidden", timeout: 6_000 });
    await page.getByLabel("Change language").click();
    await expectVisible(page.getByRole("listbox"), "Language dropdown did not open.");
    await page.getByRole("option", { name: /ქართული/ }).click();
    assert((await page.locator("html").getAttribute("lang")) === "ka", "Language selection did not change document language.");
    await page.getByLabel("Change language").click();
    await page.getByRole("option", { name: /English/ }).click();
    assert((await page.locator("html").getAttribute("lang")) === "en", "Language selection did not restore English.");

    // Journey D: global Search uses live catalog data and returns a live product route.
    await page.getByLabel("Search").click();
    const globalSearch = page.getByPlaceholder("Search bouquets, colours, occasions…");
    await expectVisible(globalSearch, "Global search overlay did not open.");
    await globalSearch.fill("Lily");
    const lilyResults = page.getByRole("link", { name: /Lily/i });
    await expectVisible(lilyResults.first(), "Global search did not return a live Lily product.");
    assert(await lilyResults.count() > 0, "Global search did not return any Lily product result.");
    await globalSearch.press("Enter");
    await page.waitForURL(/\/catalog\?q=Lily/);
    results.push("global-search");
    results.push("header-cart-language-and-hero");

    // Catalog query, filter routes and footer's featured destination must have real results.
    for (const path of ["/catalog?category=bouquet", "/catalog?category=single-stems", "/catalog?occasion=featured"]) {
      await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
      assert(await page.locator('a[href^="/product/"]').count() > 0, `Catalog filter ${path} returned no products.`);
    }
    results.push("catalog-live-filters");

    // Journey A: a current catalog card resolves to its product, quantity changes, cart opens and checkout retains state.
    await page.goto(`${baseUrl}/catalog`, { waitUntil: "networkidle" });
    const productHref = await page.locator('a[href^="/product/"]').first().getAttribute("href");
    assert(productHref, "Catalog does not expose a product detail destination.");
    await page.goto(`${baseUrl}${productHref}`, { waitUntil: "networkidle" });
    const secondGalleryImage = page.getByLabel("View image 2");
    if (await secondGalleryImage.count()) {
      await secondGalleryImage.click();
      assert((await secondGalleryImage.getAttribute("aria-current")) === "true", "Product gallery thumbnail did not set the active image.");
    }
    const addButton = page.getByRole("button", { name: /^Add to cart ·/ });
    const beforePrice = await addButton.textContent();
    await page.getByLabel("Increase quantity").click();
    await page.waitForTimeout(100);
    assert((await addButton.textContent()) !== beforePrice, "Product quantity did not update the add-to-cart total.");
    const deliveryAccordion = page.getByRole("button", { name: "Delivery & payment" });
    await deliveryAccordion.click();
    assert((await deliveryAccordion.getAttribute("aria-expanded")) === "true", "Product delivery accordion did not expand.");
    await deliveryAccordion.click();
    assert((await deliveryAccordion.getAttribute("aria-expanded")) === "false", "Product delivery accordion did not collapse.");
    const favorite = page.getByLabel("Add to wishlist").first();
    await favorite.click();
    await expectVisible(page.getByLabel("Remove from wishlist"), "Product detail wishlist button did not toggle state.");
    await page.goto(`${baseUrl}/favorites`, { waitUntil: "networkidle" });
    assert(await page.locator(`a[href="${productHref}"]`).count() > 0, "Wishlist route did not retain the selected product.");
    await page.goto(`${baseUrl}${productHref}`, { waitUntil: "networkidle" });
    await addButton.click();
    const cartDialog = page.getByRole("dialog", { name: "Shopping cart" });
    await expectVisible(cartDialog, "Add to cart did not open the synchronized cart drawer.");
    assert(await cartDialog.getByText(/Subtotal/).count() === 1, "Cart drawer does not show a subtotal after adding a product.");
    const cartQuantity = cartDialog.getByRole("group", { name: "Quantity" });
    await cartQuantity.getByLabel("Increase quantity").click();
    await page.reload({ waitUntil: "networkidle" });
    await page.getByLabel("Cart", { exact: true }).click();
    await expectVisible(cartDialog, "Cart state did not persist after a page reload.");
    assert(await cartQuantity.getByText("2", { exact: true }).count() === 1, "Cart quantity did not persist after a page reload.");
    await cartDialog.getByRole("link", { name: "Checkout" }).click();
    await page.waitForURL(/\/checkout/);
    assert(!(await page.getByRole("button", { name: "Place order" }).isDisabled()), "Checkout is disabled with a valid cart.");
    for (const [label, value] of [["Full name", "QA Audit"], ["Email", "qa.audit@example.test"], ["Phone", "+995555000000"], ["Address", "Audit Street 1"]]) {
      await page.getByLabel(label).fill(value);
    }
    await page.goto(`${baseUrl}/cart`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Remove item" }).click();
    await expectVisible(page.getByText("Your cart is empty", { exact: true }), "Removing the last cart item did not synchronize the cart empty state.");
    results.push("product-cart-checkout");

    // A fresh browser context proves that empty checkout does not surface an active order CTA.
    const emptyContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      ignoreHTTPSErrors: true,
    });
    const emptyPage = await emptyContext.newPage();
    await emptyPage.goto(`${baseUrl}/checkout`, { waitUntil: "networkidle" });
    await expectVisible(emptyPage.getByText("Your cart is empty."), "Empty checkout did not show its intentional empty state.");
    assert(await emptyPage.getByRole("button", { name: "Place order" }).count() === 0, "Empty checkout exposes an active order action.");
    await emptyContext.close();
    results.push("empty-checkout-guard");

    // Catalog control surface: query/clear, price, sort, pagination and mobile filter drawer all change the live result state.
    await page.goto(`${baseUrl}/catalog`, { waitUntil: "networkidle" });
    const catalogSearch = page.getByPlaceholder("Search bouquets, colours…");
    await catalogSearch.fill("not-a-real-flower-query");
    await page.waitForURL(/q=not-a-real-flower-query/);
    assert(await page.locator('a[href^="/product/"]').count() === 0, "Catalog search zero-result query still shows products.");
    await page.getByLabel("Clear search").click();
    await page.waitForURL((url) => !url.searchParams.has("q"));
    await page.getByRole("button", { name: "≤ 180 ₾" }).click();
    await page.waitForURL(/max=180/);
    assert(await page.locator('a[href^="/product/"]').count() > 0, "Price filter returned no eligible products unexpectedly.");
    await page.getByRole("button", { name: "Clear all" }).click();
    await page.waitForURL((url) => !url.searchParams.has("max"));
    await page.locator("select").selectOption("price-asc");
    await page.waitForURL(/sort=price-asc/);
    await page.getByLabel("Next page").click();
    await page.waitForURL(/page=2/);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/catalog`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Filters" }).click();
    await expectVisible(page.getByRole("heading", { name: "Filters" }), "Mobile filter drawer did not open.");
    await page.getByRole("button", { name: "≤ 180 ₾" }).click();
    await page.waitForURL(/max=180/);
    await page.getByRole("button", { name: /Show results/ }).click();
    assert((await page.getByRole("heading", { name: "Filters" }).count()) === 0, "Mobile filter Apply did not close the drawer.");
    results.push("catalog-ui-filters-and-pagination");

    const quickAdd = page.getByRole("button", { name: /Add to cart —/ }).first();
    await quickAdd.click();
    await page.goto(`${baseUrl}/cart`, { waitUntil: "networkidle" });
    assert(await page.getByRole("button", { name: "Remove item" }).count() > 0, "ProductCard quick-add did not add the exact card product to cart.");
    await page.getByRole("button", { name: "Remove item" }).first().click();
    await expectVisible(page.getByText("Your cart is empty", { exact: true }), "ProductCard quick-add cart item did not remove cleanly.");
    results.push("product-detail-wishlist-accordions-and-card-quick-add");

    // Journey B: restored Visual Builder selection updates summary, opens cart and keeps its order CTA gated.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseUrl}/builder`, { waitUntil: "networkidle" });
    const addStem = page.getByLabel(/^\+ /).first();
    await addStem.click();
    await expectVisible(page.getByText("1 stems", { exact: true }).first(), "Visual Builder selection did not update its live stem summary.");
    const bouquetCta = page.getByRole("button", { name: "Add bouquet to cart" });
    assert(!(await bouquetCta.isDisabled()), "Visual Builder did not enable its cart CTA after a stem selection.");
    await bouquetCta.click();
    await expectVisible(page.getByRole("dialog", { name: "Shopping cart" }), "Visual Builder cart handoff did not open the cart drawer.");
    results.push("visual-builder-cart");

    // Journey B continued: AI Builder guards empty selection, clears cleanly, generates a result and hands it to cart.
    await page.goto(`${baseUrl}/builder`, { waitUntil: "networkidle" });
    await page.getByRole("tab").nth(1).click();
    const aiGenerate = page.getByRole("button", { name: "Generate this bouquet" });
    assert(await aiGenerate.isDisabled(), "AI generation is active with no selected flowers.");
    await page.getByLabel(/^\+ /).first().click();
    await page.getByRole("button", { name: "Clear" }).click();
    assert(await aiGenerate.isDisabled(), "AI Builder Clear did not reset the selected flowers.");
    await page.getByLabel(/^\+ /).first().click();
    await aiGenerate.click();
    const aiOrder = page.getByRole("button", { name: "Order this bouquet" });
    await expectVisible(aiOrder, "AI generation did not produce a usable bouquet result.");
    await aiOrder.click();
    await expectVisible(page.getByRole("dialog", { name: "Shopping cart" }), "AI result did not hand off to the cart drawer.");
    results.push("ai-builder-generation-and-cart");

    // Journey C: mobile menu opens, exposes live category links, and closes via Escape.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.getByLabel("Open menu").click();
    const mobileNav = page.locator('nav[aria-label="Mobile"]');
    await expectVisible(mobileNav, "Mobile menu did not open.");
    assert(await mobileNav.getByRole("link", { name: /Bouquets/i }).count() === 1, "Mobile menu lacks the live Bouquet category link.");
    await page.keyboard.press("Escape");
    await mobileNav.waitFor({ state: "hidden", timeout: 6_000 });
    results.push("mobile-menu");

    // Footer contact and safe no-data collection affordances.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseUrl}/catalog`, { waitUntil: "networkidle" });
    const footerHrefs = await page.locator("footer a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    for (const href of ["/catalog", "/builder", "/catalog?occasion=featured", "/about", "/journal", "/rewards", "/about#delivery", "/about#contact", "/favorites", "/account/login"]) {
      assert(footerHrefs.includes(href), `Footer is missing the expected ${href} destination.`);
    }
    assert((await page.getByRole("link", { name: "+995 555 123 456" }).getAttribute("href"))?.startsWith("tel:"), "Footer phone is not a valid tel: action.");
    assert((await page.getByRole("link", { name: "hello@flowersboutique.co" }).getAttribute("href"))?.startsWith("mailto:"), "Footer email is not a valid mailto: action.");
    assert(await page.getByRole("link", { name: "Flower Boxes" }).count() === 0, "Unavailable Flower Boxes collection remains a fake link.");
    assert(await page.getByRole("link", { name: "Peonies" }).count() === 0, "Unavailable Peonies collection remains a fake link.");
    results.push("footer-contact-and-safe-collections");

    // About contact targets and Journal article routes must remain navigable without inventing an external destination.
    await page.goto(`${baseUrl}/about`, { waitUntil: "networkidle" });
    assert((await page.getByRole("link", { name: "+995 555 123 456" }).first().getAttribute("href"))?.startsWith("tel:"), "About phone action is not a valid tel: link.");
    assert((await page.getByRole("link", { name: "hello@flowersboutique.co" }).first().getAttribute("href"))?.startsWith("mailto:"), "About email action is not a valid mailto: link.");
    assert((await page.getByRole("link", { name: "WhatsApp" }).first().getAttribute("href"))?.startsWith("https://wa.me/"), "About WhatsApp action is malformed.");
    await page.goto(`${baseUrl}/journal`, { waitUntil: "networkidle" });
    const articleHref = await page.locator('a[href^="/journal/"]').first().getAttribute("href");
    assert(articleHref && articleHref !== "/journal", "Journal list does not expose a detail route.");
    await page.goto(`${baseUrl}${articleHref}`, { waitUntil: "networkidle" });
    assert(new URL(page.url()).pathname.startsWith("/journal/"), "Journal detail destination did not resolve.");
    results.push("about-contact-and-journal-routes");

    // Account forms retain native validation and a safe password-support route without creating audit accounts.
    await page.goto(`${baseUrl}/account/login`, { waitUntil: "networkidle" });
    const loginForm = page.locator("form");
    assert((await loginForm.getByLabel("Email").getAttribute("required")) !== null, "Login email is not required.");
    assert((await loginForm.getByLabel("Password").getAttribute("required")) !== null, "Login password is not required.");
    assert(!(await loginForm.evaluate((form) => form.checkValidity())), "Empty login form bypasses browser validation.");
    assert((await page.getByRole("link", { name: "Forgot password?" }).getAttribute("href"))?.startsWith("mailto:"), "Password recovery does not provide a usable support email action.");
    await page.getByRole("link", { name: "Create an account" }).click();
    await page.waitForURL(/\/account\/register/);
    const registerForm = page.locator("form");
    for (const label of ["Full name", "Email", "Password"]) {
      assert((await registerForm.getByLabel(label).getAttribute("required")) !== null, `Register ${label} is not required.`);
    }
    assert(!(await registerForm.evaluate((form) => form.checkValidity())), "Empty registration form bypasses browser validation.");
    results.push("account-forms-and-validation");

    // Admin remains protected; the public storefront does not expose manager controls.
    await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
    assert(new URL(page.url()).pathname === "/account/login", "Admin route is not protected by the customer/auth entry boundary.");
    results.push("admin-access-guard");

    // Each registered public/utility route returns a real application page, not a stale/404 destination.
    for (const route of ["/", "/catalog", "/builder", "/bouquet-builder", "/about", "/rewards", "/journal", "/favorites", "/cart", "/checkout", "/account/login", "/account/register"]) {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      assert(response?.ok(), `Route ${route} did not return a successful response.`);
      assert(
        (await page.getByRole("heading", { name: /page not found|not found/i }).count()) === 0,
        `Route ${route} resolved to a not-found page.`,
      );
    }
    results.push("public-route-matrix");

    assert(runtimeErrors.length === 0, `Browser console/runtime errors were captured: ${runtimeErrors.join(" | ")}`);
    assert(failedResources.length === 0, `Failed browser resources were captured: ${failedResources.join(" | ")}`);

    console.log(JSON.stringify({ status: "passed", results }, null, 2));
  } catch (error) {
    if (runtimeErrors.length) console.error("Captured browser runtime errors:\n" + runtimeErrors.join("\n"));
    if (failedResources.length) console.error("Captured failed resources:\n" + failedResources.join("\n"));
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
