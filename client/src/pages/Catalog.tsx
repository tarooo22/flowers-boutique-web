import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { addToCart } from "@/lib/cartUtils";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useSEO } from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/product/ProductCard";
import { cleanProductName, getProductName } from "@/lib/productPresentation";

type SortOption = "featured" | "priceAsc" | "priceDesc" | "name";
type Availability = "all" | "available" | "unavailable";

const catalogSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Flower's Boutique catalog",
  description: "Fresh bouquets and considered floral arrangements in Tbilisi.",
  url: "/catalog",
};

export default function Catalog() {
  const { language, t } = useLanguage();
  const { openDrawer } = useCartDrawer();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    () => {
      const value =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("category")
          : null;
      return value && /^\d+$/.test(value) ? Number(value) : null;
    }
  );
  const [searchTerm, setSearchTerm] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (new URLSearchParams(window.location.search).get("search") ?? "")
  );
  const [sort, setSort] = useState<SortOption>("featured");
  const [availability, setAvailability] = useState<Availability>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useSEO({
    titleKa: "ყვავილების კატალოგი | Flower's Boutique",
    titleEn: "Flower Catalog | Flower's Boutique",
    descriptionKa: "დახვეწილი თაიგულები და ყვავილების კომპოზიციები თბილისში.",
    descriptionEn:
      "Browse considered bouquets and fresh floral arrangements in Tbilisi.",
    canonical: "/catalog",
    structuredData: catalogSchema,
    lang: language as "ka" | "en",
  });

  const productsQuery = trpc.products.list.useQuery();
  const categoriesQuery = trpc.categories.list.useQuery();
  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    return [...products]
      .filter((product: any) => {
        const name =
          (language === "ka" ? product.nameKa : product.nameEn) || "";
        const numericPrice = Number(product.priceMin ?? 0);
        return (
          (!selectedCategoryId || product.categoryId === selectedCategoryId) &&
          (!query || name.toLocaleLowerCase().includes(query)) &&
          (min === null || numericPrice >= min) &&
          (max === null || numericPrice <= max) &&
          (availability === "all" ||
            (availability === "available"
              ? product.isAvailable
              : !product.isAvailable))
        );
      })
      .sort((a: any, b: any) => {
        if (sort === "name")
          return String(language === "ka" ? a.nameKa : a.nameEn).localeCompare(
            String(language === "ka" ? b.nameKa : b.nameEn),
            language
          );
        if (sort === "priceAsc")
          return (
            Number(a.priceMin ?? Number.MAX_SAFE_INTEGER) -
            Number(b.priceMin ?? Number.MAX_SAFE_INTEGER)
          );
        if (sort === "priceDesc")
          return Number(b.priceMin ?? 0) - Number(a.priceMin ?? 0);
        return Number(b.featured) - Number(a.featured);
      });
  }, [
    availability,
    language,
    maxPrice,
    minPrice,
    products,
    searchTerm,
    selectedCategoryId,
    sort,
  ]);

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSearchTerm("");
    setAvailability("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const addProduct = (product: any) => {
    addToCart({
      productId: product.id,
      name: getProductName(product, language),
      price: Number(product.salePrice ?? product.priceMin ?? 0),
      quantity: 1,
      unitType: product.unitType || "",
      imageUrl: product.imageUrl,
    });
    toast.success(language === "ka" ? "კალათაში დაემატა" : "Added to cart");
    openDrawer();
  };

  const hasFilters = Boolean(
    selectedCategoryId ||
      searchTerm ||
      availability !== "all" ||
      minPrice ||
      maxPrice
  );
  const ka = language === "ka";

  return (
    <div className="p1-site p2-catalog-page min-h-screen">
      <Navbar />
      <main>
        <section className="fb-catalog-intro">
          <div className="fb-page-shell">
            <div className="fb-breadcrumbs">
              <Link href="/">{t("nav.home")}</Link>
              <ChevronRight size={14} />
              <span>{t("nav.catalog")}</span>
            </div>
            <div className="fb-catalog-intro__row">
              <div>
                <p className="fb-eyebrow">FLOWER'S BOUTIQUE · COLLECTION</p>
                <h1 className="fb-display">{ka ? "თაიგულები" : "Bouquets"}</h1>
                <p>
                  {ka
                    ? "ჩვენი კოლექცია თქვენი მნიშვნელოვანი მომენტებისთვის."
                    : "A considered collection for your meaningful moments."}
                </p>
              </div>
              <button
                type="button"
                className="fb-filter-trigger"
                onClick={() => setFiltersOpen(open => !open)}
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal size={17} /> {ka ? "ფილტრები" : "Filters"}{" "}
                {hasFilters && <span aria-label="Active filters" />}
              </button>
            </div>
            <nav
              className="fb-catalog-collection-nav"
              aria-label={ka ? "კატალოგის კატეგორიები" : "Catalog categories"}
            >
              <button
                type="button"
                className={selectedCategoryId === null ? "is-selected" : ""}
                onClick={() => setSelectedCategoryId(null)}
              >
                {ka ? "ყველა" : "All"}
              </button>
              {categories.map((category: any) => (
                <button
                  type="button"
                  key={category.id}
                  className={
                    selectedCategoryId === category.id ? "is-selected" : ""
                  }
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  {cleanProductName(
                    ka ? category.nameKa : category.nameEn,
                    ka ? "კატეგორია" : "Category"
                  )}
                </button>
              ))}
            </nav>
          </div>
        </section>

        <section className="fb-page-shell fb-catalog-layout">
          <aside
            className={`fb-catalog-filters ${filtersOpen ? "is-open" : ""}`}
            aria-label={ka ? "კატალოგის ფილტრები" : "Catalog filters"}
          >
            <div className="fb-catalog-filters__head">
              <h2>{ka ? "ფილტრები" : "Filter"}</h2>
              <button
                type="button"
                className="fb-filter-close"
                onClick={() => setFiltersOpen(false)}
                aria-label={ka ? "დახურვა" : "Close filters"}
              >
                <X size={18} />
              </button>
            </div>
            <label className="fb-field-label" htmlFor="catalog-search">
              {ka ? "ძიება" : "Search"}
            </label>
            <div className="fb-search-field">
              <Search size={17} />
              <input
                id="catalog-search"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder={ka ? "მოძებნეთ თაიგული" : "Search bouquets"}
              />
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label={ka ? "ძიების გასუფთავება" : "Clear search"}
                hidden={!searchTerm}
              >
                <X size={15} />
              </button>
            </div>
            <fieldset>
              <legend>{ka ? "კატეგორია" : "Category"}</legend>
              <div className="fb-filter-list">
                <button
                  type="button"
                  className={selectedCategoryId === null ? "is-selected" : ""}
                  onClick={() => setSelectedCategoryId(null)}
                >
                  <span>{ka ? "ყველა კოლექცია" : "All collections"}</span>
                  <small>{products.length}</small>
                </button>
                {categories.map((category: any) => (
                  <button
                    type="button"
                    key={category.id}
                    className={
                      selectedCategoryId === category.id ? "is-selected" : ""
                    }
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <span>
                      {cleanProductName(
                        ka ? category.nameKa : category.nameEn,
                        ka ? "კატეგორია" : "Category"
                      )}
                    </span>
                    <small>
                      {
                        products.filter(
                          (product: any) => product.categoryId === category.id
                        ).length
                      }
                    </small>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>{ka ? "ხელმისაწვდომობა" : "Availability"}</legend>
              <div className="fb-filter-list">
                <button
                  type="button"
                  className={availability === "all" ? "is-selected" : ""}
                  onClick={() => setAvailability("all")}
                >
                  <span>{ka ? "ყველა" : "All"}</span>
                </button>
                <button
                  type="button"
                  className={availability === "available" ? "is-selected" : ""}
                  onClick={() => setAvailability("available")}
                >
                  <span>{ka ? "მარაგშია" : "In stock"}</span>
                  <Check size={15} />
                </button>
                <button
                  type="button"
                  className={
                    availability === "unavailable" ? "is-selected" : ""
                  }
                  onClick={() => setAvailability("unavailable")}
                >
                  <span>{ka ? "ამოიწურა" : "Out of stock"}</span>
                </button>
              </div>
            </fieldset>
            <fieldset>
              <legend>{ka ? "ფასის დიაპაზონი (₾)" : "Price range (₾)"}</legend>
              <div className="fb-price-fields">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={event => setMinPrice(event.target.value)}
                  placeholder={ka ? "მინ" : "Min"}
                  aria-label={ka ? "მინიმალური ფასი" : "Minimum price"}
                />
                <span>—</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={event => setMaxPrice(event.target.value)}
                  placeholder={ka ? "მაქს" : "Max"}
                  aria-label={ka ? "მაქსიმალური ფასი" : "Maximum price"}
                />
              </div>
            </fieldset>
            {hasFilters && (
              <button
                type="button"
                className="fb-clear-filters"
                onClick={clearFilters}
              >
                <RotateCcw size={14} />{" "}
                {ka ? "ფილტრების გასუფთავება" : "Clear filters"}
              </button>
            )}
          </aside>

          {filtersOpen && (
            <button
              type="button"
              className="fb-filter-scrim"
              aria-label={ka ? "ფილტრების დახურვა" : "Close filters"}
              onClick={() => setFiltersOpen(false)}
            />
          )}

          <div className="fb-catalog-results">
            <div className="fb-catalog-toolbar">
              <p>
                {productsQuery.isLoading
                  ? "—"
                  : `${filteredProducts.length} ${ka ? "თაიგული" : "bouquets"}`}
              </p>
              <label>
                {ka ? "დალაგება" : "Sort by"}
                <span className="fb-sort-select">
                  <select
                    value={sort}
                    onChange={event =>
                      setSort(event.target.value as SortOption)
                    }
                    aria-label={ka ? "დალაგება" : "Sort products"}
                  >
                    <option value="featured">
                      {ka ? "რჩეული" : "Featured"}
                    </option>
                    <option value="priceAsc">
                      {ka ? "ფასი: დაბლიდან" : "Price: low to high"}
                    </option>
                    <option value="priceDesc">
                      {ka ? "ფასი: მაღლიდან" : "Price: high to low"}
                    </option>
                    <option value="name">{ka ? "სახელი" : "Name"}</option>
                  </select>
                  <ChevronDown size={15} />
                </span>
              </label>
            </div>
            {productsQuery.isLoading ? (
              <div
                className="fb-catalog-grid"
                aria-label={ka ? "იტვირთება" : "Loading products"}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="fb-product-skeleton" />
                ))}
              </div>
            ) : productsQuery.isError ? (
              <div className="fb-catalog-state">
                <AlertCircle size={28} />
                <h2>
                  {ka
                    ? "კატალოგის ჩატვირთვა ვერ მოხერხდა"
                    : "We couldn't load the catalog"}
                </h2>
                <p>
                  {ka
                    ? "გთხოვთ, სცადოთ თავიდან."
                    : "Please try again in a moment."}
                </p>
                <button type="button" onClick={() => productsQuery.refetch()}>
                  <RotateCcw size={15} /> {ka ? "თავიდან ცდა" : "Try again"}
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="fb-catalog-state">
                <Search size={28} />
                <h2>{ka ? "თაიგული ვერ მოიძებნა" : "No bouquets found"}</h2>
                <p>
                  {ka
                    ? "სცადეთ სხვა ძიება ან გაასუფთავეთ ფილტრები."
                    : "Try another search or clear your filters."}
                </p>
                {hasFilters && (
                  <button type="button" onClick={clearFilters}>
                    {ka ? "ყველა თაიგულის ნახვა" : "View all bouquets"}
                  </button>
                )}
              </div>
            ) : (
              <div className="fb-catalog-grid">
                {filteredProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    onAdd={addProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
