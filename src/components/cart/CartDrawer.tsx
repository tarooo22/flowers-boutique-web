"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/Button";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { CloseIcon, BagIcon, TruckIcon } from "@/components/ui/Icons";

export function CartDrawer() {
  const {
    cartOpen,
    closeCart,
    lines,
    customLines,
    subtotal,
    setQty,
    removeFromCart,
    setCustomQty,
    removeCustom,
    cartCount,
    getProduct,
    getUnitPrice,
  } = useStore();
  const { t } = useI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    if (cartOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, closeCart]);

  if (!cartOpen) return null;

  const freeFrom = brand.delivery.freeFrom;
  const remaining = Math.max(0, freeFrom - subtotal);
  const progress = Math.min(100, (subtotal / freeFrom) * 100);

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        aria-label="Close cart"
        className="fb-overlay absolute inset-0 bg-[var(--overlay)]"
        onClick={closeCart}
      />
      <aside className="fb-drawer absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-[var(--page)] shadow-[var(--shadow-pop)]">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-display text-[18px]">
            {t("cart.title")}{" "}
            <span className="mono text-[13px] font-medium text-[var(--muted)]">({cartCount})</span>
          </h2>
          <button
            aria-label="Close cart"
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
          >
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 && customLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--surface-warm)]">
              <BagIcon className="h-7 w-7 text-[var(--muted)]" />
            </div>
            <div>
              <p className="font-display text-[17px]">{t("cart.empty")}</p>
              <p className="mt-1 text-[13px] text-[var(--muted)]">{t("cart.emptyHint")}</p>
            </div>
            <Button href="/catalog" variant="dark" onClick={closeCart}>
              {t("common.browseBouquets")}
            </Button>
          </div>
        ) : (
          <>
            {/* free delivery progress */}
            <div className="border-b bg-[var(--surface-warm)] px-5 py-3">
              <p className="flex items-center gap-2 text-[12.5px] text-[var(--ink)]">
                <TruckIcon className="h-4 w-4 text-[var(--action)]" />
                {remaining > 0 ? (
                  <span>{t("cart.addForFree", { amount: formatPrice(remaining) })}</span>
                ) : (
                  <span>{t("cart.freeUnlocked")}</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[var(--action)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y overflow-y-auto px-5">
              {customLines.map((line) => (
                <li key={line.id} className="flex gap-3 py-4">
                  <div className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-lg bg-[var(--surface-warm)]">
                    {line.image ? (
                      <Image
                        src={line.image}
                        alt=""
                        fill
                        sizes="72px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                        {t("builder.tabVisual")}
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold">
                          {line.kind === "ai" ? t("builder.tabAI") : t("builder.tabVisual")}
                        </p>
                        <p className="truncate text-[12px] text-[var(--muted)]">
                          {line.kind === "ai"
                            ? line.prompt
                            : t("builder.stems", {
                                n: (line.stems ?? []).reduce((s, x) => s + x.quantity, 0),
                              })}
                        </p>
                      </div>
                      <button
                        aria-label="Remove item"
                        onClick={() => removeCustom(line.id)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--muted)] hover:bg-black/5"
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QuantityControl
                        size="sm"
                        value={line.quantity}
                        onChange={(q) => setCustomQty(line.id, q)}
                      />
                      <span className="mono text-[13px] font-semibold">
                        {formatPrice(line.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}

              {lines.map((line) => {
                const p = getProduct(line.productId);
                if (!p) return null;
                const variant = p.variants.find((v) => v.id === line.variantId);
                const unit = getUnitPrice(p, line.variantId);
                return (
                  <li key={`${line.productId}-${line.variantId}`} className="flex gap-3 py-4">
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={closeCart}
                      className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-lg bg-[var(--surface-warm)]"
                    >
                      <Image src={p.images[0]} alt={p.name} fill sizes="72px" unoptimized className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${p.slug}`}
                            onClick={closeCart}
                            className="block truncate text-[13.5px] font-semibold"
                          >
                            {p.name}
                          </Link>
                          {variant && variant.id !== "classic" ? (
                            <p className="text-[12px] text-[var(--muted)]">{variant.label}</p>
                          ) : (
                            <p className="text-[12px] text-[var(--muted-2)]">{p.subtitle}</p>
                          )}
                        </div>
                        <button
                          aria-label="Remove item"
                          onClick={() => removeFromCart(line.productId, line.variantId)}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--muted)] hover:bg-black/5"
                        >
                          <CloseIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <QuantityControl
                          size="sm"
                          value={line.quantity}
                          onChange={(q) => setQty(line.productId, line.variantId, q)}
                        />
                        <span className="mono text-[13px] font-semibold">
                          {formatPrice(unit * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t px-5 py-4">
              <div className="flex items-center justify-between pb-3">
                <span className="text-[13px] text-[var(--muted)]">{t("common.subtotal")}</span>
                <span className="mono text-[18px] font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="pb-3 text-[12px] text-[var(--muted-2)]">{t("cart.taxesNote")}</p>
              <Button href="/checkout" variant="primary" fullWidth onClick={closeCart}>
                {t("common.checkout")}
              </Button>
              <button
                onClick={closeCart}
                className="mt-2 w-full py-2 text-[13px] font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
              >
                {t("common.continueShopping")}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
