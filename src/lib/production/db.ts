import "server-only";

import { drizzle } from "drizzle-orm/mysql2";
import { mysqlTable, int, varchar, text, decimal, boolean, json, timestamp } from "drizzle-orm/mysql-core";

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

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }),
  items: json("items").notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
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
});

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

let database: ReturnType<typeof drizzle> | null = null;

export function getProductionDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for the production storefront adapter");
  if (!database) database = drizzle(url);
  return database;
}
