#!/usr/bin/env node
/**
 * seed-catalog.mjs
 * Idempotent seed script for Flower's Boutique public catalog
 * Imports categories, products, and images from CSV exports
 * Updates image URLs to use Manus storage paths
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseCSV } from 'csv-parse/sync';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load asset mappings
const assetMappingsPath = '/tmp/asset_mappings.json';
let assetMappings = {};
if (fs.existsSync(assetMappingsPath)) {
  assetMappings = JSON.parse(fs.readFileSync(assetMappingsPath, 'utf-8'));
  console.log(`Loaded ${Object.keys(assetMappings).length} asset mappings`);
}

// Helper to map old image paths to new Manus storage paths
function mapImagePath(oldPath) {
  if (!oldPath) return null;
  
  // Extract filename from path
  const filename = path.basename(oldPath);
  
  // Look up in mappings
  if (assetMappings[filename]) {
    return assetMappings[filename];
  }
  
  // If not found, return original (might be a banner or other asset)
  return oldPath;
}

// Load CSV files
const catalogDir = path.join(__dirname, 'manus-data/public-catalog');

function loadCSV(filename) {
  const files = fs.readdirSync(catalogDir).filter(f => f.startsWith(filename));
  if (files.length === 0) {
    console.warn(`No CSV file found for ${filename}`);
    return [];
  }
  
  const filepath = path.join(catalogDir, files[0]);
  const content = fs.readFileSync(filepath, 'utf-8');
  return parseCSV(content, { columns: true });
}

const categories = loadCSV('categories_');
const products = loadCSV('products_');
const productImages = loadCSV('productImages_');
const banners = loadCSV('banners_');
const seoKeywords = loadCSV('seoKeywords_');

console.log(`Loaded ${categories.length} categories`);
console.log(`Loaded ${products.length} products`);
console.log(`Loaded ${productImages.length} product images`);
console.log(`Loaded ${banners.length} banners`);
console.log(`Loaded ${seoKeywords.length} SEO keywords`);

// Transform data for database insertion
const transformedCategories = categories.map(row => ({
  id: parseInt(row.id),
  nameKa: row.nameKa,
  nameEn: row.nameEn,
  descriptionKa: row.descriptionKa || null,
  descriptionEn: row.descriptionEn || null,
  slug: row.slug,
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt),
}));

const transformedProducts = products.map(row => ({
  id: parseInt(row.id),
  nameKa: row.nameKa,
  nameEn: row.nameEn,
  descriptionKa: row.descriptionKa || null,
  descriptionEn: row.descriptionEn || null,
  categoryId: parseInt(row.categoryId),
  imageUrl: mapImagePath(row.imageUrl),
  imageKey: row.imageKey || null,
  isRose: row.isRose === '1' || row.isRose === 'true',
  isAvailable: row.isAvailable === '1' || row.isAvailable === 'true',
  published: row.published !== '0' && row.published !== 'false',
  featured: row.featured === '1' || row.featured === 'true',
  priceMin: row.priceMin ? parseFloat(row.priceMin) : null,
  priceMax: row.priceMax ? parseFloat(row.priceMax) : null,
  priceOnRequest: row.priceOnRequest === '1' || row.priceOnRequest === 'true',
  unitType: row.unitType || 'single stem',
  variants: row.variants ? JSON.parse(row.variants) : [],
  bloomsPerStemMin: row.bloomsPerStemMin ? parseInt(row.bloomsPerStemMin) : 1,
  bloomsPerStemMax: row.bloomsPerStemMax ? parseInt(row.bloomsPerStemMax) : 1,
  stemDisplayRule: row.stemDisplayRule || null,
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt),
}));

const transformedProductImages = productImages.map(row => ({
  id: parseInt(row.id),
  productId: parseInt(row.productId),
  imageUrl: mapImagePath(row.imageUrl),
  imageKey: row.imageKey || null,
  sortOrder: row.sortOrder ? parseInt(row.sortOrder) : 0,
  createdAt: new Date(row.createdAt),
}));

const transformedBanners = banners.map(row => ({
  id: parseInt(row.id),
  titleKa: row.titleKa || null,
  titleEn: row.titleEn || null,
  descriptionKa: row.descriptionKa || null,
  descriptionEn: row.descriptionEn || null,
  imageUrl: mapImagePath(row.imageUrl),
  imageKey: row.imageKey || null,
  ctaText: row.ctaText || null,
  ctaLink: row.ctaLink || null,
  sortOrder: row.sortOrder ? parseInt(row.sortOrder) : 0,
  isActive: row.isActive !== '0' && row.isActive !== 'false',
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt),
}));

const transformedSeoKeywords = seoKeywords.map(row => ({
  id: parseInt(row.id),
  keyword: row.keyword,
  targetUrl: row.targetUrl || null,
  isActive: row.isActive !== '0' && row.isActive !== 'false',
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt),
}));

// Write seed data to JSON files for inspection
fs.writeFileSync(
  path.join(__dirname, '/tmp/seed-categories.json'),
  JSON.stringify(transformedCategories, null, 2)
);
fs.writeFileSync(
  path.join(__dirname, '/tmp/seed-products.json'),
  JSON.stringify(transformedProducts.slice(0, 3), null, 2)
);

console.log('\n✓ Seed data prepared');
console.log(`  - ${transformedCategories.length} categories`);
console.log(`  - ${transformedProducts.length} products`);
console.log(`  - ${transformedProductImages.length} product images`);
console.log(`  - ${transformedBanners.length} banners`);
console.log(`  - ${transformedSeoKeywords.length} SEO keywords`);

// Export for database insertion
export { transformedCategories, transformedProducts, transformedProductImages, transformedBanners, transformedSeoKeywords };
