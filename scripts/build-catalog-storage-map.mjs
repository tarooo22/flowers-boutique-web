import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const manifestFile = process.env.CATALOG_MEDIA_MANIFEST;
const uploadOutputFile = process.env.CATALOG_MEDIA_UPLOAD_OUTPUT;
const outputDirectory =
  process.env.CATALOG_MEDIA_OUTPUT_DIR ??
  "/home/ubuntu/webdev-static-assets/flowers-boutique-catalog";

if (!manifestFile || !uploadOutputFile) {
  throw new Error(
    "CATALOG_MEDIA_MANIFEST and CATALOG_MEDIA_UPLOAD_OUTPUT must both be set."
  );
}

const [manifestText, uploadOutput] = await Promise.all([
  readFile(manifestFile, "utf8"),
  readFile(uploadOutputFile, "utf8"),
]);
const manifest = JSON.parse(manifestText);
const storagePathByFilename = new Map();
const uploadMatches = uploadOutput.matchAll(
  /Uploading file \(webdev private\): .*\/([^/\n]+) \(size: \d+ bytes\)\nFile uploaded successfully!\nStorage Path: (\/manus-storage\/[^\n]+)/g
);

for (const match of uploadMatches) {
  const [, filename, storagePath] = match;
  if (storagePathByFilename.has(filename)) {
    throw new Error(`Duplicate upload entry for ${filename}.`);
  }
  storagePathByFilename.set(filename, storagePath);
}

const entries = manifest.entries.map(entry => {
  if (entry.status !== "matched") {
    return { ...entry, persistentImageUrl: null, uploadStatus: "not_uploaded_unmatched" };
  }

  const persistentImageUrl = storagePathByFilename.get(entry.sourceFilename) ?? null;
  return {
    ...entry,
    persistentImageUrl,
    uploadStatus: persistentImageUrl ? "uploaded" : "missing_upload_output",
  };
});

const missingUploadOutput = entries.filter(
  entry => entry.status === "matched" && entry.uploadStatus !== "uploaded"
);
if (missingUploadOutput.length > 0) {
  throw new Error(
    `The upload output omitted ${missingUploadOutput.length} matched image(s): ${missingUploadOutput
      .map(entry => entry.sourceFilename)
      .join(", ")}`
  );
}

const report = {
  generatedAt: new Date().toISOString(),
  source: { manifestFile, uploadOutputFile },
  summary: {
    products: entries.length,
    uploaded: entries.filter(entry => entry.uploadStatus === "uploaded").length,
    intentionallyImageUnavailable: entries.filter(
      entry => entry.uploadStatus === "not_uploaded_unmatched"
    ).length,
  },
  entries,
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "catalog-product-storage-map.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8"
);

console.log(JSON.stringify(report.summary));
