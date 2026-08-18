"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { CloseIcon, SearchIcon, ChevronDown } from "@/components/ui/Icons";
import type { Order, OrderStatus } from "@/lib/server/store";

interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category: string;
  image: string;
  price: number;
  basePrice: number;
  available: boolean;
  bestseller: boolean;
  edited: boolean;
}

interface Stats {
  orderCount: number;
  revenue: number;
  averageOrder: number;
  newCount: number;
  productCount: number;
}

type Tab = "overview" | "orders" | "products";

const STATUSES: OrderStatus[] = ["new", "confirmed", "delivering", "completed", "cancelled"];

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: "bg-[var(--action)]/15 text-[var(--action-deep)]",
  confirmed: "bg-[#7fa8d9]/20 text-[#2f5a8f]",
  delivering: "bg-[#f0be2c]/20 text-[#8a6510]",
  completed: "bg-[var(--green-soft)] text-[var(--green)]",
  cancelled: "bg-black/8 text-[var(--muted)]",
};

export function AdminDashboard({ demoCredentials }: { demoCredentials: boolean }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [o, p] = await Promise.all([
        fetch("/api/admin/orders").then((r) => r.json()),
        fetch("/api/admin/products").then((r) => r.json()),
      ]);
      setOrders(o.orders ?? []);
      setProducts(p.products ?? []);
      setStats(p.stats ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial data load — the admin panel is client-fetched behind auth
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const setStatus = async (id: string, status: OrderStatus) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    void refresh();
  };

  const removeOrder = async (id: string) => {
    await fetch(`/api/admin/orders?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    void refresh();
  };

  const patchProduct = async (id: string, patch: Partial<AdminProduct>) => {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const data = await res.json();
    if (data.products) setProducts(data.products);
  };

  const signOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  };

  const visibleOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q)
    );
  });

  const visibleProducts = products.filter((p) =>
    query.trim() ? p.name.toLowerCase().includes(query.toLowerCase()) : true,
  );

  return (
    <div className="container-fb py-8 pb-24">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Flower&rsquo;s Boutique
          </p>
          <h1 className="font-display mt-1 text-[30px] leading-none tracking-[-0.015em] sm:text-[36px]">
            Admin panel
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Button href="/" variant="outline" size="sm">
            View site
          </Button>
          <Button variant="dark" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      {demoCredentials ? (
        <p className="mt-4 rounded-lg border border-[var(--action)]/30 bg-[var(--action)]/8 px-4 py-3 text-[12.5px] leading-relaxed">
          <strong>Demo credentials are active.</strong> Set{" "}
          <code className="mono">ADMIN_PASSWORD</code> and{" "}
          <code className="mono">ADMIN_SESSION_SECRET</code> in your environment before putting this
          online.
        </p>
      ) : null}

      {/* tabs */}
      <div role="tablist" className="mt-7 flex gap-2 border-b border-[var(--line)]">
        {(
          [
            ["overview", "Overview"],
            ["orders", `Orders${stats?.newCount ? ` (${stats.newCount} new)` : ""}`],
            ["products", "Products"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-[13.5px] font-semibold transition ${
              tab === id
                ? "border-[var(--action)] text-[var(--ink)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------------- overview ---------------- */}
      {tab === "overview" ? (
        <div className="mt-7">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Orders", value: stats?.orderCount ?? 0 },
              { label: "Revenue", value: formatPrice(stats?.revenue ?? 0) },
              { label: "Average order", value: formatPrice(stats?.averageOrder ?? 0) },
              { label: "Products", value: stats?.productCount ?? 0 },
            ].map((s) => (
              <div key={s.label} className="rounded-[var(--radius-lg)] border bg-[var(--surface)] p-5">
                <p className="text-[12px] uppercase tracking-wide text-[var(--muted)]">{s.label}</p>
                <p className="mono mt-2 text-[26px] font-bold leading-none">{s.value}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display mt-9 text-[19px]">Latest orders</h2>
          {loading ? (
            <p className="mt-3 text-[13px] text-[var(--muted)]">Loading…</p>
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              text="Orders placed through checkout will appear here."
            />
          ) : (
            <div className="mt-3 overflow-hidden rounded-[var(--radius-lg)] border bg-[var(--surface)]">
              {orders.slice(0, 5).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setTab("orders");
                    setOpenOrder(o.id);
                  }}
                  className="flex w-full items-center gap-4 border-b px-5 py-3.5 text-left last:border-b-0 hover:bg-black/[0.02]"
                >
                  <span className="mono text-[12.5px] font-semibold">{o.id}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px]">{o.customer.name}</span>
                  <StatusPill status={o.status} />
                  <span className="text-[13px] font-semibold tabular-nums">
                    {formatPrice(o.total)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* ---------------- orders ---------------- */}
      {tab === "orders" ? (
        <div className="mt-7">
          <Toolbar query={query} setQuery={setQuery} placeholder="Search by id, name or phone…">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
              className="h-10 rounded-full border border-[var(--line-strong)] bg-white px-4 pr-8 text-[13px] font-semibold outline-none"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Toolbar>

          {loading ? (
            <p className="mt-4 text-[13px] text-[var(--muted)]">Loading…</p>
          ) : visibleOrders.length === 0 ? (
            <EmptyState
              title="No orders match"
              text="Place a test order through checkout to see it here."
            />
          ) : (
            <div className="mt-4 grid gap-3">
              {visibleOrders.map((o) => {
                const open = openOrder === o.id;
                return (
                  <div key={o.id} className="overflow-hidden rounded-[var(--radius-lg)] border bg-[var(--surface)]">
                    <button
                      onClick={() => setOpenOrder(open ? null : o.id)}
                      aria-expanded={open}
                      className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-left hover:bg-black/[0.02]"
                    >
                      <span className="mono text-[13px] font-semibold">{o.id}</span>
                      <span className="min-w-0 flex-1 truncate text-[13.5px]">
                        {o.customer.name}
                        <span className="ml-2 text-[12.5px] text-[var(--muted)]">
                          {o.customer.phone}
                        </span>
                      </span>
                      <span className="text-[12px] text-[var(--muted)]">
                        {formatDate(o.createdAt.slice(0, 10))}
                      </span>
                      <StatusPill status={o.status} />
                      <span className="text-[14px] font-semibold tabular-nums">
                        {formatPrice(o.total)}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-[var(--muted)] transition ${open ? "rotate-180" : ""}`}
                      />
                    </button>

                    {open ? (
                      <div className="grid gap-6 border-t px-5 py-5 md:grid-cols-[1.1fr_0.9fr]">
                        {/* items */}
                        <div>
                          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                            Items
                          </h3>
                          <ul className="mt-3 grid gap-2.5">
                            {o.items.map((it, i) => (
                              <li key={i} className="flex items-center gap-3">
                                {it.image ? (
                                  <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--surface-warm)]">
                                    <Image
                                      src={it.image}
                                      alt=""
                                      fill
                                      sizes="40px"
                                      className="object-cover"
                                      unoptimized={it.image.startsWith("data:")}
                                    />
                                  </span>
                                ) : null}
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[13px] font-medium">
                                    {it.name}
                                  </span>
                                  <span className="text-[12px] text-[var(--muted)]">
                                    × {it.quantity}
                                  </span>
                                </span>
                                <span className="text-[13px] tabular-nums">
                                  {formatPrice(it.price * it.quantity)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <dl className="mt-4 grid gap-1.5 border-t pt-3 text-[13px]">
                            <Line label="Subtotal" value={formatPrice(o.subtotal)} />
                            <Line
                              label="Delivery"
                              value={o.delivery ? formatPrice(o.delivery) : "Free"}
                            />
                            <Line label="Total" value={formatPrice(o.total)} strong />
                          </dl>
                        </div>

                        {/* customer + actions */}
                        <div>
                          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                            Delivery
                          </h3>
                          <dl className="mt-3 grid gap-1.5 text-[13px]">
                            <Line label="Recipient" value={o.customer.recipient || o.customer.name} />
                            <Line label="Address" value={`${o.customer.address}, ${o.customer.city}`} />
                            <Line label="When" value={`${o.customer.date} · ${o.customer.time}`} />
                            <Line label="Email" value={o.customer.email || "—"} />
                            {o.customer.notes ? (
                              <Line label="Notes" value={o.customer.notes} />
                            ) : null}
                          </dl>

                          <div className="mt-5 flex flex-wrap items-center gap-2">
                            {STATUSES.map((s) => (
                              <button
                                key={s}
                                onClick={() => setStatus(o.id, s)}
                                aria-pressed={o.status === s}
                                className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                                  o.status === s
                                    ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                                    : "border-[var(--line-strong)] hover:border-[var(--ink)]"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => removeOrder(o.id)}
                            className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--action-deep)] hover:underline"
                          >
                            <CloseIcon className="h-3.5 w-3.5" />
                            Delete order
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* ---------------- products ---------------- */}
      {tab === "products" ? (
        <div className="mt-7">
          <Toolbar query={query} setQuery={setQuery} placeholder="Search products…" />

          <div className="mt-4 overflow-x-auto rounded-[var(--radius-lg)] border bg-[var(--surface)]">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b text-[11px] uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-3 py-3 font-semibold">Price ₾</th>
                  <th className="px-3 py-3 font-semibold">In stock</th>
                  <th className="px-3 py-3 font-semibold">Bestseller</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((p) => (
                  <tr key={p.id} className="border-b last:border-b-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--surface-warm)]">
                          <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold">{p.name}</span>
                          <span className="block truncate text-[12px] text-[var(--muted)]">
                            {p.subtitle}
                            {p.edited ? (
                              <span className="ml-2 text-[var(--action-deep)]">edited</span>
                            ) : null}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min={0}
                        defaultValue={p.price}
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (v !== p.price) void patchProduct(p.id, { price: v });
                        }}
                        className="h-9 w-24 rounded-md border border-[var(--line-strong)] bg-white px-2.5 text-[13px] tabular-nums outline-none focus:border-[var(--ink)]"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <Toggle
                        checked={p.available}
                        onChange={(v) => patchProduct(p.id, { available: v })}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <Toggle
                        checked={p.bestseller}
                        onChange={(v) => patchProduct(p.id, { bestseller: v })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-[var(--muted-2)]">
            Price, stock and bestseller changes are stored as overrides on top of the catalog and
            apply immediately across the site.
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------ small pieces ------------------------------ */

function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLE[status]}`}
    >
      {status}
    </span>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "border-t pt-2 font-semibold" : ""}`}>
      <dt className="shrink-0 text-[var(--muted)]">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-[var(--action)]" : "bg-black/15"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Toolbar({
  query,
  setQuery,
  placeholder,
  children,
}: {
  query: string;
  setQuery: (v: string) => void;
  placeholder: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white px-4">
        <SearchIcon className="h-[18px] w-[18px] shrink-0 text-[var(--muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full bg-transparent text-[13.5px] outline-none placeholder:text-[var(--muted-2)]"
        />
      </div>
      {children}
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] py-16 text-center">
      <p className="font-display text-[17px]">{title}</p>
      <p className="mt-1 text-[13px] text-[var(--muted)]">{text}</p>
    </div>
  );
}
