import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const archiveFile = process.env.CATALOG_SOURCE_ARCHIVE;
const manifestFile = process.env.CATALOG_MEDIA_MANIFEST;
const destinationDirectory =
  process.env.CATALOG_MEDIA_DESTINATION ??
  "/home/ubuntu/webdev-static-assets/flowers-boutique-catalog/products";

if (!archiveFile || !manifestFile) {
  throw new Error(
    "CATALOG_SOURCE_ARCHIVE and CATALOG_MEDIA_MANIFEST must both be set."
  );
}

const [{ stdout: archiveListing }, manifestText] = await Promise.all([
  execFileAsync("unzip", ["-Z1", archiveFile], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  }),
  readFile(manifestFile, "utf8"),
]);

const archivePathByNormalizedPath = new Map(
  archiveListing
    .split(/\r?\n/)
    .filter(Boolean)
    .map(rawPath => [rawPath.replace(/\\/g, "/"), rawPath])
);
const manifest = JSON.parse(manifestText);
const matchedEntries = manifest.entries.filter(
  entry => entry.status === "matched" && entry.archivePath
);

await mkdir(destinationDirectory, { recursive: true });
const extracted = [];

for (const entry of matchedEntries) {
  const rawArchivePath = archivePathByNormalizedPath.get(entry.archivePath);
  if (!rawArchivePath) {
    throw new Error(`Archive path vanished from source archive: ${entry.archivePath}`);
  }

  // The supplied archive stores Windows separators. Info-ZIP interprets a
  // single backslash as an escape in a member selector, so every separator
  // must be escaped once more for the `unzip -p` invocation.
  const unzipMemberPath = rawArchivePath.replace(/\\/g, "\\\\");

  const { stdout: bytes } = await execFileAsync(
    "unzip",
    ["-p", archiveFile, unzipMemberPath],
    {
      encoding: "buffer",
      maxBuffer: 20 * 1024 * 1024,
    }
  );
  if (!Buffer.isBuffer(bytes) || bytes.length === 0) {
    throw new Error(`Image extraction produced no bytes: ${entry.archivePath}`);
  }

  const destinationFile = path.join(destinationDirectory, entry.sourceFilename);
  await writeFile(destinationFile, bytes);
  extracted.push({
    productId: entry.productId,
    sourceFilename: entry.sourceFilename,
    file: destinationFile,
    bytes: bytes.length,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  archiveFile,
  destinationDirectory,
  extractedCount: extracted.length,
  totalBytes: extracted.reduce((total, item) => total + item.bytes, 0),
  extracted,
};
await writeFile(
  path.join(destinationDirectory, "extraction-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8"
);

console.log(
  JSON.stringify({
    extractedCount: report.extractedCount,
    totalBytes: report.totalBytes,
    destinationDirectory,
  })
);
