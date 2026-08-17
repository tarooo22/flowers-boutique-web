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

  it("keeps Home media sourced from Flower’s Boutique assets in the new reference-first composition", async () => {
    const home = await readProjectFile("client/src/pages/Home.tsx");

    expect(home).toContain('"/manus-storage/flowers-boutique-hero-rose-peony_f8130032.jpg"');
    expect(home).toContain('"/manus-storage/flowers-boutique-experience-event-styling_07114441.jpg"');
    expect(home).toContain('"/manus-storage/flowers-boutique-experience-floristry-class_0d9c281c.jpg"');
    expect(home).toContain('className="am-home-hero zip-home-hero"');
    expect(home).toContain('className="am-promo-banner am-reveal"');
    expect(home).toContain('className="am-services am-reveal"');
    expect(home).toContain('className="am-journal am-reveal"');
  });
});
