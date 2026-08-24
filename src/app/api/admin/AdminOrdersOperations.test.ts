import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const queueRoute = readFileSync(new URL("./orders/route.ts", import.meta.url), "utf8");
const summaryRoute = readFileSync(new URL("./orders/summary/route.ts", import.meta.url), "utf8");
const detailRoute = readFileSync(new URL("./orders/[id]/route.ts", import.meta.url), "utf8");
const notesRoute = readFileSync(new URL("./orders/[id]/notes/route.ts", import.meta.url), "utf8");
const service = readFileSync(new URL("../../../lib/production/adminOrders.ts", import.meta.url), "utf8");
const schema = readFileSync(new URL("../../../lib/production/db.ts", import.meta.url), "utf8");
const operations = readFileSync(new URL("../../../components/admin/OrdersOperations.tsx", import.meta.url), "utf8");

describe("Admin order operations contract", () => {
  it("keeps queue and summary data admin-only, dynamic and private", () => {
    for (const route of [queueRoute, summaryRoute, detailRoute, notesRoute]) {
      expect(route).toContain("getProductionSessionUser");
      expect(route).toMatch(/role\s*(===|!==)\s*"admin"/);
      expect(route).toContain('Cache-Control": "private, no-store"');
      expect(route).toContain('dynamic = "force-dynamic"');
    }
  });

  it("stores a separate immutable operational audit trail with revision metadata", () => {
    expect(schema).toContain('mysqlTable("orderOperationalEvents"');
    expect(schema).toContain('uniqueIndex("orderOperationalEvents_idempotency_unique")');
    expect(schema).toContain('mysqlTable("orderOperationalMeta"');
    expect(schema).toContain('revision: int("revision")');
    expect(service).toContain("idempotencyKey");
    expect(service).toContain("revision_conflict");
  });

  it("only allows forward order transitions while retaining transaction-safe Flower Circle sync", () => {
    expect(service).toContain('new: ["confirmed", "cancelled"]');
    expect(service).toContain('confirmed: ["delivering", "cancelled"]');
    expect(service).toContain('delivering: ["completed", "cancelled"]');
    expect(service).toContain("cancellation_reason_required");
    expect(service).toContain("await syncFlowerCircleOrderStatus(tx, row.id)");
  });

  it("protects the responsive operations workspace with queue filters, drawer and notes", () => {
    expect(operations).toContain("Fulfilment command center");
    expect(operations).toContain("deliveryWindow");
    expect(operations).toContain("router.replace");
    expect(operations).toContain("DetailDrawer");
    expect(operations).toContain("შიდა შენიშვნა");
    expect(operations).toContain("შეკვეთის გაუქმება");
    expect(operations).toContain("role=\"dialog\"");
  });
});
