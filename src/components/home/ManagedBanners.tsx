"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type ManagedBanner = {
  id: string;
  titleKa: string;
  titleEn: string;
  subtitleKa: string;
  subtitleEn: string;
  ctaLabelKa: string;
  ctaLabelEn: string;
  ctaHref: string;
  imageUrl: string;
};

export function ManagedBanners({ banners }: { banners: ManagedBanner[] }) {
  const { lang } = useI18n();
  if (!banners.length) return null;

  return <section aria-label="Storefront promotions" className="container-fb mt-8 grid gap-4 sm:mt-10">
    {banners.map((banner) => {
      const title = lang === "ka" ? banner.titleKa : banner.titleEn;
      const subtitle = lang === "ka" ? banner.subtitleKa : banner.subtitleEn;
      const cta = lang === "ka" ? banner.ctaLabelKa : banner.ctaLabelEn;
      return <article key={banner.id} className="grid overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-sand)] shadow-[var(--shadow-card)] md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col items-start justify-center px-6 py-8 sm:px-9 sm:py-10">
          <p className="eyebrow">Flower&rsquo;s Boutique</p>
          <h2 className="font-display mt-3 max-w-[16ch] text-[30px] leading-[0.98] sm:text-[40px]">{title}</h2>
          {subtitle ? <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-[var(--muted)]">{subtitle}</p> : null}
          {cta ? <Link href={banner.ctaHref || "/catalog"} className="mt-6 inline-flex min-h-11 items-center rounded-[var(--radius)] bg-[var(--ink)] px-5 text-[13px] font-semibold text-white transition hover:bg-[var(--action-deep)]">{cta}</Link> : null}
        </div>
        {banner.imageUrl ? <div className="relative min-h-60 bg-[var(--surface-warm)]"><Image src={banner.imageUrl} alt="" fill unoptimized={banner.imageUrl.startsWith("/manus-storage/")} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div> : null}
      </article>;
    })}
  </section>;
}
