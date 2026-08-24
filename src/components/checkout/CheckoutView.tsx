"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/Button";
import { LeafIcon } from "@/components/ui/Icons";

const timeWindows = ["09:00 – 12:00", "12:00 – 15:00", "15:00 – 18:00", "18:00 – 21:00"];
type Fulfillment = "delivery" | "studio_pickup";
type FlowerCircleCheckoutSummary = { availableBenefit: number; redemptionCapPercent: number };
type CheckoutProfile = { name: string; email: string; phone: string };
type SavedAddress = { id: number; label: string; recipientName: string; phone: string | null; city: string; address: string; instructions: string | null; isDefault: boolean };
type ContactDraft = { name: string; email: string; phone: string; recipient: string; address: string; city: string };

const isoDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const tomorrow = () => { const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() + 1); return date; };

export function CheckoutView() {
  const { lines, customLines, subtotal, clearCart, hydrated, getProduct, getUnitPrice } = useStore();
  const { t, lang } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [recipientMode, setRecipientMode] = useState<"self" | "other">("self");
  const [deliveryDate, setDeliveryDate] = useState(() => isoDate(tomorrow()));
  const [month, setMonth] = useState(() => { const date = tomorrow(); return new Date(date.getFullYear(), date.getMonth(), 1); });
  const [flowerCircle, setFlowerCircle] = useState<FlowerCircleCheckoutSummary | null>(null);
  const [useFlowerCircleBenefit, setUseFlowerCircleBenefit] = useState(false);
  const [contact, setContact] = useState<ContactDraft>({ name: "", email: "", phone: "", recipient: "", address: "", city: "თბილისი" });
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveDeliveryAddress, setSaveDeliveryAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");

  const hasCartItems = lines.length > 0 || customLines.length > 0;
  const items = lines.map((line) => { const product = getProduct(line.productId); return product ? { line, product, unit: getUnitPrice(product, line.variantId) } : null; }).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const delivery = fulfillment === "studio_pickup" || subtotal >= brand.delivery.freeFrom || subtotal === 0 ? 0 : 15;
  const flowerCircleDiscount = useFlowerCircleBenefit && flowerCircle ? Math.min(flowerCircle.availableBenefit, Math.round(subtotal * (flowerCircle.redemptionCapPercent / 100) * 100) / 100) : 0;
  const total = subtotal - flowerCircleDiscount + delivery;

  useEffect(() => {
    let active = true;
    fetch("/api/flower-circle", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { summary: null })
      .then((payload: { summary?: FlowerCircleCheckoutSummary | null }) => { if (active) setFlowerCircle(payload.summary ?? null); })
      .catch(() => { if (active) setFlowerCircle(null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([fetch("/api/account/profile", { cache: "no-store" }), fetch("/api/account/addresses", { cache: "no-store" })])
      .then(async ([profileResponse, addressesResponse]) => ({ profile: profileResponse.ok ? await profileResponse.json() : null, addresses: addressesResponse.ok ? await addressesResponse.json() : null }))
      .then((payload) => {
        if (!active) return;
        const profile = payload.profile?.profile as CheckoutProfile | undefined;
        const addresses = (payload.addresses?.addresses ?? []) as SavedAddress[];
        setSavedAddresses(addresses);
        setContact((current) => ({ ...current, name: current.name || profile?.name || "", email: current.email || profile?.email || "", phone: current.phone || profile?.phone || "" }));
        const primary = addresses.find((address) => address.isDefault) ?? addresses[0];
        if (primary) {
          setSelectedAddressId(String(primary.id));
          setContact((current) => ({ ...current, address: current.address || primary.address, city: current.city === "თბილისი" ? primary.city : current.city, recipient: current.recipient || primary.recipientName, phone: current.phone || primary.phone || "" }));
        }
      }).catch(() => null);
    return () => { active = false; };
  }, []);

  const updateContact = <K extends keyof ContactDraft>(key: K, value: ContactDraft[K]) => setContact((current) => ({ ...current, [key]: value }));
  const selectSavedAddress = (id: string) => {
    setSelectedAddressId(id);
    const address = savedAddresses.find((item) => String(item.id) === id);
    if (!address) return;
    setContact((current) => ({ ...current, address: address.address, city: address.city, recipient: address.recipientName, phone: current.phone || address.phone || "" }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    if (!hydrated || !hasCartItems) { setSubmitError(t("checkout.emptyCopy")); return; }
    setSending(true); setSubmitError(null);
    const form = new FormData(event.currentTarget);
    const cardMessage = String(form.get("cardMessage") ?? "").trim();
    const deliveryInstructions = String(form.get("notes") ?? "").trim();
    const notes = [cardMessage ? `Card message: ${cardMessage}` : "", deliveryInstructions ? `Delivery instructions: ${deliveryInstructions}` : ""].filter(Boolean).join("\n");
    const customer = Object.fromEntries(["name", "email", "phone", "recipient", "address", "city", "date", "time", "fulfillment"].map((key) => [key, String(form.get(key) ?? "")]));
    Object.assign(customer, { notes });
    const payload = { customer, useFlowerCircleBenefit: useFlowerCircleBenefit && flowerCircleDiscount > 0, items: [...items.map(({ line, product, unit }) => ({ productId: product.id, variantId: line.variantId, name: product.name, quantity: line.quantity, price: unit, image: product.images[0], kind: "product" as const })), ...customLines.map((line) => ({ name: line.kind === "ai" ? "AI bouquet" : "Custom bouquet", quantity: line.quantity, price: line.price, image: line.image, kind: "custom" as const }))] };
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) { setSubmitError(t("checkout.submitError")); return; }
      if (saveDeliveryAddress && fulfillment === "delivery" && !selectedAddressId) {
        void fetch("/api/account/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: addressLabel.trim() || "ახალი მისამართი", recipientName: customer.recipient || customer.name, phone: customer.phone, city: customer.city, address: customer.address, instructions: deliveryInstructions, isDefault: savedAddresses.length === 0 }) });
      }
      setOrderId(data.id); setSubmitted(true); clearCart(); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { setSubmitError(t("checkout.connectionError")); } finally { setSending(false); }
  };

  if (submitted) return <CheckoutSuccess id={orderId} />;
  if (!hydrated) return <CheckoutLoading />;
  if (!hasCartItems) return <CheckoutEmpty />;

  return <div className="bg-[var(--surface-warm)] pb-24 pt-4 sm:pt-7"><div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6">
    <section className="rounded-[20px] border border-black/5 bg-[var(--surface)] px-5 py-5 shadow-[0_12px_38px_rgba(34,33,30,0.055)] sm:px-7"><p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-2)]">Flower&apos;s Boutique</p><div className="mt-1 flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-display text-[30px] leading-none sm:text-[36px]">{t("common.checkout")}</h1><p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[var(--muted)]">{t("checkout.intro")}</p></div><span className="rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-[11px] font-semibold text-[var(--green)]">{t("checkout.secureOrder")}</span></div><ol className="mt-5 grid gap-2 border-t border-black/5 pt-4 text-[11px] font-semibold text-[var(--muted)] sm:grid-cols-3">{[t("checkout.progressDetails"), t("checkout.progressDelivery"), t("checkout.progressConfirm")].map((label, index) => <li key={label} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--green)] text-[10px] text-white">{index + 1}</span>{label}</li>)}</ol></section>

    <form onSubmit={handleSubmit} className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-4">
        <CheckoutStep number="1" title={t("checkout.stepContact")} description={t("checkout.contactHint")}><Field label={t("checkout.name")} name="name" autoComplete="name" value={contact.name} onChange={(value) => updateContact("name", value)} required /><div className="grid gap-3 sm:grid-cols-2"><Field label={t("checkout.email")} name="email" type="email" autoComplete="email" value={contact.email} onChange={(value) => updateContact("email", value)} required /><Field label={t("checkout.phone")} name="phone" type="tel" autoComplete="tel" value={contact.phone} onChange={(value) => updateContact("phone", value)} required /></div></CheckoutStep>

        <CheckoutStep number="2" title={t("checkout.stepMethod")} description={t("checkout.deliveryHint")}><input type="hidden" name="fulfillment" value={fulfillment} /><div className="grid gap-3 sm:grid-cols-2"><ChoiceCard active={fulfillment === "delivery"} onClick={() => setFulfillment("delivery")} title={t("checkout.deliveryChoice")} text={t("checkout.deliveryChoiceCopy")} badge={delivery ? formatPrice(delivery) : t("checkout.free")} /><ChoiceCard active={fulfillment === "studio_pickup"} onClick={() => setFulfillment("studio_pickup")} title={t("checkout.pickupChoice")} text={t("checkout.pickupChoiceCopy")} badge={t("checkout.free")} /></div></CheckoutStep>

        <CheckoutStep number="3" title={t("checkout.stepDate")} description={t("checkout.dateHint")}><input type="hidden" name="date" value={deliveryDate} /><DeliveryCalendar month={month} setMonth={setMonth} selected={deliveryDate} setSelected={setDeliveryDate} lang={lang} previousLabel={t("checkout.calendarPrevious")} nextLabel={t("checkout.calendarNext")} /><div className="grid gap-3 sm:grid-cols-2"><div className="grid gap-1.5"><label htmlFor="time" className={labelClass}>{t("checkout.time")}<span className="text-[var(--action)]"> *</span></label><select id="time" name="time" required className={inputClass}>{timeWindows.map((window) => <option key={window}>{window}</option>)}<option>{t("checkout.asap")}</option></select></div><p className="self-end rounded-[var(--radius)] bg-[var(--surface-sand)] px-3 py-3 text-[12px] leading-relaxed text-[var(--muted)]">{fulfillment === "studio_pickup" ? t("checkout.pickupChoiceCopy") : t("checkout.deliveryMethodCopy")}</p></div></CheckoutStep>

        <CheckoutStep number="4" title={t("checkout.stepRecipient")} description={t("checkout.recipientIntro")}><div className="grid gap-3 sm:grid-cols-2"><ChoiceCard compact active={recipientMode === "self"} onClick={() => setRecipientMode("self")} title={t("checkout.recipientSame")} /><ChoiceCard compact active={recipientMode === "other"} onClick={() => setRecipientMode("other")} title={t("checkout.recipientOther")} /></div>{recipientMode === "other" ? <Field label={t("checkout.recipient")} name="recipient" value={contact.recipient} onChange={(value) => updateContact("recipient", value)} hint={t("checkout.recipientHint")} /> : <input type="hidden" name="recipient" value="" />}{fulfillment === "delivery" ? <>{savedAddresses.length ? <label className="grid gap-1.5 text-[12px] font-semibold">შენახული მისამართი<select value={selectedAddressId} onChange={(event) => selectSavedAddress(event.target.value)} className={inputClass}><option value="">ახალი მისამართის გამოყენება</option>{savedAddresses.map((address) => <option key={address.id} value={address.id}>{address.label} · {address.city}</option>)}</select></label> : null}<Field label={t("checkout.address")} name="address" autoComplete="street-address" value={contact.address} onChange={(value) => { setSelectedAddressId(""); updateContact("address", value); }} required /><div className="grid gap-3 sm:grid-cols-2"><Field label={t("checkout.city")} name="city" value={contact.city} onChange={(value) => { setSelectedAddressId(""); updateContact("city", value); }} required /><p className="self-end rounded-[var(--radius)] bg-[var(--surface-sand)] px-3 py-3 text-[12px] text-[var(--muted)]">{t("checkout.deliveryMethod")}</p></div>{!selectedAddressId ? <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface-warm)] p-3"><label className="flex min-h-11 items-center gap-3 text-[12px] font-semibold"><input type="checkbox" checked={saveDeliveryAddress} onChange={(event) => setSaveDeliveryAddress(event.target.checked)} className="h-4 w-4 accent-[var(--green)]" />ეს მისამართი შევინახო მომავალ შეკვეთებისთვის</label>{saveDeliveryAddress ? <Field label="მისამართის სახელწოდება" name="addressLabel" value={addressLabel} onChange={setAddressLabel} hint="მაგალითად: სახლი ან ოფისი" /> : null}</div> : null}</> : <><input type="hidden" name="address" value="" /><input type="hidden" name="city" value="თბილისი" /><p className="rounded-[var(--radius)] border border-[var(--green)]/20 bg-[var(--green-soft)] px-4 py-3 text-[13px] text-[var(--green)]">{brand.addressFull}</p></>}</CheckoutStep>

        <CheckoutStep number="5" title={t("checkout.stepPersonalize")} description={t("checkout.notesHint")}><div className="grid gap-3 sm:grid-cols-2"><TextArea label={t("checkout.cardMessage")} name="cardMessage" placeholder={t("checkout.cardMessagePlaceholder")} /><TextArea label={t("checkout.deliveryInstructions")} name="notes" placeholder={t("checkout.deliveryInstructionsPlaceholder")} /></div></CheckoutStep>

        <CheckoutStep number="6" title={t("checkout.stepConfirm")} description={t("checkout.paymentCopy", { methods: brand.payments.join(", ") })}><label className="flex min-h-11 items-start gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface-warm)] px-3 py-3 text-[12.5px] leading-relaxed"><input required type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--green)]" />{t("checkout.consentTerms")}</label><label className="flex min-h-11 items-start gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface-warm)] px-3 py-3 text-[12.5px] leading-relaxed"><input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 accent-[var(--green)]" />{t("checkout.consentCall")}</label>{flowerCircle && flowerCircle.availableBenefit > 0 ? <label className="flex min-h-12 items-start gap-3 rounded-[var(--radius)] border border-[var(--green)]/25 bg-[var(--green-soft)] px-3 py-3 text-[12.5px] leading-relaxed"><input type="checkbox" checked={useFlowerCircleBenefit} onChange={(event) => setUseFlowerCircleBenefit(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--green)]" /><span><strong className="block text-[var(--green)]">{t("checkout.flowerCircleUse")}</strong><span className="text-[var(--muted)]">{t("checkout.flowerCircleUseHint", { amount: formatPrice(flowerCircleDiscount), cap: flowerCircle.redemptionCapPercent })}</span></span></label> : null}<p className="rounded-[var(--radius)] border border-[var(--action)]/15 bg-[var(--action)]/5 px-3 py-3 text-[12px] leading-relaxed text-[var(--muted)]">{t("checkout.confirmNote")}</p></CheckoutStep>
      </div>
      <OrderSummary customLines={customLines} items={items} subtotal={subtotal} flowerCircleDiscount={flowerCircleDiscount} delivery={delivery} total={total} error={submitError} sending={sending} />
    </form>
  </div></div>;
}

function CheckoutSuccess({ id }: { id: string }) { const { t } = useI18n(); return <div className="container-fb pb-28 pt-10"><div className="mx-auto max-w-xl rounded-[20px] border border-black/5 bg-[var(--surface)] p-8 text-center shadow-[0_18px_48px_rgba(34,33,30,0.07)]"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--green-soft)]"><LeafIcon className="h-8 w-8 text-[var(--green)]" /></div><h1 className="font-display mt-4 text-[26px]">{t("checkout.successTitle")}</h1><p className="mt-2 text-[14px] text-[var(--muted)]">{t("checkout.successCopy", { id })}</p><p className="mt-4 rounded-[var(--radius)] bg-[var(--surface-warm)] px-4 py-3 text-[12.5px] text-[var(--muted)]">{t("checkout.successNote")}</p><Button href="/catalog" variant="dark" className="mt-6">{t("checkout.continue")}</Button></div></div>; }
function CheckoutLoading() { return <div className="container-fb pb-28 pt-10" aria-busy="true"><div className="h-28 animate-pulse rounded-[20px] bg-[var(--surface-warm)]" /><div className="mt-6 h-80 animate-pulse rounded-[20px] bg-[var(--surface-warm)]" /></div>; }
function CheckoutEmpty() { const { t } = useI18n(); return <div className="container-fb pb-28 pt-10 text-center"><h1 className="font-display text-[30px]">{t("common.checkout")}</h1><p className="mt-3 text-[14px] text-[var(--muted)]">{t("checkout.empty")}</p><Button href="/catalog" variant="dark" className="mt-6">{t("checkout.browse")}</Button></div>; }

function OrderSummary({ customLines, items, subtotal, flowerCircleDiscount, delivery, total, error, sending }: { customLines: ReturnType<typeof useStore>["customLines"]; items: Array<{ line: any; product: any; unit: number }>; subtotal: number; flowerCircleDiscount: number; delivery: number; total: number; error: string | null; sending: boolean }) {
  const { t } = useI18n();
  return <aside className="h-fit rounded-[20px] border border-black/5 bg-[var(--surface)] p-5 shadow-[0_16px_42px_rgba(34,33,30,0.08)] lg:sticky lg:top-24">
    <div className="flex items-start justify-between gap-3 border-b border-black/5 pb-4"><div><p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-2)]">Flower&apos;s Boutique</p><h2 className="font-display mt-1 text-[20px]">{t("checkout.summary")}</h2></div><span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--green-soft)]"><LeafIcon className="h-4 w-4 text-[var(--green)]" /></span></div>
    <ul className="mt-4 grid gap-3">{customLines.map((line) => <SummaryItem key={line.id} image={line.image} quantity={line.quantity} name={line.kind === "ai" ? t("checkout.aiBouquet") : t("checkout.customBouquet")} price={formatPrice(line.price * line.quantity)} />)}{items.map(({ line, product, unit }) => <SummaryItem key={`${line.productId}-${line.variantId}`} image={product.images[0]} quantity={line.quantity} name={product.name} price={formatPrice(unit * line.quantity)} />)}</ul>
    <dl className="mt-5 grid gap-2 border-t border-black/5 pt-4 text-[13px]"><SummaryLine label={t("common.subtotal")} value={formatPrice(subtotal)} />{flowerCircleDiscount > 0 ? <><SummaryLine label={t("checkout.flowerCircleDiscount")} value={`−${formatPrice(flowerCircleDiscount)}`} /><SummaryLine label={t("checkout.delivery")} value={delivery === 0 ? t("checkout.free") : formatPrice(delivery)} /></> : <SummaryLine label={t("checkout.delivery")} value={delivery === 0 ? t("checkout.free") : formatPrice(delivery)} />}<SummaryLine label={t("common.total")} value={formatPrice(total)} strong /></dl>
    <div className="mt-4 rounded-[var(--radius)] bg-[var(--surface-sand)] p-3"><p className="text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">{t("checkout.summaryChecks")}</p><ul className="mt-2 grid gap-1.5 text-[11.5px] leading-relaxed text-[var(--muted)]">{[t("checkout.summaryCheckOne"), t("checkout.summaryCheckTwo"), t("checkout.summaryCheckThree")].map((copy) => <li key={copy} className="flex gap-2"><span className="text-[var(--green)]">✓</span>{copy}</li>)}</ul></div>
    {error ? <p role="alert" aria-live="polite" className="mt-3 text-[13px] font-semibold text-[var(--action-deep)]">{error}</p> : null}<Button type="submit" variant="primary" fullWidth size="lg" className="mt-4" disabled={sending}>{sending ? t("checkout.placing") : t("checkout.submitConfirm")}</Button><Link href="/cart" className="mt-3 block text-center text-[13px] font-semibold text-[var(--muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline">{t("checkout.backToCart")}</Link>
  </aside>;
}

function DeliveryCalendar({ month, setMonth, selected, setSelected, lang, previousLabel, nextLabel }: { month: Date; setMonth: (value: Date) => void; selected: string; setSelected: (value: string) => void; lang: "en" | "ka" | "ru"; previousLabel: string; nextLabel: string }) { const earliest = tomorrow(); const cells = useMemo(() => { const starts = new Date(month.getFullYear(), month.getMonth(), 1); const lead = (starts.getDay() + 6) % 7; const result: Array<Date | null> = Array.from({ length: lead }, () => null); const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(); for (let day = 1; day <= count; day++) result.push(new Date(month.getFullYear(), month.getMonth(), day)); while (result.length % 7) result.push(null); return result; }, [month]); const locale = lang === "ka" ? "ka-GE" : lang === "ru" ? "ru-RU" : "en-GB"; const weekday = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(new Date(2024, 0, index + 1))); return <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-3"><div className="flex items-center justify-between gap-2"><button type="button" aria-label={previousLabel} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className={calendarNav}>←</button><p className="text-[13px] font-semibold">{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month)}</p><button type="button" aria-label={nextLabel} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className={calendarNav}>→</button></div><div className="mt-3 grid grid-cols-7 gap-1 text-center"><>{weekday.map((day, index) => <span key={`${day}-${index}`} className="py-1 text-[10px] font-semibold text-[var(--muted-2)]">{day}</span>)}</>{cells.map((date, index) => { const value = date ? isoDate(date) : ""; const disabled = !date || date < earliest; return <button key={`${value}-${index}`} type="button" disabled={disabled} onClick={() => date && setSelected(value)} className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:text-[var(--muted-2)] ${value === selected ? "bg-[var(--green)] text-white" : "hover:bg-[var(--green-soft)]"}`}>{date?.getDate() ?? ""}</button>; })}</div></div>; }

function CheckoutStep({ number, title, description, children }: { number: string; title: string; description?: string; children: React.ReactNode }) { return <fieldset className="rounded-[18px] border border-black/5 bg-[var(--surface)] p-5 shadow-[0_10px_28px_rgba(34,33,30,0.045)] sm:p-6"><legend className="sr-only">{title}</legend><div className="mb-5 flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--green)] text-[10px] font-bold text-white">{number}</span><div><h2 className="font-display text-[20px] leading-none">{title}</h2>{description ? <p className="mt-1 text-[12px] leading-relaxed text-[var(--muted)]">{description}</p> : null}</div></div><div className="grid gap-4">{children}</div></fieldset>; }
function ChoiceCard({ active, onClick, title, text, badge, compact }: { active: boolean; onClick: () => void; title: string; text?: string; badge?: string; compact?: boolean }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`relative min-h-20 rounded-[var(--radius)] border p-4 text-left transition ${active ? "border-[var(--green)] bg-[var(--green-soft)] shadow-[0_0_0_1px_var(--green)]" : "border-[var(--line)] bg-white hover:border-[var(--line-strong)]"}`}><span className={`absolute right-3 top-3 grid h-4 w-4 place-items-center rounded-full border ${active ? "border-[var(--green)] bg-[var(--green)]" : "border-[var(--line-strong)]"}`}>{active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}</span><p className="pr-7 text-[13px] font-semibold">{title}</p>{text ? <p className="mt-1 pr-2 text-[11.5px] leading-relaxed text-[var(--muted)]">{text}</p> : null}{badge && !compact ? <span className="mt-3 inline-block rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-[var(--green)]">{badge}</span> : null}</button>; }
function Field({ label, name, type = "text", required, defaultValue, value, onChange, autoComplete, hint }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string; value?: string; onChange?: (value: string) => void; autoComplete?: string; hint?: string }) { return <div className="grid gap-1.5"><label htmlFor={name} className={labelClass}>{label}{required ? <span className="text-[var(--action)]"> *</span> : null}</label><input id={name} name={name} type={type} required={required} defaultValue={value === undefined ? defaultValue : undefined} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} autoComplete={autoComplete} className={inputClass} />{hint ? <p className="text-[11px] text-[var(--muted-2)]">{hint}</p> : null}</div>; }
function TextArea({ label, name, placeholder }: { label: string; name: string; placeholder: string }) { return <div className="grid gap-1.5"><label htmlFor={name} className={labelClass}>{label}</label><textarea id={name} name={name} rows={4} placeholder={placeholder} className="min-h-28 rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 py-2.5 text-[14px] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15" /></div>; }
function SummaryItem({ image, quantity, name, price }: { image?: string; quantity: number; name: string; price: string }) { return <li className="flex items-center gap-3"><div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-[var(--radius)] bg-[var(--surface-warm)]">{image ? <Image src={image} alt="" fill sizes="48px" className="object-cover" unoptimized /> : null}<span className="mono absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--ink)] px-1 text-[10px] font-bold text-white">{quantity}</span></div><p className="min-w-0 flex-1 truncate text-[12.5px] font-semibold uppercase tracking-[0.02em]">{name}</p><span className="text-[13px] font-semibold tabular-nums">{price}</span></li>; }
function SummaryLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className={`flex justify-between gap-4 ${strong ? "mt-1 border-t border-black/5 pt-3 text-[15px] font-semibold" : ""}`}><dt className={strong ? "" : "text-[var(--muted)]"}>{label}</dt><dd className="tabular-nums">{value}</dd></div>; }

const labelClass = "text-[12px] font-semibold text-[var(--ink)]";
const inputClass = "h-11 rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 text-[14px] outline-none transition focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15";
const calendarNav = "grid h-8 w-8 place-items-center rounded-full text-[15px] transition hover:bg-[var(--green-soft)]";
