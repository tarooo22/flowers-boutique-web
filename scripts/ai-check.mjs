import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1050 } });
await page.goto(base + "/builder", { waitUntil: "networkidle" });
await page.getByRole("tab", { name: "AI bouquet" }).click();
await page.waitForTimeout(400);

const add = async (name, times) => {
  const btn = page.getByRole("button", { name: `+ ${name}` });
  for (let i = 0; i < times; i += 1) await btn.click();
};
await add("Peony", 5);
await add("Eustoma", 4);
await page.fill("#ai-note", "wrapped in cream paper, soft morning light");
await page.waitForTimeout(400);
await page.locator("main").screenshot({ path: "qa/shots/ai-selection.png" });

await page.getByRole("button", { name: /Generate this bouquet/ }).click();
await page.waitForTimeout(3000);
await page.locator("main").screenshot({ path: "qa/shots/ai-result.png" });

const txt = (await page.locator("main").innerText()).replace(/\s+/g, " ");
console.log(txt.slice(0, 260));
console.log("order button present:", await page.getByRole("button", { name: /Order this bouquet/ }).isVisible());
await browser.close();
