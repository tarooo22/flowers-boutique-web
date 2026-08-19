"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";

/** "What are you looking for?" — horizontally scrollable pill row. */
export function CategoryChips() {
  const { t } = useI18n();

  const chips = [
    { label: t("occ.romance"), unavailable: true },
    { label: t("occ.birthday"), unavailable: true },
    { label: t("occ.justBecause"), href: "/catalog" },
    { label: t("category.bouquet"), href: "/catalog?category=bouquet" },
    { label: t("category.single-stems"), href: "/catalog?category=single-stems" },
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
          {chips.map((chip) =>
            !chip.href ? (
              <span
                key={chip.label}
                aria-disabled="true"
                title="This collection currently has no published products."
                className="cursor-not-allowed shrink-0 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--surface-sand)] px-4 py-2.5 text-[13px] font-semibold text-[var(--muted-2)]"
              >
                {chip.label}
              </span>
            ) : (
              <Link
                key={chip.label}
                href={chip.href}
                className="shrink-0 whitespace-nowrap rounded-full border border-[var(--line-strong)] bg-[var(--surface-sand)] px-4 py-2.5 text-[13px] font-semibold text-[var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--ink)] hover:bg-white hover:shadow-[var(--shadow-card)]"
              >
                {chip.label}
              </Link>
            ),
          )}
        </div>
      </Reveal>
    </section>
  );
}
