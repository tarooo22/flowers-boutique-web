"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/Button";
import { LeafIcon } from "@/components/ui/Icons";

const timeWindows = ["09:00 – 12:00", "12:00 – 15:00", "15:00 – 18:00", "18:00 – 21:00"];

export function CheckoutView() {
  const { lines, customLines, subtotal, clearCart, hydrated, getProduct, getUnitPrice } = useStore();
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasCartItems = lines.length > 0 || customLines.length > 0;
  const items = lines
    .map((line) => {
      const product = getProduct(line.productId);
      return product ? { line, product, unit: getUnitPrice(product, line.variantId) } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const delivery = subtotal >= brand.delivery.freeFrom || subtotal === 0 ? 0 : 15;
  const total = subtotal + delivery;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    if (!hydrated || !hasCartItems) {
      setSubmitError(t("checkout.emptyCopy"));
      return;
    }

    setSending(true);
    setSubmitError(null);
    const form = new FormData(event.currentTarget);
    const customer = Object.fromEntries(
      ["name", "email", "phone", "recipient", "address", "city", "date", "time", "notes"].map((key) => [key, String(form.get(key) ?? "")]),
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
        ...customLines.map((line) => ({
          name: line.kind === "ai" ? "AI bouquet" : "Custom bouquet",
          quantity: line.quantity,
          price: line.price,
          image: line.image,
          kind: "custom" as const,
        })),
      ],
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) {
        setSubmitError(t("checkout.submitError"));
        return;
      }
      setOrderId(data.id);
      setSubmitted(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(t("checkout.connectionError"));
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="container-fb pb-28 pt-10">
        <div className="mx-auto max-w-xl rounded-[20px] border border-black/5 bg-[var(--surface)] p-8 text-center shadow-[0_18px_48px_rgba(34,33,30,0.07)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--green-soft)]"><LeafIcon className="h-8 w-8 text-[var(--green)]" /></div>
          <h1 className="font-display mt-4 text-[26px]">{t("checkout.successTitle")}</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">{t("checkout.successCopy", { id: orderId })}</p>
          <p className="mt-4 rounded-[var(--radius)] bg-[var(--surface-warm)] px-4 py-3 text-[12.5px] text-[var(--muted)]">{t("checkout.successNote")}</p>
          <Button href="/catalog" variant="dark" className="mt-6">{t("checkout.continue")}</Button>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return <div className="container-fb pb-28 pt-10" aria-busy="true"><div className="h-28 animate-pulse rounded-[20px] bg-[var(--surface-warm)]" /><div className="mt-6 h-80 animate-pulse rounded-[20px] bg-[var(--surface-warm)]" /></div>;
  }

  if (!hasCartItems) {
    return (
      <div className="container-fb pb-28 pt-10 text-center">
        <h1 className="font-display text-[30px]">{t("common.checkout")}</h1>
        <p className="mt-3 text-[14px] text-[var(--muted)]">{t("checkout.empty")}</p>
        <Button href="/catalog" variant="dark" className="mt-6">{t("checkout.browse")}</Button>
      </div>
    );
  }

  return (
    <div className="container-fb pb-24 pt-5 sm:pt-7">
      <section className="rounded-[20px] border border-black/5 bg-[var(--surface)] px-5 py-5 shadow-[0_12px_38px_rgba(34,33,30,0.055)] sm:px-7">
        <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-2)]">Flower&apos;s Boutique</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div><h1 className="font-display text-[28px] leading-none sm:text-[34px]">{t("common.checkout")}</h1><p className="mt-2 max-w-xl text-[13px] text-[var(--muted)]">{t("checkout.intro")}</p></div>
          <p className="rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-[11px] font-semibold text-[var(--green)]">{t("checkout.secureOrder")}</p>
        </div>
        <ol className="mt-5 grid gap-2 border-t border-black/5 pt-4 text-[11px] font-semibold text-[var(--muted)] sm:grid-cols-4">
          {[t("checkout.stepContact"), t("checkout.stepDelivery"), t("checkout.stepSchedule"), t("checkout.stepPayment")].map((label, index) => <li key={label} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--green)] text-[10px] text-white">{index + 1}</span>{label}</li>)}
        </ol>
      </section>

      <form onSubmit={handleSubmit} className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-4">
          <CheckoutStep number="1" title={t("checkout.stepContact")} description={t("checkout.contactHint")}>
            <Field label={t("checkout.name")} name="name" autoComplete="name" required />
            <div className="grid gap-3 sm:grid-cols-2"><Field label={t("checkout.email")} name="email" type="email" autoComplete="email" required /><Field label={t("checkout.phone")} name="phone" type="tel" autoComplete="tel" required /></div>
          </CheckoutStep>

          <CheckoutStep number="2" title={t("checkout.stepDelivery")} description={t("checkout.deliveryHint")}>
            <div className="rounded-[var(--radius)] border border-[var(--green)]/20 bg-[var(--green-soft)] px-4 py-3"><p className="text-[13px] font-semibold text-[var(--ink)]">{t("checkout.deliveryMethod")}</p><p className="mt-0.5 text-[12px] leading-relaxed text-[var(--muted)]">{t("checkout.deliveryMethodCopy")}</p></div>
            <Field label={t("checkout.address")} name="address" autoComplete="street-address" required />
            <div className="grid gap-3 sm:grid-cols-2"><Field label={t("checkout.city")} name="city" defaultValue="Tbilisi" required /><Field label={t("checkout.recipient")} name="recipient" hint={t("checkout.recipientHint")} /></div>
          </CheckoutStep>

          <CheckoutStep number="3" title={t("checkout.stepSchedule")} description={t("checkout.scheduleHint")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("checkout.date")} name="date" type="date" required />
              <div className="grid gap-1.5"><label htmlFor="time" className="text-[12px] font-semibold text-[var(--ink)]">{t("checkout.time")} <span className="text-[var(--action)]">*</span></label><select id="time" name="time" required className="h-11 rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 text-[14px] outline-none transition focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15">{timeWindows.map((window) => <option key={window}>{window}</option>)}<option>{t("checkout.asap")}</option></select></div>
            </div>
          </CheckoutStep>

          <CheckoutStep number="4" title={t("checkout.stepNotes")} description={t("checkout.notesHint")}>
            <div className="grid gap-1.5"><label htmlFor="notes" className="text-[12px] font-semibold text-[var(--ink)]">{t("checkout.notes")}</label><textarea id="notes" name="notes" rows={4} placeholder={t("checkout.notesPlaceholder")} className="rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 py-2.5 text-[14px] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15" /></div>
          </CheckoutStep>

          <CheckoutStep number="5" title={t("checkout.stepPayment")}><p className="rounded-[var(--radius)] bg-[var(--surface-warm)] px-4 py-3 text-[13px] leading-relaxed text-[var(--muted)]">{t("checkout.paymentCopy", { methods: brand.payments.join(", ") })}</p></CheckoutStep>
        </div>

        <aside className="h-fit rounded-[20px] border border-black/5 bg-[var(--surface)] p-5 shadow-[0_16px_42px_rgba(34,33,30,0.08)] lg:sticky lg:top-24 sm:p-6">
          <div className="flex items-start justify-between gap-3 border-b border-black/5 pb-4"><div><p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-2)]">Flower&apos;s Boutique</p><h2 className="font-display mt-1 text-[20px]">{t("checkout.summary")}</h2></div><span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--green-soft)]"><LeafIcon className="h-4 w-4 text-[var(--green)]" /></span></div>
          <ul className="mt-4 grid gap-3">
            {customLines.map((line) => <SummaryItem key={line.id} image={line.image} quantity={line.quantity} name={line.kind === "ai" ? t("checkout.aiBouquet") : t("checkout.customBouquet")} price={formatPrice(line.price * line.quantity)} />)}
            {items.map(({ line, product, unit }) => <SummaryItem key={`${line.productId}-${line.variantId}`} image={product.images[0]} quantity={line.quantity} name={product.name} price={formatPrice(unit * line.quantity)} />)}
          </ul>
          <dl className="mt-5 grid gap-2 border-t border-black/5 pt-4 text-[13px]">
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">{t("common.subtotal")}</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">{t("checkout.delivery")}</dt><dd className="tabular-nums">{delivery === 0 ? t("checkout.free") : formatPrice(delivery)}</dd></div>
            <div className="mt-1 flex justify-between gap-4 border-t border-black/5 pt-3 text-[15px] font-semibold"><dt>{t("common.total")}</dt><dd className="tabular-nums">{formatPrice(total)}</dd></div>
          </dl>
          <div className="mt-4 rounded-[var(--radius)] bg-[var(--surface-warm)] px-3 py-2.5 text-[11.5px] leading-relaxed text-[var(--muted)]">{t("checkout.summaryNote")}</div>
          {submitError ? <p role="alert" aria-live="polite" className="mt-3 text-[13px] font-semibold text-[var(--action-deep)]">{submitError}</p> : null}
          <Button type="submit" variant="primary" fullWidth size="lg" className="mt-4" disabled={sending || !hasCartItems}>{sending ? t("checkout.placing") : t("checkout.placeOrder")}</Button>
          <Link href="/cart" className="mt-3 block text-center text-[13px] font-semibold text-[var(--muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline">{t("checkout.backToCart")}</Link>
        </aside>
      </form>
    </div>
  );
}

function CheckoutStep({ number, title, description, children }: { number: string; title: string; description?: string; children: React.ReactNode }) {
  return <fieldset className="rounded-[18px] border border-black/5 bg-[var(--surface)] p-5 shadow-[0_10px_28px_rgba(34,33,30,0.045)] sm:p-6"><legend className="sr-only">{title}</legend><div className="mb-5 flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--green)] text-[10px] font-bold text-white">{number}</span><div><h2 className="font-display text-[19px] leading-none">{title}</h2>{description ? <p className="mt-1 text-[12px] text-[var(--muted)]">{description}</p> : null}</div></div><div className="grid gap-4">{children}</div></fieldset>;
}

function Field({ label, name, type = "text", required, defaultValue, autoComplete, hint }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string; autoComplete?: string; hint?: string }) {
  return <div className="grid gap-1.5"><label htmlFor={name} className="text-[12px] font-semibold text-[var(--ink)]">{label}{required ? <span className="text-[var(--action)]"> *</span> : null}</label><input id={name} name={name} type={type} required={required} defaultValue={defaultValue} autoComplete={autoComplete} className="h-11 rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 text-[14px] outline-none transition focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15" />{hint ? <p className="text-[11px] text-[var(--muted-2)]">{hint}</p> : null}</div>;
}

function SummaryItem({ image, quantity, name, price }: { image?: string; quantity: number; name: string; price: string }) {
  return <li className="flex items-center gap-3"><div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-[var(--radius)] bg-[var(--surface-warm)]">{image ? <Image src={image} alt="" fill sizes="48px" className="object-cover" unoptimized /> : null}<span className="mono absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--ink)] px-1 text-[10px] font-bold text-white">{quantity}</span></div><p className="min-w-0 flex-1 truncate text-[12.5px] font-semibold uppercase tracking-[0.02em]">{name}</p><span className="text-[13px] font-semibold tabular-nums">{price}</span></li>;
}
