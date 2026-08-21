"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export function AccountView({
  name,
  email,
  isAdmin = false,
}: {
  name: string | null;
  email: string | null;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [history, setHistory] = useState<any>(null);
  const displayName = name?.trim() || "there";

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => null);
    router.replace("/");
    router.refresh();
  }

  useEffect(() => {
    let active = true;
    fetch("/api/account/orders", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((payload) => { if (active) setHistory(payload); }).catch(() => { if (active) setHistory(null); });
    return () => { active = false; };
  }, []);

  return (
    <div className="container-fb pt-14 pb-28">
      <section className="mx-auto w-full max-w-md rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6 sm:p-7">
        <p className="mono text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--action-deep)]">My account</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight sm:text-[34px]">Welcome, {displayName}</h1>
        <p className="mt-2 text-[14px] text-[var(--muted)]">
          You are signed in{email ? ` as ${email}` : ""}.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/catalog">
            <Button type="button" variant="primary">Continue shopping</Button>
          </Link>
          {isAdmin ? (
            <Link href="/admin">
              <Button type="button" variant="outline">Open admin panel</Button>
            </Link>
          ) : null}
          <Button type="button" variant="outline" onClick={signOut} disabled={signingOut}>
            {signingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </section>
      <section className="mx-auto mt-5 grid w-full max-w-3xl gap-5 md:grid-cols-2">
        <article className="rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6"><p className="mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">Flower Circle</p><p className="mt-3 text-[32px] font-bold text-[var(--green)]">{history?.summary ? `${history.summary.benefitPercent}%` : "—"}</p><p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">{history?.summary ? `${formatPrice(history.summary.availableBenefit)} available benefit · ${formatPrice(history.summary.eligibleSpend)} eligible confirmed orders` : "Your real order history is loading securely."}</p></article>
        <article className="rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6"><p className="mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">Recent orders</p><div className="mt-3 grid gap-2">{history?.orders?.length ? history.orders.map((order: any) => <div key={order.id} className="flex items-center justify-between gap-3 rounded-[var(--radius)] bg-[var(--surface-warm)] px-3 py-2.5 text-[12px]"><span className="font-semibold">{order.id}</span><span className="text-[var(--muted)]">{order.status}</span><span className="font-semibold">{formatPrice(order.total)}</span></div>) : <p className="text-[13px] text-[var(--muted)]">Your confirmed orders will appear here.</p>}</div></article>
      </section>
      <section className="mx-auto mt-5 w-full max-w-3xl rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6"><p className="mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">Flower Circle activity</p><div className="mt-3 grid gap-2">{history?.ledger?.length ? history.ledger.map((event: any) => <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] bg-[var(--surface-warm)] px-3 py-2.5 text-[12px]"><span className="font-semibold capitalize">{event.type}</span><span className="text-[var(--muted)]">{event.note || "Flower Circle event"}</span><span className={event.amount >= 0 ? "font-semibold text-[var(--green)]" : "font-semibold text-[var(--action-deep)]"}>{event.amount >= 0 ? "+" : ""}{formatPrice(event.amount)}</span></div>) : <p className="text-[13px] text-[var(--muted)]">Benefits earned or used at Checkout will appear here.</p>}</div></section>
    </div>
  );
}
