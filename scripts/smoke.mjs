import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const results = [];
const check = (name, cond) => {
  results.push({ name, ok: !!cond });
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
};

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // --- Add to cart + drawer (from the product page) ---
  await page.goto(base + "/product/rosewood-romance", { waitUntil: "networkidle" });
  // the main CTA carries the price; quick-add buttons on related cards do not
  await page.getByRole("button", { name: /^Add to cart · / }).click();
  const dialog = page.getByRole("dialog", { name: "Shopping cart" });
  await dialog.waitFor({ timeout: 5000 });
  check("add-to-cart opens the cart drawer", await dialog.isVisible());
  check(
    "cart drawer shows one item",
    (await dialog.getByRole("heading", { name: /Cart/ }).textContent())?.includes("(1)"),
  );

  // --- Persistence across reload ---
  await page.keyboard.press("Escape");
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Cart", exact: true }).click();
  await dialog.waitFor({ timeout: 5000 });
  check(
    "cart persists after reload (localStorage)",
    (await dialog.getByRole("heading", { name: /Cart/ }).textContent())?.includes("(1)"),
  );
  await page.keyboard.press("Escape");

  // --- Catalog filtering via URL ---
  await page.goto(base + "/catalog", { waitUntil: "networkidle" });
  const totalCount = await page.locator('a[href^="/product/"]').count();
  // sidebar filter rows read as "<Category> <count>"
  await page.getByRole("button", { name: /^Roses\b/ }).first().click();
  await page.waitForURL(/category=roses/, { timeout: 5000 });
  const rosesCount = await page.locator('a[href^="/product/"]').count();
  check("category filter updates the URL", page.url().includes("category=roses"));
  check("category filter narrows the grid", rosesCount > 0 && rosesCount < totalCount);

  // --- Search overlay ---
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Search" }).click();
  await page.locator('input[placeholder^="Search bouquets"]').fill("peony");
  await page.waitForTimeout(300);
  check("search returns live results", (await page.getByText("See all results").count()) > 0);
  await page.keyboard.press("Escape");

  // --- Mobile nav ---
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByText("Categories", { exact: true });
  await menu.waitFor({ timeout: 5000 });
  check("mobile menu opens", await menu.isVisible());

  await page.close();
} catch (err) {
  console.error("ERROR:", err.message);
  results.push({ name: "run", ok: false });
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
