import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("cart drawer mobile controls", () => {
  it("reserves lower clearance and keeps cart item actions at least 44px", async () => {
    const source = await readFile(
      path.join(process.cwd(), "client/src/components/CartDrawer.tsx"),
      "utf8",
    );

    expect(source).toContain("p-0 pb-[52px] sm:pb-0");
    expect(source).toContain("flex h-11 w-11 shrink-0 items-center justify-center");
    expect(source).toContain("flex h-11 w-11 items-center justify-center rounded");
    expect(source).toContain("aria-label={language === 'ka'");
  });
});
