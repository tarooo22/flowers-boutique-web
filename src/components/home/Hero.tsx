"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Tilt } from "@/components/ui/Tilt";
import { ArrowRight, LeafIcon, TruckIcon } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n";
import { brand } from "@/config/brand";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

/**
 * Split editorial hero with a 3D card stack.
 * Deliberately different from a full-bleed photo band: warm canvas on the left
 * for the headline, layered depth on the right.
 */
export function Hero({ products }: { products: Product[] }) {
  const { t } = useI18n();
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle scroll parallax on the decorative layers.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setOffset(Math.max(-120, Math.min(120, -rect.top * 0.12)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // The hero card displays a real, currently available production product.
  const featured = products.find((product) => product.available && product.images[0]) ?? products[0];

  const stats = [
    { value: t("common.minShort", { n: brand.delivery.windowMinutes }), label: t("hero.statDelivery") },
    { value: "300+", label: t("hero.statWeekly") },
    { value: "1–8%", label: t("hero.statCashback") },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--surface-warm)]"
    >
      {/* soft decorative blooms */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[var(--action)]/10 blur-3xl"
        style={{ transform: `translateY(${offset * 0.5}px)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-[-10%] h-[380px] w-[380px] rounded-full bg-[#7fb894]/15 blur-3xl"
        style={{ transform: `translateY(${-offset * 0.4}px)` }}
      />

      <div className="container-fb relative grid items-center gap-10 pb-12 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-16 lg:pt-20">
        {/* ---------- copy ---------- */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white/70 px-3.5 py-1.5 text-[11.5px] font-semibold text-[var(--ink)] backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--action)]" />
            {t("hero.badge")}
          </span>

          <h1 className="font-display mt-5 max-w-[16ch] text-[42px] font-semibold leading-[1.03] tracking-[-0.015em] text-[var(--ink)] sm:text-[56px] lg:text-[64px]">
            {t("hero.title")}
          </h1>

          <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-[var(--ink)]/70">
            {t("hero.subtitle")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <Button href="/catalog" variant="primary" size="lg">
              {t("common.shopCatalog")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href="#categories"
              className="inline-flex h-12 items-center rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-6 text-[13.5px] font-semibold text-[var(--ink)] transition hover:border-[var(--ink)] hover:bg-white/60"
            >
              {t("hero.findByOccasion")}
            </a>
          </div>

          {/* stats */}
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--line-strong)] pt-5">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="mono text-[17px] font-bold leading-none text-[var(--ink)] sm:text-[20px]">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-[11.5px] leading-tight text-[var(--muted)]">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- 3D card stack ---------- */}
        <div className="tilt-scene relative mx-auto w-full max-w-[300px] sm:max-w-[340px]">
          <Tilt max={9} className="relative">
            {/* back cards */}
            <div
              aria-hidden
              className="tilt-layer absolute left-[6%] top-[8%] hidden h-[78%] w-[62%] rotate-[-7deg] rounded-[var(--radius-lg)] bg-white/60 shadow-[var(--shadow-float)] sm:block"
              style={{ ["--tz" as string]: "-60px" }}
            />
            <div
              aria-hidden
              className="tilt-layer absolute right-[4%] top-[4%] hidden h-[82%] w-[58%] rotate-[6deg] rounded-[var(--radius-lg)] bg-white/75 shadow-[var(--shadow-float)] sm:block"
              style={{ ["--tz" as string]: "-30px" }}
            />

            {/* main product card */}
            <div
              className="tilt-layer relative overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-pop)]"
              style={{ ["--tz" as string]: "40px" }}
            >
              <div className="relative aspect-[4/5] bg-[var(--surface-sand)]">
                {featured?.images[0] ? (
                  <Image
                    src={featured.images[0]}
                    alt={featured.name}
                    fill
                    priority
                    sizes="(max-width:1024px) 90vw, 460px"
                    unoptimized
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold uppercase tracking-[0.03em]">
                    {featured?.name ?? t("nav.catalog")}
                  </p>
                  <p className="truncate text-[12px] text-[var(--muted)]">{featured?.subtitle}</p>
                </div>
                <span className="shrink-0 text-[14px] font-semibold tabular-nums">
                  {featured ? formatPrice(featured.price) : "—"}
                </span>
              </div>
            </div>

          </Tilt>

          {/*
            Floating chips live outside <Tilt> on purpose: inside a
            `preserve-3d` context, painting order follows 3D position rather
            than z-index, so they would render behind the card.
          */}
          <div className="fb-float pointer-events-none absolute -left-8 bottom-[18%] z-30 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 shadow-[var(--shadow-pop)] sm:flex">
            <TruckIcon className="h-4 w-4 shrink-0 text-[var(--action)]" />
            <span className="whitespace-nowrap text-[12px] font-semibold">
              {t("common.minShort", { n: brand.delivery.windowMinutes })}
            </span>
          </div>
          <div
            className="fb-float pointer-events-none absolute -right-8 top-[10%] z-30 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 shadow-[var(--shadow-pop)] sm:flex"
            style={{ animationDelay: "1.6s" }}
          >
            <LeafIcon className="h-4 w-4 shrink-0 text-[#4f9a72]" />
            <span className="whitespace-nowrap text-[12px] font-semibold">
              {t("marquee.freshDaily")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
