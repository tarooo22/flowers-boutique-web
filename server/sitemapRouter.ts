/**
 * sitemapRouter.ts
 * Serves /sitemap.xml with static routes + dynamic product URLs.
 * Regenerated on every request so new products appear immediately.
 */
import type { Express, Request, Response } from "express";
import { getProducts } from "./db";

const BASE_URL = "https://flowers-boutique.example";

const STATIC_ROUTES = [
  { loc: "/",                        changefreq: "weekly",  priority: "1.0" },
  { loc: "/catalog",                 changefreq: "daily",   priority: "0.9" },
  { loc: "/bouquet-builder",         changefreq: "weekly",  priority: "0.9" },
  { loc: "/about",                   changefreq: "monthly", priority: "0.8" },
  { loc: "/contact",                 changefreq: "monthly", priority: "0.8" },
  { loc: "/flower-delivery-tbilisi", changefreq: "weekly",  priority: "0.85" },
  { loc: "/flower-shop-tbilisi",     changefreq: "weekly",  priority: "0.85" },
  { loc: "/rose-bouquets",           changefreq: "weekly",  priority: "0.80" },
  { loc: "/lily-bouquets",           changefreq: "weekly",  priority: "0.80" },
  { loc: "/spray-roses",             changefreq: "weekly",  priority: "0.80" },
  { loc: "/birthday-flowers",        changefreq: "weekly",  priority: "0.80" },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function registerSitemapRoute(app: Express) {
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const products = await getProducts();
      const now = new Date().toISOString().split("T")[0];

      const staticEntries = STATIC_ROUTES.map(
        (r) => `  <url>
    <loc>${escapeXml(BASE_URL + r.loc)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
      ).join("\n");

      const productEntries = (products || [])
        .map(
          (p: any) => `  <url>
    <loc>${escapeXml(`${BASE_URL}/product/${p.id}`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
        )
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticEntries}
${productEntries}
</urlset>`;

      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (err) {
      console.error("[sitemap] Error generating sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });
}
