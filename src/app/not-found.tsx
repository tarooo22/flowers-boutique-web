"use client";

import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="container-fb flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
      <p className="mono text-[12px] uppercase tracking-[0.2em] text-[var(--muted)]">{t("notFound.eyebrow")}</p>
      <h1 className="font-display mt-3 text-[40px] leading-none sm:text-[56px]">{t("notFound.title")}</h1>
      <p className="mt-3 max-w-[42ch] text-[14px] text-[var(--muted)]">{t("notFound.copy")}</p>
      <div className="mt-7 flex gap-3">
        <Button href="/" variant="primary">{t("notFound.home")}</Button>
        <Button href="/catalog" variant="outline">{t("notFound.catalog")}</Button>
      </div>
    </div>
  );
}
