"use client";

import type { Product } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

export function RelatedProducts({ products }: { products: Product[] }) {
  const { t } = useI18n();
  if (!products.length) return null;
  return (
    <section className="container-fb pt-16">
      <Reveal>
        <SectionHeader title={t("product.related")} viewAllHref="/catalog" />
        <ProductGrid products={products} />
      </Reveal>
    </section>
  );
}
