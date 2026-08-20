import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import { categories, getProductionDb, orders, productImages, products } from "@/lib/production/db";

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
    categoryId: String(product.categoryId),
    slug: `product-${product.id}`,
    name: product.nameKa || product.nameEn,
    nameKa: product.nameKa,
    nameEn: product.nameEn,
    descriptionKa: product.descriptionKa ?? "",
    descriptionEn: product.descriptionEn ?? "",
    subtitle: product.nameEn || undefined,
    category: category?.nameKa || category?.nameEn || "",
    image: product.imageUrl || "",
    price: toNumber(product.priceMin),
    priceMax: toNumber(product.priceMax),
    basePrice: toNumber(product.priceMin),
    priceOnRequest: product.priceOnRequest === true,
    unitType: product.unitType ?? "single stem",
    available: product.isAvailable !== false,
    bestseller: product.featured === true,
    published: product.published !== false,
    edited: false,
  }));
}

export async function listProductionAdminCategories() {
  const rows = await getProductionDb().select().from(categories);
  return rows.map((category) => ({
    id: String(category.id),
    nameKa: category.nameKa,
    nameEn: category.nameEn,
    descriptionKa: category.descriptionKa ?? "",
    descriptionEn: category.descriptionEn ?? "",
    slug: category.slug,
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

export type AdminProductPatch = {
  nameKa?: string;
  nameEn?: string;
  descriptionKa?: string;
  descriptionEn?: string;
  price?: number;
  priceMax?: number;
  priceOnRequest?: boolean;
  unitType?: string;
  categoryId?: number;
  imageUrl?: string;
  available?: boolean;
  published?: boolean;
  bestseller?: boolean;
};

export async function updateProductionAdminProduct(id: number, patch: AdminProductPatch) {
  const updates: Record<string, unknown> = {};
  if (patch.nameKa !== undefined) updates.nameKa = patch.nameKa;
  if (patch.nameEn !== undefined) updates.nameEn = patch.nameEn;
  if (patch.descriptionKa !== undefined) updates.descriptionKa = patch.descriptionKa;
  if (patch.descriptionEn !== undefined) updates.descriptionEn = patch.descriptionEn;
  if (patch.price !== undefined) updates.priceMin = String(patch.price);
  if (patch.priceMax !== undefined) updates.priceMax = String(patch.priceMax);
  if (patch.priceOnRequest !== undefined) updates.priceOnRequest = patch.priceOnRequest;
  if (patch.unitType !== undefined) updates.unitType = patch.unitType;
  if (patch.categoryId !== undefined) updates.categoryId = patch.categoryId;
  if (patch.imageUrl !== undefined) updates.imageUrl = patch.imageUrl;
  if (patch.available !== undefined) updates.isAvailable = patch.available;
  if (patch.published !== undefined) updates.published = patch.published;
  if (patch.bestseller !== undefined) updates.featured = patch.bestseller;
  if (!Object.keys(updates).length) throw new Error("nothing_to_update");
  await getProductionDb().update(products).set(updates).where(eq(products.id, id));
}

export async function createProductionAdminProduct(input: Required<Pick<AdminProductPatch, "nameKa" | "nameEn" | "categoryId">> & AdminProductPatch) {
  await getProductionDb().insert(products).values({
    nameKa: input.nameKa,
    nameEn: input.nameEn,
    descriptionKa: input.descriptionKa ?? "",
    descriptionEn: input.descriptionEn ?? "",
    priceMin: String(input.price ?? 0),
    priceMax: String(input.priceMax ?? input.price ?? 0),
    priceOnRequest: input.priceOnRequest ?? false,
    unitType: input.unitType ?? "single stem",
    categoryId: input.categoryId,
    imageUrl: input.imageUrl ?? null,
    isAvailable: input.available ?? true,
    published: input.published ?? true,
    featured: input.bestseller ?? false,
  });
}

export async function deleteProductionAdminProduct(id: number) {
  const database = getProductionDb();
  await database.delete(productImages).where(eq(productImages.productId, id));
  await database.delete(products).where(eq(products.id, id));
}

export async function updateProductionOrderStatus(publicId: string, status: string) {
  const orderNumber = Number(publicId.replace(/^FLR-/, ""));
  if (!Number.isSafeInteger(orderNumber)) throw new Error("invalid_input");
  const map: Record<string, string> = { new: "new", confirmed: "processing", delivering: "courier", completed: "delivered", cancelled: "cancelled" };
  const deliveryStatus = map[status];
  if (!deliveryStatus) throw new Error("invalid_input");
  await getProductionDb().update(orders).set({ deliveryStatus }).where(eq(orders.orderNumber, orderNumber));
}
