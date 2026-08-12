import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const liveDomain = "https://flower-shop-jx9auvvz.manus.space";

describe("public SEO surface", () => {
  it("uses the active production domain for fallback canonicals and crawl discovery", async () => {
    const [seoHook, robots, sitemap] = await Promise.all([
      readFile(path.join(projectRoot, "client/src/hooks/useSEO.ts"), "utf8"),
      readFile(path.join(projectRoot, "client/public/robots.txt"), "utf8"),
      readFile(path.join(projectRoot, "client/public/sitemap.xml"), "utf8"),
    ]);

    expect(seoHook).toContain(liveDomain);
    expect(seoHook).toContain('setMeta("og:site_name", "Flower’s Boutique & Events", "property")');
    expect(seoHook).toContain('setMeta("twitter:card", "summary_large_image")');
    expect(robots).toContain(`Sitemap: ${liveDomain}/sitemap.xml`);
    expect(sitemap).toContain(liveDomain);
    expect(`${robots}\n${sitemap}\n${seoHook}`).not.toContain("flowers-boutique.example");
  });

  it("does not advertise an unverifiable sample product page in the static sitemap", async () => {
    const sitemap = await readFile(
      path.join(projectRoot, "client/public/sitemap.xml"),
      "utf8",
    );

    expect(sitemap).not.toContain("/product/1");
  });
});
