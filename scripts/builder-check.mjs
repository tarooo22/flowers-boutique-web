import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

await page.goto(base + "/builder", { waitUntil: "networkidle" });

// compose: 7 roses, 5 peonies, 3 eustoma
const add = async (name, times) => {
  const btn = page.getByRole("button", { name: `+ ${name}` });
  for (let i = 0; i < times; i += 1) await btn.click();
};
await add("Red rose", 7);
await add("Peony", 5);
await add("Eustoma", 3);
await page.waitForTimeout(700);

const stems = await page.locator("[data-stem-count]").getAttribute("data-stem-count");
console.log("stem count on canvas:", stems);

const total = await page.locator("dl").last().innerText();
console.log("summary:\n" + total);

await page.locator("main").screenshot({ path: "qa/shots/builder-composed.png" });

// switch wrapper + ribbon
await page.getByRole("button", { name: "Burgundy" }).first().click();
await page.waitForTimeout(500);
await page.locator("main").screenshot({ path: "qa/shots/builder-burgundy.png" });

// ribbon-only mode
await page.getByRole("button", { name: "Ribbon only" }).click();
await page.waitForTimeout(600);
await page.locator("main").screenshot({ path: "qa/shots/builder-ribbononly.png" });

// add to cart
await page.getByRole("button", { name: "With paper" }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: /Add bouquet to cart/ }).click();
await page.waitForTimeout(800);
const drawer = page.getByRole("dialog", { name: "Shopping cart" });
console.log("cart drawer visible:", await drawer.isVisible());
console.log("drawer text:", (await drawer.innerText()).replace(/\s+/g, " ").slice(0, 200));

await browser.close();
