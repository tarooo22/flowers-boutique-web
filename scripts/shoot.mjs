import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

// usage: node shoot.mjs <url> <label> <outdir> [widths] [fullpage=1] [waitMs]
const [, , url, label, outDir, widthsArg = "375,768,1280,1440", fullArg = "1", waitArg = "1500"] =
  process.argv;
const widths = widthsArg.split(",").map(Number);
const fullPage = fullArg === "1";
const waitMs = Number(waitArg);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
for (const w of widths) {
  const page = await browser.newPage({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  // trigger lazy content + settle
  // Scroll through at a human-ish pace so IntersectionObserver reveals fire.
  await page.evaluate(async () => {
    await new Promise((r) => {
      const step = Math.round(window.innerHeight * 0.6);
      const t = setInterval(() => {
        window.scrollBy(0, step);
        if (
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
        ) {
          clearInterval(t);
          r();
        }
      }, 180);
    });
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(waitMs);
  const file = join(outDir, `${label}-${w}.png`);
  await page.screenshot({ path: file, fullPage });
  console.log("saved", file);
  await page.close();
}
await browser.close();
