import { drizzle } from "drizzle-orm/mysql2";
import { sql, eq, desc, asc, isNull, and, like, or, count } from "drizzle-orm";
import { InsertUser, users, products, categories, banners, orders, InsertOrder, productImages, customerAddresses, customerOrders, Order } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries - get published products (for catalog and sitemap)
export type CatalogSort = "featured" | "priceAsc" | "priceDesc" | "name";
export type CatalogAvailability = "all" | "available" | "unavailable";

export interface CatalogQueryInput {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  availability?: CatalogAvailability;
  minPrice?: number;
  maxPrice?: number;
  sort?: CatalogSort;
}

export async function getCatalogProducts(input: CatalogQueryInput = {}) {
  const db = await getDb();
  const page = Math.max(1, Math.floor(input.page ?? 1));
  const pageSize = Math.min(24, Math.max(1, Math.floor(input.pageSize ?? 24)));
  const search = input.search?.trim();
  const filters = [eq(products.published, true)];

  if (input.categoryId !== undefined) {
    filters.push(eq(products.categoryId, input.categoryId));
  }
  if (input.availability === "available") {
    filters.push(eq(products.isAvailable, true));
  } else if (input.availability === "unavailable") {
    filters.push(eq(products.isAvailable, false));
  }
  if (search) {
    const searchLike = `%${search}%`;
    filters.push(or(like(products.nameKa, searchLike), like(products.nameEn, searchLike))!);
  }
  if (input.minPrice !== undefined) {
    filters.push(sql`${products.priceMin} >= ${input.minPrice}`);
  }
  if (input.maxPrice !== undefined) {
    filters.push(sql`${products.priceMin} <= ${input.maxPrice}`);
  }

  if (!db) {
    return { items: [], total: 0, page, pageSize, hasMore: false, categoryCounts: {} };
  }

  const where = and(...filters);
  const sort = input.sort ?? "featured";
  const orderBy =
    sort === "priceAsc"
      ? [asc(products.priceMin), asc(products.id)]
      : sort === "priceDesc"
        ? [desc(products.priceMin), asc(products.id)]
        : sort === "name"
          ? [asc(products.nameKa), asc(products.id)]
          : [desc(products.featured), desc(products.isAvailable), asc(products.id)];
  const [items, totalRows, categoryRows] = await Promise.all([
    db.select().from(products).where(where).orderBy(...orderBy).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ total: count(products.id) }).from(products).where(where),
    db.select({ categoryId: products.categoryId, total: count(products.id) })
      .from(products)
      .where(eq(products.published, true))
      .groupBy(products.categoryId),
  ]);
  const total = Number(totalRows[0]?.total ?? 0);
  const categoryCounts = Object.fromEntries(
    categoryRows.map(row => [String(row.categoryId), Number(row.total)])
  );
  return { items, total, page, pageSize, hasMore: page * pageSize < total, categoryCounts };
}

export async function getProducts(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(products).where(eq(products.published, true)) as any;
  if (limit) query = query.limit(limit);
  return await query;
}

// Get all products including unavailable (for admin)
export async function getAllProducts(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(products) as any;
  if (limit) return query.limit(limit);
  return query;
}

export async function getFeaturedProducts() {
  const db = await getDb();
  if (!db) return [];
  
  // Get featured products (limit to 4)
  const featured = await db.select().from(products).where(eq(products.featured, true)).limit(4);
  
  // If featured products exist, return them
  if (featured.length > 0) {
    return featured;
  }
  
  // Fallback: return first 3 available products
  return db.select().from(products).where(eq(products.isAvailable, true)).limit(3);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductByName(nameEn: string, nameKa?: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  // Try to find by English name first
  let result = await db.select().from(products).where(eq(products.nameEn, nameEn)).limit(1);
  if (result.length > 0) return result[0];
  
  // Try Georgian name if provided
  if (nameKa) {
    result = await db.select().from(products).where(eq(products.nameKa, nameKa)).limit(1);
    if (result.length > 0) return result[0];
  }
  
  return undefined;
}

// Category queries
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(categories)
    .where(
      sql`EXISTS (SELECT 1 FROM ${products} WHERE ${products.categoryId} = ${categories.id} AND ${products.published} = true)`
    )
    .orderBy(categories.id);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.slug, slug),
        sql`EXISTS (SELECT 1 FROM ${products} WHERE ${products.categoryId} = ${categories.id} AND ${products.published} = true)`
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Banner queries
export async function getActiveBanners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(banners).where(eq(banners.isActive, true)).orderBy(banners.sortOrder);
}

// Product mutations
export async function createProduct(product: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(products).values(product);
  if (result && (result as any).insertId) {
    return { id: (result as any).insertId, ...product };
  }
  return result;
}

export async function updateProduct(id: number, updates: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.update(products).set(updates).where(eq(products.id, id));
  return result;
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.delete(products).where(eq(products.id, id));
  return result;
}

// Category mutations
export async function createCategory(category: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(categories).values(category);
  return result;
}

export async function updateCategory(id: number, updates: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.update(categories).set(updates).where(eq(categories.id, id));
  return result;
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.delete(categories).where(eq(categories.id, id));
  return result;
}

// Banner mutations
export async function createBanner(banner: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(banners).values(banner);
  return result;
}
export async function updateBanner(id: number, updates: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.update(banners).set(updates).where(eq(banners.id, id));
  return result;
}
export async function deleteBanner(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.delete(banners).where(eq(banners.id, id));
  return result;
}
export async function getAllBanners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(banners).orderBy(banners.sortOrder);
}

// Order queries
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(orders).values(order);
  return result;
}
export async function getOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

// Get orders for authenticated customer
export async function getMyOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

// Get single order by ID from canonical orders table
export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Get all orders for admin (both guest and authenticated)
export async function getAdminOrders(filters?: { paymentStatus?: string; deliveryStatus?: string; searchTerm?: string }) {
  const db = await getDb();
  if (!db) return [];

  const searchLike = filters?.searchTerm ? `%${filters.searchTerm}%` : undefined;
  return db
    .select()
    .from(orders)
    .where(and(
      filters?.paymentStatus ? eq(orders.paymentStatus, filters.paymentStatus as any) : undefined,
      filters?.deliveryStatus ? eq(orders.deliveryStatus, filters.deliveryStatus as any) : undefined,
      searchLike ? or(
        like(orders.customerName, searchLike),
        like(orders.customerEmail, searchLike),
        like(orders.customerPhone, searchLike),
        like(orders.recipientName, searchLike),
      ) : undefined,
    ))
    .orderBy(desc(orders.createdAt));
}

// Profile management functions
export async function getCustomerById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateCustomerProfile(id: number, updates: { name?: string; phone?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set(updates).where(eq(users.id, id));
}

export async function updateCustomerPassword(id: number, passwordHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ passwordHash }).where(eq(users.id, id));
}

// Address management
export async function getCustomerAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customerAddresses).where(eq(customerAddresses.userId, userId));
}

export async function createCustomerAddress(address: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customerAddresses).values(address);
  return result;
}

export async function updateCustomerAddress(userId: number, id: number, updates: any): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const owned = await db
    .select({ id: customerAddresses.id })
    .from(customerAddresses)
    .where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)))
    .limit(1);
  if (!owned[0]) return false;
  await db
    .update(customerAddresses)
    .set(updates)
    .where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)));
  return true;
}

export async function deleteCustomerAddress(userId: number, id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const owned = await db
    .select({ id: customerAddresses.id })
    .from(customerAddresses)
    .where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)))
    .limit(1);
  if (!owned[0]) return false;
  await db
    .delete(customerAddresses)
    .where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)));
  return true;
}

// Customer orders
export async function getCustomerOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customerOrders).where(eq(customerOrders.userId, userId)).orderBy(desc(customerOrders.createdAt));
}

export async function createCustomerOrder(order: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customerOrders).values(order);
  // Get the inserted order
  const inserted = await db.select().from(customerOrders).where(eq(customerOrders.id, result[0].insertId)).limit(1);
  return inserted[0];
}

// Admin order queries
export async function getAllCustomerOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customerOrders).orderBy(desc(customerOrders.createdAt));
}

export async function getCustomerOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(customerOrders).where(eq(customerOrders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, confirmed: 0, preparing: 0, delivered: 0, cancelled: 0, totalRevenue: 0 };
  
  const allOrders = await db.select().from(orders);
  
  const stats = {
    total: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    confirmed: allOrders.filter(o => o.status === 'confirmed').length,
    preparing: allOrders.filter(o => o.status === 'preparing').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    cancelled: allOrders.filter(o => o.status === 'cancelled').length,
    totalRevenue: allOrders.reduce((sum, o) => sum + parseFloat(o.totalPrice?.toString() || '0'), 0),
  };
  
  return stats;
}


// Product variants management
export async function getProductWithVariants(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const product = await db.select().from(products).where(eq(products.id, productId));
  return product[0] || undefined;
}

export async function updateProductVariants(productId: number, variants: any[]) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.update(products).set({ variants: variants as any }).where(eq(products.id, productId));
  return result;
}

export async function addProductVariant(productId: number, variant: any) {
  const db = await getDb();
  if (!db) return undefined;
  
  const product = await getProductWithVariants(productId);
  if (!product) return undefined;
  
  const variants = product.variants || [];
  const newVariant = {
    id: Math.random().toString(36).substr(2, 9),
    ...variant,
  };
  
  variants.push(newVariant);
  return updateProductVariants(productId, variants);
}

export async function updateProductVariant(productId: number, variantId: string, updates: any) {
  const db = await getDb();
  if (!db) return undefined;
  
  const product = await getProductWithVariants(productId);
  if (!product) return undefined;
  
  const variants = product.variants || [];
  const index = variants.findIndex((v: any) => v.id === variantId);
  if (index === -1) return undefined;
  
  variants[index] = { ...variants[index], ...updates };
  return updateProductVariants(productId, variants);
}

export async function deleteProductVariant(productId: number, variantId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const product = await getProductWithVariants(productId);
  if (!product) return undefined;
  
  const variants = product.variants || [];
  const filtered = variants.filter((v: any) => v.id !== variantId);
  return updateProductVariants(productId, filtered);
}


// Admin order management functions (see getAdminOrders above)

export async function updateOrderDeliveryStatus(orderId: number, deliveryStatus: string, additionalComment?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {
    deliveryStatus: deliveryStatus as any,
    updatedAt: new Date(),
  };
  
  if (additionalComment !== undefined) {
    updateData.courierNotes = additionalComment;
  }
  
  await db.update(orders)
    .set(updateData)
    .where(eq(orders.id, orderId));
  
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateOrderPaymentStatus(orderId: number, paymentStatus: string, bogData?: {
  bogOrderId?: string;
  bogTransactionId?: string;
  bogPaymentStatus?: string;
  bogCallbackReceived?: boolean;
  bogPaymentDate?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {
    paymentStatus: paymentStatus as any,
    updatedAt: new Date(),
  };
  
  if (bogData) {
    if (bogData.bogOrderId !== undefined) updateData.bogOrderId = bogData.bogOrderId;
    if (bogData.bogTransactionId !== undefined) updateData.bogTransactionId = bogData.bogTransactionId;
    if (bogData.bogPaymentStatus !== undefined) updateData.bogPaymentStatus = bogData.bogPaymentStatus;
    if (bogData.bogCallbackReceived !== undefined) updateData.bogCallbackReceived = bogData.bogCallbackReceived;
    if (bogData.bogPaymentDate !== undefined) updateData.bogPaymentDate = bogData.bogPaymentDate;
  }
  
  await db.update(orders)
    .set(updateData)
    .where(eq(orders.id, orderId));
  
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAdminOrderStats() {
  const db = await getDb();
  if (!db) return {
    totalOrders: 0,
    pendingPayment: 0,
    paid: 0,
    failed: 0,
    cancelled: 0,
    refunded: 0,
    totalRevenue: 0,
    deliveryStats: {
      new: 0,
      processing: 0,
      preparing: 0,
      courier: 0,
      delivered: 0,
      cancelled: 0,
    }
  };
  
  // Use canonical orders table and exclude soft-deleted orders
  const allOrders = await db.select().from(orders).where(isNull(orders.deletedAt));
  
  const stats = {
    totalOrders: allOrders.length,
    pendingPayment: allOrders.filter(o => o.paymentStatus === 'pending_payment' || o.paymentStatus === 'pending').length,
    paid: allOrders.filter(o => o.paymentStatus === 'paid').length,
    failed: allOrders.filter(o => o.paymentStatus === 'failed').length,
    cancelled: allOrders.filter(o => o.paymentStatus === 'cancelled').length,
    refunded: allOrders.filter(o => o.paymentStatus === 'refunded').length,
    totalRevenue: allOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + Number(o.totalPrice ?? 0), 0),
    deliveryStats: {
      new: allOrders.filter(o => o.deliveryStatus === 'new').length,
      processing: allOrders.filter(o => o.deliveryStatus === 'processing').length,
      preparing: allOrders.filter(o => o.deliveryStatus === 'preparing').length,
      courier: allOrders.filter(o => o.deliveryStatus === 'courier').length,
      delivered: allOrders.filter(o => o.deliveryStatus === 'delivered').length,
      cancelled: allOrders.filter(o => o.deliveryStatus === 'cancelled').length,
    }
  };
  
  return stats;
}


/**
 * Generate next order number safely (600016 onwards)
 * Uses database transaction to ensure concurrency-safe unique numbers
 */
export async function generateNextOrderNumber(): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Get the maximum existing order number
    const result = await db.select({ maxOrderNumber: sql<number>`COALESCE(MAX(orderNumber), 600015)` })
      .from(orders);
    
    const maxOrderNumber = result[0]?.maxOrderNumber || 600015;
    const nextOrderNumber = maxOrderNumber + 1;
    
    return nextOrderNumber;
  } catch (error) {
    console.error("[Database] Error generating order number:", error);
    throw new Error("Failed to generate order number");
  }
}

/**
 * Create a new order with payment tracking fields
 */
export async function createOrderWithPayment(data: {
  userId?: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: any[];
  totalPrice: number;
  recipientName?: string;
  recipientPhone?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
  courierNotes?: string;
  orderChannel?: string;
  paymentMethod?: string;
  deliveryType?: 'delivery' | 'pickup';
  building?: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
  giftMessage?: string;
}): Promise<Order | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const orderNumber = await generateNextOrderNumber();
    
    const insertData: InsertOrder = {
      userId: data.userId || null,
      customerName: data.customerName,
      customerEmail: data.customerEmail || null,
      customerPhone: data.customerPhone || null,
      items: data.items,
      totalPrice: String(data.totalPrice),
      recipientName: data.recipientName || null,
      recipientPhone: data.recipientPhone || null,
      deliveryAddress: data.deliveryAddress || null,
      deliveryDate: data.deliveryDate || null,
      deliveryTime: data.deliveryTime || null,
      notes: data.notes || null,
      courierNotes: data.courierNotes || null,
      orderChannel: (data.orderChannel as any) || 'card',
      paymentMethod: (data.paymentMethod as any) || 'card',
      deliveryStatus: 'new',
      paymentStatus: 'pending_payment',
      orderNumber: orderNumber,
      building: data.building || null,
      entrance: data.entrance || null,
      floor: data.floor || null,
      apartment: data.apartment || null,
      giftMessage: data.giftMessage || null,
    };
    
    await db.insert(orders).values(insertData);

    const newOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);
    if (newOrder.length > 0) {
      const order = newOrder[0];
      console.log('[Database] Retrieved order (payment):', { id: order.id, orderNumber: order.orderNumber });
      if (!order.orderNumber) {
        console.error('[Database] WARNING: Order created but has no orderNumber (payment):', { id: order.id, orderNumber: order.orderNumber });
      }
      return order;
    }

    console.error('[Database] WARNING: Order write succeeded but the record could not be reloaded by order number (payment)');
    return null;
  } catch (error) {
    console.error("[Database] Error creating order with payment:", error);
    throw error;
  }
}

/**
 * Unified canonical order creation for all channels
 * This is the ONLY function that should create orders going forward
 * Replaces both createCustomerOrder (legacy) and createOrderWithPayment
 */
export async function createCanonicalOrder(data: {
  userId?: number | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  items: any[];
  totalPrice: number | string;
  recipientName?: string | null;
  recipientPhone?: string | null;
  deliveryAddress?: string | null;
  deliveryDate?: string | null;
  deliveryTime?: string | null;
  notes?: string | null;
  courierNotes?: string | null;
  orderChannel?: string; // 'whatsapp', 'messenger', 'phone', 'website', 'card'
  paymentMethod?: string; // 'cash', 'card', 'bank_transfer', 'whatsapp', 'messenger'
  paymentStatus?: string; // 'pending', 'paid', 'failed', 'cancelled', 'refunded'
  deliveryStatus?: string; // 'new', 'awaiting_confirmation', 'processing', 'preparing', 'courier', 'delivered', 'cancelled'
  building?: string | null;
  entrance?: string | null;
  floor?: string | null;
  apartment?: string | null;
  giftMessage?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  placeId?: string | null;
  fulfillmentType?: string; // 'delivery' or 'pickup'
  deliveryFee?: number | string; // delivery fee amount
  metaFbc?: string | null; // Meta Conversions API FBC value
  metaFbp?: string | null; // Meta Conversions API FBP value
}): Promise<Order | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const orderNumber = await generateNextOrderNumber();
    
    // Normalize totalPrice to number
    const totalPriceNum = typeof data.totalPrice === 'string' 
      ? parseFloat(data.totalPrice) 
      : data.totalPrice;
    
    const insertData: InsertOrder = {
      userId: data.userId || null,
      customerName: data.customerName,
      customerEmail: data.customerEmail || null,
      customerPhone: data.customerPhone || null,
      items: data.items,
      totalPrice: String(totalPriceNum),
      recipientName: data.recipientName || null,
      recipientPhone: data.recipientPhone || null,
      deliveryAddress: data.deliveryAddress || null,
      deliveryDate: data.deliveryDate || null,
      deliveryTime: data.deliveryTime || null,
      notes: data.notes || null,
      courierNotes: data.courierNotes || null,
      orderChannel: (data.orderChannel as any) || 'phone',
      paymentMethod: (data.paymentMethod as any) || 'cash',
      deliveryStatus: (data.deliveryStatus as any) || 'new',
      paymentStatus: (data.paymentStatus as any) || 'pending',
      orderNumber: orderNumber,
      building: data.building || null,
      entrance: data.entrance || null,
      floor: data.floor || null,
      apartment: data.apartment || null,
      giftMessage: data.giftMessage || null,
      latitude:
        data.latitude === undefined || data.latitude === null
          ? null
          : String(data.latitude),
      longitude:
        data.longitude === undefined || data.longitude === null
          ? null
          : String(data.longitude),
      placeId: data.placeId || null,
      fulfillmentType: (data.fulfillmentType as any) || 'delivery',
      deliveryFee: String(data.deliveryFee ?? 0),
      metaFbc: data.metaFbc || null,
      metaFbp: data.metaFbp || null,
    };
    
    await db.insert(orders).values(insertData);

    const newOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);
    if (newOrder.length > 0) {
      const order = newOrder[0];
      console.log('[Database] Retrieved order:', { id: order.id, orderNumber: order.orderNumber });
      if (!order.orderNumber) {
        console.error('[Database] WARNING: Order created but has no orderNumber:', { id: order.id, orderNumber: order.orderNumber });
      }
      return order;
    }
    
    console.error('[Database] WARNING: No insertId returned from insert operation');
    return null;
  } catch (error) {
    console.error("[Database] Error creating canonical order:", error);
    throw error;
  }
}

/**
 * Update order with BOG payment details
 */
export async function updateOrderBOGPayment(orderId: number, data: {
  bogOrderId?: string;
  bogExternalOrderId?: string;
  bogAuthCode?: string;
  bogPayerIdentifier?: string;
  bogPaymentMethod?: string;
  bogPaymentStatus?: string;
  bogCallbackReceived?: boolean;
  paidAt?: Date;
  paymentLastCheckedAt?: Date;
  paymentFailureReason?: string;
  paymentStatus?: string;
}): Promise<Order | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (data.bogOrderId !== undefined) updateData.bogOrderId = data.bogOrderId;
    if (data.bogExternalOrderId !== undefined) updateData.bogExternalOrderId = data.bogExternalOrderId;
    if (data.bogAuthCode !== undefined) updateData.bogAuthCode = data.bogAuthCode;
    if (data.bogPayerIdentifier !== undefined) updateData.bogPayerIdentifier = data.bogPayerIdentifier;
    if (data.bogPaymentMethod !== undefined) updateData.bogPaymentMethod = data.bogPaymentMethod;
    if (data.bogPaymentStatus !== undefined) updateData.bogPaymentStatus = data.bogPaymentStatus;
    if (data.bogCallbackReceived !== undefined) updateData.bogCallbackReceived = data.bogCallbackReceived;
    if (data.paidAt !== undefined) updateData.paidAt = data.paidAt;
    if (data.paymentLastCheckedAt !== undefined) updateData.paymentLastCheckedAt = data.paymentLastCheckedAt;
    if (data.paymentFailureReason !== undefined) updateData.paymentFailureReason = data.paymentFailureReason;
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
    
    await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId));
    
    const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Error updating order BOG payment:", error);
    throw error;
  }
}

/**
 * Find order by BOG order ID
 */
export async function findOrderByBOGOrderId(bogOrderId: string): Promise<Order | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.select().from(orders).where(eq(orders.bogOrderId, bogOrderId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Error finding order by BOG ID:", error);
    return null;
  }
}

/**
 * Find order by BOG external order ID (fallback)
 */
export async function findOrderByBOGExternalId(bogExternalOrderId: string): Promise<Order | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.select().from(orders).where(eq(orders.bogExternalOrderId, bogExternalOrderId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Error finding order by BOG external ID:", error);
    return null;
  }
}
