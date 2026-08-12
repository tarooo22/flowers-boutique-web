import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("mobile fixed action surfaces", () => {
  it("reserves safe lower-viewport clearance for platform fixed chrome", async () => {
    const css = await readFile(
      path.join(process.cwd(), "client/src/index.css"),
      "utf8",
    );

    expect(css).toContain(
      ".fb-product-sticky {\n    position: fixed;\n    z-index: 60;\n    left: 0;\n    right: 0;\n    bottom: max(52px, env(safe-area-inset-bottom));",
    );
    expect(css).toContain(
      ".p1-bottom-nav {\n    position: fixed;\n    z-index: 68;\n    right: 0;\n    bottom: max(52px, env(safe-area-inset-bottom));",
    );
    expect(css).toContain("padding: 20px 0 148px;");
  });
});
