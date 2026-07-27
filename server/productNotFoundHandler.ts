import { Request, Response } from "express";
import { getDb } from "./db";
import { products } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Server-side handler for product routes that returns HTTP 404 for nonexistent products
 * This must run BEFORE the SPA fallback to properly set the HTTP status code
 */
export async function handleProductRoute(req: Request, res: Response, next: Function) {
  const productIdStr = req.params.id;
  
  // Only handle /product/:id routes
  if (!req.path.startsWith("/product/") || !productIdStr) {
    return next();
  }

  const productId = parseInt(productIdStr, 10);
  
  // Invalid product ID format
  if (isNaN(productId) || productId <= 0) {
    res.status(404);
    res.set("Content-Type", "text/html; charset=utf-8");
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="robots" content="noindex, follow">
          <title>პროდუქტი ვერ მოიძებნა</title>
        </head>
        <body>
          <h1>404 - პროდუქტი ვერ მოიძებნა</h1>
        </body>
      </html>
    `);
  }

  try {
    // Check if product exists and is published
    const dbInstance = await getDb();
    if (!dbInstance) {
      // Database not available, allow SPA to handle
      return next();
    }
    const product = await dbInstance
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    // Product not found or not published
    if (!product || product.length === 0 || !product[0].published) {
      res.status(404);
      res.set("Content-Type", "text/html; charset=utf-8");
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="robots" content="noindex, follow">
            <title>პროდუქტი ვერ მოიძებნა</title>
          </head>
          <body>
            <h1>404 - პროდუქტი ვერ მოიძებნა</h1>
            <p>მითითებული პროდუქტი არ არსებობს ან აღარ არის ხელმისაწვდომი.</p>
          </body>
        </html>
      `);
    }

    // Product exists and is published - allow SPA to handle it
    next();
  } catch (error) {
    console.error("[Product 404 Handler] Error checking product:", error);
    // On error, allow SPA to handle it (fail open)
    next();
  }
}
