import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { categories, flowerCircleLedger, getProductionDb, orders, products } from "@/lib/production/db";
import { calculateFlowerCircleRedemption, getFlowerCircleBalance } from "@/lib/production/flowerCircle";
import { MAX_PER_FLOWER, MAX_STEMS, wrappers } from "@/data/builder";
import { getDeliveryPolicy } from "@/lib/production/storefrontSettings";
import { isDeliveryScheduleAllowed } from "@/lib/production/deliverySchedule";

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
type CustomStem = { key?: unknown; quantity?: unknown };
type CustomLine = {
  kind: "custom";
  customKind?: unknown;
  quantity?: unknown;
  stems?: unknown;
  wrapperId?: unknown;
  ribbonId?: unknown;
  image?: unknown;
};

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

const AI_STYLING_FEE = 20;

function catalogStemId(key: unknown) {
  const match = typeof key === "string" ? /^catalog-(\d+)$/.exec(key) : null;
  const id = match ? Number(match[1]) : NaN;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function customPreviewImage(value: unknown) {
  const image = text(value, 400);
  return image.startsWith("/manus-storage/") ? image : undefined;
}

async function canonicalCustomOrderItems(lines: CustomLine[]) {
  const parsed = lines.map((line) => {
    const stems = Array.isArray(line.stems) ? line.stems as CustomStem[] : [];
    const normalized = stems.map((stem) => ({ id: catalogStemId(stem.key), quantity: quantity(stem.quantity) }));
    if (!normalized.length || normalized.some((stem) => !stem.id)) throw new Error("invalid_custom_composition");
    const stemCount = normalized.reduce((sum, stem) => sum + stem.quantity, 0);
    if (stemCount > MAX_STEMS || normalized.some((stem) => stem.quantity > MAX_PER_FLOWER)) throw new Error("invalid_custom_composition");
    return { line, stems: normalized as Array<{ id: number; quantity: number }> };
  });

  const ids = [...new Set(parsed.flatMap((entry) => entry.stems.map((stem) => stem.id)))];
  const rows = ids.length
    ? await getProductionDb()
      .select({ product: products, category: categories })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(inArray(products.id, ids), eq(products.published, true), eq(products.isAvailable, true), eq(categories.slug, "single-stems")))
    : [];
  const flowers = new Map(rows.map((row) => [row.product.id, row.product]));

  return parsed.map(({ line, stems }) => {
    const kind = line.customKind === "ai" ? "ai" : "visual";
    const flowersTotal = stems.reduce((sum, stem) => {
      const flower = flowers.get(stem.id);
      if (!flower) throw new Error("invalid_custom_composition");
      return sum + Number(flower.priceMin ?? 0) * stem.quantity;
    }, 0);
    const wrapperId = line.wrapperId === null ? null : text(line.wrapperId, 80);
    const wrapper = wrapperId ? wrappers.find((entry) => entry.id === wrapperId) : undefined;
    if (kind === "visual" && wrapperId && !wrapper) throw new Error("invalid_custom_composition");
    const unitPrice = flowersTotal + (kind === "ai" ? AI_STYLING_FEE : wrapper?.price ?? 0);
    return {
      kind: "custom" as const,
      name: kind === "ai" ? "AI bouquet" : "Custom bouquet",
      quantity: quantity(line.quantity),
      unitPrice,
      total: unitPrice * quantity(line.quantity),
      image: customPreviewImage(line.image),
      composition: { kind, stems, wrapperId, ribbonId: text(line.ribbonId, 80) || null },
    };
  });
}

function isDuplicateOrderNumberError(error: unknown) {
  const code = (error as { cause?: { code?: string }; code?: string })?.cause?.code ?? (error as { code?: string })?.code;
  return code === "ER_DUP_ENTRY";
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
  const { policy: deliveryPolicy } = await getDeliveryPolicy();
  if (!isDeliveryScheduleAllowed(customer.date, customer.time, deliveryPolicy)) throw new Error("invalid_delivery_schedule");

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
  const canonicalCustomItems = await canonicalCustomOrderItems(customLines);
  const items = [...canonicalProductItems, ...canonicalCustomItems];
  if (!items.length) throw new Error("empty_order");

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = customer.fulfillment === "studio_pickup" || subtotal >= 150 ? 0 : 15;
  const userId = Number.isSafeInteger(input.userId) && Number(input.userId) > 0 ? Number(input.userId) : null;
  const benefitDiscount = userId ? calculateFlowerCircleRedemption(await getFlowerCircleBalance(userId), subtotal, input.useFlowerCircleBenefit === true) : 0;
  const total = subtotal - benefitDiscount + deliveryFee;
  const db = getProductionDb();
  let orderNumber: number | null = null;
  for (let attempt = 0; attempt < 3 && orderNumber === null; attempt += 1) {
    try {
      orderNumber = await db.transaction(async (tx) => {
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
    } catch (error) {
      if (!isDuplicateOrderNumberError(error) || attempt === 2) throw error;
    }
  }
  if (orderNumber === null) throw new Error("order_creation_failed");
  return { id: `FLR-${orderNumber}`, orderNumber, subtotal, deliveryFee, flowerCircleDiscount: benefitDiscount, total };
}
