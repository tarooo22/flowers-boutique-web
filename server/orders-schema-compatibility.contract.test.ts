import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

describe("orders schema compatibility migration", () => {
  it("repairs every active orders-list field that was missing from the legacy table without data mutations", async () => {
    const migration = await readFile(
      path.join(
        projectRoot,
        "drizzle/migrations/repair_orders_schema_compatibility_20260812.sql",
      ),
      "utf8",
    );

    const requiredColumns = [
      "customerName",
      "customerEmail",
      "customerPhone",
      "deliveryAddress",
      "deliveryTime",
      "orderChannel",
      "deliveryStatus",
      "orderNumber",
      "fulfillmentType",
      "deliveryFee",
      "bogOrderId",
      "bogExternalOrderId",
      "bogTransactionId",
      "bogAuthCode",
      "bogPayerIdentifier",
      "bogPaymentMethod",
      "bogPaymentStatus",
      "bogCallbackReceived",
      "paidAt",
      "paymentLastCheckedAt",
      "paymentFailureReason",
      "deletedAt",
      "deletedByUserId",
      "deletionReason",
    ];

    for (const column of requiredColumns) {
      expect(migration).toContain(`ADD COLUMN IF NOT EXISTS \`${column}\``);
    }

    expect(migration).toContain("CREATE UNIQUE INDEX IF NOT EXISTS `orders_orderNumber_unique`");

    const executableSql = migration.replace(/^--.*$/gm, "");
    expect(executableSql).not.toMatch(/\b(UPDATE|DELETE|INSERT|DROP|TRUNCATE)\b/i);
  });
});
