"use client";

import { MinusIcon, PlusIcon } from "./Icons";

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  ariaLabel?: string;
}

export function QuantityControl({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  ariaLabel = "Quantity",
}: Props) {
  const dim = size === "sm" ? "h-8" : "h-11";
  const btn = size === "sm" ? "w-8" : "w-11";
  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center rounded-full border border-[var(--line-strong)] ${dim}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className={`grid ${btn} h-full place-items-center rounded-full text-[var(--ink)] transition hover:bg-black/5 disabled:opacity-30`}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span
        className="mono min-w-7 text-center text-[13px] font-semibold tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className={`grid ${btn} h-full place-items-center rounded-full text-[var(--ink)] transition hover:bg-black/5 disabled:opacity-30`}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
