"use client";

import { useCallback, useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { LANGUAGE_CHANGE_EVENT, LANGUAGE_STORAGE_KEY } from "@/lib/i18n";
import { translations } from "@/lib/translations";

type RewardsLocale = keyof typeof translations;
type FlowerCircleSummary = {
  eligibleSpend: number;
  eligibleOrderCount: number;
  currentLevelId: "first-bloom" | "studio-friend" | "season-regular" | "inner-circle";
  benefitPercent: number;
  nextLevelThreshold: number | null;
  remainingToNextLevel: number;
  progressPercent: number;
};

function readPersistedLocale(): RewardsLocale {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored && stored in translations ? (stored as RewardsLocale) : "en";
}

export function RewardsView() {
  const [locale, setLocale] = useState<RewardsLocale>("en");
  const [summary, setSummary] = useState<FlowerCircleSummary | null | undefined>(undefined);
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let value = translations[locale][key] ?? translations.en[key] ?? key;
      if (vars) for (const [name, replacement] of Object.entries(vars)) value = value.replace(new RegExp(`\\{${name}\\}`, "g"), String(replacement));
      return value;
    },
    [locale],
  );

  useEffect(() => {
    const syncLocale = () => setLocale(readPersistedLocale());
    syncLocale();
    window.addEventListener(LANGUAGE_CHANGE_EVENT, syncLocale);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, syncLocale);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/flower-circle", { cache: "no-store" })
      .then(async (response) => (response.ok ? response.json() : { summary: null }))
      .then((payload: { summary?: FlowerCircleSummary | null }) => {
        if (active) setSummary(payload.summary ?? null);
      })
      .catch(() => {
        if (active) setSummary(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const tiers = [
    { n: 1, id: "first-bloom", label: t("rewards.tier1Label"), threshold: t("rewards.tier1Threshold"), note: t("rewards.tier1Note"), pct: "1%" },
    { n: 2, id: "studio-friend", label: t("rewards.tier2Label"), threshold: t("rewards.tier2Threshold"), note: t("rewards.tier2Note"), pct: "2%" },
    { n: 3, id: "season-regular", label: t("rewards.tier3Label"), threshold: t("rewards.tier3Threshold"), note: t("rewards.tier3Note"), pct: "3%" },
    { n: 4, id: "inner-circle", label: t("rewards.tier4Label"), threshold: t("rewards.tier4Threshold"), note: t("rewards.tier4Note"), pct: "5%" },
  ];
  const memberSummary = summary ?? null;
  const currentTierIndex = memberSummary ? tiers.findIndex((tier) => tier.id === memberSummary.currentLevelId) : -1;
  const numberFormatter = new Intl.NumberFormat(locale === "ka" ? "ka-GE" : locale === "ru" ? "ru-RU" : "en-US", { maximumFractionDigits: 0 });

  useEffect(() => {
    document.title = `${t("rewards.metaTitle")} · Flower's Boutique`;
  }, [t]);

  return (
    <div className="container-fb pt-6 pb-20 sm:pb-28">
      <Breadcrumbs items={[{ label: t("rewards.breadcrumbHome"), href: "/" }, { label: t("rewards.breadcrumbCurrent") }]} />
      <p className="eyebrow mt-5">{t("rewards.eyebrow")}</p>
      <h1 className="font-display mt-2 max-w-[18ch] text-[32px] leading-[0.98] sm:text-[46px]">{t("rewards.title")}</h1>
      <p className="mt-4 max-w-[62ch] text-[14px] leading-relaxed text-[var(--muted)]">{t("rewards.intro")}</p>

      <section className="mt-8 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--green)] p-6 text-[var(--green-ink)] shadow-[var(--shadow-card)] sm:p-8" aria-labelledby="circle-balance">
        <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p id="circle-balance" className="mono text-[11px] uppercase tracking-[0.16em] text-white/60">{t("rewards.balanceLabel")}</p>
            <p className="mt-2 text-[46px] font-bold leading-none sm:text-[52px]">
              {summary === undefined ? "—" : `${memberSummary?.benefitPercent ?? 0}%`} <span className="text-[16px] font-medium text-white/70">{t("rewards.balanceUnit")}</span>
            </p>
            <p className="mt-3 max-w-[42ch] text-[13px] leading-relaxed text-white/75">{memberSummary ? t("rewards.memberSpend", { spend: numberFormatter.format(memberSummary.eligibleSpend), count: memberSummary.eligibleOrderCount }) : t("rewards.balanceDescription")}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-white/15 bg-white/8 px-5 py-4 md:min-w-[230px]">
            <p className="mono text-[10px] uppercase tracking-[0.15em] text-white/60">{t("rewards.maxBenefitLabel")}</p>
            <p className="mt-1 text-[30px] font-bold leading-none">{memberSummary ? `${memberSummary.benefitPercent}%` : "5%"}</p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-white/75">{memberSummary ? t("rewards.memberLevel") : t("rewards.maxBenefitDescription")}</p>
          </div>
        </div>
        <div className="mt-7 border-t border-white/15 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-white/85">
            <span>{memberSummary ? t("rewards.memberProgressLabel") : t("rewards.progressLabel")}</span>
            <span className="font-semibold text-white">{memberSummary?.nextLevelThreshold ? `${numberFormatter.format(memberSummary.nextLevelThreshold)} ₾` : t("rewards.maxLevel")}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuemin={0} aria-valuemax={memberSummary?.nextLevelThreshold ?? 8000} aria-valuenow={memberSummary?.eligibleSpend ?? 0} aria-label={t("rewards.progressLabel")}>
            <div className="h-full rounded-full bg-[#7fd6a6] transition-[width] duration-300" style={{ width: `${memberSummary?.progressPercent ?? 0}%` }} />
          </div>
          <p className="mt-3 text-[12px] text-white/62">{memberSummary ? memberSummary.nextLevelThreshold ? t("rewards.memberNextTier", { amount: numberFormatter.format(memberSummary.remainingToNextLevel) }) : t("rewards.memberAtMaximum") : t("rewards.nextTier")}</p>
        </div>
      </section>
      {summary === null ? <section className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] border bg-[var(--surface)] px-5 py-4"><p className="max-w-[56ch] text-[13px] leading-relaxed text-[var(--muted)]">{t("rewards.signInText")}</p><Button href="/account/login" variant="dark" size="sm">{t("rewards.signInCta")}</Button></section> : null}

      <section className="mt-10" aria-labelledby="circle-levels">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow mb-1">{t("rewards.tiersEyebrow")}</p>
            <h2 id="circle-levels" className="font-display text-[25px] leading-tight">{t("rewards.tiersTitle")}</h2>
          </div>
          <p className="max-w-[46ch] text-[13px] leading-relaxed text-[var(--muted)]">{t("rewards.tiersDescription")}</p>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier, index) => (
            <li key={tier.n} className={`relative overflow-hidden rounded-[var(--radius-md)] border p-5 ${index === currentTierIndex ? "border-[var(--green)] bg-[var(--green-soft)]" : "bg-[var(--surface)]"}`}>
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-8 w-8 place-items-center rounded-full text-[12px] font-bold ${index === currentTierIndex ? "bg-[var(--green)] text-white" : "border border-[var(--line-strong)] text-[var(--muted)]"}`}>{tier.n}</span>
                <span className={`text-[25px] font-bold leading-none tabular-nums ${index === currentTierIndex ? "text-[var(--action-deep)]" : "text-[var(--ink)]"}`}>{tier.pct}</span>
              </div>
              <p className="mt-6 text-[14px] font-semibold">{tier.label}</p>
              <p className="mt-1 text-[12.5px] text-[var(--muted)]">{tier.threshold}</p>
              <p className="mt-4 border-t border-black/8 pt-3 text-[12px] leading-relaxed text-[var(--muted)]">{tier.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[var(--radius-lg)] border bg-[var(--surface)] p-5 sm:p-6">
          <p className="eyebrow mb-2">{t("rewards.exampleEyebrow")}</p>
          <h2 className="font-display text-[25px] leading-tight">{t("rewards.exampleTitle")}</h2>
          <p className="mt-3 max-w-[42ch] text-[13px] leading-relaxed text-[var(--muted)]">{t("rewards.exampleDescription")}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-[var(--surface-warm)] p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-black/10 py-2 text-[14px]">
            <span className="text-[var(--muted)]">{t("rewards.exampleOrderTotal")}</span>
            <span className="tabular-nums">200 ₾</span>
          </div>
          <div className="flex items-center justify-between border-b border-black/10 py-2 text-[14px]">
            <span className="text-[var(--muted)]">{t("rewards.exampleCashback")}</span>
            <span className="font-semibold text-[var(--green)] tabular-nums">3%</span>
          </div>
          <div className="flex items-center justify-between py-2 text-[15px] font-semibold">
            <span>{t("rewards.exampleEffectiveCost")}</span>
            <span className="font-semibold text-[var(--green)] tabular-nums">{t("rewards.examplePetals")}</span>
          </div>
        </div>
      </section>
      <p className="mt-3 text-[12px] leading-relaxed text-[var(--muted-2)]">{t("rewards.disclaimer")}</p>

      <div className="mt-8">
        <Button href="/catalog" variant="primary" size="lg">{t("rewards.cta")}</Button>
      </div>
    </div>
  );
}
