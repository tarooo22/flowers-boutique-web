import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "client", "public");
const heroSource = path.join(
  publicDir,
  "flower-assets",
  "editorial",
  "new-collection.webp"
);
const heroDir = path.join(publicDir, "flower-assets", "hero");
const brandSource = path.join(publicDir, "brand", "flowers-boutique-logo.png");
const artifactsDir = path.join(root, "artifacts", "phase-1");

await fs.mkdir(heroDir, { recursive: true });
await fs.mkdir(artifactsDir, { recursive: true });

const heroTargets = [
  ["light-studio-desktop.webp", 1280, 960, "webp"],
  ["light-studio-desktop.avif", 1280, 960, "avif"],
  ["light-studio-mobile.webp", 800, 1000, "webp"],
  ["light-studio-mobile.avif", 800, 1000, "avif"],
];

for (const [name, width, height, format] of heroTargets) {
  let image = sharp(heroSource)
    .rotate()
    .resize({
      width,
      height,
      fit: "cover",
      position: "centre",
      withoutEnlargement: false,
    });
  image =
    format === "avif"
      ? image.avif({ quality: 62, effort: 5 })
      : image.webp({ quality: 82, effort: 5 });
  await image.toFile(path.join(heroDir, name));
}

await sharp(brandSource)
  .rotate()
  .resize({ width: 192, height: 192, fit: "cover" })
  .webp({ quality: 86, effort: 5 })
  .toFile(path.join(publicDir, "brand", "flowers-boutique-logo-192.webp"));

const contactSheetSources = [
  ["editorial/new-collection.webp", "new-collection"],
  ["editorial/pink-roses.webp", "pink-roses"],
  ["editorial/mixed-bouquet.webp", "mixed-bouquet"],
  ["products/7692.webp", "product-7692"],
  ["products/8319.webp", "product-8319"],
  ["products/8340.webp", "product-8340"],
  ["products/8344.webp", "product-8344"],
  ["products/8346.webp", "product-8346"],
];

const tileWidth = 340;
const tileHeight = 430;
const photoHeight = 382;
const gap = 12;
const columns = 4;
const tiles = [];

for (let index = 0; index < contactSheetSources.length; index += 1) {
  const [relativePath, label] = contactSheetSources[index];
  const photo = await sharp(path.join(publicDir, "flower-assets", relativePath))
    .rotate()
    .resize({
      width: tileWidth,
      height: photoHeight,
      fit: "cover",
      position: "attention",
    })
    .jpeg({ quality: 82 })
    .toBuffer();
  const labelSvg = Buffer.from(
    `<svg width="${tileWidth}" height="48" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffffff"/><text x="16" y="30" font-family="Arial, sans-serif" font-size="16" fill="#282828">${label}</text></svg>`
  );
  const tile = await sharp({
    create: {
      width: tileWidth,
      height: tileHeight,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite([
      { input: photo, top: 0, left: 0 },
      { input: labelSvg, top: photoHeight, left: 0 },
    ])
    .jpeg({ quality: 86 })
    .toBuffer();
  tiles.push({
    input: tile,
    left: (index % columns) * (tileWidth + gap),
    top: Math.floor(index / columns) * (tileHeight + gap),
  });
}

await sharp({
  create: {
    width: columns * tileWidth + (columns - 1) * gap,
    height: 2 * tileHeight + gap,
    channels: 3,
    background: "#f5f2ee",
  },
})
  .composite(tiles)
  .jpeg({ quality: 88 })
  .toFile(path.join(artifactsDir, "flower-assets-contact-sheet.jpg"));

const metadata = {};
for (const file of [
  heroSource,
  ...heroTargets.map(([name]) => path.join(heroDir, name)),
  brandSource,
  path.join(publicDir, "brand", "flowers-boutique-logo-192.webp"),
]) {
  const stat = await fs.stat(file);
  const image = await sharp(file).metadata();
  metadata[path.relative(root, file).replaceAll("\\", "/")] = {
    width: image.width,
    height: image.height,
    format: image.format,
    bytes: stat.size,
  };
}
await fs.writeFile(
  path.join(artifactsDir, "storefront-image-sizes.json"),
  JSON.stringify(metadata, null, 2)
);
