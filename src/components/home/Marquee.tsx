"use client";

import { useI18n } from "@/lib/i18n";

/** Infinite scrolling brand band. Pauses on hover; static under reduced motion. */
export function Marquee() {
  const { t } = useI18n();
  const items = [
    t("marquee.freshDaily"),
    t("marquee.handTied"),
    t("marquee.delivery90"),
    t("marquee.seasonal"),
    t("marquee.cashback"),
    t("marquee.floristStudio"),
  ];
  // duplicated once so the -50% keyframe loops seamlessly
  const loop = [...items, ...items];

  return (
    <div
      className="fb-marquee mt-10 overflow-hidden border-y border-[var(--line-strong)] bg-[var(--ink)] py-3.5 text-white sm:mt-14"
      aria-hidden
    >
      <div className="fb-marquee-track">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="mono px-6 text-[12.5px] font-medium uppercase tracking-[0.16em] text-white/85">
              {item}
            </span>
            <span className="text-[var(--action)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
