"use client";

import type { Product } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

interface Props {
  titleKey: string;
  eyebrowKey?: string;
  products: Product[];
  viewAllHref?: string;
  priorityCount?: number;
}

/** A titled homepage row of four product cards, revealed in sequence. */
export function ProductSection({
  titleKey,
  eyebrowKey,
  products,
  viewAllHref = "/catalog",
  priorityCount = 0,
}: Props) {
  const { t } = useI18n();
  if (!products.length) return null;

  return (
    <section className="container-fb pt-12 sm:pt-16">
      <Reveal>
        <SectionHeader
          title={t(titleKey)}
          eyebrow={eyebrowKey ? t(eyebrowKey) : undefined}
          viewAllHref={viewAllHref}
        />
      </Reveal>
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <ProductCard product={p} priority={i < priorityCount} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
