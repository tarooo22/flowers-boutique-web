import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "https://3000-i2pfjamc2e6vvxjvr0sej-59b127c0.us3.manus.computer";
const routes = ["/", "/catalog", "/builder", "/cart", "/checkout", "/account", "/about", "/admin"];
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 1 });
let hasPageOverflow = false;

for (const route of routes) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  const audit = await page.evaluate(() => {
    const viewport = window.innerWidth;
    const offenders = Array.from(document.querySelectorAll("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === "string" ? element.className.slice(0, 180) : "",
          text: (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 90),
          left: Math.round(rect.left * 10) / 10,
          right: Math.round(rect.right * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
          scrollWidth: element.scrollWidth,
        };
      })
      .filter((item) => item.width > 0 && (item.right > viewport + 1 || item.left < -1 || item.scrollWidth > viewport + 1))
      .slice(0, 12);

    return {
      viewport,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      offenders,
    };
  });
  if (audit.documentWidth > audit.viewport || audit.bodyWidth > audit.viewport) hasPageOverflow = true;
  console.log(JSON.stringify({ route, ...audit }));
}

await browser.close();
if (hasPageOverflow) process.exitCode = 1;
