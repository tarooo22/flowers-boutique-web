import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./route.ts", import.meta.url), "utf8");

describe("Account order and Flower Circle history API", () => {
  it("requires the current session and never returns another account's history", () => {
    expect(source).toContain("getProductionSessionUser");
    expect(source).toContain("{ error: \"unauthorized\" }");
    expect(source).toContain("eq(orders.userId, user.id)");
    expect(source).toContain("eq(orders.customerEmail, email)");
    expect(source).toContain('"Cache-Control": "private, no-store"');
  });
});
