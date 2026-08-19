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

type Tab = "products" | "categories" | "orders" | "banners" | "settings";

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
  const [tab, setTab] = useState<Tab>("products");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
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
    await Promise.all([
      fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }),
      fetch("/api/admin/login", { method: "DELETE", credentials: "same-origin" }),
    ]);
    router.replace("/");
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

  const categories = useMemo(
    () => Array.from(products.reduce((groups, product) => {
      const key = product.category || "Uncategorised";
      groups.set(key, (groups.get(key) ?? 0) + 1);
      return groups;
    }, new Map<string, number>()).entries()).map(([name, count]) => ({ name, count })),
    [products],
  );

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesQuery = !query.trim() || product.name.toLowerCase().includes(query.toLowerCase()) || product.subtitle?.toLowerCase().includes(query.toLowerCase());
    const matchesAvailability = availabilityFilter === "all" || (availabilityFilter === "available" ? product.available : !product.available);
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesQuery && matchesAvailability && matchesCategory;
  }), [availabilityFilter, categoryFilter, products, query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8] py-8 pb-24 sm:py-12">
      <div className="mx-auto w-full max-w-7xl px-4">
        <header className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#C4603A] text-lg text-white" aria-hidden="true">◆</span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8E705F]">Flower&rsquo;s Boutique · Control room</p>
              <h1 className="mt-1 font-display text-[30px] leading-none text-[#1C1917] sm:text-[38px]">Admin Panel</h1>
              <p className="mt-2 text-[13px] text-[#76685F]">Manage products, orders and storefront content</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button href="/" variant="outline" size="sm">View storefront</Button>
            <Button variant="dark" size="sm" onClick={signOut}>Sign out</Button>
          </div>
        </header>
        {demoCredentials ? <p className="mt-5 rounded-lg border border-[#C4603A]/30 bg-[#C4603A]/8 px-4 py-3 text-[12.5px] leading-relaxed text-[#6D5142]"><strong>Demo credentials are active.</strong> Configure real administrator credentials before sharing access.</p> : null}
        <div role="tablist" className="mt-8 overflow-x-auto border-b border-[#E8E4DF]">
          <div className="flex min-w-max gap-2 sm:gap-4">
            {(["products", "categories", "orders", "banners", "settings"] as Tab[]).map((id) => {
              const label = id === "products" ? "Products" : id === "categories" ? "Categories" : id === "orders" ? `Orders${stats?.newCount ? ` (${stats.newCount} new)` : ""}` : id === "banners" ? "Banners" : "Settings";
              return <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setQuery(""); setFeedback(null); }} className={`border-b-2 px-3 py-3 text-sm font-medium transition sm:px-4 ${tab === id ? "border-[#C4603A] text-[#C4603A]" : "border-transparent text-[#76685F] hover:text-[#1C1917]"}`}>{label}</button>;
            })}
          </div>
        </div>
      {feedback ? <div role="status" className="mt-4 rounded-[var(--radius)] border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-3 text-[12.5px] text-[var(--muted)]">{feedback}</div> : null}
      {tab === "products" ? <ProductsWorkspace loading={loading} products={visibleProducts} query={query} setQuery={setQuery} availabilityFilter={availabilityFilter} setAvailabilityFilter={setAvailabilityFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} categories={categories} patchProduct={patchProduct} busy={busy} /> : null}
      {tab === "categories" ? <CategoriesPanel categories={categories} /> : null}
      {tab === "orders" ? <OrdersWorkspace loading={loading} orders={visibleOrders} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} openOrder={openOrder} setOpenOrder={setOpenOrder} setStatus={setStatus} busy={busy} /> : null}
      {tab === "banners" ? <LegacyNotice title="Banners" text="Current storefront editorial blocks are published from protected project content. Their live assets remain available on the storefront without exposing unsafe public editing controls." /> : null}
      {tab === "settings" ? <LegacyNotice title="Storefront settings" text="Delivery, payments and account security remain protected configuration. Use the current manager order and product controls for day-to-day storefront operations." /> : null}
    </div>
    </div>
  );
}

function Overview({
  stats,
  orders,
  loading,
  onOpenOrders,
  onOpenOrder,
}: {
  stats: Stats | null;
  orders: Order[];
  loading: boolean;
  onOpenOrders: () => void;
  onOpenOrder: (id: string) => void;
}) {
  return (
    <div className="mt-7">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Orders", value: stats?.orderCount ?? 0 },
          { label: "Revenue", value: formatPrice(stats?.revenue ?? 0) },
          { label: "Average order", value: formatPrice(stats?.averageOrder ?? 0) },
          { label: "Products", value: stats?.productCount ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--radius-lg)] border bg-[var(--surface)] p-5">
            <p className="text-[12px] uppercase tracking-wide text-[var(--muted)]">{stat.label}</p>
            <p className="mono mt-2 text-[26px] font-bold leading-none">{stat.value}</p>
          </div>
        ))}
      </div>
      <h2 className="font-display mt-9 text-[19px]">Latest orders</h2>
      {loading ? <LoadingRows /> : orders.length === 0 ? (
        <EmptyState title="No orders yet" text="Orders placed through checkout will appear here." />
          ) : (
        <div className="mt-3 overflow-hidden rounded-[var(--radius-lg)] border bg-[var(--surface)]">
          {orders.slice(0, 5).map((order) => <button key={order.id} type="button" onClick={() => onOpenOrder(order.id)} className="flex w-full items-center gap-4 border-b px-5 py-3.5 text-left last:border-b-0 hover:bg-black/[0.02]"><span className="mono text-[12.5px] font-semibold">{order.id}</span><span className="min-w-0 flex-1 truncate text-[13px]">{order.customer.name}</span><StatusPill status={order.status} /><span className="text-[13px] font-semibold tabular-nums">{formatPrice(order.total)}</span></button>)}
        </div>
      )}
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

function ProductsWorkspace({ loading, products, query, setQuery, availabilityFilter, setAvailabilityFilter, categoryFilter, setCategoryFilter, categories, patchProduct, busy }: { loading: boolean; products: AdminProduct[]; query: string; setQuery: (value: string) => void; availabilityFilter: "all" | "available" | "unavailable"; setAvailabilityFilter: (value: "all" | "available" | "unavailable") => void; categoryFilter: string; setCategoryFilter: (value: string) => void; categories: Array<{ name: string; count: number }>; patchProduct: (id: string, patch: Partial<AdminProduct>) => void; busy: string | null }) {
  return (
    <div className="pt-8">
      <div className="mb-8"><h2 className="text-3xl font-bold text-[#1C1917]">Manage Products</h2><p className="mt-2 text-sm text-[#76685F]">Add, edit and manage Flower&rsquo;s Boutique products</p></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Toolbar query={query} setQuery={setQuery} placeholder="Search…" />
        <select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value as "all" | "available" | "unavailable")} className="h-11 rounded-lg border border-[#E8E4DF] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#C4603A]"><option value="all">All availability</option><option value="available">Available</option><option value="unavailable">Unavailable</option></select>
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-11 rounded-lg border border-[#E8E4DF] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#C4603A]"><option value="all">All categories</option>{categories.map((category) => <option key={category.name} value={category.name}>{category.name}</option>)}</select>
      </div>
      {loading ? <LoadingRows /> : products.length === 0 ? <EmptyState title="No matching products" text="Change the search term to find another catalog item." /> : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-[#E8E4DF] bg-white shadow-sm">
          <table className="w-full min-w-[780px] text-left"><thead><tr className="border-b border-[#E8E4DF] bg-[#FAFAF8] text-[11px] uppercase tracking-wide text-[#76685F]"><th className="px-5 py-3 font-semibold">Product</th><th className="px-3 py-3 font-semibold">Category</th><th className="px-3 py-3 font-semibold">Price ₾</th><th className="px-3 py-3 font-semibold">Available</th><th className="px-3 py-3 font-semibold">Featured</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-[#F1EEEA] last:border-b-0"><td className="px-5 py-3"><div className="flex items-center gap-3"><span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[#F5F0E8]"><Image src={product.image} alt="" fill sizes="40px" unoptimized={product.image.startsWith("/manus-storage/")} className="object-cover" /></span><span className="min-w-0"><span className="block truncate text-[13px] font-semibold text-[#1C1917]">{product.name}</span><span className="block truncate text-[12px] text-[#76685F]">{product.subtitle}{product.edited ? <span className="ml-2 text-[#C4603A]">edited</span> : null}</span></span></div></td><td className="px-3 py-3 text-[12px] text-[#76685F]">{product.category}</td><td className="px-3 py-3"><input type="number" min={0} defaultValue={product.price} disabled={busy === `product:${product.id}`} onBlur={(event) => { const value = Number(event.target.value); if (value !== product.price) void patchProduct(product.id, { price: value }); }} className="h-9 w-24 rounded-md border border-[#E8E4DF] bg-white px-2.5 text-[13px] tabular-nums outline-none focus:ring-2 focus:ring-[#C4603A] disabled:opacity-50" /></td><td className="px-3 py-3"><Toggle checked={product.available} disabled={busy === `product:${product.id}`} onChange={(value) => patchProduct(product.id, { available: value })} /></td><td className="px-3 py-3"><Toggle checked={product.bestseller} disabled={busy === `product:${product.id}`} onChange={(value) => patchProduct(product.id, { bestseller: value })} /></td></tr>)}</tbody></table>
        </div>
      )}
      <p className="mt-3 text-[12px] leading-relaxed text-[#8B817A]">Price, availability and featured updates are stored as catalog overrides and apply immediately across the storefront.</p>
    </div>
  );
}

function CategoriesPanel({ categories }: { categories: Array<{ name: string; count: number }> }) {
  return <div className="pt-8"><div className="mb-8"><h2 className="text-3xl font-bold text-[#1C1917]">Manage Categories</h2><p className="mt-2 text-sm text-[#76685F]">Live catalog taxonomy used by the current storefront</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <div key={category.name} className="rounded-lg border border-[#E8E4DF] bg-white p-5 shadow-sm"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C4603A]">Category</p><h3 className="mt-2 text-[17px] font-semibold text-[#1C1917]">{category.name}</h3><p className="mt-2 text-[13px] text-[#76685F]">{category.count} product{category.count === 1 ? "" : "s"} in the live catalog</p></div>)}</div></div>;
}

function LegacyNotice({ title, text }: { title: string; text: string }) {
  return <div className="pt-8"><div className="rounded-lg border border-[#E8E4DF] bg-white p-6 shadow-sm"><h2 className="text-3xl font-bold text-[#1C1917]">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#76685F]">{text}</p></div></div>;
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div><p className="eyebrow">{eyebrow}</p><h2 className="font-display mt-2 text-[24px] leading-none sm:text-[29px]">{title}</h2><p className="mt-2 max-w-[66ch] text-[13px] leading-relaxed text-[var(--muted)]">{text}</p></div>; }
function StatusPill({ status }: { status: OrderStatus }) { return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[status]}`}>{status}</span>; }
function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className={`flex justify-between gap-4 ${strong ? "border-t border-[var(--line)] pt-2 font-semibold" : ""}`}><dt className="shrink-0 text-[var(--muted)]">{label}</dt><dd className="text-right">{value}</dd></div>; }
function Toggle({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: (value: boolean) => void }) { return <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)} className={`relative h-10 w-12 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-[var(--action)]" : "bg-black/15"}`}><span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow transition-all ${checked ? "left-3" : "left-1"}`} /></button>; }
function Toolbar({ query, setQuery, placeholder, children }: { query: string; setQuery: (value: string) => void; placeholder: string; children?: React.ReactNode }) { return <div className="flex min-w-[220px] items-center gap-2 rounded-lg border border-[#E8E4DF] bg-white px-3"><SearchIcon className="h-[18px] w-[18px] shrink-0 text-[#8B817A]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="h-11 w-full bg-transparent text-[13.5px] outline-none placeholder:text-[#A69B92]" />{children}</div>; }
function EmptyState({ title, text }: { title: string; text: string }) { return <div className="mt-4 rounded-[var(--radius)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-warm)]/35 py-14 text-center"><p className="font-display text-[19px]">{title}</p><p className="mx-auto mt-2 max-w-[42ch] text-[13px] leading-relaxed text-[var(--muted)]">{text}</p></div>; }
function LoadingRows() { return <div className="mt-4 grid gap-3"><div className="h-16 animate-pulse rounded-[var(--radius)] bg-[var(--surface-warm)]" /><div className="h-16 animate-pulse rounded-[var(--radius)] bg-[var(--surface-warm)]" /><div className="h-16 animate-pulse rounded-[var(--radius)] bg-[var(--surface-warm)]" /></div>; }
function OrderItemImage({ image }: { image?: string }) { return image ? <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--surface-warm)]"><Image src={image} alt="" fill sizes="40px" unoptimized={image.startsWith("data:") || image.startsWith("/manus-storage/")} className="object-cover" /></span> : <span className="h-12 w-10 shrink-0 rounded-md bg-[var(--surface-warm)]" />; }
