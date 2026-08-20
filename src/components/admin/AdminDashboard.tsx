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
  categoryId: string;
  slug: string;
  name: string;
  nameKa: string;
  nameEn: string;
  descriptionKa: string;
  descriptionEn: string;
  subtitle?: string;
  category: string;
  image: string;
  price: number;
  priceMax: number;
  basePrice: number;
  priceOnRequest: boolean;
  unitType: string;
  available: boolean;
  bestseller: boolean;
  published: boolean;
  edited: boolean;
}

interface AdminCategory {
  id: string;
  nameKa: string;
  nameEn: string;
  descriptionKa: string;
  descriptionEn: string;
  slug: string;
}

type ProductDraft = {
  nameKa: string;
  nameEn: string;
  descriptionKa: string;
  descriptionEn: string;
  price: number;
  priceMax: number;
  priceOnRequest: boolean;
  unitType: string;
  categoryId: number;
  imageUrl: string;
  available: boolean;
  published: boolean;
  bestseller: boolean;
};

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
  const [adminCategories, setAdminCategories] = useState<AdminCategory[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);

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
      setAdminCategories(productsPayload.categories ?? []);
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

  const saveProduct = async (draft: ProductDraft, id?: string) => {
    setBusy(id ? `editor:${id}` : "editor:create");
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/products", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, ...(id ? { id } : {}) }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.products) throw new Error("Product save failed");
      setProducts(payload.products);
      setEditingProduct(null);
      setCreatingProduct(false);
      setFeedback(id ? "Product changes were saved." : "Product was added to the catalog.");
    } catch {
      setFeedback("Could not save the product. Please review the required fields and try again.");
    } finally {
      setBusy(null);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product from the catalog? This cannot be undone.")) return;
    setBusy(`delete:${id}`);
    setFeedback(null);
    try {
      const response = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok || !payload.products) throw new Error("Product deletion failed");
      setProducts(payload.products);
      setEditingProduct(null);
      setFeedback("Product was deleted from the catalog.");
    } catch {
      setFeedback("Could not delete the product. Please try again.");
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

  const categorySummaries = useMemo(
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
    <div className="min-h-screen bg-[var(--surface-warm)] py-6 pb-24 sm:py-8">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <header className="rounded-[var(--radius-lg)] bg-[var(--ink)] px-6 py-6 text-white shadow-[var(--shadow-card)] sm:px-8 sm:py-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">Flower&rsquo;s Boutique · Operations</p>
              <h1 className="mt-2 font-display text-[31px] leading-none sm:text-[40px]">ადმინისტრირების პანელი</h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/72">პროდუქტების, კატეგორიების, შეკვეთებისა და storefront-ის ოპერაციული მართვა ერთ სივრცეში.</p>
            </div>
            <Button href="/" variant="light" size="sm">მაღაზია</Button>
          </div>
        </header>
        <div role="tablist" className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-card)]">
          <div className="flex min-w-max gap-1.5">
            {(["products", "categories", "orders", "banners", "settings"] as Tab[]).map((id) => {
              const label = id === "products" ? "პროდუქტები" : id === "categories" ? "კატეგორიები" : id === "orders" ? `შეკვეთები${stats?.newCount ? ` · ${stats.newCount}` : ""}` : id === "banners" ? "ბანერები" : "პარამეტრები";
              return <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setQuery(""); setFeedback(null); }} className={`min-h-10 rounded-[var(--radius)] px-4 text-[12.5px] font-semibold transition ${tab === id ? "bg-[var(--ink)] text-white shadow-sm" : "text-[var(--muted)] hover:bg-[var(--surface-sand)] hover:text-[var(--ink)]"}`}>{label}</button>;
            })}
          </div>
        </div>
        {demoCredentials ? <p className="mt-4 rounded-[var(--radius)] border border-[var(--action)]/30 bg-[var(--action)]/8 px-4 py-3 text-[12.5px] leading-relaxed text-[var(--action-deep)]"><strong>Demo credentials are active.</strong> Configure real administrator credentials before sharing access.</p> : null}
      {feedback ? <div role="status" className="mt-4 rounded-[var(--radius)] border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-3 text-[12.5px] text-[var(--muted)]">{feedback}</div> : null}
      {tab === "products" ? <ProductsWorkspace loading={loading} products={visibleProducts} query={query} setQuery={setQuery} availabilityFilter={availabilityFilter} setAvailabilityFilter={setAvailabilityFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} categories={categorySummaries} patchProduct={patchProduct} onAdd={() => setCreatingProduct(true)} onEdit={setEditingProduct} onDelete={deleteProduct} busy={busy} /> : null}
      {tab === "categories" ? <CategoriesPanel categories={adminCategories} summaries={categorySummaries} /> : null}
      {tab === "orders" ? <OrdersWorkspace loading={loading} orders={visibleOrders} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} openOrder={openOrder} setOpenOrder={setOpenOrder} setStatus={setStatus} busy={busy} /> : null}
      {tab === "banners" ? <LegacyNotice title="Banners" text="Current storefront editorial blocks are published from protected project content. Their live assets remain available on the storefront without exposing unsafe public editing controls." /> : null}
      {tab === "settings" ? <LegacyNotice title="Storefront settings" text="Delivery, payments and account security remain protected configuration. Use the current manager order and product controls for day-to-day storefront operations." /> : null}
      {(editingProduct || creatingProduct) ? <ProductEditor product={editingProduct} categories={adminCategories} busy={busy === (editingProduct ? `editor:${editingProduct.id}` : "editor:create")} onClose={() => { setEditingProduct(null); setCreatingProduct(false); }} onSave={(draft) => saveProduct(draft, editingProduct?.id)} onDelete={editingProduct ? () => deleteProduct(editingProduct.id) : undefined} /> : null}
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

function ProductsWorkspace({ loading, products, query, setQuery, availabilityFilter, setAvailabilityFilter, categoryFilter, setCategoryFilter, categories, patchProduct, onAdd, onEdit, onDelete, busy }: { loading: boolean; products: AdminProduct[]; query: string; setQuery: (value: string) => void; availabilityFilter: "all" | "available" | "unavailable"; setAvailabilityFilter: (value: "all" | "available" | "unavailable") => void; categoryFilter: string; setCategoryFilter: (value: string) => void; categories: Array<{ name: string; count: number }>; patchProduct: (id: string, patch: Partial<AdminProduct>) => void; onAdd: () => void; onEdit: (product: AdminProduct) => void; onDelete: (id: string) => void; busy: string | null }) {
  return <div className="pt-7">
    <div className="mb-5"><p className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Catalog operations</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-display text-[30px] leading-none text-[var(--ink)]">პროდუქტების მართვა</h2><p className="mt-2 text-sm text-[var(--muted)]">დაამატეთ, შეცვალეთ და მართეთ Flower&rsquo;s Boutique-ის პროდუქტები</p></div><Button type="button" variant="dark" size="sm" onClick={onAdd}>+ ახალი პროდუქტი</Button></div></div>
    <div className="grid gap-3 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)] md:grid-cols-[1.25fr_0.9fr_0.9fr]">
      <Toolbar query={query} setQuery={setQuery} placeholder="ძებნა…" />
      <select aria-label="Filter product availability" value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value as "all" | "available" | "unavailable")} className="h-11 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--action)]"><option value="all">ყველა სტატუსი</option><option value="available">მხოლოდ მარაგში</option><option value="unavailable">არ არის მარაგში</option></select>
      <select aria-label="Filter product category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-11 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--action)]"><option value="all">ყველა კატეგორია</option>{categories.map((category) => <option key={category.name} value={category.name}>{category.name}</option>)}</select>
    </div>
    <p className="mt-4 text-[12px] text-[var(--muted)]">{products.length} პროდუქტი ამ ფილტრებით</p>
    {loading ? <LoadingRows /> : products.length === 0 ? <EmptyState title="No matching products" text="Change the search term to find another catalog item." /> : <div className="mt-3 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]"><table className="w-full min-w-[940px] text-left"><thead><tr className="border-b border-[var(--line)] bg-[var(--surface-sand)] text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]"><th className="px-4 py-3">სურ.</th><th className="px-4 py-3">სახელი</th><th className="px-4 py-3">კატეგორია</th><th className="px-4 py-3">ფასი</th><th className="px-4 py-3">სტატუსი</th><th className="px-4 py-3">მოქმედებები</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-[var(--line)] last:border-b-0"><td className="px-4 py-3"><span className="relative block h-11 w-10 overflow-hidden rounded-md bg-[var(--surface-sand)]"><Image src={product.image} alt="" fill sizes="40px" unoptimized={product.image.startsWith("/manus-storage/")} className="object-cover" /></span></td><td className="px-4 py-3"><p className="text-[13px] font-semibold text-[var(--ink)]">{product.name}</p><p className="mt-0.5 text-[12px] text-[var(--muted)]">{product.subtitle}</p></td><td className="px-4 py-3 text-[12px] text-[var(--muted)]">{product.category}</td><td className="px-4 py-3"><input aria-label={`Price for ${product.name}`} type="number" min={0} defaultValue={product.price} disabled={busy === `product:${product.id}`} onBlur={(event) => { const value = Number(event.target.value); if (value !== product.price) void patchProduct(product.id, { price: value }); }} className="h-9 w-24 rounded-md border border-[var(--line)] bg-white px-2.5 text-[13px] tabular-nums outline-none focus:ring-2 focus:ring-[var(--action)] disabled:opacity-50" /></td><td className="px-4 py-3"><div className="flex items-center gap-2"><Toggle checked={product.available} disabled={busy === `product:${product.id}`} onChange={(value) => patchProduct(product.id, { available: value })} /><span className="text-[11px] text-[var(--muted)]">{product.available ? "მარაგშია" : "არაა მარაგში"}</span></div></td><td className="px-4 py-3"><div className="flex items-center gap-2"><button type="button" aria-label={`Edit ${product.name}`} onClick={() => onEdit(product)} className="min-h-10 rounded-[var(--radius)] border border-[var(--line)] px-3 text-[12px] font-semibold text-[var(--ink)] transition hover:border-[var(--ink)]">რედაქტირება</button><button type="button" aria-label={`Delete ${product.name}`} disabled={busy === `delete:${product.id}`} onClick={() => onDelete(product.id)} className="min-h-10 rounded-[var(--radius)] border border-[var(--action)]/35 px-3 text-[12px] font-semibold text-[var(--action-deep)] transition hover:bg-[var(--action)]/10 disabled:opacity-50">წაშლა</button></div></td></tr>)}</tbody></table></div>}
  </div>;
}

function CategoriesPanel({ categories, summaries }: { categories: AdminCategory[]; summaries: Array<{ name: string; count: number }> }) {
  return <div className="pt-7"><div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"><p className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Catalog structure</p><h2 className="mt-2 font-display text-[30px] leading-none">კატეგორიების მართვა</h2><p className="mt-2 text-sm text-[var(--muted)]">მიმდინარე კატალოგის სტრუქტურა და პროდუქტების რაოდენობა</p></div><div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]">{categories.map((category) => { const summary = summaries.find((item) => item.name === category.nameKa || item.name === category.nameEn); return <div key={category.id} className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-4 last:border-b-0"><div><p className="font-semibold text-[var(--ink)]">{category.nameKa}</p><p className="mt-1 text-[12px] text-[var(--muted)]">/{category.slug} · {category.nameEn}</p></div><span className="rounded-full bg-[var(--green-soft)] px-3 py-1 text-[12px] font-semibold text-[var(--green)]">{summary?.count ?? 0} პროდუქტი</span></div>; })}</div></div>;
}

function ProductEditor({ product, categories, busy, onClose, onSave, onDelete }: { product: AdminProduct | null; categories: AdminCategory[]; busy: boolean; onClose: () => void; onSave: (draft: ProductDraft) => void; onDelete?: () => void }) {
  const [draft, setDraft] = useState<ProductDraft>(() => ({
    nameKa: product?.nameKa ?? "",
    nameEn: product?.nameEn ?? "",
    descriptionKa: product?.descriptionKa ?? "",
    descriptionEn: product?.descriptionEn ?? "",
    price: product?.price ?? 0,
    priceMax: product?.priceMax ?? product?.price ?? 0,
    priceOnRequest: product?.priceOnRequest ?? false,
    unitType: product?.unitType ?? "single stem",
    categoryId: Number(product?.categoryId ?? categories[0]?.id ?? 0),
    imageUrl: product?.image ?? "",
    available: product?.available ?? true,
    published: product?.published ?? true,
    bestseller: product?.bestseller ?? false,
  }));
  const update = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((previous) => ({ ...previous, [key]: value }));
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!draft.nameKa.trim() || !draft.nameEn.trim() || !draft.categoryId) return; onSave({ ...draft, nameKa: draft.nameKa.trim(), nameEn: draft.nameEn.trim() }); };
  return <div role="dialog" aria-modal="true" aria-label={product ? "Edit product" : "Add product"} className="fixed inset-0 z-50 flex items-end bg-black/35 p-0 sm:items-center sm:justify-center sm:p-6"><form onSubmit={submit} className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--surface-warm)] shadow-2xl sm:rounded-[var(--radius-lg)]"><header className="flex items-start justify-between gap-4 bg-[var(--ink)] px-5 py-5 text-white sm:px-7"><div><p className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Flower&rsquo;s Boutique · Catalog studio</p><h2 className="mt-2 font-display text-[27px] leading-none">{product ? "პროდუქტის რედაქტირება" : "ახალი პროდუქტი"}</h2><p className="mt-2 text-[12px] text-white/70">შეავსეთ მხოლოდ რეალური პროდუქტის მონაცემები.</p></div><button type="button" onClick={onClose} className="min-h-10 rounded-[var(--radius)] border border-white/25 px-3 text-[12px] font-semibold hover:bg-white/10">დახურვა</button></header><div className="grid gap-4 overflow-y-auto p-5 sm:p-7"><EditorSection title="ძირითადი ინფორმაცია" text="ორენოვანი სახელი, აღწერა და კატალოგის კატეგორია."><div className="grid gap-3 sm:grid-cols-2"><Field label="სახელი (ქართული)"><input required value={draft.nameKa} onChange={(event) => update("nameKa", event.target.value)} /></Field><Field label="სახელი (ინგლისურად)"><input required value={draft.nameEn} onChange={(event) => update("nameEn", event.target.value)} /></Field></div><div className="grid gap-3 sm:grid-cols-2"><Field label="აღწერა (ქართული)"><textarea value={draft.descriptionKa} onChange={(event) => update("descriptionKa", event.target.value)} /></Field><Field label="აღწერა (ინგლისურად)"><textarea value={draft.descriptionEn} onChange={(event) => update("descriptionEn", event.target.value)} /></Field></div><Field label="კატეგორია"><select required value={draft.categoryId} onChange={(event) => update("categoryId", Number(event.target.value))}>{categories.map((category) => <option key={category.id} value={category.id}>{category.nameKa} · {category.nameEn}</option>)}</select></Field></EditorSection><EditorSection title="ფასი და მარაგი" text="ფასის დიაპაზონი და storefront visibility."><div className="grid gap-3 sm:grid-cols-2"><Field label="მინიმალური ფასი"><input required type="number" min={0} value={draft.price} onChange={(event) => update("price", Number(event.target.value))} /></Field><Field label="მაქსიმალური ფასი"><input required type="number" min={0} value={draft.priceMax} onChange={(event) => update("priceMax", Number(event.target.value))} /></Field></div><Field label="ერთეული"><input value={draft.unitType} onChange={(event) => update("unitType", event.target.value)} /></Field><div className="grid gap-2 sm:grid-cols-3"><CheckField label="ფასი მოთხოვნით" checked={draft.priceOnRequest} onChange={(value) => update("priceOnRequest", value)} /><CheckField label="მარაგშია" checked={draft.available} onChange={(value) => update("available", value)} /><CheckField label="გამორჩეული" checked={draft.bestseller} onChange={(value) => update("bestseller", value)} /></div></EditorSection><EditorSection title="მთავარი ფოტო" text="გამოიყენეთ მხოლოდ existing managed-storage ან licensed image URL."><Field label="Image URL"><input type="url" value={draft.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} placeholder="https://… ან /manus-storage/…" /></Field></EditorSection></div><footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--surface)] px-5 py-4 sm:px-7"><div>{onDelete ? <button type="button" disabled={busy} onClick={onDelete} className="min-h-10 rounded-[var(--radius)] border border-[var(--action)]/35 px-3 text-[12px] font-semibold text-[var(--action-deep)] hover:bg-[var(--action)]/10 disabled:opacity-50">წაშლა</button> : null}</div><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={onClose}>გაუქმება</Button><Button type="submit" variant="dark" size="sm" disabled={busy}>{busy ? "ინახება…" : "შენახვა"}</Button></div></footer></form></div>;
}

function EditorSection({ title, text, children }: { title: string; text: string; children: React.ReactNode }) { return <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)]"><div className="border-b border-[var(--line)] px-5 py-4"><h3 className="font-semibold text-[var(--ink)]">{title}</h3><p className="mt-1 text-[12px] text-[var(--muted)]">{text}</p></div><div className="grid gap-4 p-5">{children}</div></section>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1.5 text-[12px] font-semibold text-[var(--ink)]">{label}<span className="[&>input]:h-11 [&>input]:w-full [&>input]:rounded-[var(--radius)] [&>input]:border [&>input]:border-[var(--line)] [&>input]:bg-white [&>input]:px-3 [&>input]:font-normal [&>input]:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-[var(--action)] [&>select]:h-11 [&>select]:w-full [&>select]:rounded-[var(--radius)] [&>select]:border [&>select]:border-[var(--line)] [&>select]:bg-white [&>select]:px-3 [&>select]:font-normal [&>textarea]:min-h-24 [&>textarea]:w-full [&>textarea]:rounded-[var(--radius)] [&>textarea]:border [&>textarea]:border-[var(--line)] [&>textarea]:bg-white [&>textarea]:p-3 [&>textarea]:font-normal [&>textarea]:outline-none [&>textarea]:focus:ring-2 [&>textarea]:focus:ring-[var(--action)]">{children}</span></label>; }
function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex min-h-11 items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] px-3 text-[12px] font-semibold text-[var(--ink)]"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />{label}</label>; }

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
