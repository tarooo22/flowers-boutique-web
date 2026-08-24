import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./route.ts", import.meta.url), "utf8");

describe("private account order detail contract", () => {
  it("requires a session, preserves legacy-owned order matching and keeps customer details private", () => {
    expect(source).toContain("getProductionSessionUser");
    expect(source).toContain('error: "unauthorized"');
    expect(source).toContain("eq(orders.userId, user.id)");
    expect(source).toContain("eq(orders.customerEmail, email)");
    expect(source).toContain('"Cache-Control": "private, no-store"');
  });

  it("returns immutable created/status timeline data without any customer mutation", () => {
    expect(source).toContain("orderOperationalEvents");
    expect(source).toContain('eventType: "created"');
    expect(source).not.toContain(".update(orders)");
    expect(source).not.toContain(".delete(orders)");
  });
});
