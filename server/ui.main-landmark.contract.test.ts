import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const publicFlowPages = [
  "About.tsx",
  "Delivery.tsx",
  "Returns.tsx",
  "Checkout.tsx",
  "PaymentSuccess.tsx",
  "Contact.tsx",
  "AIBouquetBuilder.tsx",
];

describe("public page main landmarks", () => {
  it("keeps the shared skip-link target on key public information and transactional flows", async () => {
    const contents = await Promise.all(
      publicFlowPages.map((file) =>
        readFile(path.join(projectRoot, "client/src/pages", file), "utf8"),
      ),
    );

    for (const [index, source] of contents.entries()) {
      expect(source, publicFlowPages[index]).toContain('<main id="main-content"');
    }
  });
});
