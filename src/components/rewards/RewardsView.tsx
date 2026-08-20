"use client";

import { useCallback, useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { LANGUAGE_CHANGE_EVENT, LANGUAGE_STORAGE_KEY } from "@/lib/i18n";
import { translations } from "@/lib/translations";

type RewardsLocale = keyof typeof translations;

function readPersistedLocale(): RewardsLocale {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored && stored in translations ? (stored as RewardsLocale) : "en";
}

export function RewardsView() {
  const [locale, setLocale] = useState<RewardsLocale>("en");
  const t = useCallback(
    (key: string) => translations[locale][key] ?? translations.en[key] ?? key,
    [locale],
  );

  useEffect(() => {
    const syncLocale = () => setLocale(readPersistedLocale());
    syncLocale();
    window.addEventListener(LANGUAGE_CHANGE_EVENT, syncLocale);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, syncLocale);
  }, []);

  const tiers = [
    { n: 1, label: t("rewards.tier1Label"), note: t("rewards.tier1Note"), pct: "1%", active: true },
    { n: 2, label: t("rewards.tier2Label"), note: "", pct: "3%" },
    { n: 3, label: t("rewards.tier3Label"), note: "", pct: "5%" },
    { n: 4, label: t("rewards.tier4Label"), note: t("rewards.tier4Note"), pct: "8%" },
  ];

  useEffect(() => {
    document.title = `${t("rewards.metaTitle")} · Flower's Boutique`;
  }, [t]);

  return (
    <div className="container-fb pt-6 pb-20 sm:pb-28">
      <Breadcrumbs items={[{ label: t("rewards.breadcrumbHome"), href: "/" }, { label: t("rewards.breadcrumbCurrent") }]} />
      <h1 className="font-display mt-4 text-[30px] leading-none sm:text-[40px]">{t("rewards.title")}</h1>
      <p className="mt-3 max-w-[60ch] text-[14px] text-[var(--muted)]">{t("rewards.intro")}</p>

      <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--green)] p-6 text-[var(--green-ink)] sm:p-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.16em] text-white/60">{t("rewards.balanceLabel")}</p>
            <p className="mt-2 text-[40px] font-bold leading-none">
              0 <span className="text-[16px] font-medium text-white/70">{t("rewards.balanceUnit")}</span>
            </p>
            <p className="mt-3 max-w-[42ch] text-[13px] leading-relaxed text-white/75">{t("rewards.balanceDescription")}</p>
          </div>
          <div className="md:pl-6">
            <p className="text-[13px] text-white/85">{t("rewards.progress")}</p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[6%] rounded-full bg-[#7fd6a6]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="eyebrow mb-1">{t("rewards.tiersEyebrow")}</p>
        <p className="mb-4 text-[13px] text-[var(--muted)]">{t("rewards.tiersDescription")}</p>
        <ul className="divide-y rounded-[var(--radius-lg)] border bg-[var(--surface)]">
          {tiers.map((tier) => (
            <li key={tier.n} className="flex items-center gap-4 px-5 py-4">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold ${
                  tier.active ? "bg-[var(--action)] text-white" : "border border-[var(--line-strong)] text-[var(--muted)]"
                }`}
              >
                {tier.n}
              </span>
              <span className="flex-1 text-[14px] font-semibold">
                {tier.label}
                {tier.note ? <span className="ml-2 text-[12.5px] font-normal text-[var(--muted)]">{tier.note}</span> : null}
              </span>
              <span className={`text-[15px] font-bold tabular-nums ${tier.active ? "text-[var(--action)]" : "text-[var(--ink)]"}`}>
                {tier.pct}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <p className="eyebrow mb-2">{t("rewards.exampleEyebrow")}</p>
        <div className="rounded-[var(--radius-lg)] bg-[var(--surface-warm)] p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-black/10 py-2 text-[14px]">
            <span className="text-[var(--muted)]">{t("rewards.exampleOrderTotal")}</span>
            <span className="tabular-nums">200 ₾</span>
          </div>
          <div className="flex items-center justify-between border-b border-black/10 py-2 text-[14px]">
            <span className="text-[var(--muted)]">{t("rewards.exampleCashback")}</span>
            <span className="font-semibold text-[var(--green)] tabular-nums">{t("rewards.examplePetals")}</span>
          </div>
          <div className="flex items-center justify-between py-2 text-[15px] font-semibold">
            <span>{t("rewards.exampleEffectiveCost")}</span>
            <span className="tabular-nums">194 ₾</span>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted-2)]">{t("rewards.disclaimer")}</p>
      </div>

      <div className="mt-8">
        <Button href="/catalog" variant="primary" size="lg">{t("rewards.cta")}</Button>
      </div>
    </div>
  );
}
