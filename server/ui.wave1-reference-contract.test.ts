import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const readProjectFile = (relativePath: string) =>
  readFile(path.join(projectRoot, relativePath), "utf8");

describe("Wave 1 measured-reference visual contract", () => {
  it("locks the approved shared aliases in one final cascade", async () => {
    const styles = await readProjectFile("client/src/styles/wave1-reference.css");

    for (const token of [
      "--fb-page: #fbf7ee;",
      "--fb-bone-2: #f3eddf;",
      "--fb-bone-3: #eae2ce;",
      "--fb-surface: #ffffff;",
      "--fb-ink: #1a1a1a;",
      "--fb-ink-soft: #3a3a38;",
      "--fb-muted: #6b6b63;",
      "--fb-action: #ff5a3c;",
      "--fb-action-hover: #e0442a;",
      "--fb-action-ink: #d13b22;",
      "--fb-positive: #14532d;",
      "--fb-positive-surface: #e3efe7;",
      "--fb-scrim: rgba(26, 26, 26, 0.42);",
      "--fb-container: 1280px;",
    ]) {
      expect(styles).toContain(token);
    }

    expect(styles).toContain("--fb-ease-out: cubic-bezier(0.23, 1, 0.32, 1);");
    expect(styles).toContain("--fb-ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);");
    expect(styles).not.toContain("!important");
  });

  it("loads only public typography sources and uses the measured canvas color", async () => {
    const [documentHead, main] = await Promise.all([
      readProjectFile("client/index.html"),
      readProjectFile("client/src/main.tsx"),
    ]);

    expect(documentHead).toContain('content="#FBF7EE"');
    expect(documentHead).toContain("family=Noto+Sans+Georgian");
    expect(documentHead).toContain("family=Space+Mono");
    expect(main).toContain('import "./styles/wave1-reference.css";');
  });

  it("implements deterministic shell, header and catalog geometry at the required breakpoints", async () => {
    const styles = await readProjectFile("client/src/styles/wave1-reference.css");

    expect(styles).toContain("width: min(var(--fb-content), calc(100% - (var(--fb-gutter) * 2)));");
    expect(styles).toContain("--fb-gutter: 16px;");
    expect(styles).toContain("@media (min-width: 768px)");
    expect(styles).toContain("--fb-gutter: 24px;");
    expect(styles).toContain("grid-template-rows: 64px 58px;");
    expect(styles).toContain("min-height: 122px;");
    expect(styles).toContain("min-height: 55px;");
    expect(styles).toContain("min-height: 65px;");
    expect(styles).toContain("grid-template-columns: repeat(2, minmax(0, 1fr));");
    expect(styles).toContain("grid-template-columns: repeat(3, minmax(0, 1fr));");
    expect(styles).toContain("grid-template-columns: repeat(4, minmax(0, 1fr));");
    expect(styles).toContain("gap: 28px 12px;");
    expect(styles).toContain("gap: 32px 18px;");
  });

  it("keeps the header, cart, catalog query and reusable product-card behavior contracts intact", async () => {
    const [navbar, catalog, productCard] = await Promise.all([
      readProjectFile("client/src/components/Navbar.tsx"),
      readProjectFile("client/src/pages/Catalog.tsx"),
      readProjectFile("client/src/components/product/ProductCard.tsx"),
    ]);

    expect(navbar).toContain("setLanguage(\"ka\")");
    expect(navbar).toContain("setLanguage(\"en\")");
    expect(navbar).toContain("onClick={openDrawer}");
    expect(navbar).toContain("navigate(");
    expect(catalog).toContain("trpc.products.catalog.useQuery(catalogInput)");
    expect(catalog).toContain("window.history.replaceState");
    expect(catalog).toContain("setPage(current => current + 1)");
    expect(productCard).toContain("getProductName(product, language)");
    expect(productCard).toContain("localStorage.getItem(key)");
    expect(productCard).toContain("onClick={() => onAdd(product)}");
    expect(productCard).toContain('href={`/product/${product.id}`}');
  });

  it("keeps the reference layer reduced-motion safe and visually restrained", async () => {
    const styles = await readProjectFile("client/src/styles/wave1-reference.css");

    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).not.toContain("linear-gradient");
    expect(styles).not.toContain("backdrop-filter: blur");
    expect(styles).toContain("backdrop-filter: none;");
    expect(styles).toContain("box-shadow: var(--fb-shadow-header);");
  });
});
