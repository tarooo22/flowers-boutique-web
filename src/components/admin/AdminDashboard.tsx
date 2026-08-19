"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { SearchIcon, ChevronDown } from "@/components/ui/Icons";
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

const NAV: Array<{ id: Tab; label: string; note: string }> = [
  { id: "overview", label: "Today", note: "At-a-glance operations" },
  { id: "orders", label: "Orders", note: "Fulfilment and delivery" },
  { id: "products", label: "Products", note: "Price and availability" },
];

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
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/products"),
      ]);
      if (!ordersResponse.ok || !productsResponse.ok) throw new Error("Unable to refresh manager data");
      const [ordersPayload, productsPayload] = await Promise.all([
        ordersResponse.json(),
        productsResponse.json(),
      ]);
      setOrders(ordersPayload.orders ?? []);
      setProducts(productsPayload.products ?? []);
      setStats(productsPayload.stats ?? null);
    } catch {
      setFeedback("Could not refresh manager data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const changeTab = (next: Tab) => {
    setTab(next);
    setQuery("");
    setFeedback(null);
  };

  const setStatus = async (id: string, status: OrderStatus) => {
    setBusy(`status:${id}`);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error("Status update failed");
      await refresh();
      setFeedback(`Order ${id} is now ${status}.`);
    } catch {
      setFeedback("Could not update this order. Please retry.");
    } finally {
      setBusy(null);
    }
  };

  const patchProduct = async (id: string, patch: Partial<AdminProduct>) => {
    setBusy(`product:${id}`);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await response.json();
      if (!response.ok || !data.products) throw new Error("Product update failed");
      setProducts(data.products);
      setFeedback("Product changes were saved across the storefront.");
    } catch {
      setFeedback("Could not save the product change. Please retry.");
    } finally {
      setBusy(null);
    }
  };

  const signOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  };

  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (statusFilter !== "all" && order.status !== statusFilter) return false;
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          order.id.toLowerCase().includes(q) ||
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.phone.toLowerCase().includes(q)
        );
      }),
    [orders, query, statusFilter],
  );

  const visibleProducts = useMemo(
    () => products.filter((product) => (!query.trim() ? true : product.name.toLowerCase().includes(query.toLowerCase()))),
    [products, query],
  );

  const pendingOrders = orders.filter((order) => ["new", "confirmed", "delivering"].includes(order.status));

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--surface-warm)]/75 py-5 sm:py-8">
      <div className="container-fb pb-14">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-card)] sm:px-7 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Flower&rsquo;s Boutique · manager workspace</p>
              <h1 className="font-display mt-2 text-[30px] leading-none tracking-[-0.015em] sm:text-[38px]">
                Keep today in bloom.
              </h1>
              <p className="mt-2 max-w-[60ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
                Prioritise new orders, move delivery status forward, and keep the catalog ready without leaving one operational workspace.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Button href="/" variant="outline" size="sm">View site</Button>
              <Button variant="dark" size="sm" onClick={signOut}>Sign out</Button>
            </div>
          </div>
          {demoCredentials ? (
            <p className="mt-5 rounded-[var(--radius)] border border-[var(--action)]/30 bg-[var(--action)]/8 px-4 py-3 text-[12.5px] leading-relaxed">
              <strong>Demo credentials are active.</strong> Configure <code className="mono">ADMIN_PASSWORD</code> and <code className="mono">ADMIN_SESSION_SECRET</code> before giving any team member access.
            </p>
          ) : null}
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)] lg:block">
            <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Workspace</p>
            <nav className="grid gap-1.5" aria-label="Manager workspace">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeTab(item.id)}
                  aria-current={tab === item.id ? "page" : undefined}
                  className={`min-h-14 rounded-[var(--radius)] px-3.5 py-2.5 text-left transition ${
                    tab === item.id
                      ? "bg-[var(--ink)] text-white shadow-[var(--shadow-card)]"
                      : "text-[var(--ink)] hover:bg-[var(--surface-sand)]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2 text-[13px] font-semibold">
                    {item.label}
                    {item.id === "orders" && stats?.newCount ? (
                      <span className={`mono rounded-full px-2 py-0.5 text-[10px] ${tab === item.id ? "bg-white/15 text-white" : "bg-[var(--action)]/15 text-[var(--action-deep)]"}`}>{stats.newCount}</span>
                    ) : null}
                  </span>
                  <span className={`mt-0.5 block text-[11px] ${tab === item.id ? "text-white/70" : "text-[var(--muted)]"}`}>{item.note}</span>
                </button>
              ))}
            </nav>
            <div className="mt-5 border-t border-[var(--line)] px-3 pt-4 text-[12px] leading-relaxed text-[var(--muted)]">
              {stats?.newCount ? `${stats.newCount} new order${stats.newCount === 1 ? "" : "s"} need attention.` : "No new orders are waiting."}
            </div>
          </aside>

          <div>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Manager workspace">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeTab(item.id)}
                  aria-pressed={tab === item.id}
                  className={`min-h-11 shrink-0 rounded-full border px-4 text-[12.5px] font-semibold transition ${
                    tab === item.id ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line-strong)] bg-[var(--surface)]"
                  }`}
                >
                  {item.label}{item.id === "orders" && stats?.newCount ? ` · ${stats.newCount}` : ""}
                </button>
              ))}
            </nav>

            {feedback ? (
              <div role="status" className="mt-3 rounded-[var(--radius)] border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-3 text-[12.5px] text-[var(--muted)]">
                {feedback}
              </div>
            ) : null}

            <section className="mt-3 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:mt-0 sm:p-6">
              {tab === "overview" ? (
                <Overview
                  stats={stats}
                  pendingOrders={pendingOrders}
                  loading={loading}
                  onOpenOrders={() => changeTab("orders")}
                  onOpenOrder={(id) => {
                    setOpenOrder(id);
                    changeTab("orders");
                  }}
                />
              ) : null}
              {tab === "orders" ? (
                <OrdersWorkspace
                  loading={loading}
                  orders={visibleOrders}
                  query={query}
                  setQuery={setQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  openOrder={openOrder}
                  setOpenOrder={setOpenOrder}
                  setStatus={setStatus}
                  busy={busy}
                />
              ) : null}
              {tab === "products" ? (
                <ProductsWorkspace
                  loading={loading}
                  products={visibleProducts}
                  query={query}
                  setQuery={setQuery}
                  patchProduct={patchProduct}
                  busy={busy}
                />
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Overview({
  stats,
  pendingOrders,
  loading,
  onOpenOrders,
  onOpenOrder,
}: {
  stats: Stats | null;
  pendingOrders: Order[];
  loading: boolean;
  onOpenOrders: () => void;
  onOpenOrder: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Today</p>
          <h2 className="font-display mt-2 text-[24px] leading-none sm:text-[29px]">The operating picture</h2>
        </div>
        <button type="button" onClick={onOpenOrders} className="min-h-11 rounded-full border border-[var(--line-strong)] px-4 text-[12.5px] font-semibold transition hover:border-[var(--ink)]">
          Open all orders
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "All orders", value: stats?.orderCount ?? 0, note: "Recorded storefront orders" },
          { label: "Revenue", value: formatPrice(stats?.revenue ?? 0), note: "Current order total" },
          { label: "Average order", value: formatPrice(stats?.averageOrder ?? 0), note: "Average checkout value" },
          { label: "Products", value: stats?.productCount ?? 0, note: "Catalog items managed here" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface-warm)]/55 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{stat.label}</p>
            <p className="mono mt-3 text-[25px] font-bold leading-none">{stat.value}</p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--muted)]">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-[19px]">Latest orders</h3>
            <span className="text-[12px] text-[var(--muted)]">Select one to manage fulfilment</span>
          </div>
          {loading ? <LoadingRows /> : pendingOrders.length === 0 ? (
            <EmptyState title="The queue is clear" text="New orders will appear here as soon as checkout completes." />
          ) : (
            <div className="mt-3 overflow-hidden rounded-[var(--radius)] border border-[var(--line)]">
              {pendingOrders.slice(0, 5).map((order) => (
                <button key={order.id} type="button" onClick={() => onOpenOrder(order.id)} className="flex min-h-16 w-full items-center gap-3 border-b border-[var(--line)] px-4 text-left transition last:border-b-0 hover:bg-[var(--surface-warm)]">
                  <span className="mono text-[12px] font-semibold">{order.id}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{order.customer.name}</span>
                  <StatusPill status={order.status} />
                  <span className="text-[13px] font-semibold tabular-nums">{formatPrice(order.total)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-[var(--radius)] bg-[var(--ink)] p-5 text-white">
          <p className="mono text-[11px] uppercase tracking-[0.16em] text-white/55">Attention needed</p>
          <p className="font-display mt-3 text-[31px] leading-none">{stats?.newCount ?? 0}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70">New orders are ready for confirmation. Move each order through status directly from its delivery details.</p>
          <button type="button" onClick={onOpenOrders} className="mt-5 min-h-11 rounded-full bg-white px-4 text-[12.5px] font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-sand)]">
            Manage new orders
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersWorkspace({
  loading,
  orders,
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  openOrder,
  setOpenOrder,
  setStatus,
  busy,
}: {
  loading: boolean;
  orders: Order[];
  query: string;
  setQuery: (value: string) => void;
  statusFilter: OrderStatus | "all";
  setStatusFilter: (value: OrderStatus | "all") => void;
  openOrder: string | null;
  setOpenOrder: (id: string | null) => void;
  setStatus: (id: string, status: OrderStatus) => void;
  busy: string | null;
}) {
  return (
    <div>
      <SectionHeading eyebrow="Fulfilment" title="Orders in motion" text="Search, open delivery details and advance the current status without leaving the workspace." />
      <Toolbar query={query} setQuery={setQuery} placeholder="Search by ID, name or phone…">
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "all")} className="h-11 rounded-full border border-[var(--line-strong)] bg-white px-4 pr-8 text-[13px] font-semibold outline-none focus:border-[var(--ink)]">
          <option value="all">All statuses</option>
          {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </Toolbar>
      {loading ? <LoadingRows /> : orders.length === 0 ? <EmptyState title="No orders match" text="Change the filters or wait for the next storefront checkout." /> : (
        <div className="mt-4 grid gap-3">
          {orders.map((order) => <OrderCard key={order.id} order={order} open={openOrder === order.id} setOpenOrder={setOpenOrder} setStatus={setStatus} busy={busy === `status:${order.id}`} />)}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, open, setOpenOrder, setStatus, busy }: { order: Order; open: boolean; setOpenOrder: (id: string | null) => void; setStatus: (id: string, status: OrderStatus) => void; busy: boolean }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)]">
      <button type="button" onClick={() => setOpenOrder(open ? null : order.id)} aria-expanded={open} className="flex min-h-16 w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 text-left transition hover:bg-[var(--surface-warm)] sm:px-5">
        <span className="mono text-[12.5px] font-semibold">{order.id}</span>
        <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">{order.customer.name}<span className="ml-2 text-[12px] font-normal text-[var(--muted)]">{order.customer.phone}</span></span>
        <span className="text-[12px] text-[var(--muted)]">{formatDate(order.createdAt.slice(0, 10))}</span>
        <StatusPill status={order.status} />
        <span className="text-[14px] font-semibold tabular-nums">{formatPrice(order.total)}</span>
        <ChevronDown className={`h-4 w-4 text-[var(--muted)] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="grid gap-6 border-t border-[var(--line)] bg-[var(--surface-warm)]/40 px-4 py-5 lg:grid-cols-[1.1fr_0.9fr] sm:px-5">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Order contents</h3>
            <ul className="mt-3 grid gap-2.5">
              {order.items.map((item, index) => <li key={`${item.name}-${index}`} className="flex items-center gap-3"><OrderItemImage image={item.image} /><span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium">{item.name}</span><span className="text-[12px] text-[var(--muted)]">× {item.quantity}</span></span><span className="text-[13px] tabular-nums">{formatPrice(item.price * item.quantity)}</span></li>)}
            </ul>
            <dl className="mt-4 grid gap-1.5 border-t border-[var(--line)] pt-3 text-[13px]"><Line label="Subtotal" value={formatPrice(order.subtotal)} /><Line label="Delivery" value={order.delivery ? formatPrice(order.delivery) : "Free"} /><Line label="Total" value={formatPrice(order.total)} strong /></dl>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Delivery details</h3>
            <dl className="mt-3 grid gap-1.5 text-[13px]"><Line label="Recipient" value={order.customer.recipient || order.customer.name} /><Line label="Address" value={`${order.customer.address}, ${order.customer.city}`} /><Line label="When" value={`${order.customer.date} · ${order.customer.time}`} /><Line label="Email" value={order.customer.email || "—"} />{order.customer.notes ? <Line label="Notes" value={order.customer.notes} /> : null}</dl>
            <div className="mt-5 border-t border-[var(--line)] pt-4"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Set fulfilment status</p><div className="mt-3 flex flex-wrap gap-2">{STATUSES.map((status) => <button key={status} type="button" disabled={busy || order.status === status} onClick={() => setStatus(order.id, status)} aria-pressed={order.status === status} className={`min-h-10 rounded-full border px-3 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${order.status === status ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line-strong)] bg-white hover:border-[var(--ink)]"}`}>{status}</button>)}</div>{busy ? <p className="mt-3 text-[12px] text-[var(--muted)]">Saving status…</p> : null}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProductsWorkspace({ loading, products, query, setQuery, patchProduct, busy }: { loading: boolean; products: AdminProduct[]; query: string; setQuery: (value: string) => void; patchProduct: (id: string, patch: Partial<AdminProduct>) => void; busy: string | null }) {
  return (
    <div>
      <SectionHeading eyebrow="Catalog control" title="Products customers can buy" text="Update price, availability and bestseller placement. Changes apply on top of the production catalog." />
      <Toolbar query={query} setQuery={setQuery} placeholder="Search products…" />
      {loading ? <LoadingRows /> : products.length === 0 ? <EmptyState title="No matching products" text="Change the search term to find another catalog item." /> : (
        <div className="mt-4 overflow-x-auto rounded-[var(--radius)] border border-[var(--line)]">
          <table className="w-full min-w-[720px] text-left"><thead><tr className="border-b border-[var(--line)] bg-[var(--surface-warm)]/70 text-[11px] uppercase tracking-wide text-[var(--muted)]"><th className="px-5 py-3 font-semibold">Product</th><th className="px-3 py-3 font-semibold">Price ₾</th><th className="px-3 py-3 font-semibold">Available</th><th className="px-3 py-3 font-semibold">Bestseller</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-[var(--line)] last:border-b-0"><td className="px-5 py-3"><div className="flex items-center gap-3"><span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--surface-warm)]"><Image src={product.image} alt="" fill sizes="40px" unoptimized={product.image.startsWith("/manus-storage/")} className="object-cover" /></span><span className="min-w-0"><span className="block truncate text-[13px] font-semibold">{product.name}</span><span className="block truncate text-[12px] text-[var(--muted)]">{product.subtitle}{product.edited ? <span className="ml-2 text-[var(--action-deep)]">edited</span> : null}</span></span></div></td><td className="px-3 py-3"><input type="number" min={0} defaultValue={product.price} disabled={busy === `product:${product.id}`} onBlur={(event) => { const value = Number(event.target.value); if (value !== product.price) void patchProduct(product.id, { price: value }); }} className="h-10 w-24 rounded-md border border-[var(--line-strong)] bg-white px-2.5 text-[13px] tabular-nums outline-none transition focus:border-[var(--ink)] disabled:opacity-50" /></td><td className="px-3 py-3"><Toggle checked={product.available} disabled={busy === `product:${product.id}`} onChange={(value) => patchProduct(product.id, { available: value })} /></td><td className="px-3 py-3"><Toggle checked={product.bestseller} disabled={busy === `product:${product.id}`} onChange={(value) => patchProduct(product.id, { bestseller: value })} /></td></tr>)}</tbody></table>
        </div>
      )}
      <p className="mt-3 text-[12px] leading-relaxed text-[var(--muted-2)]">Price, availability and bestseller updates are stored as catalog overrides and apply immediately across the storefront.</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div><p className="eyebrow">{eyebrow}</p><h2 className="font-display mt-2 text-[24px] leading-none sm:text-[29px]">{title}</h2><p className="mt-2 max-w-[66ch] text-[13px] leading-relaxed text-[var(--muted)]">{text}</p></div>; }
function StatusPill({ status }: { status: OrderStatus }) { return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[status]}`}>{status}</span>; }
function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className={`flex justify-between gap-4 ${strong ? "border-t border-[var(--line)] pt-2 font-semibold" : ""}`}><dt className="shrink-0 text-[var(--muted)]">{label}</dt><dd className="text-right">{value}</dd></div>; }
function Toggle({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: (value: boolean) => void }) { return <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)} className={`relative h-10 w-12 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-[var(--action)]" : "bg-black/15"}`}><span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow transition-all ${checked ? "left-3" : "left-1"}`} /></button>; }
function Toolbar({ query, setQuery, placeholder, children }: { query: string; setQuery: (value: string) => void; placeholder: string; children?: React.ReactNode }) { return <div className="mt-5 flex flex-wrap items-center gap-3"><div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white px-4"><SearchIcon className="h-[18px] w-[18px] shrink-0 text-[var(--muted)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="h-11 w-full bg-transparent text-[13.5px] outline-none placeholder:text-[var(--muted-2)]" /></div>{children}</div>; }
function EmptyState({ title, text }: { title: string; text: string }) { return <div className="mt-4 rounded-[var(--radius)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-warm)]/35 py-14 text-center"><p className="font-display text-[19px]">{title}</p><p className="mx-auto mt-2 max-w-[42ch] text-[13px] leading-relaxed text-[var(--muted)]">{text}</p></div>; }
function LoadingRows() { return <div className="mt-4 grid gap-3"><div className="h-16 animate-pulse rounded-[var(--radius)] bg-[var(--surface-warm)]" /><div className="h-16 animate-pulse rounded-[var(--radius)] bg-[var(--surface-warm)]" /><div className="h-16 animate-pulse rounded-[var(--radius)] bg-[var(--surface-warm)]" /></div>; }
function OrderItemImage({ image }: { image?: string }) { return image ? <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--surface-warm)]"><Image src={image} alt="" fill sizes="40px" unoptimized={image.startsWith("data:") || image.startsWith("/manus-storage/")} className="object-cover" /></span> : <span className="h-12 w-10 shrink-0 rounded-md bg-[var(--surface-warm)]" />; }
