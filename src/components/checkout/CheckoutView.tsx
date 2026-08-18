"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/Button";
import { LeafIcon } from "@/components/ui/Icons";

const timeWindows = ["09:00 – 12:00", "12:00 – 15:00", "15:00 – 18:00", "18:00 – 21:00", "As soon as possible"];

export function CheckoutView() {
  const { lines, customLines, subtotal, clearCart, hydrated, getProduct, getUnitPrice } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const items = lines
    .map((l) => {
      const p = getProduct(l.productId);
      return p ? { line: l, product: p, unit: getUnitPrice(p, l.variantId) } : null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const delivery = subtotal >= brand.delivery.freeFrom || subtotal === 0 ? 0 : 15;
  const total = subtotal + delivery;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setSubmitError(null);

    const form = new FormData(e.currentTarget);
    const customer = Object.fromEntries(
      ["name", "email", "phone", "recipient", "address", "city", "date", "time", "notes"].map(
        (k) => [k, String(form.get(k) ?? "")],
      ),
    );

    const payload = {
      customer,
      items: [
        ...items.map(({ line, product, unit }) => ({
          productId: product.id,
          variantId: line.variantId,
          name: product.name,
          quantity: line.quantity,
          price: unit,
          image: product.images[0],
          kind: "product" as const,
        })),
        ...customLines.map((l) => ({
          name: l.kind === "ai" ? "AI bouquet" : "Custom bouquet",
          quantity: l.quantity,
          price: l.price,
          image: l.image,
          kind: "custom" as const,
        })),
      ],
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) {
        setSubmitError("We couldn't place the order. Please check your details and try again.");
        return;
      }
      setOrderId(data.id);
      setSubmitted(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("We couldn't reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="container-fb pt-10 pb-28">
        <div className="mx-auto max-w-xl rounded-[var(--radius-lg)] border bg-[var(--surface)] p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--green-soft)]">
            <LeafIcon className="h-8 w-8 text-[var(--green)]" />
          </div>
          <h1 className="font-display mt-4 text-[26px]">Thank you — your order is in!</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            Order <span className="mono font-semibold text-[var(--ink)]">{orderId}</span> has been
            received. Our florist will call you shortly to confirm delivery.
          </p>
          <p className="mt-4 rounded-lg bg-[var(--surface-warm)] px-4 py-3 text-[12.5px] text-[var(--muted)]">
            Your order was saved and is now visible in the admin panel. No payment was taken —
            payment is arranged when our florist calls to confirm.
          </p>
          <Button href="/catalog" variant="dark" className="mt-6">
            Continue shopping
          </Button>
        </div>
      </div>
    );
  }

  if (hydrated && items.length === 0 && customLines.length === 0) {
    return (
      <div className="container-fb pt-10 pb-28 text-center">
        <h1 className="font-display text-[30px]">Checkout</h1>
        <p className="mt-3 text-[14px] text-[var(--muted)]">Your cart is empty.</p>
        <Button href="/catalog" variant="dark" className="mt-6">
          Browse bouquets
        </Button>
      </div>
    );
  }

  return (
    <div className="container-fb pt-8 pb-24">
      <h1 className="font-display text-[30px] leading-none sm:text-[38px]">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-8">
          <Fieldset legend="Contact details">
            <Field label="Full name" name="name" autoComplete="name" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" autoComplete="email" required />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" required />
            </div>
          </Fieldset>

          <Fieldset legend="Delivery">
            <Field label="Recipient name (optional)" name="recipient" />
            <Field label="Address" name="address" autoComplete="street-address" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" name="city" defaultValue="Tbilisi" required />
              <Field label="Delivery date" name="date" type="date" required />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="time" className="text-[12.5px] font-semibold text-[var(--ink)]">
                Delivery time
              </label>
              <select
                id="time"
                name="time"
                required
                className="h-11 rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 text-[14px] outline-none focus:border-[var(--ink)]"
              >
                {timeWindows.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="notes" className="text-[12.5px] font-semibold text-[var(--ink)]">
                Notes for the florist (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Card message, gate code, preferred colours…"
                className="rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--ink)]"
              />
            </div>
          </Fieldset>

          <Fieldset legend="Payment">
            <p className="rounded-lg bg-[var(--surface-warm)] px-4 py-3 text-[13px] text-[var(--muted)]">
              Payment is handled after confirmation. This demo does not take real payments — a
              florist will contact you to arrange {brand.payments.join(", ")}.
            </p>
          </Fieldset>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-[18px]">Your order</h2>
          <ul className="mt-4 grid gap-3">
            {customLines.map((line) => (
              <li key={line.id} className="flex items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-[var(--surface-warm)]">
                  {line.image ? (
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized={line.image.startsWith("data:")}
                    />
                  ) : null}
                  <span className="mono absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--ink)] px-1 text-[10px] font-bold text-white">
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold uppercase tracking-[0.02em]">
                    {line.kind === "ai" ? "AI bouquet" : "Custom bouquet"}
                  </p>
                </div>
                <span className="text-[13px] font-semibold tabular-nums">
                  {formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}

            {items.map(({ line, product, unit }) => (
              <li key={`${line.productId}-${line.variantId}`} className="flex items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-[var(--surface-warm)]">
                  <Image src={product.images[0]} alt="" fill sizes="48px" className="object-cover" />
                  <span className="mono absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--ink)] px-1 text-[10px] font-bold text-white">
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold uppercase tracking-[0.02em]">
                    {product.name}
                  </p>
                </div>
                <span className="text-[13px] font-semibold tabular-nums">
                  {formatPrice(unit * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 grid gap-2 border-t pt-4 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Delivery</dt>
              <dd className="tabular-nums">{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
            </div>
            <div className="mt-1 flex justify-between border-t pt-3 text-[15px] font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          {submitError ? (
            <p role="alert" className="mt-4 text-[13px] font-semibold text-[var(--action-deep)]">
              {submitError}
            </p>
          ) : null}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            className="mt-5"
            disabled={sending}
          >
            {sending ? "Placing order…" : "Place order"}
          </Button>
          <Link
            href="/cart"
            className="mt-3 block text-center text-[13px] font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4">
      <legend className="font-display mb-1 text-[18px]">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="text-[12.5px] font-semibold text-[var(--ink)]">
        {label}
        {required ? <span className="text-[var(--action)]"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="h-11 rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 text-[14px] outline-none transition focus:border-[var(--ink)]"
      />
    </div>
  );
}
