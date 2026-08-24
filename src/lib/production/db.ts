import "server-only";

import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { mysqlTable, int, varchar, text, decimal, boolean, json, timestamp, index, uniqueIndex } from "drizzle-orm/mysql-core";

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  nameKa: varchar("nameKa", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  descriptionKa: text("descriptionKa"),
  descriptionEn: text("descriptionEn"),
  slug: varchar("slug", { length: 255 }).notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  nameKa: varchar("nameKa", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  descriptionKa: text("descriptionKa"),
  descriptionEn: text("descriptionEn"),
  priceMin: decimal("priceMin", { precision: 10, scale: 2 }),
  priceMax: decimal("priceMax", { precision: 10, scale: 2 }),
  priceOnRequest: boolean("priceOnRequest").default(false),
  unitType: varchar("unitType", { length: 50 }).default("single stem"),
  categoryId: int("categoryId").notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }),
  imageKey: varchar("imageKey", { length: 512 }),
  isRose: boolean("isRose").default(false),
  isAvailable: boolean("isAvailable").default(true),
  published: boolean("published").default(true),
  featured: boolean("featured").default(false),
  variants: json("variants").$type<unknown[]>().default([]),
});

export const productImages = mysqlTable("productImages", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }).notNull(),
  imageKey: varchar("imageKey", { length: 512 }).notNull(),
  sortOrder: int("sortOrder").default(0),
});

/** Metadata registry for uploaded reusable managed-media objects. Bytes remain in managed storage. */
export const adminMediaAssets = mysqlTable("adminMediaAssets", {
  id: int("id").autoincrement().primaryKey(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 512 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [uniqueIndex("adminMediaAssets_storageKey_unique").on(table.storageKey)]);

/** Storefront-managed editorial banners. This maps the pre-existing production table to preserve legacy content. */
export const banners = mysqlTable("banners", {
  id: int("id").autoincrement().primaryKey(),
  titleKa: varchar("titleKa", { length: 255 }),
  titleEn: varchar("titleEn", { length: 255 }),
  descriptionKa: text("descriptionKa"),
  descriptionEn: text("descriptionEn"),
  imageUrl: varchar("imageUrl", { length: 512 }).notNull(),
  imageKey: varchar("imageKey", { length: 512 }).notNull(),
  ctaText: varchar("ctaText", { length: 255 }),
  ctaLink: varchar("ctaLink", { length: 512 }),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }),
  items: json("items").notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  subtotalBeforeBenefit: decimal("subtotalBeforeBenefit", { precision: 10, scale: 2 }),
  flowerCircleDiscount: decimal("flowerCircleDiscount", { precision: 10, scale: 2 }).default("0"),
  flowerCircleEarned: decimal("flowerCircleEarned", { precision: 10, scale: 2 }).default("0"),
  notes: text("notes"),
  recipientName: varchar("recipientName", { length: 255 }),
  deliveryAddress: text("deliveryAddress"),
  deliveryDate: varchar("deliveryDate", { length: 20 }),
  deliveryTime: varchar("deliveryTime", { length: 20 }),
  orderChannel: varchar("orderChannel", { length: 32 }),
  paymentMethod: varchar("paymentMethod", { length: 32 }),
  paymentStatus: varchar("paymentStatus", { length: 32 }),
  deliveryStatus: varchar("deliveryStatus", { length: 32 }),
  orderNumber: int("orderNumber"),
  fulfillmentType: varchar("fulfillmentType", { length: 32 }),
  deliveryFee: decimal("deliveryFee", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("orders_order_number_unique").on(table.orderNumber),
  index("orders_user_delivery_status_index").on(table.userId, table.deliveryStatus),
]);

/** Immutable audit events for earned, redeemed, reversed and manager-adjusted Flower Circle benefits. */
export const flowerCircleLedger = mysqlTable("flowerCircleLedger", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderId: int("orderId"),
  eventKey: varchar("eventKey", { length: 128 }).notNull(),
  type: varchar("type", { length: 16 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  benefitRate: decimal("benefitRate", { precision: 5, scale: 2 }),
  status: varchar("status", { length: 16 }).notNull().default("posted"),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("flowerCircleLedger_event_key_unique").on(table.eventKey),
  index("flowerCircleLedger_user_created_index").on(table.userId, table.createdAt),
  index("flowerCircleLedger_order_index").on(table.orderId),
]);

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 16 }).notNull(),
});

export const authSessions = mysqlTable("authSessions", {
  tokenHash: varchar("tokenHash", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  revokedAt: timestamp("revokedAt"),
});

/** Customer-owned delivery address book. Data is accessed only through the authenticated Account APIs. */
export const customerAddresses = mysqlTable("customerAddresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  label: varchar("label", { length: 80 }).notNull(),
  recipientName: varchar("recipientName", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  city: varchar("city", { length: 80 }).notNull().default("თბილისი"),
  address: text("address").notNull(),
  instructions: text("instructions"),
  isDefault: boolean("isDefault").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("customerAddresses_user_updated_index").on(table.userId, table.updatedAt)]);

/** One preference row per customer; operational order updates stay enabled by default. */
export const customerNotificationPreferences = mysqlTable("customerNotificationPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderUpdates: boolean("orderUpdates").notNull().default(true),
  flowerCircleUpdates: boolean("flowerCircleUpdates").notNull().default(true),
  editorialUpdates: boolean("editorialUpdates").notNull().default(false),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("customerNotificationPreferences_user_unique").on(table.userId)]);

/** Immutable manager-visible events. This is distinct from the financial Flower Circle ledger. */
export const orderOperationalEvents = mysqlTable("orderOperationalEvents", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  eventType: varchar("eventType", { length: 32 }).notNull(),
  fromStatus: varchar("fromStatus", { length: 32 }),
  toStatus: varchar("toStatus", { length: 32 }),
  reason: varchar("reason", { length: 255 }),
  note: text("note"),
  actorUserId: int("actorUserId"),
  idempotencyKey: varchar("idempotencyKey", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("orderOperationalEvents_idempotency_unique").on(table.idempotencyKey),
  index("orderOperationalEvents_order_created_index").on(table.orderId, table.createdAt),
]);

/** Mutable operational assignment/priority state with an explicit revision for safe concurrent manager updates. */
export const orderOperationalMeta = mysqlTable("orderOperationalMeta", {
  orderId: int("orderId").primaryKey(),
  assigneeUserId: int("assigneeUserId"),
  priority: varchar("priority", { length: 24 }).notNull().default("standard"),
  internalFlags: json("internalFlags").$type<string[]>().default([]),
  revision: int("revision").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Admin-managed public storefront policy records. Values are validated by their API contract before persistence. */
export const storefrontSettings = mysqlTable("storefrontSettings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: json("value").notNull(),
  revision: int("revision").notNull().default(0),
  updatedByUserId: int("updatedByUserId"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Append-only administrative trace for customer-visible storefront policy revisions. */
export const storefrontSettingEvents = mysqlTable("storefrontSettingEvents", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 64 }).notNull(),
  revision: int("revision").notNull(),
  value: json("value").notNull(),
  actorUserId: int("actorUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("storefrontSettingEvents_key_created_index").on(table.settingKey, table.createdAt)]);

/** Customer-managed occasion reminders. Delivery remains disabled until a consented channel is configured. */
export const customerGiftReminders = mysqlTable("customerGiftReminders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  occasion: varchar("occasion", { length: 80 }).notNull(),
  reminderMonthDay: varchar("reminderMonthDay", { length: 5 }).notNull(),
  recipientName: varchar("recipientName", { length: 120 }),
  note: varchar("note", { length: 400 }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("customerGiftReminders_user_active_index").on(table.userId, table.active)]);

/** Immutable delivery queue for a future consented notification provider; no worker is activated by this schema. */
export const customerNotificationOutbox = mysqlTable("customerNotificationOutbox", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  channel: varchar("channel", { length: 24 }).notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  payload: json("payload").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("queued"),
  dedupeKey: varchar("dedupeKey", { length: 160 }).notNull(),
  scheduledAt: timestamp("scheduledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [uniqueIndex("customerNotificationOutbox_dedupe_unique").on(table.dedupeKey), index("customerNotificationOutbox_status_scheduled_index").on(table.status, table.scheduledAt)]);

function createProductionDb(url: string) {
  return drizzle({ client: createPool(url) });
}

let database: ReturnType<typeof createProductionDb> | null = null;

export function getProductionDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for the production storefront adapter");
  if (!database) {
    // A single mysql connection can be closed by the server between dynamic
    // page requests, which surfaced as PROTOCOL_CONNECTION_LOST during the
    // real browser audit. A pool acquires a healthy connection per query.
    database = createProductionDb(url);
  }
  return database;
}
