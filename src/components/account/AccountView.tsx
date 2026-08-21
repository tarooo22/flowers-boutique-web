"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/format";

type Tab = "orders" | "profile" | "security" | "addresses" | "notifications" | "coupons";

const tabs: { id: Tab; label: string }[] = [
  { id: "orders", label: "შეკვეთები" },
  { id: "profile", label: "პროფილი" },
  { id: "security", label: "უსაფრთხოება" },
  { id: "addresses", label: "მისამართები" },
  { id: "notifications", label: "შეტყობინებები" },
  { id: "coupons", label: "კუპონები" },
];

const statusLabel: Record<string, string> = {
  new: "ახალი", processing: "დამუშავებაში", confirmed: "დადასტურებული", courier: "კურიერთანაა",
  delivering: "მიწოდებაშია", delivered: "დასრულებული", completed: "დასრულებული", cancelled: "გაუქმებული",
};

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-7"><h1 className="font-display text-[27px] leading-tight sm:text-[31px]">{title}</h1>{description ? <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-[var(--muted)]">{description}</p> : null}<div className="mt-6">{children}</div></section>;
}

function Empty({ title, copy, action }: { title: string; copy: string; action?: ReactNode }) {
  return <div className="grid min-h-48 place-items-center rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--surface-warm)] px-5 text-center"><div><span aria-hidden="true" className="mx-auto block h-7 w-7 rounded-sm border border-[var(--line)] bg-[var(--surface)]" /><h2 className="mt-4 font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[var(--muted)]">{copy}</p>{action ? <div className="mt-5">{action}</div> : null}</div></div>;
}

export function AccountView({ name, email, isAdmin = false }: { name: string | null; email: string | null; isAdmin?: boolean }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [history, setHistory] = useState<any>(undefined);
  const [tab, setTab] = useState<Tab>("orders");
  const displayName = name?.trim() || "მომხმარებელი";
  const date = useMemo(() => new Intl.DateTimeFormat("ka-GE", { day: "2-digit", month: "short", year: "numeric" }), []);

  useEffect(() => {
    let mounted = true;
    fetch("/api/account/orders", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((payload) => { if (mounted) setHistory(payload); }).catch(() => { if (mounted) setHistory(null); });
    return () => { mounted = false; };
  }, []);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    await Promise.all([fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }), fetch("/api/admin/login", { method: "DELETE", credentials: "same-origin" })]).catch(() => null);
    router.replace("/");
    router.refresh();
  }

  const orders = history === undefined ? <Empty title="შეკვეთები იტვირთება" copy="თქვენი ისტორია დაცული კავშირით იტვირთება." /> : history?.orders?.length ? <div className="grid gap-3">{history.orders.map((order: any) => <article key={order.id} className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface-warm)] px-4 py-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="mono text-[12px] font-bold">{order.id}</p><p className="mt-1 text-[12px] text-[var(--muted)]">{order.createdAt ? date.format(new Date(order.createdAt)) : ""}</p></div><div className="text-right"><span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold">{statusLabel[order.status] ?? order.status}</span><p className="mt-2 text-[14px] font-bold">{formatPrice(order.total)}</p></div></div>{order.flowerCircleDiscount || order.flowerCircleEarned ? <div className="mt-3 flex flex-wrap gap-3 border-t border-[var(--line)] pt-3 text-[12px] text-[var(--muted)]">{order.flowerCircleDiscount ? <span>გამოყენებული სარგებელი: {formatPrice(order.flowerCircleDiscount)}</span> : null}{order.flowerCircleEarned ? <span>დარიცხული სარგებელი: {formatPrice(order.flowerCircleEarned)}</span> : null}</div> : null}</article>)}</div> : <Empty title="შეკვეთები ჯერ არ გაქვთ" copy="პირველი თაიგულის არჩევის შემდეგ შეკვეთები აქ გამოჩნდება." action={<Link href="/catalog" className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-[var(--ink)] px-4 text-[13px] font-semibold text-white">კატალოგში</Link>} />;

  return <div className="container-fb py-8 pb-24 sm:py-12"><div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[210px_minmax(0,1fr)]"><aside className="lg:pt-2"><header className="border-b border-[var(--line)] pb-5 lg:border-0"><p className="font-display text-[25px] leading-none">{displayName}</p><p className="mt-2 truncate text-[12px] text-[var(--muted)]">{email ?? ""}</p></header><nav aria-label="ჩემი ანგარიშის სექციები" className="mt-4 flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible">{tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} aria-current={tab === item.id ? "page" : undefined} className={`min-h-11 shrink-0 rounded-[var(--radius)] px-3 text-left text-[13px] font-semibold transition-colors lg:block lg:w-full ${tab === item.id ? "bg-[var(--surface)] shadow-[var(--shadow-card)]" : "text-[var(--muted)] hover:bg-[var(--surface-warm)] hover:text-[var(--ink)]"}`}>{item.label}</button>)}{isAdmin ? <Link href="/admin" className="mt-2 hidden min-h-11 items-center rounded-[var(--radius)] px-3 text-[13px] font-semibold text-[var(--green)] hover:bg-[var(--green-soft)] lg:flex">ადმინი</Link> : null}<button type="button" onClick={signOut} disabled={signingOut} className="mt-2 hidden min-h-11 w-full rounded-[var(--radius)] px-3 text-left text-[13px] font-semibold text-[var(--action-deep)] hover:bg-[var(--action)]/8 disabled:opacity-60 lg:block">{signingOut ? "გასვლა…" : "გასვლა"}</button></nav></aside><main className="min-w-0">{tab === "orders" ? <div className="grid gap-5"><Panel title="შეკვეთები" description="თქვენი ბოლო შეკვეთები და Flower Circle-ის დარიცხვა.">{orders}</Panel><div className="grid gap-5 sm:grid-cols-2"><Panel title="ყვავილის წრე" description="სტატუსი რეალური eligible შეკვეთებიდან ითვლება."><div className="flex items-end justify-between gap-3"><p className="text-[42px] font-bold leading-none text-[var(--green)]">{history?.summary ? `${history.summary.benefitPercent}%` : "—"}</p><p className="text-right text-[12px] text-[var(--muted)]">{history?.summary ? `${formatPrice(history.summary.availableBenefit)} ხელმისაწვდომია` : "იტვირთება"}</p></div><p className="mt-4 text-[13px] text-[var(--muted)]">eligible შეკვეთები: {history?.summary ? formatPrice(history.summary.eligibleSpend) : "—"}</p></Panel><Panel title="აქტივობა" description="დარიცხული ან Checkout-ში გამოყენებული სარგებელი.">{history?.ledger?.length ? <div className="grid gap-2">{history.ledger.map((event: any) => <div key={event.id} className="flex items-center justify-between gap-3 rounded-[var(--radius)] bg-[var(--surface-warm)] px-3 py-2.5 text-[12px]"><span className="font-semibold">{event.note || "Flower Circle"}</span><span className={event.amount >= 0 ? "font-bold text-[var(--green)]" : "font-bold text-[var(--action-deep)]"}>{event.amount >= 0 ? "+" : ""}{formatPrice(event.amount)}</span></div>)}</div> : <p className="text-[13px] text-[var(--muted)]">აქტივობა ჯერ არ არის.</p>}</Panel></div></div> : null}{tab === "profile" ? <Panel title="პროფილი" description="თქვენი ანგარიშის ძირითადი ინფორმაცია."><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-[12px] font-semibold">სახელი<input readOnly value={displayName} className="min-h-11 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface-warm)] px-3 text-[14px] font-normal outline-none" /></label><label className="grid gap-2 text-[12px] font-semibold">ელფოსტა<input readOnly value={email ?? ""} className="min-h-11 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface-warm)] px-3 text-[14px] font-normal outline-none" /></label></div><p className="mt-4 text-[12px] leading-relaxed text-[var(--muted)]">ეს ველები უსაფრთხო სესიიდან ივსება; თვითმომსახურების რედაქტირება ჯერ არ არის ჩართული.</p></Panel> : null}{tab === "security" ? <Panel title="უსაფრთხოება" description="თქვენი შესვლისა და ანგარიშის დაცვა."><div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface-warm)] p-4"><p className="font-semibold">შესვლის ელფოსტა</p><p className="mt-2 text-[13px] text-[var(--muted)]">{email ?? "—"}</p><p className="mt-4 text-[12px] leading-relaxed text-[var(--muted)]">პაროლის ცვლილება და ორფაქტორიანი ავტორიზაცია ამ ანგარიშისთვის ჯერ არ არის ჩართული.</p></div></Panel> : null}{tab === "addresses" ? <Panel title="მისამართები" description="სწრაფი Checkout-ისთვის შენახული მისამართები."><Empty title="შენახული მისამართები ჯერ არ არის" copy="მიწოდების მისამართი კონკრეტული შეკვეთის ფარგლებში ინახება. მისამართების წიგნაკი მალე დაემატება." /></Panel> : null}{tab === "notifications" ? <Panel title="შეტყობინებები" description="აკონტროლეთ როგორ გიკავშირდებით."><Empty title="პარამეტრები ჯერ არ არის ჩართული" copy="შეკვეთის დასადასტურებლად საჭირო ზარები და შეტყობინებები მუშაობს. პერსონალური არჩევანი მალე დაემატება." /></Panel> : null}{tab === "coupons" ? <Panel title="კუპონები და სარგებელი" description="თქვენი აქტიური კუპონები და Flower Circle-ის გამოსაყენებელი ბალანსი."><div className="rounded-[var(--radius)] bg-[var(--green-soft)] p-5"><p className="font-semibold">Flower Circle სარგებელი</p><p className="mt-3 text-[30px] font-bold text-[var(--green)]">{history?.summary ? formatPrice(history.summary.availableBenefit) : "—"}</p><p className="mt-2 text-[13px] text-[var(--muted)]">ხელმისაწვდომი სარგებელი Checkout-ზე გამოჩნდება, როცა იგი გამოსაყენებელია.</p></div><p className="mt-5 text-[13px] text-[var(--muted)]">პერსონალური კუპონები ახლა არ გაქვთ.</p></Panel> : null}<div className="mt-5 flex flex-wrap gap-3 lg:hidden">{isAdmin ? <Link href="/admin" className="inline-flex min-h-11 items-center rounded-[var(--radius)] border border-[var(--line)] px-4 text-[13px] font-semibold">ადმინი</Link> : null}<button type="button" onClick={signOut} disabled={signingOut} className="min-h-11 rounded-[var(--radius)] px-4 text-[13px] font-semibold text-[var(--action-deep)] hover:bg-[var(--action)]/8">{signingOut ? "გასვლა…" : "გასვლა"}</button></div></main></div></div>;
}
