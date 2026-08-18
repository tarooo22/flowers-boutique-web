import { chromium } from "playwright";
const base = "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
await page.goto(base + "/builder", { waitUntil: "networkidle" });
// switch to Georgian
await page.getByRole("button", { name: "Change language" }).click();
await page.getByRole("option", { name: /ქართული/ }).click();
await page.waitForTimeout(600);
const add = async (name, times) => {
  const btn = page.getByRole("button", { name: `+ ${name}` });
  for (let i = 0; i < times; i += 1) await btn.click();
};
await add("პიონი", 6);
await add("ლილია", 4);
await add("მოლუცელა", 3);
await page.waitForTimeout(800);
await page.locator("main").screenshot({ path: "qa/shots/final-builder-ka.png" });
console.log("builder KA captured");
await browser.close();
