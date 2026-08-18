import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { products as seedProducts } from "@/data/products";

/**
 * Small JSON-file store for orders and product overrides.
 *
 * This keeps the admin panel genuinely functional in local/self-hosted runs
 * without pulling in a database. On a read-only or ephemeral filesystem
 * (most serverless platforms) writes fall back to an in-process cache, so the
 * app still works — it just won't persist across cold starts. Swap this module
 * for a real database when one is available.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "store.json");

export type OrderStatus = "new" | "confirmed" | "delivering" | "completed" | "cancelled";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  kind?: "product" | "custom";
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
    recipient?: string;
    address: string;
    city: string;
    date: string;
    time: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
}

/** Admin-editable fields layered on top of the static catalog. */
export interface ProductOverride {
  price?: number;
  available?: boolean;
  bestseller?: boolean;
}

interface StoreShape {
  orders: Order[];
  overrides: Record<string, ProductOverride>;
}

const empty: StoreShape = { orders: [], overrides: {} };

let cache: StoreShape | null = null;
let writable = true;

async function load(): Promise<StoreShape> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    cache = { ...empty, ...(JSON.parse(raw) as Partial<StoreShape>) };
  } catch {
    cache = structuredClone(empty);
  }
  return cache;
}

async function save(next: StoreShape): Promise<void> {
  cache = next;
  if (!writable) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf8");
  } catch (error) {
    // read-only filesystem — keep serving from memory rather than failing
    writable = false;
    console.warn("[store] falling back to in-memory persistence:", error);
  }
}

/* ------------------------------- orders ---------------------------------- */

export async function listOrders(): Promise<Order[]> {
  const s = await load();
  return [...s.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const s = await load();
  return s.orders.find((o) => o.id === id);
}

export async function createOrder(
  input: Omit<Order, "id" | "createdAt" | "status">,
): Promise<Order> {
  const s = await load();
  const order: Order = {
    ...input,
    id: `FB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  await save({ ...s, orders: [...s.orders, order] });
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | undefined> {
  const s = await load();
  const orders = s.orders.map((o) => (o.id === id ? { ...o, status } : o));
  await save({ ...s, orders });
  return orders.find((o) => o.id === id);
}

export async function deleteOrder(id: string): Promise<void> {
  const s = await load();
  await save({ ...s, orders: s.orders.filter((o) => o.id !== id) });
}

/* ------------------------------ overrides -------------------------------- */

export async function listOverrides(): Promise<Record<string, ProductOverride>> {
  return (await load()).overrides;
}

export async function setOverride(
  id: string,
  patch: ProductOverride,
): Promise<ProductOverride> {
  const s = await load();
  const next = { ...(s.overrides[id] ?? {}), ...patch };
  await save({ ...s, overrides: { ...s.overrides, [id]: next } });
  return next;
}

/** Catalog with admin overrides applied — what the admin table displays. */
export async function listAdminProducts() {
  const overrides = await listOverrides();
  return seedProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    category: p.category,
    image: p.images[0],
    price: overrides[p.id]?.price ?? p.price,
    basePrice: p.price,
    available: overrides[p.id]?.available ?? p.available,
    bestseller: overrides[p.id]?.bestseller ?? Boolean(p.bestseller),
    edited: Boolean(overrides[p.id]),
  }));
}

/* ------------------------------- metrics --------------------------------- */

export async function getStats() {
  const orders = await listOrders();
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});
  return {
    orderCount: orders.length,
    revenue,
    averageOrder: orders.length ? Math.round(revenue / orders.length) : 0,
    newCount: byStatus.new ?? 0,
    byStatus,
    productCount: seedProducts.length,
  };
}
