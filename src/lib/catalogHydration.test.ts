import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const layoutSource = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const providersSource = readFileSync(new URL("../components/ClientProviders.tsx", import.meta.url), "utf8");
const storeSource = readFileSync(new URL("./store.tsx", import.meta.url), "utf8");
const searchSource = readFileSync(new URL("../components/layout/Search.tsx", import.meta.url), "utf8");
const mobileNavSource = readFileSync(new URL("../components/layout/MobileNav.tsx", import.meta.url), "utf8");

describe("route-scoped catalog hydration contract", () => {
  it("does not serialize the complete live catalog through the root provider", () => {
    expect(layoutSource).not.toContain("listLiveProducts");
    expect(layoutSource).toContain("<ClientProviders>{children}</ClientProviders>");
    expect(providersSource).not.toContain("products=");
  });

  it("hydrates only persisted cart/favourite product IDs and searches on demand", () => {
    expect(storeSource).toContain("/api/catalog/products?ids=");
    expect(storeSource).toContain("catalogLoading");
    expect(searchSource).toContain("/api/catalog/search?q=");
    expect(mobileNavSource).not.toContain("catalogProducts");
  });
});
