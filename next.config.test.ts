import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./next.config.ts", import.meta.url), "utf8");

describe("public trust headers", () => {
  it("sets frame protection, CSP and privacy headers", () => {
    expect(source).toContain("Content-Security-Policy");
    expect(source).toContain("frame-ancestors 'self'");
    expect(source).toContain("X-Frame-Options");
    expect(source).toContain("Referrer-Policy");
    expect(source).toContain("Permissions-Policy");
  });
});
