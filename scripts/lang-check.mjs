import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const snap = async (label) => {
  const h1 = (await page.locator("h1").first().innerText()).replace(/\s+/g, " ").trim();
  const nav = await page.locator("header nav a").allInnerTexts();
  const btn = (await page.locator('a[href="/catalog"]').first().innerText()).trim();
  console.log(`\n[${label}]`);
  console.log("  h1 :", h1);
  console.log("  nav:", nav.join(" | "));
  console.log("  cta:", btn);
  return h1;
};

await page.goto(base, { waitUntil: "networkidle" });
const en = await snap("EN (default)");

// switch to Georgian through the real UI
await page.getByRole("button", { name: "Change language" }).click();
await page.getByRole("option", { name: /ქართული/ }).click();
await page.waitForTimeout(400);
const ka = await snap("KA (after clicking ქართული)");

// switch to Russian
await page.getByRole("button", { name: "Change language" }).click();
await page.getByRole("option", { name: /Русский/ }).click();
await page.waitForTimeout(400);
const ru = await snap("RU (after clicking Русский)");

// persistence across reload
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(400);
const ruReload = await snap("RU (after reload — persistence)");

await page.screenshot({ path: "qa/shots/lang-ru.png" });

// back to Georgian for a screenshot
await page.getByRole("button", { name: "Change language" }).click();
await page.getByRole("option", { name: /ქართული/ }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: "qa/shots/lang-ka.png" });

const distinct = new Set([en, ka, ru]).size === 3;
const persists = ru === ruReload;
console.log(`\nthree distinct languages : ${distinct ? "PASS" : "FAIL"}`);
console.log(`language persists reload : ${persists ? "PASS" : "FAIL"}`);

await browser.close();
process.exit(distinct && persists ? 0 : 1);
