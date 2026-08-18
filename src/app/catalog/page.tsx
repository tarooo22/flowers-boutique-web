import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { listLiveCategories, listLiveProducts } from "@/lib/production/catalog";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse hand-tied bouquets — filter by occasion, colour and price.",
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([listLiveProducts(), listLiveCategories()]);
  return (
    <Suspense fallback={<div className="container-fb py-20" />}>
      <CatalogView products={products} categories={categories} />
    </Suspense>
  );
}
