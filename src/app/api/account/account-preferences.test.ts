import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const profile = readFileSync(new URL("./profile/route.ts", import.meta.url), "utf8");
const addresses = readFileSync(new URL("./addresses/route.ts", import.meta.url), "utf8");
const notifications = readFileSync(new URL("./notifications/route.ts", import.meta.url), "utf8");

describe("Account preferences API", () => {
  it("requires the server-verified session for every preferences endpoint", () => {
    expect(profile).toContain("getProductionSessionUser");
    expect(addresses).toContain("getProductionSessionUser");
    expect(notifications).toContain("getProductionSessionUser");
    expect(profile).toContain('error: "unauthorized"');
    expect(addresses).toContain('error: "unauthorized"');
    expect(notifications).toContain('error: "unauthorized"');
  });

  it("scopes profile, address and notification writes to user ownership", () => {
    expect(profile).toContain("eq(users.id, user.id)");
    expect(addresses).toContain("eq(customerAddresses.userId, user.id)");
    expect(addresses).toContain("transaction");
    expect(addresses).toContain("MAX_ADDRESSES = 10");
    expect(addresses).toContain('error: "address_limit"');
    expect(notifications).toContain("userId: user.id");
  });
});
