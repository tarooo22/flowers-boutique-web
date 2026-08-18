import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Rewards",
  description: "Earn 1–8% back in petals on every order with Flower's Rewards.",
};

const tiers = [
  { n: 1, label: "Start", note: "You are here", pct: "1%", active: true },
  { n: 2, label: "From 1 000 ₾", note: "", pct: "3%" },
  { n: 3, label: "From 5 000 ₾", note: "", pct: "5%" },
  { n: 4, label: "From 10 000 ₾", note: "Top tier", pct: "8%" },
];

export default function RewardsPage() {
  return (
    <div className="container-fb pt-6 pb-20 sm:pb-28">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Rewards" }]} />
      <h1 className="font-display mt-4 text-[30px] leading-none sm:text-[40px]">Rewards in petals</h1>
      <p className="mt-3 max-w-[60ch] text-[14px] text-[var(--muted)]">
        Every order earns you petals — Flower&rsquo;s Boutique&rsquo;s loyalty currency. Spend more
        over time and your rate climbs from 1% up to 8% back.
      </p>

      {/* balance card */}
      <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--green)] p-6 text-[var(--green-ink)] sm:p-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.16em] text-white/60">Your balance</p>
            <p className="mt-2 text-[40px] font-bold leading-none">
              0 <span className="text-[16px] font-medium text-white/70">petals = 0 ₾</span>
            </p>
            <p className="mt-3 max-w-[42ch] text-[13px] leading-relaxed text-white/75">
              You earn 1% on every order — all confirmed purchases return to you as petals,
              automatically.
            </p>
          </div>
          <div className="md:pl-6">
            <p className="text-[13px] text-white/85">
              Spend <strong>1 000 ₾</strong> in total and your rate rises to <strong>3%</strong>.
            </p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[6%] rounded-full bg-[#7fd6a6]" />
            </div>
          </div>
        </div>
      </div>

      {/* tiers */}
      <div className="mt-10">
        <p className="eyebrow mb-1">How it grows</p>
        <p className="mb-4 text-[13px] text-[var(--muted)]">
          Your rate updates automatically as your lifetime spend increases.
        </p>
        <ul className="divide-y rounded-[var(--radius-lg)] border bg-[var(--surface)]">
          {tiers.map((t) => (
            <li key={t.n} className="flex items-center gap-4 px-5 py-4">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold ${
                  t.active ? "bg-[var(--action)] text-white" : "border border-[var(--line-strong)] text-[var(--muted)]"
                }`}
              >
                {t.n}
              </span>
              <span className="flex-1 text-[14px] font-semibold">
                {t.label}
                {t.note ? <span className="ml-2 text-[12.5px] font-normal text-[var(--muted)]">{t.note}</span> : null}
              </span>
              <span className={`text-[15px] font-bold tabular-nums ${t.active ? "text-[var(--action)]" : "text-[var(--ink)]"}`}>
                {t.pct}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* example */}
      <div className="mt-8">
        <p className="eyebrow mb-2">One example — 3% cashback</p>
        <div className="rounded-[var(--radius-lg)] bg-[var(--surface-warm)] p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-black/10 py-2 text-[14px]">
            <span className="text-[var(--muted)]">Order total</span>
            <span className="tabular-nums">200 ₾</span>
          </div>
          <div className="flex items-center justify-between border-b border-black/10 py-2 text-[14px]">
            <span className="text-[var(--muted)]">Cashback earned at 3%</span>
            <span className="font-semibold text-[var(--green)] tabular-nums">+6 petals</span>
          </div>
          <div className="flex items-center justify-between py-2 text-[15px] font-semibold">
            <span>Effective cost of a 200 ₾ order</span>
            <span className="tabular-nums">194 ₾</span>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted-2)]">
          Petals are a loyalty reward — they are not money, cannot be withdrawn and do not expire.
        </p>
      </div>

      <div className="mt-8">
        <Button href="/catalog" variant="primary" size="lg">Start earning — shop bouquets</Button>
      </div>
    </div>
  );
}
