"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import type { Category, CategoryId, Product, SortKey } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { localizedCategoryName } from "@/lib/categoryLabels";
import {
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  CloseIcon,
  MenuIcon,
} from "@/components/ui/Icons";

const PAGE_SIZE = 12;

const sortOptions: { value: SortKey; key: string }[] = [
  { value: "featured", key: "sort.featured" },
  { value: "newest", key: "sort.newest" },
  { value: "price-asc", key: "sort.priceAsc" },
  { value: "price-desc", key: "sort.priceDesc" },
  { value: "name-asc", key: "sort.nameAsc" },
];

const priceSteps = [180, 220, 260, 320];

/** swatch colours for the colour filter chips */
const COLOR_HEX: Record<string, string> = {
  Amber: "#e0a832", Blue: "#7fa8d9", Blush: "#f3c6cf", Burgundy: "#7d2338",
  Coral: "#ff8a65", Cream: "#f2ead8", Green: "#9bb87c", Lavender: "#b39ddb",
  Multi: "linear-gradient(135deg,#ef8fae,#ffcf6b,#8db4e0)", Orange: "#ff9e40",
  Pastel: "linear-gradient(135deg,#f4c7cf,#cfe0d0,#f6e2b8)", Peach: "#ffc09a",
  Pink: "#ef8fb3", Plum: "#8e4a6b", Purple: "#9d84cc", Red: "#c5203a",
  Rust: "#b5623a", White: "#ffffff", Yellow: "#ffd645",
};

function filterLiveProducts(
  source: Product[],
  input: { category: CategoryId | "all"; tag?: string; query: string; colors: string[]; maxPrice?: number; inStockOnly: boolean; sort: SortKey },
) {
  const normalized = input.query.trim().toLocaleLowerCase();
  const result = source.filter((product) => {
    if (input.category !== "all" && product.category !== input.category) return false;
    if (input.tag && !product.tags.includes(input.tag)) return false;
    if (normalized && !`${product.name} ${product.subtitle ?? ""} ${product.description}`.toLocaleLowerCase().includes(normalized)) return false;
    if (input.colors.length && !input.colors.some((color) => product.colors.includes(color))) return false;
    if (input.maxPrice !== undefined && product.price > input.maxPrice) return false;
    return !(input.inStockOnly && !product.available);
  });
  return result.sort((a, b) => {
    if (input.sort === "price-asc") return a.price - b.price;
    if (input.sort === "price-desc") return b.price - a.price;
    if (input.sort === "name-asc") return a.name.localeCompare(b.name, "ka");
    if (input.sort === "featured") return Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller));
    return 0;
  });
}

function colorsFor(source: Product[]) {
  return [...new Set(source.flatMap((product) => product.colors))].sort();
}

export function CatalogView({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const category = (params.get("category") ?? "all") as CategoryId | "all";
  const activeCategory = categories.find((item) => item.id === category);
  const categoryName = activeCategory ? localizedCategoryName(activeCategory, t) : category;
  const tag = params.get("occasion") ?? undefined;
  const query = params.get("q") ?? "";
  const colors = params.get("colors")?.split(",").filter(Boolean) ?? [];
  const maxPrice = params.get("max") ? Number(params.get("max")) : undefined;
  const inStockOnly = params.get("stock") === "1";
  const sort = (params.get("sort") ?? "featured") as SortKey;
  const page = Math.max(1, Number(params.get("page") ?? "1"));

  const [queryInput, setQueryInput] = useState(query);

  const setParams = useCallback(
    (next: Record<string, string | null>, resetPage = true) => {
      const sp = new URLSearchParams(params.toString());
      Object.entries(next).forEach(([k, v]) => {
        if (v === null || v === "") sp.delete(k);
        else sp.set(k, v);
      });
      if (resetPage) sp.delete("page");
      router.replace(`/catalog${sp.toString() ? `?${sp}` : ""}`, { scroll: false });
    },
    [params, router],
  );

  const all = filterLiveProducts(products, { category, tag, query, colors, maxPrice, inStockOnly, sort });
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const from = (current - 1) * PAGE_SIZE;
  const pageItems = all.slice(from, from + PAGE_SIZE);

  const toggleColor = (c: string) => {
    const next = colors.includes(c) ? colors.filter((x) => x !== c) : [...colors, c];
    setParams({ colors: next.join(",") || null });
  };

  const activeCount =
    (category !== "all" ? 1 : 0) + (tag ? 1 : 0) + colors.length +
    (maxPrice ? 1 : 0) + (inStockOnly ? 1 : 0);

  const clearAll = () =>
    setParams({ category: null, occasion: null, colors: null, max: null, stock: null });

  /*
    Rendered as a plain function call rather than <FilterPanel />: declaring a
    component inside render would remount the whole panel on every keystroke.
  */
  const filterPanel = (
    <div className="grid gap-7">
      <FilterGroup title={t("cat.category")}>
        <ul className="grid gap-0.5">
          <li>
            <FilterRow
              active={category === "all"}
              onClick={() => setParams({ category: null, occasion: null })}
              label={t("cat.all")}
              count={products.length}
            />
          </li>
          {categories
            // a category with nothing in it is noise, not a filter
            .map((c) => ({ c, n: filterLiveProducts(products, { category: c.id, query: "", colors: [], inStockOnly: false, sort: "featured" }).length }))
            .filter(({ n }) => n > 0)
            .map(({ c, n }) => (
              <li key={c.id}>
                <FilterRow
                  active={category === c.id}
                  onClick={() => setParams({ category: c.id, occasion: null })}
                  label={localizedCategoryName(c, t)}
                  count={n}
                />
              </li>
            ))}
        </ul>
      </FilterGroup>

      <FilterGroup title={t("cat.colour")}>
        <div className="flex flex-wrap gap-1.5">
          {colorsFor(products).map((c) => {
            const active = colors.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleColor(c)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-[12px] font-medium transition ${
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                    : "border-[var(--line-strong)] hover:border-[var(--ink)]"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-black/10"
                  style={{ background: COLOR_HEX[c] ?? "#ddd" }}
                />
                {c}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title={t("cat.price")}>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setParams({ max: null })}
            aria-pressed={!maxPrice}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
              !maxPrice
                ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                : "border-[var(--line-strong)] hover:border-[var(--ink)]"
            }`}
          >
            {t("cat.anyPrice")}
          </button>
          {priceSteps.map((p) => (
            <button
              key={p}
              onClick={() => setParams({ max: maxPrice === p ? null : String(p) })}
              aria-pressed={maxPrice === p}
              className={`rounded-full border px-3 py-1.5 text-[12px] font-medium tabular-nums transition ${
                maxPrice === p
                  ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                  : "border-[var(--line-strong)] hover:border-[var(--ink)]"
              }`}
            >
              ≤ {p} ₾
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t("cat.availability")}>
        <label className="flex cursor-pointer items-center gap-2.5 text-[13px]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setParams({ stock: inStockOnly ? null : "1" })}
            className="h-4 w-4 accent-[var(--action)]"
          />
          {t("cat.inStock")}
        </label>
      </FilterGroup>

      {activeCount > 0 ? (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 justify-self-start text-[12.5px] font-semibold text-[var(--action-deep)] hover:underline"
        >
          <CloseIcon className="h-3.5 w-3.5" />
          {t("cat.clearAll")}
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="pb-20 sm:pb-28">
      {/* ---------- header band ---------- */}
      <div className="border-b border-[var(--line)] bg-[var(--surface-warm)]">
        <div className="container-fb py-9 sm:py-12">
          <h1 className="font-display text-[34px] leading-none tracking-[-0.015em] sm:text-[46px]">
            {t("cat.title")}
          </h1>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-[var(--ink)]/70">
            {t("cat.hero")}
          </p>

          {/* search */}
          <div className="mt-6 flex max-w-md items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white px-4">
            <SearchIcon className="h-[18px] w-[18px] shrink-0 text-[var(--muted)]" />
            <input
              value={queryInput}
              onChange={(e) => {
                setQueryInput(e.target.value);
                setParams({ q: e.target.value || null });
              }}
              placeholder={t("cat.searchPlaceholder")}
              className="h-11 w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--muted-2)]"
            />
            {queryInput ? (
              <button
                aria-label="Clear search"
                onClick={() => {
                  setQueryInput("");
                  setParams({ q: null });
                }}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--muted)] hover:bg-black/5"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ---------- body ---------- */}
      <div className="container-fb grid gap-8 pt-8 lg:grid-cols-[228px_minmax(0,1fr)] lg:gap-10">
        {/* sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {filterPanel}
          </div>
        </aside>

        <div>
          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-4 py-2 text-[13px] font-semibold transition hover:border-[var(--ink)] lg:hidden"
              >
                <MenuIcon className="h-4 w-4" />
                {t("cat.filters")}
                {activeCount > 0 ? (
                  <span className="mono grid h-5 min-w-5 place-items-center rounded-full bg-[var(--action)] px-1 text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                ) : null}
              </button>
              <p className="text-[13px] text-[var(--muted)]">
                {all.length > 0
                  ? t("cat.showing", {
                      a: from + 1,
                      b: Math.min(from + PAGE_SIZE, all.length),
                      n: all.length,
                    })
                  : t("cat.count", { n: 0 })}
              </p>
            </div>

            <label className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
              <span className="hidden sm:inline">{t("cat.sort")}</span>
              <select
                value={sort}
                onChange={(e) => setParams({ sort: e.target.value })}
                className="h-10 rounded-full border border-[var(--line-strong)] bg-white px-4 pr-8 text-[13px] font-semibold text-[var(--ink)] outline-none transition hover:border-[var(--ink)]"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {t(o.key)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* active filter pills */}
          {activeCount > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {category !== "all" ? (
                <Pill onClear={() => setParams({ category: null })}>
                  {categoryName}
                </Pill>
              ) : null}
              {colors.map((c) => (
                <Pill key={c} onClear={() => toggleColor(c)}>
                  {c}
                </Pill>
              ))}
              {maxPrice ? (
                <Pill onClear={() => setParams({ max: null })}>≤ {maxPrice} ₾</Pill>
              ) : null}
              {inStockOnly ? (
                <Pill onClear={() => setParams({ stock: null })}>{t("cat.inStock")}</Pill>
              ) : null}
            </div>
          ) : null}

          {/* grid */}
          <div className="mt-6">
            {pageItems.length ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 4) * 60}>
                    <ProductCard product={p} priority={i < 4} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] py-20 text-center">
                <p className="font-display text-[18px]">{t("cat.noResults")}</p>
                <p className="mt-1 text-[13px] text-[var(--muted)]">{t("cat.noResultsHint")}</p>
                {activeCount > 0 ? (
                  <Button variant="dark" className="mt-5" onClick={clearAll}>
                    {t("cat.clearAll")}
                  </Button>
                ) : null}
              </div>
            )}
          </div>

          {/* pagination */}
          {totalPages > 1 ? (
            <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
              <PageBtn
                disabled={current <= 1}
                onClick={() => setParams({ page: String(current - 1) }, false)}
                label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </PageBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  aria-current={n === current}
                  onClick={() => setParams({ page: String(n) }, false)}
                  className={`mono grid h-10 w-10 place-items-center rounded-full text-[13px] font-semibold transition ${
                    n === current
                      ? "bg-[var(--ink)] text-white"
                      : "border border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--ink)]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <PageBtn
                disabled={current >= totalPages}
                onClick={() => setParams({ page: String(current + 1) }, false)}
                label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </PageBtn>
            </nav>
          ) : null}
        </div>
      </div>

      {/* ---------- mobile filter drawer ---------- */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            aria-label={t("cat.close")}
            className="fb-overlay absolute inset-0 bg-[var(--overlay)]"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fb-drawer absolute right-0 top-0 flex h-full w-[88%] max-w-[380px] flex-col bg-[var(--page)] shadow-[var(--shadow-pop)]">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-display text-[18px]">{t("cat.filters")}</h2>
              <button
                aria-label={t("cat.close")}
                onClick={() => setDrawerOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {filterPanel}
            </div>
            <div className="border-t px-5 py-4">
              <Button variant="primary" fullWidth size="lg" onClick={() => setDrawerOpen(false)}>
                {t("cat.apply")} ({all.length})
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------ small pieces ------------------------------ */

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterRow({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13.5px] transition ${
        active
          ? "bg-[var(--ink)] font-semibold text-white"
          : "text-[var(--ink)]/85 hover:bg-black/5"
      }`}
    >
      {label}
      <span className={`mono text-[11px] ${active ? "text-white/70" : "text-[var(--muted-2)]"}`}>
        {count}
      </span>
    </button>
  );
}

function Pill({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-sand)] py-1.5 pl-3 pr-1.5 text-[12px] font-semibold">
      {children}
      <button
        onClick={onClear}
        aria-label="Remove filter"
        className="grid h-5 w-5 place-items-center rounded-full text-[var(--muted)] transition hover:bg-black/10 hover:text-[var(--ink)]"
      >
        <CloseIcon className="h-3 w-3" />
      </button>
    </span>
  );
}

function PageBtn({
  disabled,
  onClick,
  label,
  children,
}: {
  disabled?: boolean;
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--ink)] transition hover:border-[var(--ink)] disabled:opacity-30 disabled:hover:border-[var(--line-strong)]"
    >
      {children}
    </button>
  );
}
