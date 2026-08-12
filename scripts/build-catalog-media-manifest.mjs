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
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (!quoted && character === ",") {
      row.push(value);
      value = "";
      continue;
    }

    if (!quoted && (character === "\n" || character === "\r")) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value);
      if (row.some(cell => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += character;
  }

  row.push(value);
  if (row.some(cell => cell.trim() !== "")) rows.push(row);

  const [headers, ...records] = rows;
  return records.map(record =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""]))
  );
}

function basename(filePath) {
  return filePath.replace(/\\/g, "/").split("/").pop() ?? "";
}

const projectRoot = process.cwd();
const archivePathsFile = process.env.ARCHIVE_PATHS_FILE;
const outputDirectory = process.env.MEDIA_MANIFEST_DIR ?? "/home/ubuntu/webdev-static-assets/flowers-boutique-catalog";
const productsFile = path.join(
  projectRoot,
  "manus-data/public-catalog/products_20260726_144315.csv"
);

if (!archivePathsFile) {
  throw new Error("ARCHIVE_PATHS_FILE must point to a newline-delimited ZIP file listing.");
}

const [productsText, archivePathsText] = await Promise.all([
  readFile(productsFile, "utf8"),
  readFile(archivePathsFile, "utf8"),
]);

const products = parseCsv(productsText);
const imagePaths = archivePathsText
  .split(/\r?\n/)
  .map(filePath => filePath.trim().replace(/\\/g, "/"))
  .filter(filePath => /\/uploaded-assets\/photos\/products\/.*\.(avif|jpe?g|png|webp)$/i.test(`/${filePath}`));

const archivePathByBasename = new Map();
for (const imagePath of imagePaths) {
  const name = basename(imagePath);
  const existing = archivePathByBasename.get(name);
  if (!existing) archivePathByBasename.set(name, imagePath);
  else if (existing !== imagePath) archivePathByBasename.set(name, null);
}

const entries = products.map(product => {
  const sourceFilename = basename(product.imageUrl);
  const archivePath = sourceFilename
    ? archivePathByBasename.get(sourceFilename) ?? null
    : null;
  return {
    productId: Number(product.id),
    slug: product.slug || null,
    nameKa: product.nameKa,
    sourceImageUrl: product.imageUrl || null,
    sourceFilename: sourceFilename || null,
    archivePath,
    status: !sourceFilename ? "no_image_reference" : archivePath ? "matched" : "unmatched",
  };
});

const matched = entries.filter(entry => entry.status === "matched");
const unmatched = entries.filter(entry => entry.status !== "matched");
const manifest = {
  generatedAt: new Date().toISOString(),
  source: {
    productsFile: path.relative(projectRoot, productsFile),
    archivePathsFile,
  },
  summary: {
    products: entries.length,
    matched: matched.length,
    unmatched: unmatched.length,
  },
  entries,
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "catalog-media-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8"
);
await writeFile(
  path.join(outputDirectory, "catalog-media-unmatched.json"),
  `${JSON.stringify(unmatched, null, 2)}\n`,
  "utf8"
);

console.log(JSON.stringify(manifest.summary));
