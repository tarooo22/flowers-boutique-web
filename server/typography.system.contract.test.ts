import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const source = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("site typography system", () => {
  it("centralizes the legal UI and display font architecture", async () => {
    const [indexCss, waveCss, amelieCss, html] = await Promise.all([
      source("client/src/index.css"),
      source("client/src/styles/wave1-reference.css"),
      source("client/src/styles/amelie-rebuild.css"),
      source("client/index.html"),
    ]);

    expect(indexCss).toContain('--f-ui: "Noto Sans Georgian", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;');
    expect(indexCss).toContain('--f-display: "Amelie Display", "Noto Serif Georgian", "Noto Sans Georgian", Georgia, serif;');
    expect(waveCss).toContain("--fb-font-ui: var(--f-ui);");
    expect(waveCss).toContain("--font-heading: var(--f-display);");
    expect(amelieCss).toContain("--am-ui: var(--f-ui);");
    expect(amelieCss).toContain(".am-home-hero h1 {");
    expect(amelieCss).toContain("font-family: var(--f-display) !important;");
    expect(amelieCss).toContain("[style*=\"Cormorant Garamond\"]");
    expect(html).toContain("family=Noto+Sans+Georgian:wght@400;500;600;700");
    expect(html).toContain("Noto+Serif+Georgian:wght@400;500;600;700");
    expect(html).not.toContain("Space+Mono");
  });
});
