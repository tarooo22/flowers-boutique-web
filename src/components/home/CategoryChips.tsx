"use client";

import Link from "next/link";
import { categories } from "@/data/categories";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";

/** "What are you looking for?" — horizontally scrollable pill row. */
export function CategoryChips() {
  const { t } = useI18n();

  const occasions = [
    { label: t("occ.romance"), href: "/catalog?occasion=romance" },
    { label: t("occ.birthday"), href: "/catalog?occasion=joy" },
    { label: t("occ.justBecause"), href: "/catalog" },
    ...categories.map((c) => ({
      label: t(`category.${c.id}`),
      href: `/catalog?category=${c.id}`,
    })),
  ];

  return (
    <section id="categories" className="container-fb pt-12 sm:pt-16">
      <Reveal>
        <h2 className="font-display mb-4 text-[24px] leading-tight tracking-[-0.01em] sm:text-[28px]">
          {t("home.chipsHeading")}
        </h2>
      </Reveal>
      <Reveal delay={90}>
        <div className="hide-scrollbar -mx-[var(--gutter)] flex gap-2.5 overflow-x-auto px-[var(--gutter)] pb-1">
          {occasions.map((o) => (
            <Link
              key={o.label}
              href={o.href}
              className="shrink-0 whitespace-nowrap rounded-full border border-[var(--line-strong)] bg-[var(--surface-sand)] px-4 py-2.5 text-[13px] font-semibold text-[var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--ink)] hover:bg-white hover:shadow-[var(--shadow-card)]"
            >
              {o.label}
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
