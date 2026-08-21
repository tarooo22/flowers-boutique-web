"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { MAX_PER_FLOWER, MAX_STEMS } from "@/data/builder";
import { Button } from "@/components/ui/Button";
import { PlusIcon, MinusIcon, CloseIcon, LeafIcon, StarIcon } from "@/components/ui/Icons";

/** flat styling fee on top of the stems, matching the studio service */
const STYLING_FEE = 20;
const MIN_GENERATION_DURATION_MS = 5_000;

export type LiveBuilderFlower = { key: string; name: string; price: number; asset: string };

export function AIBouquet({ flowers }: { flowers: LiveBuilderFlower[] }) {
  const { t } = useI18n();
  const { addCustomBouquet } = useStore();

  const [counts, setCounts] = useState<Partial<Record<string, number>>>({});
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState<"live" | "demo" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  /** the selection the current image was generated for */
  const [generatedFor, setGeneratedFor] = useState<string | null>(null);
  const [onlySelected, setOnlySelected] = useState(false);

  const selected = useMemo(
    () => flowers.filter((f) => (counts[f.key] ?? 0) > 0),
    [counts, flowers],
  );
  const totalStems = selected.reduce((s, f) => s + (counts[f.key] ?? 0), 0);
  const flowersTotal = selected.reduce((s, f) => s + f.price * (counts[f.key] ?? 0), 0);
  const total = totalStems > 0 ? flowersTotal + STYLING_FEE : 0;

  /** fingerprint of the current selection + note */
  const fingerprint = useMemo(
    () =>
      selected.map((f) => `${f.key}:${counts[f.key]}`).join("|") + `::${note.trim()}`,
    [selected, counts, note],
  );
  const stale = Boolean(image) && generatedFor !== null && generatedFor !== fingerprint;
  const hasFreshResult = Boolean(image) && !stale;

  // rotate the progress messages while generating
  useEffect(() => {
    if (!loading) {
      // reset the progress copy once generation finishes
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(0);
      return;
    }
    const id = window.setInterval(() => setStep((s) => (s + 1) % 3), 1800);
    return () => window.clearInterval(id);
  }, [loading]);

  const setCount = (key: string, next: number) => {
    const clamped = Math.max(0, Math.min(MAX_PER_FLOWER, next));
    const others = totalStems - (counts[key] ?? 0);
    if (others + clamped > MAX_STEMS) return;
    setCounts((prev) => ({ ...prev, [key]: clamped }));
  };

  const generate = async () => {
    if (totalStems === 0) {
      setError(t("ai.needFlowers"));
      return;
    }
    setLoading(true);
    setError(null);
    const snapshot = fingerprint;
    const generationStartedAt = Date.now();
    try {
      const res = await fetch("/api/bouquet/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowers: selected.map((f) => ({
            name: f.name,
            quantity: counts[f.key] ?? 0,
          })),
          note: note.trim(),
        }),
      });
      const data = (await res.json()) as {
        mode?: "live" | "demo";
        image?: string;
      };
      if (!res.ok || !data.image) {
        setError(t("builder.aiError"));
        return;
      }
      const remainingDuration = Math.max(0, MIN_GENERATION_DURATION_MS - (Date.now() - generationStartedAt));
      if (remainingDuration) {
        await new Promise((resolve) => window.setTimeout(resolve, remainingDuration));
      }
      setImage(data.image);
      setMode(data.mode ?? "demo");
      setGeneratedFor(snapshot);
    } catch {
      setError(t("builder.aiError"));
    } finally {
      setLoading(false);
    }
  };

  const visible = onlySelected ? selected : flowers;
  const steps = [t("ai.step1"), t("ai.step2"), t("ai.step3")];
  const previewCardWidth =
    selected.length <= 4 ? "23%" : selected.length <= 10 ? "16%" : selected.length <= 24 ? "11.5%" : "9%";
  const circularPreview = selected.map((flower, index) => {
    const ring = Math.floor(index / 10);
    const indexInRing = index % 10;
    const flowersInRing = Math.min(10, selected.length - ring * 10);
    const radius = selected.length === 1 ? 0 : Math.min(46, selected.length <= 10 ? 32 : 18 + ring * 9);
    const angle = (indexInRing / flowersInRing) * Math.PI * 2 - Math.PI / 2;
    return {
      flower,
      index,
      left: `${50 + Math.cos(angle) * radius}%`,
      top: `${50 + Math.sin(angle) * radius}%`,
    };
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
      {/* ---------- preview stage ---------- */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[24px] border border-[var(--line)] bg-[radial-gradient(circle_at_50%_20%,#fff_0%,#fbf7f0_45%,#f0e7d9_100%)]">
          {image && !stale ? (
            <Image
              src={image}
              alt={t("builder.aiResult")}
              fill
              sizes="(max-width:1024px) 92vw, 520px"
              className={`object-cover transition-opacity duration-500 ${stale ? "opacity-60" : ""}`}
              unoptimized={image.startsWith("data:") || image.startsWith("/manus-storage/")}
            />
          ) : selected.length ? (
            <div
              data-testid="ai-composition-preview"
              aria-label={t("ai.selectFlowers")}
              className={`absolute inset-[7%] overflow-hidden rounded-full border border-white/80 bg-white/30 shadow-inner ${loading ? "fb-bouquet-stage--generating" : ""}`}
            >
              <span className="absolute inset-[14%] rounded-full border border-dashed border-[var(--action)]/25" aria-hidden="true" />
              <span className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.18)_70%)]" aria-hidden="true" />
              {circularPreview.map(({ flower: f, index, left, top }) => (
                <div
                  key={f.key}
                  data-testid="ai-composition-cell"
                  className="fb-bouquet-card absolute aspect-[3/4] overflow-hidden rounded-[14px] border border-white/85 bg-white/85 shadow-[0_10px_20px_rgba(65,41,27,0.13)]"
                  style={{
                    left,
                    top,
                    width: previewCardWidth,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${Math.min(index * 75, 900)}ms`,
                    zIndex: index + 2,
                  }}
                >
                  <Image
                    src={f.asset}
                    alt={f.name}
                    fill
                    sizes="(max-width: 640px) 20vw, 92px"
                    className="object-contain p-[8%]"
                    unoptimized
                  />
                  <span className="mono absolute right-1 top-1 rounded-full bg-[var(--ink)] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                    {counts[f.key]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-full place-items-center px-8 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/80">
                  <LeafIcon className="h-6 w-6 text-[var(--action)]" />
                </div>
                <p className="mt-4 max-w-[26ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
                  {t("ai.noSelection")}
                </p>
              </div>
            </div>
          )}

          {/* generating overlay */}
          {loading ? (
            <div aria-busy="true" className="absolute inset-0 grid place-items-center bg-[var(--ink)]/18 backdrop-blur-[1px]">
              <div className="rounded-full border border-white/70 bg-white/90 px-7 py-6 text-center shadow-[var(--shadow-float)]">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--line-strong)] border-t-[var(--action)]" />
                <p className="mt-4 text-[13.5px] font-semibold text-[var(--ink)]">
                  {steps[step]}
                </p>
                <div className="mt-3 flex justify-center gap-1.5">
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === step ? "w-6 bg-[var(--action)]" : "w-1.5 bg-[var(--line-strong)]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* stem badge */}
          {totalStems > 0 && !loading ? (
            <span className="absolute right-4 top-4 z-20 inline-flex items-center rounded-full border border-white/75 bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)] shadow-sm backdrop-blur">
              {t("builder.stems", { n: totalStems })}
            </span>
          ) : null}
        </div>

        {image && mode && !loading ? (
          <p className="mx-auto mt-3 max-w-[520px] rounded-lg bg-[var(--surface-sand)] px-4 py-2.5 text-[12px] leading-relaxed text-[var(--muted)]">
            {stale ? t("ai.outdated") : mode === "demo" ? t("builder.aiDemoNote") : t("builder.aiLiveNote")}
          </p>
        ) : null}
      </div>

      {/* ---------- controls ---------- */}
      <div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[20px]">{t("ai.selectFlowers")}</h2>
            <p className="mt-1 text-[12.5px] text-[var(--muted)]">{t("ai.selectHint")}</p>
          </div>
          {selected.length > 0 ? (
            <button
              onClick={() => setCounts({})}
              className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold text-[var(--muted)] hover:text-[var(--action-deep)]"
            >
              <CloseIcon className="h-3.5 w-3.5" />
              {t("builder.clear")}
            </button>
          ) : null}
        </div>

        {/* filter */}
        <div className="mt-3 flex gap-2">
          {[
            { id: false, label: t("ai.filterAll"), n: flowers.length },
            { id: true, label: t("ai.filterSelected"), n: selected.length },
          ].map((f) => (
            <button
              key={String(f.id)}
              onClick={() => setOnlySelected(f.id)}
              aria-pressed={onlySelected === f.id}
              disabled={f.id && selected.length === 0}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition disabled:opacity-40 ${
                onlySelected === f.id
                  ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                  : "border-[var(--line-strong)] hover:border-[var(--ink)]"
              }`}
            >
              {f.label} <span className="mono opacity-70">{f.n}</span>
            </button>
          ))}
        </div>

        {/* flower grid */}
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {visible.map((f) => {
            const count = counts[f.key] ?? 0;
            const active = count > 0;
            return (
              <li
                key={f.key}
                data-testid="ai-flower-option"
                className={`flex items-center gap-3 rounded-[var(--radius)] border p-2.5 transition ${
                  active
                    ? "border-[var(--ink)] bg-white shadow-[var(--shadow-card)]"
                    : "border-[var(--line-strong)] bg-[var(--surface-sand)]/60 hover:border-[var(--ink)]"
                }`}
              >
                <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md bg-white">
                  <Image
                    src={f.asset}
                    alt=""
                    width={44}
                      height={44}
                      className="h-11 w-11 object-contain object-top"
                      style={{ objectPosition: "50% 8%" }}
                      unoptimized
                  />
                  {active ? (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--action)]">
                      <StarIcon className="h-2.5 w-2.5 text-white" />
                    </span>
                  ) : null}
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
                    data-testid="ai-flower-increment"
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
        </ul>

        {/* style note */}
        <div className="mt-6">
          <label htmlFor="ai-note" className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t("ai.styleNote")}{" "}
            <span className="font-normal normal-case text-[var(--muted-2)]">
              ({t("ai.optional")})
            </span>
          </label>
          <textarea
            id="ai-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder={t("ai.stylePlaceholder")}
            className="mt-2 w-full rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-4 py-3 text-[14px] leading-relaxed outline-none transition focus:border-[var(--ink)]"
          />
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-[13px] font-semibold text-[var(--action-deep)]">
            {error}
          </p>
        ) : null}

        {/* summary */}
        <div className="mt-6 rounded-[var(--radius-lg)] border bg-[var(--surface)] p-5">
          <dl className="grid gap-1.5 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">
                {t("builder.flowersTotal")} · {t("builder.stems", { n: totalStems })}
              </dt>
              <dd className="tabular-nums">{formatPrice(flowersTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">{t("builder.tabAI")}</dt>
              <dd className="tabular-nums">{totalStems ? formatPrice(STYLING_FEE) : "—"}</dd>
            </div>
            <div className="mt-1 flex justify-between border-t pt-2.5 text-[16px] font-semibold">
              <dt>{t("common.total")}</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>

          <div className="mt-4 grid gap-2">
            <Button
              variant={hasFreshResult ? "outline" : "primary"}
              size="lg"
              fullWidth
              disabled={loading || totalStems === 0}
              onClick={generate}
            >
              {loading
                ? t("builder.aiGenerating")
                : image
                  ? t("builder.aiRegenerate")
                  : t("ai.generateFor")}
            </Button>

            {image && !stale ? (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() =>
                  addCustomBouquet({
                    kind: "ai",
                    image,
                    prompt:
                      selected
                        .map((f) => `${counts[f.key]}× ${f.name}`)
                        .join(", ") + (note.trim() ? ` — ${note.trim()}` : ""),
                    stems: selected.map((f) => ({
                      key: f.key,
                      quantity: counts[f.key] ?? 0,
                    })),
                    price: total,
                  })
                }
              >
                {t("builder.aiOrder")}
              </Button>
            ) : null}
          </div>

          {totalStems === 0 ? (
            <p className="mt-2 text-center text-[12px] text-[var(--muted-2)]">
              {t("ai.needFlowers")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
