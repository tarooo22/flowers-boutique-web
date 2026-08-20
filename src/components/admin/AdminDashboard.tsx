"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { ChevronDown, SearchIcon } from "@/components/ui/Icons";
import type { Order, OrderStatus } from "@/lib/server/store";

interface AdminMedia {
  id: string;
  url: string;
  key: string;
  productId?: string;
  productName?: string;
  sortOrder: number;
}

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
  images: AdminMedia[];
  price: number;
  priceMax: number;
  basePrice: number;
  priceOnRequest: boolean;
  unitType: string;
  available: boolean;
  bestseller: boolean;
  published: boolean;
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
  images: AdminMedia[];
  available: boolean;
  published: boolean;
  bestseller: boolean;
};

type CategoryDraft = { nameKa: string; nameEn: string; descriptionKa: string; descriptionEn: string; slug: string };
type Tab = "products" | "categories" | "orders" | "banners" | "settings";

interface Stats { orderCount: number; revenue: number; averageOrder: number; newCount: number; productCount: number }

const STATUSES: OrderStatus[] = ["new", "confirmed", "delivering", "completed", "cancelled"];
const STATUS_LABEL: Record<OrderStatus, string> = { new: "ახალი", confirmed: "დადასტურებული", delivering: "გზაში", completed: "დასრულებული", cancelled: "გაუქმებული" };
const STATUS_STYLE: Record<OrderStatus, string> = {
  new: "bg-[var(--action)]/15 text-[var(--action-deep)]",
  confirmed: "bg-[#7fa8d9]/20 text-[#2f5a8f]",
  delivering: "bg-[#f0be2c]/20 text-[#8a6510]",
  completed: "bg-[var(--green-soft)] text-[var(--green)]",
  cancelled: "bg-black/8 text-[var(--muted)]",
};

function newCategoryDraft(): CategoryDraft { return { nameKa: "", nameEn: "", descriptionKa: "", descriptionEn: "", slug: "" }; }

export function AdminDashboard({ demoCredentials }: { demoCredentials: boolean }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [media, setMedia] = useState<AdminMedia[]>([]);
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
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersResponse, productsResponse] = await Promise.all([fetch("/api/admin/orders"), fetch("/api/admin/products")]);
      if (!ordersResponse.ok || !productsResponse.ok) throw new Error("refresh_failed");
      const [ordersPayload, productsPayload] = await Promise.all([ordersResponse.json(), productsResponse.json()]);
      setOrders(ordersPayload.orders ?? []);
      setProducts(productsPayload.products ?? []);
      setCategories(productsPayload.categories ?? []);
      setMedia(productsPayload.media ?? []);
      setStats(productsPayload.stats ?? null);
    } catch {
      setFeedback("მონაცემების განახლება ვერ მოხერხდა. სცადეთ ხელახლა.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const patchProduct = async (id: string, patch: Record<string, unknown>) => {
    setBusy(`product:${id}`); setFeedback(null);
    try {
      const response = await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) });
      const payload = await response.json();
      if (!response.ok || !payload.products) throw new Error("save_failed");
      setProducts(payload.products); setFeedback("პროდუქტის ცვლილებები შენახულია storefront-ზე.");
    } catch { setFeedback("პროდუქტის ცვლილებების შენახვა ვერ მოხერხდა."); }
    finally { setBusy(null); }
  };

  const saveProduct = async (draft: ProductDraft, id?: string) => {
    setBusy(id ? `editor:${id}` : "editor:create"); setFeedback(null);
    try {
      const response = await fetch("/api/admin/products", {
        method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, imageUrls: draft.images.map(({ url, key }) => ({ url, key })), ...(id ? { id } : {}) }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.products) throw new Error("save_failed");
      setProducts(payload.products); setEditingProduct(null); setCreatingProduct(false);
      setFeedback(id ? "პროდუქტი და მისი ფოტოები შენახულია." : "პროდუქტი კატალოგში დაემატა.");
    } catch { setFeedback("პროდუქტის შენახვა ვერ მოხერხდა. სავალდებულო ველები გადაამოწმეთ."); }
    finally { setBusy(null); }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("პროდუქტის წაშლა გსურთ? ეს მოქმედება ვერ დაბრუნდება.")) return;
    setBusy(`delete:${id}`); setFeedback(null);
    try {
      const response = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok || !payload.products) throw new Error("delete_failed");
      setProducts(payload.products); setEditingProduct(null); setFeedback("პროდუქტი კატალოგიდან წაიშალა.");
    } catch { setFeedback("პროდუქტის წაშლა ვერ მოხერხდა."); }
    finally { setBusy(null); }
  };

  const uploadMedia = async (files: File[]) => {
    if (!files.length) return [];
    setBusy("media:upload"); setFeedback(null);
    try {
      const form = new FormData(); files.slice(0, 8).forEach((file) => form.append("files", file));
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const payload = await response.json();
      if (!response.ok || !Array.isArray(payload.media)) throw new Error("upload_failed");
      setMedia((previous) => [...payload.media, ...previous.filter((asset) => !payload.media.some((created: AdminMedia) => created.url === asset.url))]);
      setFeedback(`${payload.media.length} ფოტო აიტვირთა და მედია ბიბლიოთეკაში დაემატა.`);
      return payload.media as AdminMedia[];
    } catch { setFeedback("ფოტოების ატვირთვა ვერ მოხერხდა. გამოიყენეთ JPG, PNG ან WebP, მაქსიმუმ 8MB თითო ფოტო."); return []; }
    finally { setBusy(null); }
  };

  const saveCategory = async (draft: CategoryDraft, id?: string) => {
    setBusy(id ? `category:${id}` : "category:create"); setFeedback(null);
    try {
      const response = await fetch("/api/admin/categories", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...draft, ...(id ? { id } : {}) }) });
      const payload = await response.json();
      if (!response.ok || !payload.categories) throw new Error(payload.error ?? "save_failed");
      setCategories(payload.categories); setEditingCategory(null); setCreatingCategory(false); setFeedback(id ? "კატეგორია განახლდა." : "ახალი კატეგორია დაემატა.");
    } catch { setFeedback("კატეგორიის შენახვა ვერ მოხერხდა. სახელი და უნიკალური slug გადაამოწმეთ."); }
    finally { setBusy(null); }
  };

  const deleteCategory = async (category: AdminCategory) => {
    if (!window.confirm(`წავშალოთ „${category.nameKa}“? პროდუქტებიანი კატეგორია დაცულია და არ წაიშლება.`)) return;
    setBusy(`category:delete:${category.id}`); setFeedback(null);
    try {
      const response = await fetch(`/api/admin/categories?id=${encodeURIComponent(category.id)}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "delete_failed");
      setCategories(payload.categories); setFeedback("კატეგორია წაიშალა.");
    } catch { setFeedback("კატეგორიის წაშლა ვერ მოხერხდა: ჯერ გადაიტანეთ მასზე მიბმული პროდუქტები სხვა კატეგორიაში."); }
    finally { setBusy(null); }
  };

  const setStatus = async (id: string, status: OrderStatus) => {
    setBusy(`status:${id}`); setFeedback(null);
    try {
      const response = await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      if (!response.ok) throw new Error("status_failed");
      await refresh(); setFeedback(`შეკვეთა ${id} — ${STATUS_LABEL[status]}.`);
    } catch { setFeedback("შეკვეთის სტატუსის განახლება ვერ მოხერხდა."); }
    finally { setBusy(null); }
  };

  const signOut = async () => {
    await Promise.all([fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }), fetch("/api/admin/login", { method: "DELETE", credentials: "same-origin" })]);
    router.replace("/"); router.refresh();
  };

  const visibleProducts = useMemo(() => products.filter((product) => {
    const needle = query.toLowerCase();
    return (!needle || `${product.name} ${product.nameEn} ${product.category}`.toLowerCase().includes(needle))
      && (availabilityFilter === "all" || (availabilityFilter === "available" ? product.available : !product.available))
      && (categoryFilter === "all" || product.category === categoryFilter);
  }), [availabilityFilter, categoryFilter, products, query]);
  const visibleOrders = useMemo(() => orders.filter((order) => {
    const needle = query.toLowerCase();
    return (statusFilter === "all" || order.status === statusFilter) && (!needle || `${order.id} ${order.customer.name} ${order.customer.phone} ${order.customer.address}`.toLowerCase().includes(needle));
  }), [orders, query, statusFilter]);
  const categorySummaries = useMemo(() => categories.map((category) => ({ category, count: products.filter((product) => product.categoryId === category.id).length })), [categories, products]);

  return <div className="min-h-screen bg-[var(--surface-warm)] py-5 pb-24 sm:py-8">
    <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
      <header className="rounded-[var(--radius-lg)] bg-[var(--ink)] px-5 py-6 text-white shadow-[var(--shadow-card)] sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">Flower&rsquo;s Boutique · Operations</p><h1 className="mt-2 font-display text-[31px] leading-none sm:text-[40px]">ადმინისტრირების პანელი</h1><p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/72">კატალოგი, მედია, კატეგორიები, შეკვეთები და მიწოდების ოპერაციები ერთ სამუშაო სივრცეში.</p></div><div className="flex flex-wrap gap-2"><Button href="/" variant="light" size="sm">მაღაზია</Button><button type="button" onClick={signOut} className="min-h-10 rounded-[var(--radius)] border border-white/20 px-3 text-[12px] font-semibold hover:bg-white/10">გასვლა</button></div></div>
      </header>
      <div role="tablist" className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-card)]"><div className="flex min-w-max gap-1.5">{(["products", "categories", "orders", "banners", "settings"] as Tab[]).map((id) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setQuery(""); setFeedback(null); }} className={`min-h-10 rounded-[var(--radius)] px-4 text-[12.5px] font-semibold transition ${tab === id ? "bg-[var(--ink)] text-white shadow-sm" : "text-[var(--muted)] hover:bg-[var(--surface-sand)] hover:text-[var(--ink)]"}`}>{id === "products" ? "პროდუქტები" : id === "categories" ? "კატეგორიები" : id === "orders" ? `შეკვეთები${stats?.newCount ? ` · ${stats.newCount}` : ""}` : id === "banners" ? "ბანერები" : "პარამეტრები"}</button>)}</div></div>
      {demoCredentials ? <p className="mt-4 rounded-[var(--radius)] border border-[var(--action)]/30 bg-[var(--action)]/8 px-4 py-3 text-[12.5px] text-[var(--action-deep)]"><strong>Demo credentials are active.</strong> რეალური მენეჯერის წვდომისთვის გამოიყენეთ production administrator account.</p> : null}
      {feedback ? <div role="status" className="mt-4 rounded-[var(--radius)] border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-3 text-[12.5px] text-[var(--muted)]">{feedback}</div> : null}
      {tab === "products" ? <ProductsWorkspace loading={loading} products={visibleProducts} query={query} setQuery={setQuery} availabilityFilter={availabilityFilter} setAvailabilityFilter={setAvailabilityFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} categories={categorySummaries} patchProduct={patchProduct} onAdd={() => setCreatingProduct(true)} onEdit={setEditingProduct} onDelete={deleteProduct} busy={busy} /> : null}
      {tab === "categories" ? <CategoriesWorkspace categories={categorySummaries} loading={loading} onCreate={() => setCreatingCategory(true)} onEdit={setEditingCategory} onDelete={deleteCategory} busy={busy} /> : null}
      {tab === "orders" ? <OrdersWorkspace loading={loading} orders={visibleOrders} allOrders={orders} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} openOrder={openOrder} setOpenOrder={setOpenOrder} setStatus={setStatus} busy={busy} /> : null}
      {tab === "banners" ? <LegacyNotice title="ბანერები" text="Storefront editorial blocks დაცულია project content-ში. ყოველდღიური მუშაობისთვის გამოიყენეთ კატალოგი, მედია და შეკვეთების ინსტრუმენტები." /> : null}
      {tab === "settings" ? <LegacyNotice title="პარამეტრები" text="მიწოდების, გადახდისა და account security-ის კონფიგურაცია დაცულია. აქ არსებული სამუშაო ინსტრუმენტები storefront-ის ყოველდღიურ მართვას ემსახურება." /> : null}
      {(editingProduct || creatingProduct) ? <ProductEditor product={editingProduct} categories={categories} media={media} busy={busy?.startsWith("editor:") || busy === "media:upload"} onUpload={uploadMedia} onClose={() => { setEditingProduct(null); setCreatingProduct(false); }} onSave={(draft) => saveProduct(draft, editingProduct?.id)} onDelete={editingProduct ? () => deleteProduct(editingProduct.id) : undefined} /> : null}
      {(editingCategory || creatingCategory) ? <CategoryEditor category={editingCategory} busy={busy?.startsWith("category:") ?? false} onClose={() => { setEditingCategory(null); setCreatingCategory(false); }} onSave={(draft) => saveCategory(draft, editingCategory?.id)} /> : null}
    </div>
  </div>;
}

function ProductsWorkspace({ loading, products, query, setQuery, availabilityFilter, setAvailabilityFilter, categoryFilter, setCategoryFilter, categories, patchProduct, onAdd, onEdit, onDelete, busy }: { loading: boolean; products: AdminProduct[]; query: string; setQuery: (value: string) => void; availabilityFilter: "all" | "available" | "unavailable"; setAvailabilityFilter: (value: "all" | "available" | "unavailable") => void; categoryFilter: string; setCategoryFilter: (value: string) => void; categories: Array<{ category: AdminCategory; count: number }>; patchProduct: (id: string, patch: Record<string, unknown>) => void; onAdd: () => void; onEdit: (product: AdminProduct) => void; onDelete: (id: string) => void; busy: string | null }) {
  return <div className="pt-7"><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Catalog operations</p><h2 className="mt-2 font-display text-[30px] leading-none">პროდუქტების მართვა</h2><p className="mt-2 text-sm text-[var(--muted)]">პროდუქტი, გალერეა, ფასი, მარაგი და storefront visibility.</p></div><Button type="button" variant="dark" size="sm" onClick={onAdd}>+ ახალი პროდუქტი</Button></div>
    <div className="grid gap-3 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)] md:grid-cols-[1.25fr_0.9fr_0.9fr]"><Toolbar query={query} setQuery={setQuery} placeholder="სახელი ან კატეგორია…" /><select aria-label="Filter product availability" value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value as "all" | "available" | "unavailable")} className={selectClass}><option value="all">ყველა სტატუსი</option><option value="available">მხოლოდ მარაგში</option><option value="unavailable">არ არის მარაგში</option></select><select aria-label="Filter product category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={selectClass}><option value="all">ყველა კატეგორია</option>{categories.map(({ category }) => <option key={category.id} value={category.nameKa}>{category.nameKa}</option>)}</select></div>
    <p className="mt-4 text-[12px] text-[var(--muted)]">{products.length} პროდუქტი ამ ფილტრებით</p>
    {loading ? <LoadingRows /> : products.length === 0 ? <EmptyState title="პროდუქტი ვერ მოიძებნა" text="შეცვალეთ ფილტრი ან დაამატეთ ახალი პროდუქტი." /> : <div className="mt-3 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]"><table className="w-full min-w-[970px] text-left"><thead><tr className="border-b border-[var(--line)] bg-[var(--surface-sand)] text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]"><th className="px-4 py-3">მედია</th><th className="px-4 py-3">სახელი</th><th className="px-4 py-3">კატეგორია</th><th className="px-4 py-3">ფასი</th><th className="px-4 py-3">მარაგი</th><th className="px-4 py-3">მოქმედებები</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-[var(--line)] last:border-b-0"><td className="px-4 py-3"><div className="flex items-center gap-2"><MediaThumb media={product.images[0]} fallback={product.image} /><span className="rounded-full bg-[var(--surface-sand)] px-2 py-1 text-[10px] font-bold text-[var(--muted)]">{product.images.length || 0} ფოტო</span></div></td><td className="px-4 py-3"><p className="text-[13px] font-semibold">{product.name}</p><p className="mt-0.5 text-[12px] text-[var(--muted)]">{product.nameEn}</p></td><td className="px-4 py-3 text-[12px] text-[var(--muted)]">{product.category}</td><td className="px-4 py-3"><input aria-label={`Price for ${product.name}`} type="number" min={0} defaultValue={product.price} disabled={busy === `product:${product.id}`} onBlur={(event) => { const value = Number(event.target.value); if (value !== product.price) void patchProduct(product.id, { price: value }); }} className="h-9 w-24 rounded-md border border-[var(--line)] bg-white px-2.5 text-[13px] tabular-nums outline-none focus:ring-2 focus:ring-[var(--action)] disabled:opacity-50" /></td><td className="px-4 py-3"><div className="flex items-center gap-2"><Toggle checked={product.available} disabled={busy === `product:${product.id}`} onChange={(value) => patchProduct(product.id, { available: value })} /><span className="text-[11px] text-[var(--muted)]">{product.available ? "მარაგშია" : "არაა მარაგში"}</span></div></td><td className="px-4 py-3"><div className="flex items-center gap-2"><button type="button" onClick={() => onEdit(product)} className={minorButton}>რედაქტირება</button><button type="button" disabled={busy === `delete:${product.id}`} onClick={() => onDelete(product.id)} className={`${minorButton} border-[var(--action)]/35 text-[var(--action-deep)] hover:bg-[var(--action)]/10`}>წაშლა</button></div></td></tr>)}</tbody></table></div>}
  </div>;
}

function CategoriesWorkspace({ categories, loading, onCreate, onEdit, onDelete, busy }: { categories: Array<{ category: AdminCategory; count: number }>; loading: boolean; onCreate: () => void; onEdit: (category: AdminCategory) => void; onDelete: (category: AdminCategory) => void; busy: string | null }) {
  return <div className="pt-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Catalog structure</p><h2 className="mt-2 font-display text-[30px] leading-none">კატეგორიების მართვა</h2><p className="mt-2 text-sm text-[var(--muted)]">დაამატეთ, შეცვალეთ ან უსაფრთხოდ წაშალეთ კატეგორიები.</p></div><Button type="button" variant="dark" size="sm" onClick={onCreate}>+ ახალი კატეგორია</Button></div>
    {loading ? <LoadingRows /> : <div className="mt-5 grid gap-3 md:grid-cols-2">{categories.map(({ category, count }) => <article key={category.id} className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"><div className="flex items-start justify-between gap-3"><div><p className="font-display text-[22px] leading-none">{category.nameKa}</p><p className="mt-1 text-[12px] text-[var(--muted)]">{category.nameEn} · /{category.slug}</p></div><span className="rounded-full bg-[var(--green-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--green)]">{count} პროდუქტი</span></div><p className="mt-4 min-h-9 text-[12.5px] leading-relaxed text-[var(--muted)]">{category.descriptionKa || "აღწერა არ არის დამატებული."}</p><div className="mt-5 flex gap-2 border-t border-[var(--line)] pt-4"><button type="button" className={minorButton} onClick={() => onEdit(category)}>რედაქტირება</button><button type="button" disabled={busy === `category:delete:${category.id}`} className={`${minorButton} border-[var(--action)]/35 text-[var(--action-deep)] hover:bg-[var(--action)]/10 disabled:opacity-50`} onClick={() => onDelete(category)}>წაშლა</button></div></article>)}</div>}
  </div>;
}

function OrdersWorkspace({ loading, orders, allOrders, query, setQuery, statusFilter, setStatusFilter, openOrder, setOpenOrder, setStatus, busy }: { loading: boolean; orders: Order[]; allOrders: Order[]; query: string; setQuery: (value: string) => void; statusFilter: OrderStatus | "all"; setStatusFilter: (value: OrderStatus | "all") => void; openOrder: string | null; setOpenOrder: (id: string | null) => void; setStatus: (id: string, status: OrderStatus) => void; busy: string | null }) {
  const counts = Object.fromEntries(STATUSES.map((status) => [status, allOrders.filter((order) => order.status === status).length])) as Record<OrderStatus, number>;
  return <div className="pt-7"><SectionHeading eyebrow="Fulfilment desk" title="შეკვეთები მოძრაობაში" text="დაალაგეთ სამუშაო რიგი, გახსენით მიწოდების დეტალები და შეცვალეთ სტატუსი იმავე სივრცეში." /><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{STATUSES.map((status) => <button key={status} type="button" onClick={() => setStatusFilter(statusFilter === status ? "all" : status)} className={`rounded-[var(--radius)] border p-4 text-left transition ${statusFilter === status ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)]"}`}><p className={`text-[11px] font-semibold uppercase tracking-wide ${statusFilter === status ? "text-white/65" : "text-[var(--muted)]"}`}>{STATUS_LABEL[status]}</p><p className="mono mt-2 text-[25px] font-bold leading-none">{counts[status]}</p></button>)}</div><div className="mt-5 grid gap-3 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)] md:grid-cols-[1fr_220px]"><Toolbar query={query} setQuery={setQuery} placeholder="ID, სახელი, ტელეფონი ან მისამართი…" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "all")} className={selectClass}><option value="all">ყველა სტატუსი</option>{STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABEL[status]}</option>)}</select></div>{loading ? <LoadingRows /> : orders.length === 0 ? <EmptyState title="შეკვეთა ვერ მოიძებნა" text="შეცვალეთ ძიება ან სტატუსის ფილტრი." /> : <div className="mt-4 grid gap-3">{orders.map((order) => <OrderCard key={order.id} order={order} open={openOrder === order.id} setOpenOrder={setOpenOrder} setStatus={setStatus} busy={busy === `status:${order.id}`} />)}</div>}</div>;
}

function OrderCard({ order, open, setOpenOrder, setStatus, busy }: { order: Order; open: boolean; setOpenOrder: (id: string | null) => void; setStatus: (id: string, status: OrderStatus) => void; busy: boolean }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${order.customer.address}, ${order.customer.city}`)}`;
  return <article className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]"><button type="button" onClick={() => setOpenOrder(open ? null : order.id)} aria-expanded={open} className="flex min-h-16 w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 text-left transition hover:bg-[var(--surface-warm)] sm:px-5"><span className="mono text-[12.5px] font-semibold">{order.id}</span><span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-semibold">{order.customer.name}</span><span className="block truncate text-[12px] text-[var(--muted)]">{order.customer.phone || "ტელეფონი არ არის"} · {order.customer.date || "თარიღი არაა"}</span></span><StatusPill status={order.status} /><span className="text-[14px] font-semibold tabular-nums">{formatPrice(order.total)}</span><ChevronDown className={`h-4 w-4 text-[var(--muted)] transition ${open ? "rotate-180" : ""}`} /></button>{open ? <div className="grid gap-6 border-t border-[var(--line)] bg-[var(--surface-warm)]/40 px-4 py-5 lg:grid-cols-[1.1fr_0.9fr] sm:px-5"><div><h3 className={smallHeading}>შეკვეთის შემადგენლობა</h3><ul className="mt-3 grid gap-2.5">{order.items.map((item, index) => <li key={`${item.name}-${index}`} className="flex items-center gap-3"><OrderItemImage image={item.image} /><span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium">{item.name}</span><span className="text-[12px] text-[var(--muted)]">× {item.quantity}</span></span><span className="text-[13px] tabular-nums">{formatPrice(item.price * item.quantity)}</span></li>)}</ul><dl className="mt-4 grid gap-1.5 border-t border-[var(--line)] pt-3 text-[13px]"><Line label="ჯამი" value={formatPrice(order.subtotal)} /><Line label="მიწოდება" value={order.delivery ? formatPrice(order.delivery) : "უფასო"} /><Line label="სულ" value={formatPrice(order.total)} strong /></dl></div><div><h3 className={smallHeading}>მიწოდების კონტროლი</h3><dl className="mt-3 grid gap-1.5 text-[13px]"><Line label="მიმღები" value={order.customer.recipient || order.customer.name} /><Line label="მისამართი" value={`${order.customer.address}, ${order.customer.city}`} /><Line label="დრო" value={`${order.customer.date} · ${order.customer.time}`} /><Line label="ელფოსტა" value={order.customer.email || "—"} />{order.customer.notes ? <Line label="შენიშვნა" value={order.customer.notes} /> : null}</dl><div className="mt-4 flex flex-wrap gap-2"><a href={`tel:${order.customer.phone}`} className={minorButton}>დარეკვა</a><a href={directions} target="_blank" rel="noreferrer" className={minorButton}>რუკაზე ნახვა</a></div><div className="mt-5 border-t border-[var(--line)] pt-4"><p className={smallHeading}>სტატუსის შეცვლა</p><div className="mt-3 flex flex-wrap gap-2">{STATUSES.map((status) => <button key={status} type="button" disabled={busy || order.status === status} onClick={() => setStatus(order.id, status)} aria-pressed={order.status === status} className={`min-h-10 rounded-full border px-3 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${order.status === status ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line-strong)] bg-white hover:border-[var(--ink)]"}`}>{STATUS_LABEL[status]}</button>)}</div>{busy ? <p className="mt-3 text-[12px] text-[var(--muted)]">ინახება…</p> : null}</div></div></div> : null}</article>;
}

function ProductEditor({ product, categories, media, busy, onUpload, onClose, onSave, onDelete }: { product: AdminProduct | null; categories: AdminCategory[]; media: AdminMedia[]; busy: boolean; onUpload: (files: File[]) => Promise<AdminMedia[]>; onClose: () => void; onSave: (draft: ProductDraft) => void; onDelete?: () => void }) {
  const [draft, setDraft] = useState<ProductDraft>(() => ({ nameKa: product?.nameKa ?? "", nameEn: product?.nameEn ?? "", descriptionKa: product?.descriptionKa ?? "", descriptionEn: product?.descriptionEn ?? "", price: product?.price ?? 0, priceMax: product?.priceMax ?? product?.price ?? 0, priceOnRequest: product?.priceOnRequest ?? false, unitType: product?.unitType ?? "single stem", categoryId: Number(product?.categoryId ?? categories[0]?.id ?? 0), images: product?.images ?? [], available: product?.available ?? true, published: product?.published ?? true, bestseller: product?.bestseller ?? false }));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const update = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((previous) => ({ ...previous, [key]: value }));
  const addMedia = (items: AdminMedia[]) => setDraft((previous) => ({ ...previous, images: [...previous.images, ...items.filter((item) => !previous.images.some((existing) => existing.url === item.url))].slice(0, 8) }));
  const receiveFiles = async (files: File[]) => { const created = await onUpload(files); addMedia(created); };
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!draft.nameKa.trim() || !draft.nameEn.trim() || !draft.categoryId) return; onSave({ ...draft, nameKa: draft.nameKa.trim(), nameEn: draft.nameEn.trim() }); };
  return <div role="dialog" aria-modal="true" aria-label={product ? "Edit product" : "Add product"} className="fixed inset-0 z-50 flex items-end bg-black/40 p-0 sm:items-center sm:justify-center sm:p-6"><form onSubmit={submit} className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--surface-warm)] shadow-2xl sm:rounded-[var(--radius-lg)]"><header className="flex items-start justify-between gap-4 bg-[var(--ink)] px-5 py-5 text-white sm:px-7"><div><p className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Flower&rsquo;s Boutique · Catalog studio</p><h2 className="mt-2 font-display text-[27px] leading-none">{product ? "პროდუქტის რედაქტირება" : "ახალი პროდუქტი"}</h2><p className="mt-2 text-[12px] text-white/70">რეალური პროდუქტები, კატეგორია, ფასი და ფოტო გალერეა.</p></div><button type="button" onClick={onClose} className="min-h-10 rounded-[var(--radius)] border border-white/25 px-3 text-[12px] font-semibold hover:bg-white/10">დახურვა</button></header><div className="grid gap-4 overflow-y-auto p-5 sm:p-7"><EditorSection title="ძირითადი ინფორმაცია" text="ორენოვანი სახელი, აღწერა და კატალოგის კატეგორია."><div className="grid gap-3 sm:grid-cols-2"><Field label="სახელი (ქართული)"><input required value={draft.nameKa} onChange={(event) => update("nameKa", event.target.value)} /></Field><Field label="სახელი (ინგლისურად)"><input required value={draft.nameEn} onChange={(event) => update("nameEn", event.target.value)} /></Field></div><div className="grid gap-3 sm:grid-cols-2"><Field label="აღწერა (ქართული)"><textarea value={draft.descriptionKa} onChange={(event) => update("descriptionKa", event.target.value)} /></Field><Field label="აღწერა (ინგლისურად)"><textarea value={draft.descriptionEn} onChange={(event) => update("descriptionEn", event.target.value)} /></Field></div><Field label="კატეგორია"><select required value={draft.categoryId} onChange={(event) => update("categoryId", Number(event.target.value))}>{categories.map((category) => <option key={category.id} value={category.id}>{category.nameKa} · {category.nameEn}</option>)}</select></Field></EditorSection><EditorSection title="ფოტოები და გალერეა" text="გადაათრიეთ JPG, PNG ან WebP ფოტო, აირჩიეთ ტელეფონიდან/კომპიუტერიდან ან მედია ბიბლიოთეკიდან. მაქსიმუმ 8 ფოტო, თითო 8MB."><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(event) => { void receiveFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }} /><div onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragActive(false)} onDrop={(event) => { event.preventDefault(); setDragActive(false); void receiveFiles(Array.from(event.dataTransfer.files)); }} className={`rounded-[var(--radius)] border-2 border-dashed p-5 text-center transition ${dragActive ? "border-[var(--action)] bg-[var(--action)]/8" : "border-[var(--line-strong)] bg-[var(--surface-warm)]"}`}><p className="font-semibold">ფოტოს გადაათრიეთ აქ</p><p className="mt-1 text-[12px] text-[var(--muted)]">ან აირჩიეთ მოწყობილობიდან — ტელეფონის კამერა/გალერეაც მხარდაჭერილია.</p><div className="mt-4 flex flex-wrap justify-center gap-2"><button type="button" onClick={() => fileInput.current?.click()} disabled={busy} className={minorButton}>{busy ? "იტვირთება…" : "ფოტოს ატვირთვა"}</button><button type="button" onClick={() => setPickerOpen(true)} className={minorButton}>მედია ბიბლიოთეკა</button></div></div><MediaStrip images={draft.images} onRemove={(url) => update("images", draft.images.filter((image) => image.url !== url))} onMove={(url, direction) => { const index = draft.images.findIndex((image) => image.url === url); const target = index + direction; if (target < 0 || target >= draft.images.length) return; const next = [...draft.images]; [next[index], next[target]] = [next[target], next[index]]; update("images", next); }} /></EditorSection><EditorSection title="ფასი და storefront სტატუსი" text="ფასის დიაპაზონი, მარაგი და გამოჩენა storefront-ზე."><div className="grid gap-3 sm:grid-cols-2"><Field label="მინიმალური ფასი"><input required type="number" min={0} value={draft.price} onChange={(event) => update("price", Number(event.target.value))} /></Field><Field label="მაქსიმალური ფასი"><input required type="number" min={0} value={draft.priceMax} onChange={(event) => update("priceMax", Number(event.target.value))} /></Field></div><Field label="ერთეული"><input value={draft.unitType} onChange={(event) => update("unitType", event.target.value)} /></Field><div className="grid gap-2 sm:grid-cols-3"><CheckField label="ფასი მოთხოვნით" checked={draft.priceOnRequest} onChange={(value) => update("priceOnRequest", value)} /><CheckField label="მარაგშია" checked={draft.available} onChange={(value) => update("available", value)} /><CheckField label="გამორჩეული" checked={draft.bestseller} onChange={(value) => update("bestseller", value)} /></div></EditorSection></div><footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--surface)] px-5 py-4 sm:px-7"><div>{onDelete ? <button type="button" disabled={busy} onClick={onDelete} className={`${minorButton} border-[var(--action)]/35 text-[var(--action-deep)]`}>წაშლა</button> : null}</div><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={onClose}>გაუქმება</Button><Button type="submit" variant="dark" size="sm" disabled={busy}>{busy ? "ინახება…" : "შენახვა"}</Button></div></footer></form>{pickerOpen ? <MediaPicker media={media} selected={draft.images} onClose={() => setPickerOpen(false)} onSelect={(asset) => addMedia([asset])} /> : null}</div>;
}

function MediaPicker({ media, selected, onClose, onSelect }: { media: AdminMedia[]; selected: AdminMedia[]; onClose: () => void; onSelect: (asset: AdminMedia) => void }) {
  const [search, setSearch] = useState(""); const selectedUrls = new Set(selected.map((item) => item.url)); const shown = media.filter((asset) => !search.trim() || `${asset.productName ?? ""} ${asset.key}`.toLowerCase().includes(search.toLowerCase()));
  return <div role="dialog" aria-modal="true" aria-label="მედია ბიბლიოთეკა" className="fixed inset-0 z-[60] flex items-end bg-black/45 sm:items-center sm:justify-center sm:p-8"><div className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--surface)] shadow-2xl sm:rounded-[var(--radius-lg)]"><header className="flex items-center justify-between gap-4 border-b border-[var(--line)] p-5"><div><p className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Media library</p><h3 className="mt-1 font-display text-[24px] leading-none">არსებული ფოტოები</h3></div><button type="button" className={minorButton} onClick={onClose}>დახურვა</button></header><div className="p-5"><Toolbar query={search} setQuery={setSearch} placeholder="პროდუქტი ან ფაილი…" /></div><div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto px-5 pb-5 sm:grid-cols-3 lg:grid-cols-4">{shown.map((asset) => <button key={asset.id} type="button" disabled={selectedUrls.has(asset.url)} onClick={() => onSelect(asset)} className="group overflow-hidden rounded-[var(--radius)] border border-[var(--line)] text-left transition hover:border-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-45"><span className="relative block aspect-square bg-[var(--surface-sand)]"><Image src={asset.url} alt="" fill unoptimized={asset.url.startsWith("/manus-storage/")} sizes="180px" className="object-cover" /></span><span className="block truncate px-3 py-2 text-[11px] font-semibold">{asset.productName || "ატვირთული ფოტო"}</span></button>)}</div></div></div>;
}

function CategoryEditor({ category, busy, onClose, onSave }: { category: AdminCategory | null; busy: boolean; onClose: () => void; onSave: (draft: CategoryDraft) => void }) { const [draft, setDraft] = useState<CategoryDraft>(() => category ? { nameKa: category.nameKa, nameEn: category.nameEn, descriptionKa: category.descriptionKa, descriptionEn: category.descriptionEn, slug: category.slug } : newCategoryDraft()); const update = <K extends keyof CategoryDraft>(key: K, value: CategoryDraft[K]) => setDraft((previous) => ({ ...previous, [key]: value })); return <div role="dialog" aria-modal="true" aria-label="Category editor" className="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center sm:p-6"><form onSubmit={(event) => { event.preventDefault(); onSave(draft); }} className="w-full max-w-2xl overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--surface-warm)] shadow-2xl sm:rounded-[var(--radius-lg)]"><header className="flex items-start justify-between gap-4 bg-[var(--ink)] px-5 py-5 text-white"><div><p className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Catalog structure</p><h2 className="mt-2 font-display text-[27px] leading-none">{category ? "კატეგორიის რედაქტირება" : "ახალი კატეგორია"}</h2></div><button type="button" onClick={onClose} className="min-h-10 rounded-[var(--radius)] border border-white/25 px-3 text-[12px] font-semibold">დახურვა</button></header><div className="grid gap-4 p-5"><div className="grid gap-3 sm:grid-cols-2"><Field label="სახელი (ქართული)"><input required value={draft.nameKa} onChange={(event) => update("nameKa", event.target.value)} /></Field><Field label="სახელი (ინგლისურად)"><input required value={draft.nameEn} onChange={(event) => update("nameEn", event.target.value)} /></Field></div><Field label="Slug (ლათინური, უნიკალური)"><input required value={draft.slug} onChange={(event) => update("slug", event.target.value)} placeholder="seasonal-bouquets" /></Field><div className="grid gap-3 sm:grid-cols-2"><Field label="აღწერა (ქართული)"><textarea value={draft.descriptionKa} onChange={(event) => update("descriptionKa", event.target.value)} /></Field><Field label="აღწერა (ინგლისურად)"><textarea value={draft.descriptionEn} onChange={(event) => update("descriptionEn", event.target.value)} /></Field></div></div><footer className="flex justify-end gap-2 border-t border-[var(--line)] bg-[var(--surface)] px-5 py-4"><Button type="button" variant="outline" size="sm" onClick={onClose}>გაუქმება</Button><Button type="submit" variant="dark" size="sm" disabled={busy}>{busy ? "ინახება…" : "შენახვა"}</Button></footer></form></div>; }

function MediaStrip({ images, onRemove, onMove }: { images: AdminMedia[]; onRemove: (url: string) => void; onMove: (url: string, direction: -1 | 1) => void }) { return images.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{images.map((image, index) => <div key={image.url} className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)]"><div className="relative aspect-square"><Image src={image.url} alt="" fill unoptimized={image.url.startsWith("/manus-storage/")} sizes="160px" className="object-cover" />{index === 0 ? <span className="absolute left-2 top-2 rounded-full bg-[var(--ink)] px-2 py-1 text-[9px] font-bold text-white">მთავარი</span> : null}</div><div className="flex gap-1 p-2"><button type="button" onClick={() => onMove(image.url, -1)} disabled={index === 0} className="min-h-9 flex-1 rounded border text-[12px] disabled:opacity-35">←</button><button type="button" onClick={() => onMove(image.url, 1)} disabled={index === images.length - 1} className="min-h-9 flex-1 rounded border text-[12px] disabled:opacity-35">→</button><button type="button" onClick={() => onRemove(image.url)} className="min-h-9 flex-1 rounded border border-[var(--action)]/35 text-[12px] text-[var(--action-deep)]">წაშლა</button></div></div>)}</div> : <p className="rounded-[var(--radius)] bg-[var(--surface-sand)] px-4 py-3 text-[12px] text-[var(--muted)]">ჯერ ფოტო არ არის არჩეული. პირველი ფოტო პროდუქტის მთავარ გამოსახულებად გამოჩნდება.</p>; }

function MediaThumb({ media, fallback }: { media?: AdminMedia; fallback?: string }) { const source = media?.url || fallback; return <span className="relative block h-11 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--surface-sand)]">{source ? <Image src={source} alt="" fill sizes="40px" unoptimized={source.startsWith("/manus-storage/")} className="object-cover" /> : null}</span>; }
function EditorSection({ title, text, children }: { title: string; text: string; children: React.ReactNode }) { return <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)]"><div className="border-b border-[var(--line)] px-5 py-4"><h3 className="font-semibold">{title}</h3><p className="mt-1 text-[12px] text-[var(--muted)]">{text}</p></div><div className="grid gap-4 p-5">{children}</div></section>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1.5 text-[12px] font-semibold text-[var(--ink)]">{label}<span className="[&>input]:h-11 [&>input]:w-full [&>input]:rounded-[var(--radius)] [&>input]:border [&>input]:border-[var(--line)] [&>input]:bg-white [&>input]:px-3 [&>input]:font-normal [&>input]:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-[var(--action)] [&>select]:h-11 [&>select]:w-full [&>select]:rounded-[var(--radius)] [&>select]:border [&>select]:border-[var(--line)] [&>select]:bg-white [&>select]:px-3 [&>select]:font-normal [&>textarea]:min-h-24 [&>textarea]:w-full [&>textarea]:rounded-[var(--radius)] [&>textarea]:border [&>textarea]:border-[var(--line)] [&>textarea]:bg-white [&>textarea]:p-3 [&>textarea]:font-normal [&>textarea]:outline-none [&>textarea]:focus:ring-2 [&>textarea]:focus:ring-[var(--action)]">{children}</span></label>; }
function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex min-h-11 items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] px-3 text-[12px] font-semibold"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />{label}</label>; }
function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div><p className="eyebrow">{eyebrow}</p><h2 className="font-display mt-2 text-[24px] leading-none sm:text-[29px]">{title}</h2><p className="mt-2 max-w-[66ch] text-[13px] leading-relaxed text-[var(--muted)]">{text}</p></div>; }
function StatusPill({ status }: { status: OrderStatus }) { return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>; }
function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className={`flex justify-between gap-4 ${strong ? "border-t border-[var(--line)] pt-2 font-semibold" : ""}`}><dt className="shrink-0 text-[var(--muted)]">{label}</dt><dd className="text-right">{value}</dd></div>; }
function Toggle({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: (value: boolean) => void }) { return <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)} className={`relative h-10 w-12 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-[var(--action)]" : "bg-black/15"}`}><span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow transition-all ${checked ? "left-3" : "left-1"}`} /></button>; }
function Toolbar({ query, setQuery, placeholder }: { query: string; setQuery: (value: string) => void; placeholder: string }) { return <div className="flex min-w-[220px] items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-white px-3"><SearchIcon className="h-[18px] w-[18px] shrink-0 text-[var(--muted)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="h-11 w-full bg-transparent text-[13.5px] outline-none placeholder:text-[var(--muted-2)]" /></div>; }
function EmptyState({ title, text }: { title: string; text: string }) { return <div className="mt-4 rounded-[var(--radius)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-warm)]/35 py-14 text-center"><p className="font-display text-[19px]">{title}</p><p className="mx-auto mt-2 max-w-[42ch] text-[13px] leading-relaxed text-[var(--muted)]">{text}</p></div>; }
function LoadingRows() { return <div className="mt-4 grid gap-3"><div className="h-16 animate-pulse rounded-[var(--radius)] bg-[var(--surface-warm)]" /><div className="h-16 animate-pulse rounded-[var(--radius)] bg-[var(--surface-warm)]" /><div className="h-16 animate-pulse rounded-[var(--radius)] bg-[var(--surface-warm)]" /></div>; }
function OrderItemImage({ image }: { image?: string }) { return image ? <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--surface-warm)]"><Image src={image} alt="" fill sizes="40px" unoptimized={image.startsWith("/manus-storage/")} className="object-cover" /></span> : <span className="h-12 w-10 shrink-0 rounded-md bg-[var(--surface-sand)]" />; }
function LegacyNotice({ title, text }: { title: string; text: string }) { return <div className="pt-8"><div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]"><h2 className="font-display text-[28px]">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{text}</p></div></div>; }

const selectClass = "h-11 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--action)]";
const minorButton = "inline-flex min-h-10 items-center justify-center rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 text-[12px] font-semibold text-[var(--ink)] transition hover:border-[var(--ink)]";
const smallHeading = "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]";
