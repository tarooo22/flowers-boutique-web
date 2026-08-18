"use client";

import Link from "next/link";
import { ArrowRight } from "./Icons";
import { useI18n } from "@/lib/i18n";

interface Props {
  title: string;
  eyebrow?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

/** Section heading row: display title on the left, optional "view all" link on the right. */
export function SectionHeader({
  title,
  eyebrow,
  viewAllHref,
  viewAllLabel,
  className = "",
}: Props) {
  const { t } = useI18n();
  return (
    <div className={`mb-5 flex items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow ? <div className="eyebrow mb-2">{eyebrow}</div> : null}
        <h2 className="font-display text-[24px] leading-tight tracking-[-0.01em] text-[var(--ink)] sm:text-[28px]">
          {title}
        </h2>
      </div>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--action)]"
        >
          {viewAllLabel ?? t("common.viewAll")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
