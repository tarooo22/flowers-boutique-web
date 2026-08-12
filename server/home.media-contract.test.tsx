// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { editorialImageSources, resolveEditorialImageSource } from "../client/src/lib/editorialMedia";
import EditorialImage from "../client/src/components/EditorialImage";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

const readProjectFile = (relativePath: string) =>
  readFile(path.join(projectRoot, relativePath), "utf8");

describe("homepage editorial media contract", () => {
  it("keeps editorial sources primary and resolves fallback only after failure", () => {
    expect(resolveEditorialImageSource("builder", [], false)).toBe(
      editorialImageSources.builder
    );
    expect(
      resolveEditorialImageSource("brand", ["/manus-storage/brand.webp"], false)
    ).toBe(editorialImageSources.brand);
    expect(resolveEditorialImageSource("builder", [], true)).toBeNull();
    expect(
      resolveEditorialImageSource("builder", ["/manus-storage/bouquet.webp"], true)
    ).toBe("/manus-storage/bouquet.webp");
  });

  it("renders the editorial source first and switches after an actual image error", () => {
    const fallback = "/manus-storage/bouquet.webp";
    const { rerender } = render(
      <EditorialImage
        slot="builder"
        fallbackImages={[]}
        alt="Builder editorial"
        width={1000}
        height={1000}
      />
    );

    const image = screen.getByAltText("Builder editorial");
    expect(image.getAttribute("src")).toBe(editorialImageSources.builder);
    expect(image.getAttribute("src")).not.toBe(fallback);

    fireEvent.error(image);
    expect(image.style.visibility).toBe("hidden");
    expect(image.getAttribute("src")).toBe(editorialImageSources.builder);

    rerender(
      <EditorialImage
        slot="builder"
        fallbackImages={[fallback]}
        alt="Builder editorial"
        width={1000}
        height={1000}
      />
    );

    expect(image.getAttribute("src")).toBe(fallback);
    expect(image.style.visibility).toBe("visible");
  });

  it("keeps Home wired to the tested editorial component and persistent image data", async () => {
    const [home, media] = await Promise.all([
      readProjectFile("client/src/pages/Home.tsx"),
      readProjectFile("client/src/lib/editorialMedia.ts"),
    ]);

    expect(media).toContain('"/flower-assets/editorial/pink-roses.webp"');
    expect(media).toContain('"/flower-assets/editorial/mixed-bouquet.webp"');
    expect(home).toContain("import EditorialImage from \"@/components/EditorialImage\";");
    expect(home).toContain("const persistentEditorialImages = useMemo(");
    expect(home).toContain('slot="builder"');
    expect(home).toContain('slot="brand"');
  });
});
