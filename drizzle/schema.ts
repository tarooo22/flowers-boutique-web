import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, decimal, boolean, json, uniqueIndex, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  phone: varchar("phone", { length: 20 }),
  passwordHash: varchar("passwordHash", { length: 255 }), // For native auth
  loginMethod: varchar("loginMethod", { length: 64 }), // 'oauth' or 'native'
  role: mysqlEnum("role", ["customer", "admin"]).default("customer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Opaque authentication sessions. Only a SHA-256 hash of the browser token is
// persisted, so a database read cannot be used to replay an active session.
export const authSessions = mysqlTable(
  "authSessions",
  {
    tokenHash: varchar("tokenHash", { length: 64 }).primaryKey(),
    userId: int("userId").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    revokedAt: timestamp("revokedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    lastUsedAt: timestamp("lastUsedAt").defaultNow().notNull(),
  },
  table => [
    index("authSessions_userId_idx").on(table.userId),
    index("authSessions_expiresAt_idx").on(table.expiresAt),
  ],
);

export type AuthSession = typeof authSessions.$inferSelect;
export type InsertAuthSession = typeof authSessions.$inferInsert;

// Categories table
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  nameKa: varchar("nameKa", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  descriptionKa: text("descriptionKa"),
  descriptionEn: text("descriptionEn"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Products table
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
  isAvailable: boolean("isAvailable").default(true), // Stock status: true = in stock, false = out of stock
  published: boolean("published").default(true), // Catalog visibility: true = visible, false = hidden
  featured: boolean("featured").default(false),
  // Color variants: JSON array of color options for this product
  // Each variant: { id, colorNameKa, colorNameEn, colorHex, imageUrl, imageKey, priceMin, priceMax, available, isDefault }
  variants: json("variants").$type<any[]>().default([]),
  // Stem metadata for realistic AI bouquet generation
  bloomsPerStemMin: int("bloomsPerStemMin").default(1), // Minimum blooms per stem
  bloomsPerStemMax: int("bloomsPerStemMax").default(1), // Maximum blooms per stem
  stemDisplayRule: varchar("stemDisplayRule", { length: 255 }), // e.g., "5-7 small rose blooms", "2-4 lily blooms"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Product images table (for gallery)
export const productImages = mysqlTable("productImages", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }).notNull(),
  imageKey: varchar("imageKey", { length: 512 }).notNull(),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;

// Banners table
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

export type Banner = typeof banners.$inferSelect;
export type InsertBanner = typeof banners.$inferInsert;

// Consolidated orders table (guest + authenticated)
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Nullable - for guest orders
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }),
  items: json("items").notNull(), // JSON array of {productId, quantity, price}
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  // Delivery details
  recipientName: varchar("recipientName", { length: 255 }),
  recipientPhone: varchar("recipientPhone", { length: 20 }),
  deliveryAddress: text("deliveryAddress"),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  placeId: varchar("placeId", { length: 255 }),
  building: varchar("building", { length: 50 }),
  entrance: varchar("entrance", { length: 50 }),
  floor: varchar("floor", { length: 50 }),
  apartment: varchar("apartment", { length: 50 }),
  deliveryDate: varchar("deliveryDate", { length: 20 }),
  deliveryTime: varchar("deliveryTime", { length: 20 }),
  giftMessage: text("giftMessage"),
  courierNotes: text("courierNotes"),
  // Payment and delivery status
  orderChannel: mysqlEnum("orderChannel", ["whatsapp", "messenger", "phone", "email", "card", "website"]).default("whatsapp"),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "bank_transfer", "whatsapp", "messenger"]).default("cash"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "pending_payment", "paid", "failed", "cancelled", "refunded"]).default("pending"),
  deliveryStatus: mysqlEnum("deliveryStatus", ["new", "awaiting_confirmation", "processing", "preparing", "courier", "delivered", "cancelled"]).default("new"),
  // Order identification
  orderNumber: int("orderNumber").unique(), // Sequential order number (600001, 600002, etc.)
  fulfillmentType: mysqlEnum("fulfillmentType", ["delivery", "pickup"]).default("delivery"), // delivery or pickup
  deliveryFee: decimal("deliveryFee", { precision: 10, scale: 2 }).default("0"), // Delivery fee (0 for pickup)
  // BOG payment references
  bogOrderId: varchar("bogOrderId", { length: 255 }), // BOG order UUID
  bogExternalOrderId: varchar("bogExternalOrderId", { length: 25 }), // FLR-600001 format
  bogTransactionId: varchar("bogTransactionId", { length: 255 }), // Transaction ID from BOG
  bogAuthCode: varchar("bogAuthCode", { length: 50 }), // Authorization code from BOG
  bogPayerIdentifier: varchar("bogPayerIdentifier", { length: 255 }), // Masked payer identifier
  bogPaymentMethod: varchar("bogPaymentMethod", { length: 50 }), // card, apple_pay, google_pay, etc.
  bogPaymentStatus: varchar("bogPaymentStatus", { length: 50 }), // created, processing, completed, rejected, refunded
  bogCallbackReceived: boolean("bogCallbackReceived").default(false),
  paidAt: timestamp("paidAt"), // When payment was completed
  paymentLastCheckedAt: timestamp("paymentLastCheckedAt"), // Last reconciliation with BOG
  paymentFailureReason: text("paymentFailureReason"), // Why payment failed
  // Legacy status field (kept for compatibility)
  status: mysqlEnum("status", ["pending", "pending_payment", "paid", "failed", "confirmed", "preparing", "delivered", "cancelled"]).default("pending"),
  // Meta Conversions API tracking (for Purchase event deduplication)
  metaFbc: varchar("metaFbc", { length: 500 }), // Facebook Click ID in fbc format
  metaFbp: varchar("metaFbp", { length: 500 }), // Facebook Pixel ID
  // Soft delete fields
  deletedAt: timestamp("deletedAt"),
  deletedByUserId: int("deletedByUserId"),
  deletionReason: text("deletionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Customer addresses table
export const customerAddresses = mysqlTable("customerAddresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  label: varchar("label", { length: 50 }), // e.g., "Home", "Work"
  recipientName: varchar("recipientName", { length: 255 }).notNull(),
  recipientPhone: varchar("recipientPhone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postalCode", { length: 20 }),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type InsertCustomerAddress = typeof customerAddresses.$inferInsert;

// Customer orders table (legacy - kept for backward compatibility)
export const customerOrders = mysqlTable("customerOrders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  items: json("items").notNull(), // JSON array of {productId, quantity, price}
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  recipientName: varchar("recipientName", { length: 255 }).notNull(),
  recipientPhone: varchar("recipientPhone", { length: 20 }).notNull(),
  deliveryAddress: text("deliveryAddress").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }), // Delivery location latitude
  longitude: decimal("longitude", { precision: 10, scale: 6 }), // Delivery location longitude
  placeId: varchar("placeId", { length: 255 }), // Geoapify place ID
  building: varchar("building", { length: 50 }), // Building number
  entrance: varchar("entrance", { length: 50 }), // Entrance number
  floor: varchar("floor", { length: 50 }), // Floor number
  apartment: varchar("apartment", { length: 50 }), // Apartment number
  deliveryDate: varchar("deliveryDate", { length: 20 }).notNull(),
  deliveryTime: varchar("deliveryTime", { length: 20 }),
  giftMessage: text("giftMessage"),
  additionalComment: text("additionalComment"), // Admin notes/comments
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "bank_transfer", "whatsapp"]).default("cash"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending_payment", "paid", "failed", "cancelled", "refunded"]).default("pending_payment"),
  deliveryStatus: mysqlEnum("deliveryStatus", ["new", "processing", "preparing", "courier", "delivered", "cancelled"]).default("new"),
  // BOG payment references (safe to display, no secrets)
  bogOrderId: varchar("bogOrderId", { length: 255 }), // BOG order ID from API response
  bogTransactionId: varchar("bogTransactionId", { length: 255 }), // BOG transaction ID from callback
  bogPaymentStatus: varchar("bogPaymentStatus", { length: 50 }), // BOG payment status: completed, failed, cancelled, etc.
  bogCallbackReceived: boolean("bogCallbackReceived").default(false), // Whether callback was received and verified
  bogPaymentDate: timestamp("bogPaymentDate"), // When payment was confirmed
  status: mysqlEnum("status", ["pending", "pending_payment", "paid", "failed", "confirmed", "preparing", "delivered", "cancelled"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomerOrder = typeof customerOrders.$inferSelect;
export type InsertCustomerOrder = typeof customerOrders.$inferInsert;

// Order source migration tracking table
// Maps legacy customerOrders rows to canonical orders rows
// Ensures idempotent migration and prevents duplicates
export const orderSourceMappings = mysqlTable(
  "orderSourceMappings",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceTable: varchar("sourceTable", { length: 50 }).notNull(), // "customerOrders"
    sourceOrderId: int("sourceOrderId").notNull(), // Legacy order ID (600001, 630001, etc.)
    canonicalOrderId: int("canonicalOrderId").notNull(), // New canonical orders.id
    canonicalOrderNumber: int("canonicalOrderNumber").notNull(), // New orders.orderNumber
    migratedAt: timestamp("migratedAt").defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint: prevent migrating same source order twice
    sourceUnique: uniqueIndex("sourceUnique").on(table.sourceTable, table.sourceOrderId),
  })
);

export type OrderSourceMapping = typeof orderSourceMappings.$inferSelect;
export type InsertOrderSourceMapping = typeof orderSourceMappings.$inferInsert;

// SEO Keyword Ranking Tracker tables
export const seoKeywords = mysqlTable("seoKeywords", {
  id: int("id").autoincrement().primaryKey(),
  keyword: varchar("keyword", { length: 255 }).notNull().unique(),
  targetUrl: varchar("targetUrl", { length: 512 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SeoKeyword = typeof seoKeywords.$inferSelect;
export type InsertSeoKeyword = typeof seoKeywords.$inferInsert;

export const keywordRankings = mysqlTable("keywordRankings", {
  id: int("id").autoincrement().primaryKey(),
  keywordId: int("keywordId").notNull(),
  rank: int("rank"),
  searchVolume: int("searchVolume"),
  difficulty: int("difficulty"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type KeywordRanking = typeof keywordRankings.$inferSelect;
export type InsertKeywordRanking = typeof keywordRankings.$inferInsert;

export const seoMonitoringTasks = mysqlTable("seoMonitoringTasks", {
  id: int("id").autoincrement().primaryKey(),
  taskName: varchar("taskName", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  lastRun: timestamp("lastRun"),
  nextRun: timestamp("nextRun"),
  lastRunAt: timestamp("lastRunAt"),
  nextRunAt: timestamp("nextRunAt"),
  isEnabled: boolean("isEnabled").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SeoMonitoringTask = typeof seoMonitoringTasks.$inferSelect;
export type InsertSeoMonitoringTask = typeof seoMonitoringTasks.$inferInsert;
