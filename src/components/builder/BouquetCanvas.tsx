"use client";

import { useMemo } from "react";
import { getRibbon, getWrapper } from "@/data/builder";
import {
  buildBouquetTokens,
  tokenVisuals,
  type SelectedStem,
  type WrapMode,
} from "@/lib/bouquetLayout";
import { useI18n } from "@/lib/i18n";

interface Props {
  wrapperId: string;
  ribbonId: string;
  stems: SelectedStem[];
  wrapMode: WrapMode;
}

/**
 * Renders the live bouquet: wrapper back → fanned stems → paper masks →
 * wrapper front → ribbon. Plain <img> is used rather than next/image because
 * every layer is transform-animated on each interaction.
 */
export function BouquetCanvas({ wrapperId, ribbonId, stems, wrapMode }: Props) {
  const { t } = useI18n();
  const wrapper = getWrapper(wrapperId);
  const ribbon = getRibbon(ribbonId);
  const tokens = useMemo(() => buildBouquetTokens(stems), [stems]);
  const total = tokens.length;
  const ribbonOnly = wrapMode === "ribbonOnly";

  return (
    <div
      role="img"
      aria-label={t("builder.canvasAlt", { n: total })}
      data-stem-count={total}
      className={`relative isolate mx-auto aspect-[1122/1402] w-full max-w-[520px] overflow-hidden rounded-[24px] border border-[var(--line)] ${
        ribbonOnly
          ? "bg-[radial-gradient(circle_at_50%_24%,#fff_0%,#fbf7f0_48%,#efe6d9_100%)]"
          : "bg-[#f7f4ef]"
      }`}
    >
      {!ribbonOnly && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={wrapper.back}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-contain"
        />
      )}

      {/* stems */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-visible transition-transform duration-300"
        style={{
          transform: ribbonOnly ? "translateY(1.5%) scale(0.96)" : "translateY(5.5%) scale(0.92)",
          transformOrigin: "50% 34%",
        }}
      >
        {tokens.map((token) => {
          const v = tokenVisuals(token, total, wrapMode);
          return (
            <div
              key={token.id}
              className="absolute h-[43%] w-[38%] transition-transform duration-300"
              style={{
                left: "50%",
                top: "72%",
                zIndex: token.zIndex,
                transform: `translate(-50%, -100%) rotate(${v.angle.toFixed(2)}deg) scale(${v.scale.toFixed(3)})`,
                transformOrigin: "50% 100%",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={token.asset}
                alt=""
                draggable={false}
                className="absolute left-1/2 w-auto max-w-none select-none object-contain object-top"
                style={{
                  top: `calc(-42% + ${v.reachDrop.toFixed(2)}%)`,
                  height: "158%",
                  transform: `translateX(-50%) scale(${token.speciesScale})`,
                  transformOrigin: `50% ${token.scaleAnchor * 100}%`,
                  clipPath: ribbonOnly ? undefined : `inset(0 0 ${v.clipBottom.toFixed(2)}% 0)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* paper masks that hide stem ends behind the cone */}
      {!ribbonOnly && total > 0 && (
        <>
          {[
            "inset(72% 0 0 0)",
            "polygon(0 55%, 26% 55%, 36% 62%, 50% 72%, 60% 84%, 55% 100%, 0 100%)",
            "polygon(100% 55%, 74% 55%, 64% 62%, 50% 72%, 40% 84%, 45% 100%, 100% 100%)",
          ].map((clip) => (
            <div
              key={clip}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[25] bg-[#f7f4ef] bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${wrapper.back}")`, clipPath: clip }}
            />
          ))}
        </>
      )}

      {!ribbonOnly && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={wrapper.front}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute inset-0 z-30 h-full w-full select-none object-contain"
        />
      )}

      {ribbonOnly && total > 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[73.5%] z-[35] h-5 w-[22%] -translate-x-1/2 rounded-full bg-[#49392d]/12 blur-md"
        />
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ribbon.asset}
        alt=""
        aria-hidden
        draggable={false}
        className={`pointer-events-none absolute left-1/2 z-40 -translate-x-1/2 -translate-y-1/4 select-none object-contain drop-shadow-[0_10px_14px_rgba(65,41,27,0.16)] ${
          ribbonOnly ? "top-[73.8%] w-[21%]" : "top-[72%] w-[23%]"
        }`}
      />

      {total === 0 ? (
        <div className="pointer-events-none absolute left-1/2 top-[31%] z-50 -translate-x-1/2 text-center">
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-white/75 bg-white/85 px-4 py-2 text-[12px] font-medium text-[var(--muted)] shadow-sm backdrop-blur">
            {t("builder.emptyHint")}
          </span>
        </div>
      ) : (
        <div className="pointer-events-none absolute right-4 top-4 z-50">
          <span className="inline-flex items-center rounded-full border border-white/75 bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)] shadow-sm backdrop-blur">
            {t("builder.stems", { n: total })}
          </span>
        </div>
      )}

      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-[4%] z-50 h-8 rounded-[50%] bg-[#7e5d42]/10 blur-xl ${
          ribbonOnly ? "inset-x-[31%]" : "inset-x-[17%]"
        }`}
      />
    </div>
  );
}
