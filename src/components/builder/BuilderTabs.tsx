"use client";
"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { CatalogBuilderFlower } from "@/lib/builderCatalog";
import { builderFlowers } from "@/data/builder";
import { VisualBuilder } from "./VisualBuilder";
import { AIBouquet } from "./AIBouquet";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type Tab = "visual" | "ai";

export function BuilderTabs({ aiFlowers }: { aiFlowers: CatalogBuilderFlower[] }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("visual");
  const legacyBuilderFlowers = builderFlowers.map((flower) => ({
    key: flower.key,
    name: t(`builder.flower.${flower.key}`),
    price: flower.price,
    asset: flower.asset,
  }));
  const aiPickerFlowers = aiFlowers.length ? aiFlowers : legacyBuilderFlowers;

  return (
    <div className="container-fb pt-6 pb-20 sm:pb-28">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: t("nav.builder") }]} />

      <div className="mt-4 max-w-[62ch]">
        <h1 className="font-display text-[32px] leading-none tracking-[-0.015em] sm:text-[40px]">
          {t("builder.title")}
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
          {t("builder.subtitle")}
        </p>
      </div>

      {/* tabs */}
      <div role="tablist" aria-label={t("builder.title")} className="mt-7 flex gap-2">
        {(["visual", "ai"] as Tab[]).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            id={`builder-tab-${value}`}
            aria-selected={tab === value}
            aria-controls={`builder-panel-${value}`}
            onClick={(event) => {
              event.preventDefault();
              setTab(value);
            }}
            className={`rounded-full border px-5 py-2.5 text-[13.5px] font-semibold transition ${
              tab === value
                ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                : "border-[var(--line-strong)] bg-[var(--surface-sand)] hover:border-[var(--ink)] hover:bg-white"
            }`}
          >
            {value === "visual" ? t("builder.tabVisual") : t("builder.tabAI")}
          </button>
        ))}
      </div>

      <p className="mt-2.5 text-[12.5px] text-[var(--muted-2)]">
        {tab === "visual" ? t("builder.visualHint") : t("builder.aiHint")}
      </p>

      <div className="mt-8">
        {tab === "visual" ? (
          <div role="tabpanel" id="builder-panel-visual" aria-labelledby="builder-tab-visual">
            <VisualBuilder flowers={legacyBuilderFlowers} />
          </div>
        ) : (
          <div role="tabpanel" id="builder-panel-ai" aria-labelledby="builder-tab-ai">
            <AIBouquet flowers={aiPickerFlowers} />
          </div>
        )}
      </div>
    </div>
  );
}
