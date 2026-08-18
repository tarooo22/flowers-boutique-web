"use client";

import { brand } from "@/config/brand";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, WhatsappIcon } from "@/components/ui/Icons";

/** Dark pre-footer call-to-action strip (call / WhatsApp). */
export function ContactStrip() {
  const { t } = useI18n();
  return (
    <section className="container-fb relative z-10 -mb-10 translate-y-10">
      <div className="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] bg-[var(--ink)] px-6 py-5 text-white shadow-[var(--shadow-float)] sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="font-display text-[19px] leading-tight">{t("cs.title")}</p>
          <p className="mt-1 flex items-center gap-2 text-[12.5px] text-white/60">
            <span className="inline-block h-2 w-2 rounded-full bg-[#3ddc84]" />
            {t("cs.openNow")} · {brand.hours}
          </p>
        </div>
        <div className="flex w-full gap-2.5 sm:w-auto">
          <Button href={brand.phoneHref} variant="light" className="flex-1 sm:flex-none">
            <PhoneIcon className="h-4 w-4" />
            {t("cs.call")}
          </Button>
          <a
            href={brand.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[#25D366] px-6 text-[13.5px] font-semibold text-white transition hover:bg-[#1eb85a] sm:flex-none"
          >
            <WhatsappIcon className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
