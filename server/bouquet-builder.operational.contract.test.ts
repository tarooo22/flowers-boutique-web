import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

describe("bouquet builder operational surface", () => {
  it("keeps page SEO, a visible H1, a Footer, and the shared main target", async () => {
    const source = await readFile(
      path.join(projectRoot, "client/src/pages/AIBouquetBuilder.tsx"),
      "utf8",
    );

    expect(source).toContain('canonical: "/bouquet-builder"');
    expect(source).toContain("Build your bouquet");
    expect(source).toContain('<main id="main-content"');
    expect(source).toContain("<Footer />");
  });

  it("uses 44px quantity controls while blocking unavailable flower additions", async () => {
    const [visualCard, visualBuilder, aiMode, page, previewStage] = await Promise.all([
      readFile(
        path.join(
          projectRoot,
          "client/src/components/bouquet-builder/FlowerBuilderCard.tsx",
        ),
        "utf8",
      ),
      readFile(
        path.join(
          projectRoot,
          "client/src/components/bouquet-builder/VisualBouquetBuilder.tsx",
        ),
        "utf8",
      ),
      readFile(
        path.join(
          projectRoot,
          "client/src/components/bouquet-builder/AIBouquetMode.tsx",
        ),
        "utf8",
      ),
      readFile(
        path.join(projectRoot, "client/src/pages/AIBouquetBuilder.tsx"),
        "utf8",
      ),
      readFile(
        path.join(
          projectRoot,
          "client/src/components/bouquet-builder/AIFlowerPreviewStage.tsx",
        ),
        "utf8",
      ),
    ]);

    expect(visualCard.match(/h-11 w-11/g)?.length).toBeGreaterThanOrEqual(2);
    expect(visualCard).toContain('data-selected={quantity > 0 ? "true" : "false"}');
    expect(visualCard).toContain('role="group"');
    expect(visualCard).toContain('aria-live="polite"');
    expect(visualCard).toContain('aria-atomic="true"');
    expect(aiMode.match(/h-11 w-11/g)?.length).toBeGreaterThanOrEqual(2);
    expect(visualBuilder).toContain("const hasUnavailableSelection = selectedFlowers.some(");
    expect(visualBuilder).toContain("if (hasUnavailableSelection) {");
    expect(visualBuilder).toContain("product.isAvailable === false &&");
    expect(aiMode).toContain("const hasUnavailableSelection = selectedFlowers.some(");
    expect(aiMode).toContain("if (hasUnavailableSelection) {");
    expect(aiMode).toContain("if (product.isAvailable === false && delta > 0) return;");
    expect(page).toContain("builder-editorial-page");
    expect(page).toContain("builder-editorial-tabs");
    expect(visualCard).toContain("builder-flower-picker-card");
    expect(aiMode).toContain("builder-ai-selection-card");
    expect(previewStage).toContain("builder-ai-stage");
  });
});
