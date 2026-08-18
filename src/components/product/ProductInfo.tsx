"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/Button";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { TruckIcon, LeafIcon, ChevronDown } from "@/components/ui/Icons";

export function ProductInfo({ product: base }: { product: Product }) {
  const { addToCart, withOverrides, getUnitPrice } = useStore();
  const { t } = useI18n();
  const product = withOverrides(base);
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);

  const price = getUnitPrice(product, variantId);

  return (
    <div className="flex flex-col">
      <p className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
        {product.colors.join(" · ")}
      </p>
      <h1 className="font-display mt-2 text-[28px] leading-tight sm:text-[34px]">{product.name}</h1>
      {product.subtitle ? (
        <p className="mt-1.5 text-[14px] text-[var(--muted)]">{product.subtitle}</p>
      ) : null}

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-[24px] font-semibold text-[var(--ink)] tabular-nums">
          {formatPrice(price)}
        </span>
        {product.compareAt && product.compareAt > product.price ? (
          <span className="text-[15px] text-[var(--muted-2)] line-through">
            {formatPrice(product.compareAt + (price - product.price))}
          </span>
        ) : null}
      </div>

      <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-[var(--ink)]/85">
        {product.description}
      </p>

      {/* size / variant */}
      <div className="mt-6">
        <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          {t("product.size")}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const vp = getUnitPrice(product, v.id);
            const active = v.id === variantId;
            return (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                aria-pressed={active}
                className={`rounded-[var(--radius)] border px-4 py-2.5 text-left transition ${
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                    : "border-[var(--line-strong)] hover:border-[var(--ink)]"
                }`}
              >
                <span className="block text-[13px] font-semibold">{v.label}</span>
                <span
                  className={`block text-[12px] tabular-nums ${
                    active ? "text-white/70" : "text-[var(--muted)]"
                  }`}
                >
                  {formatPrice(vp)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* qty + actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <QuantityControl value={qty} onChange={setQty} />
        <Button
          variant="primary"
          size="lg"
          className="min-w-[200px] flex-1"
          disabled={!product.available}
          onClick={() => addToCart(product.id, variantId, qty)}
        >
          {product.available
            ? `${t("common.addToCart")} · ${formatPrice(price * qty)}`
            : t("common.soldOut")}
        </Button>
        <FavoriteButton productId={product.id} floating={false} />
      </div>

      {/* reassurance */}
      <ul className="mt-6 grid gap-2 border-t pt-5 text-[13px] text-[var(--ink)]/80">
        <li className="flex items-center gap-2.5">
          <TruckIcon className="h-[18px] w-[18px] text-[var(--action)]" />
          {t("product.reassure1")}
        </li>
        <li className="flex items-center gap-2.5">
          <LeafIcon className="h-[18px] w-[18px] text-[#4f9a72]" />
          {t("product.reassure2")}
        </li>
      </ul>

      {/* accordions */}
      <div className="mt-6 border-t">
        <Accordion title={t("product.careTitle")} defaultOpen>
          <ul className="grid list-disc gap-1.5 pl-4 text-[13px] leading-relaxed text-[var(--ink)]/80">
            {product.care.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Accordion>
        <Accordion title={t("product.deliveryTitle")}>
          <p className="text-[13px] leading-relaxed text-[var(--ink)]/80">
            Same-day delivery across Tbilisi within {brand.delivery.windowMinutes} minutes when you
            order before 20:00. We accept {brand.payments.join(", ")}. Free delivery on orders over{" "}
            {brand.delivery.freeFrom} {brand.delivery.currency}.
          </p>
        </Accordion>
      </div>
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-[14px] font-semibold"
      >
        {title}
        <ChevronDown className={`h-4 w-4 text-[var(--muted)] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="pb-4">{children}</div> : null}
    </div>
  );
}
