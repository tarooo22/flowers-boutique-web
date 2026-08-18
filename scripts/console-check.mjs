import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const paths = process.argv[3]?.split(",") ?? ["/", "/catalog", "/product/rosewood-romance"];

const browser = await chromium.launch();
let bad = 0;

for (const p of paths) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const msgs = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") msgs.push(`[${m.type()}] ${m.text()}`);
  });
  page.on("pageerror", (e) => msgs.push(`[pageerror] ${e.message}`));

  await page.goto(base + p, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(1200);

  // ignore noisy dev-only sourcemap/devtools chatter
  const real = msgs.filter(
    (m) => !/sourcemap|Download the React DevTools|Fast Refresh/i.test(m),
  );
  console.log(`\n${p} → ${real.length ? real.length + " message(s)" : "clean"}`);
  real.forEach((m) => console.log("   " + m.split("\n")[0].slice(0, 160)));
  bad += real.length;
  await page.close();
}

await browser.close();
console.log(`\n${bad === 0 ? "PASS — no console errors/warnings" : `FAIL — ${bad} message(s)`}`);
process.exit(bad === 0 ? 0 : 1);
