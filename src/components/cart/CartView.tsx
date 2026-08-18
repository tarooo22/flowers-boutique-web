"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/Button";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { BagIcon, CloseIcon } from "@/components/ui/Icons";

export function CartView() {
  const {
    lines,
    customLines,
    subtotal,
    setQty,
    removeFromCart,
    setCustomQty,
    removeCustom,
    hydrated,
    getProduct,
    getUnitPrice,
  } = useStore();

  if (hydrated && lines.length === 0 && customLines.length === 0) {
    return (
      <div className="container-fb pt-8 pb-24">
        <h1 className="font-display text-[30px] leading-none sm:text-[38px]">Cart</h1>
        <div className="mt-8 flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--surface-warm)]">
            <BagIcon className="h-7 w-7 text-[var(--muted)]" />
          </div>
          <p className="font-display text-[18px]">Your cart is empty</p>
          <Button href="/catalog" variant="dark">
            Browse bouquets
          </Button>
        </div>
      </div>
    );
  }

  const freeFrom = brand.delivery.freeFrom;
  const remaining = Math.max(0, freeFrom - subtotal);

  return (
    <div className="container-fb pt-8 pb-24">
      <h1 className="font-display text-[30px] leading-none sm:text-[38px]">Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* items */}
        <div className="divide-y border-y">
          {customLines.map((line) => (
            <div key={line.id} className="flex gap-4 py-5">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-warm)]">
                {line.image ? (
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized={line.image.startsWith("data:")}
                  />
                ) : (
                  <span className="grid h-full place-items-center px-2 text-center text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                    Custom
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold uppercase tracking-[0.03em]">
                      {line.kind === "ai" ? "AI bouquet" : "Custom bouquet"}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[12.5px] text-[var(--muted)]">
                      {line.kind === "ai"
                        ? line.prompt
                        : (line.stems ?? [])
                            .map((s) => `${s.quantity}× ${s.key}`)
                            .join(", ")}
                    </p>
                  </div>
                  <button
                    aria-label="Remove item"
                    onClick={() => removeCustom(line.id)}
                    className="grid h-8 w-8 place-items-center rounded-full text-[var(--muted)] hover:bg-black/5"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantityControl
                    value={line.quantity}
                    onChange={(q) => setCustomQty(line.id, q)}
                  />
                  <span className="text-[15px] font-semibold tabular-nums">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {lines.map((line) => {
            const p = getProduct(line.productId);
            if (!p) return null;
            const variant = p.variants.find((v) => v.id === line.variantId);
            const unit = getUnitPrice(p, line.variantId);
            return (
              <div key={`${line.productId}-${line.variantId}`} className="flex gap-4 py-5">
                <Link
                  href={`/product/${p.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-warm)]"
                >
                  <Image src={p.images[0]} alt={p.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/product/${p.slug}`}
                        className="text-[14px] font-semibold uppercase tracking-[0.03em]"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-0.5 text-[12.5px] text-[var(--muted)]">
                        {variant && variant.id !== "classic" ? variant.label : p.subtitle}
                      </p>
                    </div>
                    <button
                      aria-label="Remove item"
                      onClick={() => removeFromCart(line.productId, line.variantId)}
                      className="grid h-8 w-8 place-items-center rounded-full text-[var(--muted)] hover:bg-black/5"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QuantityControl
                      value={line.quantity}
                      onChange={(q) => setQty(line.productId, line.variantId, q)}
                    />
                    <span className="text-[15px] font-semibold tabular-nums">
                      {formatPrice(unit * line.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* summary */}
        <aside className="h-fit rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-[18px]">Order summary</h2>
          <dl className="mt-4 grid gap-2.5 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Subtotal</dt>
              <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Delivery</dt>
              <dd className="text-[var(--muted)]">
                {remaining > 0 ? "Calculated at checkout" : "Free"}
              </dd>
            </div>
          </dl>
          {remaining > 0 ? (
            <p className="mt-3 rounded-lg bg-[var(--surface-warm)] px-3 py-2 text-[12.5px] text-[var(--ink)]">
              Add <strong className="tabular-nums">{formatPrice(remaining)}</strong> for free delivery.
            </p>
          ) : null}
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <span className="text-[14px] font-semibold">Total</span>
            <span className="text-[20px] font-semibold tabular-nums">{formatPrice(subtotal)}</span>
          </div>
          <Button href="/checkout" variant="primary" fullWidth size="lg" className="mt-5">
            Proceed to checkout
          </Button>
          <Link
            href="/catalog"
            className="mt-3 block text-center text-[13px] font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
