import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

const readProjectFile = (relativePath: string) =>
  readFile(path.join(projectRoot, relativePath), "utf8");

describe("product detail performance contract", () => {
  it("uses a bounded category-scoped related-products query", async () => {
    const source = await readProjectFile("client/src/pages/ProductDetail.tsx");

    expect(source).toContain("trpc.products.catalog.useQuery");
    expect(source).toContain("pageSize: 5");
    expect(source).toContain('categoryId: product?.categoryId ?? 1');
    expect(source).toContain('availability: "all" as const');
    expect(source).toContain('sort: "featured" as const');
    expect(source).toContain("staleTime: 60_000");
    expect(source).not.toContain("trpc.products.list.useQuery();");
  });

  it("prioritizes the primary product image without changing its renderer", async () => {
    const source = await readProjectFile("client/src/pages/ProductDetail.tsx");

    expect(source).toContain('loading="eager"');
    expect(source).toContain('fetchPriority="high"');
    expect(source).toContain("width={900}");
    expect(source).toContain("height={900}");
    expect(source).toContain("<FlowerImage src={displayImage}");
  });

  it("integrates accessible initial, error, and partial-data state components", async () => {
    const pageSource = await readProjectFile("client/src/pages/ProductDetail.tsx");
    const stateSource = await readProjectFile("client/src/components/ProductDetailStates.tsx");

    expect(pageSource).toContain("ProductDetailLoadingState");
    expect(pageSource).toContain("ProductDetailNotFoundState");
    expect(pageSource).toContain("productQuery.isError || !product");
    expect(pageSource).toContain("relatedQuery.isLoading");
    expect(pageSource).toContain("relatedQuery.isError");
    expect(stateSource).toContain('aria-busy="true"');
    expect(stateSource).toContain('aria-live="polite"');
    expect(stateSource).toContain('role="status"');
    expect(stateSource).toContain('role="alert"');
    expect(stateSource).toContain("fb-related-skeleton");
    expect(stateSource).toContain("fb-related-error");
  });
});
