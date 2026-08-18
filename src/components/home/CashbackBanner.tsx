"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

/** Split promotional banner: image on the left, light-green content panel on the right. */
export function CashbackBanner() {
  const { t } = useI18n();
  return (
    <section className="container-fb pt-12 sm:pt-16">
      <Reveal direction="zoom">
        <div className="grid overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[180px] overflow-hidden md:min-h-full">
            <Image
              src="/manus-storage/editorial-collection_fd67f2f1.webp"
              alt="A gift bouquet"
              fill
              sizes="(max-width:768px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="bg-[var(--green-soft)] px-6 py-8 sm:px-10 sm:py-10">
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--green)]/70">
              {t("cb.eyebrow")}
            </p>
            <h2 className="font-display mt-2 max-w-[18ch] text-[26px] leading-tight tracking-[-0.01em] text-[var(--green)] sm:text-[30px]">
              {t("cb.title")}
            </h2>
            <p className="mt-3 max-w-[42ch] text-[13.5px] leading-relaxed text-[var(--green)]/80">
              {t("cb.text")}
            </p>
            <div className="mt-6">
              <Button href="/rewards" variant="dark">
                {t("cb.cta")}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
