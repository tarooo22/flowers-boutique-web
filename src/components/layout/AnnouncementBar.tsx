"use client";

import { useI18n } from "@/lib/i18n";

/** Thin dark strip at the very top of every page. */
export function AnnouncementBar() {
  const { t } = useI18n();
  const items = [t("ann.1"), t("ann.2"), t("ann.3"), t("ann.4")];

  return (
    <div className="bg-[var(--ink)] text-white">
      <div className="container-fb flex h-[35px] items-center justify-center overflow-hidden">
        <p className="mono truncate text-[11px] font-medium tracking-[0.02em] text-white/90">
          {items.join("  ·  ")}
        </p>
      </div>
    </div>
  );
}
