"use client";

import { useMemo, useState } from "react";
import {
  wrappers,
  ribbons,
  getWrapper,
  MAX_PER_FLOWER,
  MAX_STEMS,
} from "@/data/builder";
import type { SelectedStem, WrapMode } from "@/lib/bouquetLayout";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { BouquetCanvas } from "./BouquetCanvas";
import { Button } from "@/components/ui/Button";
import { PlusIcon, MinusIcon, CloseIcon } from "@/components/ui/Icons";
import type { LiveBuilderFlower } from "./AIBouquet";

export function VisualBuilder({ flowers }: { flowers: LiveBuilderFlower[] }) {
  const { t } = useI18n();
  const { addCustomBouquet } = useStore();

  const [counts, setCounts] = useState<Partial<Record<string, number>>>({});
  const [wrapperId, setWrapperId] = useState(wrappers[0].id);
  const [ribbonId, setRibbonId] = useState(ribbons[0].id);
  const [wrapMode, setWrapMode] = useState<WrapMode>("paper");

  const stems: SelectedStem[] = useMemo(
    () =>
      flowers
        .filter((f) => (counts[f.key] ?? 0) > 0)
        .map((f) => ({ key: f.key, asset: f.asset, quantity: counts[f.key] ?? 0 })),
    [counts, flowers],
  );

  const totalStems = stems.reduce((s, x) => s + x.quantity, 0);
  const flowersTotal = flowers.reduce(
    (sum, f) => sum + f.price * (counts[f.key] ?? 0),
    0,
  );
  const wrapTotal = wrapMode === "paper" ? getWrapper(wrapperId).price : 0;
  const total = flowersTotal + wrapTotal;

  const setCount = (key: string, next: number) => {
    const clamped = Math.max(0, Math.min(MAX_PER_FLOWER, next));
    const others = totalStems - (counts[key] ?? 0);
    if (others + clamped > MAX_STEMS) return;
    setCounts((prev) => ({ ...prev, [key]: clamped }));
  };

  const resetBuilder = () => {
    setCounts({});
    setWrapperId(wrappers[0].id);
    setRibbonId(ribbons.find((ribbon) => ribbon.id === "burgundy")?.id ?? ribbons[0].id);
    setWrapMode("paper");
  };

  const handleAdd = () => {
    if (totalStems === 0) return;
    addCustomBouquet({
      kind: "visual",
      stems: flowers
        .filter((f) => (counts[f.key] ?? 0) > 0)
        .map((f) => ({ key: f.key, quantity: counts[f.key] ?? 0 })),
      wrapperId: wrapMode === "paper" ? wrapperId : null,
      ribbonId,
      price: total,
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
      {/* preview */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="eyebrow">{t("builder.tabVisual")}</p>
          <button
            type="button"
            onClick={resetBuilder}
            disabled={
              totalStems === 0 &&
              wrapperId === wrappers[0].id &&
              ribbonId === (ribbons.find((ribbon) => ribbon.id === "burgundy")?.id ?? ribbons[0].id) &&
              wrapMode === "paper"
            }
            className="rounded-full border border-[var(--line-strong)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("builder.clear")}
          </button>
        </div>
        <BouquetCanvas
          wrapperId={wrapperId}
          ribbonId={ribbonId}
          stems={stems}
          wrapMode={wrapMode}
        />
      </div>

      {/* controls */}
      <div>
        {/* flowers */}
        <h2 className="font-display text-[20px]">{t("builder.flowers")}</h2>
        {flowers.length === 0 ? <p role="status" className="mt-3 rounded-[var(--radius)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-sand)] px-4 py-3 text-[13px] text-[var(--muted)]">{t("builder.catalogUnavailable")}</p> : <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {flowers.map((f) => {
            const count = counts[f.key] ?? 0;
            const active = count > 0;
            return (
              <li
                key={f.key}
                className={`flex items-center gap-3 rounded-[var(--radius)] border p-2.5 transition ${
                  active
                    ? "border-[var(--ink)] bg-white"
                    : "border-[var(--line-strong)] bg-[var(--surface-sand)]/60 hover:border-[var(--ink)]"
                }`}
              >
                <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.asset}
                    alt=""
                    className="h-11 w-11 object-contain object-top"
                    style={{ objectPosition: "50% 8%" }}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold">
                    {f.name}
                  </span>
                  <span className="block text-[12px] text-[var(--muted)]">
                    {formatPrice(f.price)} · {t("builder.perStem")}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`− ${f.name}`}
                    disabled={count === 0}
                    onClick={() => setCount(f.key, count - 1)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line-strong)] transition hover:border-[var(--ink)] disabled:opacity-30"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="mono w-6 text-center text-[13px] font-semibold tabular-nums">
                    {count}
                  </span>
                  <button
                    type="button"
                    aria-label={`+ ${f.name}`}
                    disabled={totalStems >= MAX_STEMS}
                    onClick={() => setCount(f.key, count + 1)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line-strong)] transition hover:border-[var(--ink)] disabled:opacity-30"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>}

        {/* wrap mode */}
        <div className="mt-7 flex items-center gap-2">
          {(["paper", "ribbonOnly"] as WrapMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={wrapMode === mode}
              onClick={() => setWrapMode(mode)}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
                wrapMode === mode
                  ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                  : "border-[var(--line-strong)] hover:border-[var(--ink)]"
              }`}
            >
              {mode === "paper" ? t("builder.paper") : t("builder.ribbonOnly")}
            </button>
          ))}
        </div>

        {/* wrapper colours */}
        {wrapMode === "paper" && (
          <div className="mt-6">
            <h3 className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              {t("builder.wrapping")}
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {wrappers.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  aria-pressed={wrapperId === w.id}
                  aria-label={t(`builder.color.${w.id}`)}
                  onClick={() => setWrapperId(w.id)}
                  className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[12.5px] font-semibold transition ${
                    wrapperId === w.id
                      ? "border-[var(--ink)] bg-white"
                      : "border-[var(--line-strong)] hover:border-[var(--ink)]"
                  }`}
                >
                  <span
                    className="h-6 w-6 rounded-full border border-black/10"
                    style={{ background: w.color }}
                  />
                  {t(`builder.color.${w.id}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ribbons */}
        <div className="mt-6">
          <h3 className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t("builder.ribbon")}
          </h3>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {ribbons.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={ribbonId === r.id}
                aria-label={t(`builder.color.${r.id}`)}
                onClick={() => setRibbonId(r.id)}
                className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[12.5px] font-semibold transition ${
                  ribbonId === r.id
                    ? "border-[var(--ink)] bg-white"
                    : "border-[var(--line-strong)] hover:border-[var(--ink)]"
                }`}
              >
                <span
                  className="h-6 w-6 rounded-full border border-black/10"
                  style={{ background: r.color }}
                />
                {t(`builder.color.${r.id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* summary */}
        <div className="mt-8 rounded-[var(--radius-lg)] border bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[17px]">{t("builder.summary")}</h3>
            {totalStems > 0 && (
              <button
                onClick={resetBuilder}
                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--muted)] hover:text-[var(--action-deep)]"
              >
                <CloseIcon className="h-3.5 w-3.5" />
                {t("builder.clear")}
              </button>
            )}
          </div>

          <dl className="mt-3 grid gap-1.5 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">
                {t("builder.flowersTotal")} · {t("builder.stems", { n: totalStems })}
              </dt>
              <dd className="tabular-nums">{formatPrice(flowersTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">{t("builder.wrapTotal")}</dt>
              <dd className="tabular-nums">
                {wrapTotal ? formatPrice(wrapTotal) : "—"}
              </dd>
            </div>
            <div className="mt-1 flex justify-between border-t pt-2.5 text-[16px] font-semibold">
              <dt>{t("common.total")}</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="mt-4"
            disabled={totalStems === 0}
            onClick={handleAdd}
          >
            {t("builder.addToCart")}
          </Button>
          {totalStems === 0 && (
            <p className="mt-2 text-center text-[12px] text-[var(--muted-2)]">
              {t("builder.minStems")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
