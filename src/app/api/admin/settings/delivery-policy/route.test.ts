import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const adminRoute = readFileSync(new URL("./route.ts", import.meta.url), "utf8");
const publicRoute = readFileSync(new URL("../../../storefront/delivery-policy/route.ts", import.meta.url), "utf8");
const service = readFileSync(new URL("../../../../../lib/production/storefrontSettings.ts", import.meta.url), "utf8");

describe("delivery policy settings contract", () => {
  it("guards manager writes and uses private no-store responses", () => {
    expect(adminRoute).toContain("isProductionAdmin");
    expect(adminRoute).toContain("getProductionSessionUser");
    expect(adminRoute).toContain('"Cache-Control": "private, no-store"');
    expect(adminRoute).toContain('error: "revision_conflict"');
  });

  it("keeps public storefront output read-only and maintains an immutable revision event", () => {
    expect(publicRoute).toContain("getDeliveryPolicy");
    expect(publicRoute).not.toContain("PATCH");
    expect(service).toContain("storefrontSettingEvents");
    expect(service).toContain("expectedRevision !== actualRevision");
    expect(service).toContain("onDuplicateKeyUpdate");
  });
});
