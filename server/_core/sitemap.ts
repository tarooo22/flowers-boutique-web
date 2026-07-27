import { getDb } from '../db';
import { products } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function generateSitemap(baseUrl: string): Promise<string> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available for sitemap generation');
  }

  // Get all published products from database
  const publishedProducts = await db
    .select()
    .from(products)
    .where(eq(products.published, true))

  // Build sitemap XML
  const urls: string[] = [];

  // Main pages
  const mainPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/catalog', priority: '0.9', changefreq: 'daily' },
    { loc: '/bouquet-builder', priority: '0.9', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
  ];

  // SEO landing pages
  const seoPages = [
    { loc: '/flower-delivery-tbilisi', priority: '0.85', changefreq: 'weekly' },
    { loc: '/flower-shop-tbilisi', priority: '0.85', changefreq: 'weekly' },
    { loc: '/rose-bouquets', priority: '0.80', changefreq: 'weekly' },
    { loc: '/lily-bouquets', priority: '0.80', changefreq: 'weekly' },
    { loc: '/spray-roses', priority: '0.80', changefreq: 'weekly' },
    { loc: '/birthday-flowers', priority: '0.80', changefreq: 'weekly' },
  ];

  // Add main pages (no hreflang since Georgian and English URLs are identical)
  for (const page of mainPages) {
    urls.push(`  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Add SEO pages (no hreflang since Georgian and English URLs are identical)
  for (const page of seoPages) {
    urls.push(`  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Add product pages (only published products)
  for (const product of publishedProducts) {
    const productUrl = `${baseUrl}/product/${product.id}`;
    urls.push(`  <url>
    <loc>${productUrl}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  // Build complete sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

${urls.join('\n')}

</urlset>`;

  return sitemap;
}
