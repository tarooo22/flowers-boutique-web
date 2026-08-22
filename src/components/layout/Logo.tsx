"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

interface Props {
  className?: string;
  onClick?: () => void;
  tone?: "coral" | "light";
}

/** Shared locale-aware Flower's Boutique wordmark lockup. */
export function Logo({ className = "", onClick, tone = "coral" }: Props) {
  const { lang } = useI18n();
  const primaryColor = tone === "light" ? "text-white group-hover:text-[var(--action)]" : "text-[var(--action-deep)] group-hover:text-[var(--action)]";
  const secondaryColor = tone === "light" ? "text-[var(--footer-muted)]" : "text-[var(--muted)]";
  const isGeorgian = lang === "ka";
  const primaryLabel = isGeorgian ? "ყვავილების" : "Flower's";
  const secondaryLabel = isGeorgian ? "ბუტიკი" : "Boutique";
  const homeLabel = isGeorgian ? "ყვავილების ბუტიკი — მთავარი" : "Flower's Boutique — home";
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={homeLabel}
      className={`group inline-flex flex-col leading-none ${className}`}
    >
      <span className={`font-display text-[18px] italic tracking-[-0.05em] transition-colors sm:text-[21px] ${primaryColor}`}>
        {primaryLabel}
      </span>
      <span className={`mono mt-0.5 text-[11px] font-semibold tracking-[0.12em] sm:text-[12px] ${secondaryColor}`}>
        {secondaryLabel}
      </span>
    </Link>
  );
}
