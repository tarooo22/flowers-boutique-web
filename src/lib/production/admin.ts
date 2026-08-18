import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import { categories, getProductionDb, orders, products } from "@/lib/production/db";

const toNumber = (value: unknown) => Number(value ?? 0) || 0;

function dashboardStatus(value: string | null) {
  if (value === "delivered") return "completed";
  if (value === "courier") return "delivering";
  if (value === "cancelled") return "cancelled";
  if (value === "awaiting_confirmation" || value === "processing" || value === "preparing") return "confirmed";
  return "new";
}

export async function listProductionAdminOrders() {
  const rows = await getProductionDb().select().from(orders).orderBy(desc(orders.createdAt));
  return rows.map((order) => ({
    id: `FLR-${order.orderNumber ?? order.id}`,
    databaseId: order.id,
    createdAt: order.createdAt.toISOString(),
    status: dashboardStatus(order.deliveryStatus),
    customer: {
      name: order.customerName,
      email: order.customerEmail ?? "",
      phone: order.customerPhone ?? "",
      recipient: order.recipientName ?? "",
      address: order.deliveryAddress ?? "",
      city: "თბილისი",
      date: order.deliveryDate ?? "",
      time: order.deliveryTime ?? "",
      notes: order.notes ?? "",
    },
    items: Array.isArray(order.items) ? order.items.map((item: any) => ({
      name: String(item.name ?? "Product"),
      quantity: toNumber(item.quantity) || 1,
      price: toNumber(item.unitPrice ?? item.price),
      image: typeof item.image === "string" ? item.image : undefined,
    })) : [],
    subtotal: Math.max(0, toNumber(order.totalPrice) - toNumber(order.deliveryFee)),
    delivery: toNumber(order.deliveryFee),
    total: toNumber(order.totalPrice),
  }));
}

export async function listProductionAdminProducts() {
  const rows = await getProductionDb()
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));
  return rows.map(({ product, category }) => ({
    id: String(product.id),
    slug: `product-${product.id}`,
    name: product.nameKa || product.nameEn,
    subtitle: product.nameEn || undefined,
    category: category?.nameKa || category?.nameEn || "",
    image: product.imageUrl || "",
    price: toNumber(product.priceMin),
    basePrice: toNumber(product.priceMin),
    available: product.isAvailable !== false,
    bestseller: product.featured === true,
    edited: false,
  }));
}

export async function productionAdminStats() {
  const [ordersList, productCount] = await Promise.all([
    listProductionAdminOrders(),
    getProductionDb().select({ count: sql<number>`count(*)` }).from(products),
  ]);
  const revenue = ordersList.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0);
  return {
    orderCount: ordersList.length,
    revenue,
    averageOrder: ordersList.length ? Math.round(revenue / ordersList.length) : 0,
    newCount: ordersList.filter((order) => order.status === "new").length,
    productCount: Number(productCount[0]?.count ?? 0),
  };
}

export async function updateProductionProduct(id: number, patch: { price?: number; available?: boolean; bestseller?: boolean }) {
  const updates: Record<string, unknown> = {};
  if (patch.price !== undefined) updates.priceMin = String(patch.price);
  if (patch.available !== undefined) updates.isAvailable = patch.available;
  if (patch.bestseller !== undefined) updates.featured = patch.bestseller;
  if (!Object.keys(updates).length) throw new Error("nothing_to_update");
  await getProductionDb().update(products).set(updates).where(eq(products.id, id));
}

export async function updateProductionOrderStatus(publicId: string, status: string) {
  const orderNumber = Number(publicId.replace(/^FLR-/, ""));
  if (!Number.isSafeInteger(orderNumber)) throw new Error("invalid_input");
  const map: Record<string, string> = { new: "new", confirmed: "processing", delivering: "courier", completed: "delivered", cancelled: "cancelled" };
  const deliveryStatus = map[status];
  if (!deliveryStatus) throw new Error("invalid_input");
  await getProductionDb().update(orders).set({ deliveryStatus }).where(eq(orders.orderNumber, orderNumber));
}
