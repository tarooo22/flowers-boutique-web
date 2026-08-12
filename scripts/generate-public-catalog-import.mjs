import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];
    if (character === '"') {
      if (quoted && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (!quoted && character === ",") {
      row.push(value);
      value = "";
    } else if (!quoted && (character === "\n" || character === "\r")) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value);
      if (row.some(cell => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
    } else value += character;
  }
  row.push(value);
  if (row.some(cell => cell.trim() !== "")) rows.push(row);

  const [headers, ...records] = rows;
  return records.map(record =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""]))
  );
}

function sqlString(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  return `'${String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")}'`;
}

function sqlDecimal(value) {
  return value === null || value === undefined || value === "" ? "NULL" : String(Number(value));
}

function sqlBoolean(value) {
  return String(value) === "1" || String(value).toLowerCase() === "true" ? "1" : "0";
}

const projectRoot = process.cwd();
const storageMapFile = process.env.CATALOG_STORAGE_MAP;
const outputDirectory = process.env.CATALOG_IMPORT_OUTPUT_DIR ?? "/home/ubuntu/catalog-work";
if (!storageMapFile) throw new Error("CATALOG_STORAGE_MAP must be set.");

const [categoriesText, productsText, storageMapText] = await Promise.all([
  readFile(
    path.join(projectRoot, "manus-data/public-catalog/categories_20260726_144213.csv"),
    "utf8"
  ),
  readFile(
    path.join(projectRoot, "manus-data/public-catalog/products_20260726_144315.csv"),
    "utf8"
  ),
  readFile(storageMapFile, "utf8"),
]);

const categories = parseCsv(categoriesText);
const products = parseCsv(productsText);
const storageMap = JSON.parse(storageMapText);
const storageUrlByProductId = new Map(
  storageMap.entries.map(entry => [Number(entry.productId), entry.persistentImageUrl])
);

if (products.length !== storageMap.summary.products) {
  throw new Error("Storage map and source products do not contain the same number of rows.");
}

const categoryStatements = categories.map(category => `
INSERT INTO categories (id, nameKa, nameEn, descriptionKa, descriptionEn, slug, createdAt, updatedAt)
VALUES (${Number(category.id)}, ${sqlString(category.nameKa)}, ${sqlString(category.nameEn)}, ${sqlString(category.descriptionKa)}, ${sqlString(category.descriptionEn)}, ${sqlString(category.slug)}, ${sqlString(category.createdAt)}, ${sqlString(category.updatedAt)})
ON DUPLICATE KEY UPDATE
  nameKa = VALUES(nameKa), nameEn = VALUES(nameEn), descriptionKa = VALUES(descriptionKa), descriptionEn = VALUES(descriptionEn), slug = VALUES(slug), updatedAt = VALUES(updatedAt);`);

const productStatements = products.map(product => {
  const persistentImageUrl = storageUrlByProductId.get(Number(product.id)) ?? null;
  const imageKey = persistentImageUrl?.replace(/^\//, "") ?? null;
  return `
INSERT INTO products (id, nameKa, nameEn, descriptionKa, descriptionEn, priceMin, priceMax, priceOnRequest, unitType, categoryId, imageUrl, imageKey, isRose, isAvailable, published, featured, variants, bloomsPerStemMin, bloomsPerStemMax, stemDisplayRule, createdAt, updatedAt)
VALUES (${Number(product.id)}, ${sqlString(product.nameKa)}, ${sqlString(product.nameEn)}, ${sqlString(product.descriptionKa)}, ${sqlString(product.descriptionEn)}, ${sqlDecimal(product.priceMin)}, ${sqlDecimal(product.priceMax)}, ${sqlBoolean(product.priceOnRequest)}, ${sqlString(product.unitType)}, ${Number(product.categoryId)}, ${sqlString(persistentImageUrl)}, ${sqlString(imageKey)}, ${sqlBoolean(product.isRose)}, ${sqlBoolean(product.isAvailable)}, ${sqlBoolean(product.published)}, ${sqlBoolean(product.featured)}, ${sqlString(product.variants || "[]")}, ${sqlDecimal(product.bloomsPerStemMin)}, ${sqlDecimal(product.bloomsPerStemMax)}, ${sqlString(product.stemDisplayRule)}, ${sqlString(product.createdAt)}, ${sqlString(product.updatedAt)})
ON DUPLICATE KEY UPDATE
  nameKa = VALUES(nameKa), nameEn = VALUES(nameEn), descriptionKa = VALUES(descriptionKa), descriptionEn = VALUES(descriptionEn), priceMin = VALUES(priceMin), priceMax = VALUES(priceMax), priceOnRequest = VALUES(priceOnRequest), unitType = VALUES(unitType), categoryId = VALUES(categoryId), imageUrl = VALUES(imageUrl), imageKey = VALUES(imageKey), isRose = VALUES(isRose), isAvailable = VALUES(isAvailable), published = VALUES(published), featured = VALUES(featured), variants = VALUES(variants), bloomsPerStemMin = VALUES(bloomsPerStemMin), bloomsPerStemMax = VALUES(bloomsPerStemMax), stemDisplayRule = VALUES(stemDisplayRule), updatedAt = VALUES(updatedAt);`;
});

const legacySampleIds = [1, 2, 3, 4, 5];
const sql = `-- Generated from user-supplied public catalog exports.\n-- This script is idempotent and does not delete customer, order, or account data.\nSTART TRANSACTION;\n${categoryStatements.join("\n")}\n${productStatements.join("\n")}\n-- Hide the prior migration's five sample products rather than deleting them.\nUPDATE products SET published = 0 WHERE id IN (${legacySampleIds.join(", ")});\nCOMMIT;\n`;
const report = {
  generatedAt: new Date().toISOString(),
  source: {
    categories: "manus-data/public-catalog/categories_20260726_144213.csv",
    products: "manus-data/public-catalog/products_20260726_144315.csv",
    storageMapFile,
  },
  operation: "idempotent category/product upsert plus non-destructive sample-product unpublish",
  categories: categories.length,
  products: products.length,
  productsWithPersistentImage: [...storageUrlByProductId.values()].filter(Boolean).length,
  productsWithoutOriginalImage: products.filter(
    product => !storageUrlByProductId.get(Number(product.id))
  ).map(product => Number(product.id)),
  legacySampleProductsUnpublished: legacySampleIds,
};

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDirectory, "import-public-catalog.sql"), sql, "utf8"),
  writeFile(
    path.join(outputDirectory, "import-public-catalog-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8"
  ),
]);

console.log(JSON.stringify(report));
