import { chromium } from "playwright";
const base = "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

// redirected to login when signed out
await page.goto(base + "/admin", { waitUntil: "networkidle" });
console.log("unauthenticated →", page.url().replace(base, ""));
await page.screenshot({ path: "qa/shots/admin-login.png" });

await page.fill('input[type="password"]', "flowers-admin");
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL("**/admin", { timeout: 10000 });
await page.waitForTimeout(1200);
console.log("after login →", page.url().replace(base, ""));
await page.screenshot({ path: "qa/shots/admin-overview.png" });

await page.getByRole("tab", { name: /Orders/ }).click();
await page.waitForTimeout(600);
await page.locator("text=FB-").first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: "qa/shots/admin-orders.png", fullPage: true });

await page.getByRole("tab", { name: "Products" }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: "qa/shots/admin-products.png" });
console.log("captured");
await browser.close();
