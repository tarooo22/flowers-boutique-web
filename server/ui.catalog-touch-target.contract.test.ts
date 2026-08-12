import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("catalog touch targets", () => {
  it("keeps mobile-accessible 44px targets for filtering and product actions", async () => {
    const css = await readFile(
      path.join(process.cwd(), "client/src/index.css"),
      "utf8",
    );

    expect(css).toContain(".fb-filter-list button {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  min-height: 44px;");
    expect(css).toContain(".fb-price-fields input {\n  width: 100%;\n  height: 44px;");
    expect(css).toContain(".fb-sort-select select {\n  appearance: none;\n  border: 0;\n  background: transparent;\n  height: 44px;");
    expect(css).toContain(".fb-catalog-card__wish {\n  display: grid;\n  place-items: center;\n  flex: 0 0 auto;\n  width: 44px;\n  height: 44px;");
    expect(css).toContain(".fb-catalog-card__add {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  min-height: 44px;");
  });
});
