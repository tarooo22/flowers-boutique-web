"use client";

import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Button } from "@/components/ui/Button";
import { HeartIcon } from "@/components/ui/Icons";

export function FavoritesView() {
  const { favorites, hydrated, getProduct } = useStore();
  const { t } = useI18n();
  const items = favorites
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="container-fb pt-8 pb-20 sm:pb-28">
      <h1 className="font-display text-[32px] leading-none tracking-[-0.015em] sm:text-[40px]">
        {t("wishlist.title")}
      </h1>
      <p className="mt-2 text-[13px] text-[var(--muted)]">
        {hydrated ? t("wishlist.saved", { n: items.length }) : " "}
      </p>

      <div className="mt-8">
        {!hydrated ? null : items.length ? (
          <ProductGrid products={items} />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--surface-warm)]">
              <HeartIcon className="h-7 w-7 text-[var(--muted)]" />
            </div>
            <div>
              <p className="font-display text-[18px]">{t("wishlist.empty")}</p>
              <p className="mt-1 text-[13px] text-[var(--muted)]">{t("wishlist.emptyHint")}</p>
            </div>
            <Button href="/catalog" variant="dark">
              {t("common.browseBouquets")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
