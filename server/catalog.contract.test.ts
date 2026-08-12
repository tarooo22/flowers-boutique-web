import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

const readProjectFile = (relativePath: string) =>
  readFile(path.join(projectRoot, relativePath), "utf8");

describe("catalog pagination and filtering contract", () => {
  it("exposes bounded server-side catalog inputs and a paginated response", async () => {
    const [router, db] = await Promise.all([
      readProjectFile("server/routers.ts"),
      readProjectFile("server/db.ts"),
    ]);

    expect(router).toContain("catalog: publicProcedure");
    expect(router).toContain("pageSize: z.number().int().min(1).max(24).default(24)");
    expect(router).toContain('z.enum(["all", "available", "unavailable"])');
    expect(router).toContain('z.enum(["featured", "priceAsc", "priceDesc", "name"])');
    expect(db).toContain("export async function getCatalogProducts");
    expect(db).toContain("hasMore: page * pageSize < total");
    expect(db).toContain("categoryCounts");
  });

  it("keeps catalog URL state and avoids client-side full-catalog filtering", async () => {
    const catalog = await readProjectFile("client/src/pages/Catalog.tsx");

    expect(catalog).toContain("trpc.products.catalog.useQuery(catalogInput)");
    expect(catalog).toContain("pageSize: 24");
    expect(catalog).toContain("window.history.replaceState");
    expect(catalog).toContain('params.set("page", String(page))');
    expect(catalog).not.toContain("const filteredProducts = useMemo");
  });

  it("preserves an initial page deep link and resets only after the filter signature changes", async () => {
    const catalog = await readProjectFile("client/src/pages/Catalog.tsx");

    expect(catalog).toContain("const initialFilterKey = useRef(filterKey);");
    expect(catalog).toContain("if (initialFilterKey.current !== filterKey)");
    expect(catalog).toContain("initialFilterKey.current = filterKey;");
    expect(catalog).not.toContain("useEffect(() => {\n    setPage(1);");
  });

  it("renders keyboard-accessible previous and next controls without altering product actions", async () => {
    const [catalog, styles] = await Promise.all([
      readProjectFile("client/src/pages/Catalog.tsx"),
      readProjectFile("client/src/index.css"),
    ]);

    expect(catalog).toContain('className="fb-catalog-pagination"');
    expect(catalog).toContain('aria-label={ka ? "კატალოგის გვერდები" : "Catalog pages"}');
    expect(catalog).toContain("disabled={!productsQuery.data?.hasMore}");
    expect(catalog).toContain('{ka ? "წინა" : "Previous"}');
    expect(catalog).toContain('{ka ? "შემდეგი" : "Next"}');
    expect(styles).toContain(".fb-catalog-pagination button {");
    expect(styles).toContain("min-height: 44px;");
  });
});
