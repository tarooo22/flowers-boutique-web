"use client";

"use client";

import { useEffect, useState } from "react";
import { brand } from "@/config/brand";
import { useI18n } from "@/lib/i18n";
import { formatTbilisiTime, getTbilisiStoreStatus } from "@/lib/storeHours";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, PinIcon, WhatsappIcon } from "@/components/ui/Icons";

/** Pre-footer contact panel with a live status calculated in the studio's timezone. */
export function ContactStrip() {
  const { lang, t } = useI18n();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(new Date());
    updateNow();
    const interval = window.setInterval(updateNow, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const status = now ? getTbilisiStoreStatus(now) : null;
  const isOpen = status?.isOpen ?? false;
  const locale = lang === "ka" ? "ka-GE" : lang === "ru" ? "ru-RU" : "en-GB";

  return (
    <section className="container-fb relative z-10 -mb-10 translate-y-10">
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--ink)]/10 bg-[var(--surface)] shadow-[var(--shadow-float)]">
        <div className="grid lg:grid-cols-[1.03fr_0.97fr]">
          <div className="relative min-h-[248px] overflow-hidden border-b border-[var(--line)] bg-[var(--surface-warm)] sm:min-h-[300px] lg:min-h-full lg:border-b-0 lg:border-r">
            <iframe
              title={`${brand.name} map`}
              src={brand.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.08]"
            />
            <a
              href={brand.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--ink)] px-4 text-[12.5px] font-semibold text-white shadow-[var(--shadow-float)] transition-colors duration-200 hover:bg-[var(--ink-soft)]"
            >
              <PinIcon className="h-4 w-4" />
              {t("about.getDirections")}
            </a>
          </div>
          <div className="flex flex-col justify-between gap-5 bg-[var(--surface-sand)] px-6 py-6 sm:px-8 sm:py-7">
            <div>
              <p className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Flower&rsquo;s Boutique · Tbilisi studio</p>
              <h2 className="mt-3 font-display text-[25px] leading-[1.03] text-[var(--ink)] sm:text-[31px]">{t("cs.title")}</h2>
              <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-[var(--muted)]">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--action)]" />
                {brand.addressFull}
              </p>
            </div>
            <div role="status" aria-live="polite" className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ring-4 ${isOpen ? "bg-[#28c76f] ring-[#28c76f]/15" : "bg-[var(--action)] ring-[var(--action)]/15"}`} aria-hidden="true" />
                <div>
                  <p className="text-[14px] font-bold text-[var(--ink)]">{status ? (isOpen ? t("cs.openNow") : t("cs.closedNow")) : t("cs.statusLoading")}</p>
                  <p className="mt-0.5 text-[11.5px] text-[var(--muted)]">{brand.hoursShort}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{t("cs.tbilisiTime")}</p>
                <p className="mono mt-1 text-[17px] font-bold tabular-nums text-[var(--ink)]">{now ? formatTbilisiTime(now, locale) : "--:--"}</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Button href={brand.phoneHref} variant="dark" className="w-full" aria-label={t("cs.call")}>
                <PhoneIcon className="h-4 w-4" />
                {t("cs.call")}
              </Button>
              <a
                href={brand.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[#25D366] px-5 text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-[#1eb85a]"
              >
                <WhatsappIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
