import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { flowerCircleLedger, getProductionDb, orders, products } from "@/lib/production/db";
import { calculateFlowerCircleRedemption, getFlowerCircleBalance } from "@/lib/production/flowerCircle";

type CustomerInput = {
  name: string;
  email?: string;
  phone: string;
  recipient?: string;
  address: string;
  city?: string;
  date?: string;
  time?: string;
  notes?: string;
  fulfillment?: string;
};

type ProductLine = { productId: string | number; quantity: number; variantId?: string };
type CustomLine = { kind: "custom"; quantity: number; price: number; name?: string; image?: string };

export type NextOrderInput = {
  customer: CustomerInput;
  items: Array<ProductLine | CustomLine>;
  userId?: number | null;
  useFlowerCircleBenefit?: boolean;
};

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function quantity(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.min(99, Math.max(1, Math.round(parsed))) : 1;
}

function variantPrice(product: typeof products.$inferSelect, variantId?: string) {
  const base = Number(product.priceMin ?? 0);
  const variants = Array.isArray(product.variants) ? product.variants as Array<{ id?: string; priceMin?: number | string; available?: boolean }> : [];
  const selected = variants.find((variant) => variant.id === variantId && variant.available !== false);
  return selected?.priceMin === undefined ? base : Number(selected.priceMin);
}

export async function createProductionOrder(input: NextOrderInput) {
  const customer = {
    name: text(input.customer?.name, 120),
    email: text(input.customer?.email, 160),
    phone: text(input.customer?.phone, 60),
    recipient: text(input.customer?.recipient, 120),
    address: text(input.customer?.address, 240),
    city: text(input.customer?.city, 80),
    date: text(input.customer?.date, 40),
    time: text(input.customer?.time, 40),
    notes: text(input.customer?.notes, 600),
    fulfillment: input.customer?.fulfillment === "studio_pickup" ? "studio_pickup" : "delivery",
  };
  if (!customer.name || !customer.phone || (customer.fulfillment === "delivery" && !customer.address)) throw new Error("missing_fields");

  const productLines = input.items.filter((item): item is ProductLine => "productId" in item);
  const customLines = input.items.filter((item): item is CustomLine => "kind" in item && item.kind === "custom");
  const ids = [...new Set(productLines.map((line) => Number(line.productId)).filter(Number.isSafeInteger))];
  const liveProducts = ids.length
    ? await getProductionDb().select().from(products).where(and(inArray(products.id, ids), eq(products.published, true), eq(products.isAvailable, true)))
    : [];
  const byId = new Map(liveProducts.map((product) => [product.id, product]));
  const canonicalProductItems = productLines.map((line) => {
    const product = byId.get(Number(line.productId));
    if (!product) throw new Error("invalid_product");
    const unit = variantPrice(product, line.variantId);
    return {
      kind: "product" as const,
      productId: product.id,
      name: product.nameKa || product.nameEn,
      quantity: quantity(line.quantity),
      unitPrice: unit,
      total: unit * quantity(line.quantity),
    };
  });
  const canonicalCustomItems = customLines.map((line) => {
    const unit = Number(line.price);
    if (!Number.isFinite(unit) || unit < 0) throw new Error("invalid_custom_price");
    return {
      kind: "custom" as const,
      name: text(line.name, 160) || "Custom bouquet",
      quantity: quantity(line.quantity),
      unitPrice: unit,
      total: unit * quantity(line.quantity),
      image: text(line.image, 400) || undefined,
    };
  });
  const items = [...canonicalProductItems, ...canonicalCustomItems];
  if (!items.length) throw new Error("empty_order");

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = customer.fulfillment === "studio_pickup" || subtotal >= 150 ? 0 : 15;
  const userId = Number.isSafeInteger(input.userId) && Number(input.userId) > 0 ? Number(input.userId) : null;
  const benefitDiscount = userId ? calculateFlowerCircleRedemption(await getFlowerCircleBalance(userId), subtotal, input.useFlowerCircleBenefit === true) : 0;
  const total = subtotal - benefitDiscount + deliveryFee;
  const db = getProductionDb();
  const orderNumber = await db.transaction(async (tx) => {
    const numberRow = await tx.select({ latest: sql<number>`coalesce(max(${orders.orderNumber}), 600000)` }).from(orders);
    const nextOrderNumber = Number(numberRow[0]?.latest ?? 600000) + 1;
    const result = await tx.insert(orders).values({
    userId,
    customerName: customer.name,
    customerEmail: customer.email || null,
    customerPhone: customer.phone,
    recipientName: customer.recipient || null,
    deliveryAddress: customer.address || "Flower’s Boutique studio pickup",
    deliveryDate: customer.date || null,
    deliveryTime: customer.time || null,
    notes: customer.notes || null,
    items,
    totalPrice: String(total),
    subtotalBeforeBenefit: String(subtotal),
    flowerCircleDiscount: String(benefitDiscount),
    deliveryFee: String(deliveryFee),
    orderNumber: nextOrderNumber,
    orderChannel: "website",
    paymentMethod: "cash",
    paymentStatus: "pending",
    deliveryStatus: "new",
    fulfillmentType: customer.fulfillment === "studio_pickup" ? "pickup" : "delivery",
    });
    const orderId = Number(result[0]?.insertId);
    if (!Number.isSafeInteger(orderId) || orderId <= 0) throw new Error("order_creation_failed");
    if (userId && benefitDiscount > 0) {
      await tx.insert(flowerCircleLedger).values({ userId, orderId, eventKey: `redeem:${orderId}`, type: "redeem", amount: String(-benefitDiscount), status: "posted", note: "Applied in Checkout" });
    }
    return nextOrderNumber;
  });
  return { id: `FLR-${orderNumber}`, orderNumber, subtotal, deliveryFee, flowerCircleDiscount: benefitDiscount, total };
}
