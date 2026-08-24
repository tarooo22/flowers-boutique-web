import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const footerSource = readFileSync(new URL("./Footer.tsx", import.meta.url), "utf8");
const configSource = readFileSync(new URL("../../../next.config.ts", import.meta.url), "utf8");

describe("Footer and Preview CSP contracts", () => {
  it("uses a stable composite key for duplicate navigation hrefs", () => {
    expect(footerSource).toContain('key={`${group.title}:${l.href}:${l.key ?? l.label}`}');
    expect(footerSource).not.toContain("<li key={l.href}>");
  });

  it("permits eval only in development while preserving a separate production policy", () => {
    expect(configSource).toContain('const developmentScriptSource = isDevelopment ? " \'unsafe-eval\'" : "";');
    expect(configSource).toContain("'unsafe-inline'${developmentScriptSource}");
    expect(configSource).toContain('const isDevelopment = process.env.NODE_ENV === "development";');
  });
});
