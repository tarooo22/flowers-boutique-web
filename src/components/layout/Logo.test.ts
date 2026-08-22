import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const logo = readFileSync(new URL("./Logo.tsx", import.meta.url), "utf8");
const footer = readFileSync(new URL("./Footer.tsx", import.meta.url), "utf8");

describe("Georgian brand wordmark", () => {
  it("uses the approved Georgian two-line wordmark in the shared logo component", () => {
    expect(logo).toContain("ყვავილების");
    expect(logo).toContain("ბუტიკი");
    expect(logo).toContain('aria-label="ყვავილების ბუტიკი — მთავარი"');
  });

  it("reuses the shared logo in the inverse Footer treatment", () => {
    expect(footer).toContain('import { Logo } from "./Logo"');
    expect(footer).toContain('<Logo tone="light" />');
  });
});
