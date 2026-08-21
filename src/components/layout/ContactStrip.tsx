"use client";

"use client";

import { useEffect, useState } from "react";
import { brand } from "@/config/brand";
import { useI18n } from "@/lib/i18n";
import { formatTbilisiTime, getTbilisiStoreStatus } from "@/lib/storeHours";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, WhatsappIcon } from "@/components/ui/Icons";

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
        <div className="grid lg:grid-cols-[1.16fr_0.84fr]">
          <div className="relative isolate overflow-hidden bg-[var(--ink)] px-6 py-6 text-white sm:px-8 sm:py-7">
            <div className="absolute -right-14 -top-20 h-52 w-52 rounded-full bg-[var(--action)]/20 blur-3xl" aria-hidden="true" />
            <div className="relative max-w-xl">
              <p className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">Flower&rsquo;s Boutique · Tbilisi studio</p>
              <h2 className="mt-3 font-display text-[25px] leading-[1.03] sm:text-[31px]">{t("cs.title")}</h2>
              <p className="mt-3 max-w-md text-[12.5px] leading-relaxed text-white/62">{t("cs.hours")}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5 bg-[var(--surface-sand)] px-6 py-6 sm:px-8 sm:py-7">
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
