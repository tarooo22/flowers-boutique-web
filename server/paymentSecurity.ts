import { TRPCError } from "@trpc/server";
import type { Product } from "../drizzle/schema";
import { DELIVERY_FEE_GEL, getDeliveryFeeGEL } from "../shared/checkoutPolicy";

export { DELIVERY_FEE_GEL };
export const DELIVERY_FEE_MINOR = DELIVERY_FEE_GEL * 100;

export type PaymentItemSelection = {
  productId: number;
  variantId?: string;
  quantity: number;
  customData?: unknown;
};

export type CanonicalOrderItemSnapshot = {
  productId: number;
  productCode: string;
  productNameKa: string;
  productNameEn: string;
  productImageUrl: string | null;
  quantity: number;
  price: number;
  unitPrice: number;
  lineTotal: number;
  selectedVariantId?: string;
  selectedVariant: {
    id: string;
    colorNameKa: string | null;
    colorNameEn: string | null;
    colorHex: string | null;
  } | null;
  selectedColorNameKa?: string;
  selectedColorNameEn?: string;
  selectedColorHex?: string;
  itemType: string;
  customData?: unknown;
};

export type CanonicalPayment = {
  items: CanonicalOrderItemSnapshot[];
  basketItems: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotalMinor: number;
  deliveryFeeMinor: number;
  finalTotalMinor: number;
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;
};

export function canonicalBOGAmounts(payment: CanonicalPayment) {
  return {
    amount: payment.subtotal,
    basketItems: payment.basketItems,
    deliveryAmount: payment.deliveryFee,
  } as const;
}

export type LoadProduct = (productId: number) => Promise<Product | null | undefined>;

export function toMinorUnits(value: string | number | null | undefined): number {
  if (value === null || value === undefined) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Product price is unavailable" });
  }

  const normalized = typeof value === "number" ? value.toFixed(2) : value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Product price is invalid" });
  }

  const [whole, fraction = ""] = normalized.split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(minor) || minor < 0) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Product price is invalid" });
  }
  return minor;
}

export function fromMinorUnits(value: number): number {
  if (!Number.isSafeInteger(value)) {
    throw new Error("Money value must be an integer number of minor units");
  }
  return value / 100;
}

function productCode(productId: number): string {
  return `FB-${String(productId).padStart(6, "0")}`;
}

export async function calculateCanonicalPayment(
  selections: PaymentItemSelection[],
  fulfillmentType: "delivery" | "pickup",
  loadProduct: LoadProduct,
): Promise<CanonicalPayment> {
  if (selections.length === 0) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Order must contain at least one item" });
  }

  const items: CanonicalOrderItemSnapshot[] = [];
  let subtotalMinor = 0;

  for (const selection of selections) {
    if (!Number.isInteger(selection.quantity) || selection.quantity < 1 || selection.quantity > 99) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid product quantity" });
    }

    const product = await loadProduct(selection.productId);
    if (!product) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
    }
    if (!product.isAvailable || product.published === false) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Product is unavailable" });
    }
    if (product.priceOnRequest) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Product price is unavailable" });
    }

    const variant = selection.variantId
      ? product.variants?.find(candidate => candidate?.id === selection.variantId)
      : undefined;

    if (selection.variantId && !variant) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Selected product variant is invalid" });
    }
    if (variant && variant.available === false) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Selected product variant is unavailable" });
    }

    const unitPriceMinor = toMinorUnits(variant?.priceMin ?? product.priceMin);
    const lineTotalMinor = unitPriceMinor * selection.quantity;
    if (!Number.isSafeInteger(lineTotalMinor)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Order total is too large" });
    }
    subtotalMinor += lineTotalMinor;

    const unitPrice = fromMinorUnits(unitPriceMinor);
    const lineTotal = fromMinorUnits(lineTotalMinor);
    items.push({
      productId: product.id,
      productCode: productCode(product.id),
      productNameKa: product.nameKa,
      productNameEn: product.nameEn,
      productImageUrl: variant?.imageUrl ?? product.imageUrl ?? null,
      quantity: selection.quantity,
      price: unitPrice,
      unitPrice,
      lineTotal,
      selectedVariantId: variant?.id,
      selectedVariant: variant
        ? {
            id: variant.id,
            colorNameKa: variant.colorNameKa ?? null,
            colorNameEn: variant.colorNameEn ?? null,
            colorHex: variant.colorHex ?? null,
          }
        : null,
      selectedColorNameKa: variant?.colorNameKa,
      selectedColorNameEn: variant?.colorNameEn,
      selectedColorHex: variant?.colorHex,
      itemType: product.unitType ?? "product",
      customData: selection.customData,
    });
  }

  const deliveryFeeMinor = getDeliveryFeeGEL(fulfillmentType, fromMinorUnits(subtotalMinor)) * 100;
  const finalTotalMinor = subtotalMinor + deliveryFeeMinor;
  if (!Number.isSafeInteger(finalTotalMinor) || finalTotalMinor <= 0) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Order total is invalid" });
  }

  return {
    items,
    basketItems: items.map(item => ({
      name: item.productNameKa,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.lineTotal,
    })),
    subtotalMinor,
    deliveryFeeMinor,
    finalTotalMinor,
    subtotal: fromMinorUnits(subtotalMinor),
    deliveryFee: fromMinorUnits(deliveryFeeMinor),
    finalTotal: fromMinorUnits(finalTotalMinor),
  };
}

export type LocalPaymentStatus =
  | "pending"
  | "pending_payment"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type PublicPaymentStatus = "pending" | "processing" | "paid" | "failed";

export function mapBOGStatus(status: string | null | undefined): {
  localStatus: LocalPaymentStatus;
  publicStatus: PublicPaymentStatus;
} {
  switch (status) {
    case "completed":
      return { localStatus: "paid", publicStatus: "paid" };
    case "rejected":
    case "failed":
    case "cancelled":
      return { localStatus: "failed", publicStatus: "failed" };
    case "refunded":
      return { localStatus: "refunded", publicStatus: "paid" };
    case "refund_requested":
    case "refunded_partially":
    case "blocked":
      return { localStatus: "pending_payment", publicStatus: "processing" };
    case "processing":
      return { localStatus: "pending_payment", publicStatus: "processing" };
    case "created":
    default:
      return { localStatus: "pending", publicStatus: "pending" };
  }
}

export function resolveTrustedPaymentStatus(
  currentStatus: string | null | undefined,
  bogStatus: string | null | undefined,
): LocalPaymentStatus {
  const mapped = mapBOGStatus(bogStatus).localStatus;

  // A late or duplicated non-final callback must never downgrade a payment
  // that BOG already confirmed as paid or refunded.
  if (currentStatus === "refunded") return "refunded";
  if (currentStatus === "paid" && mapped !== "refunded") return "paid";
  if (
    (currentStatus === "failed" || currentStatus === "cancelled") &&
    (mapped === "pending" || mapped === "pending_payment")
  ) {
    return currentStatus;
  }
  return mapped;
}

export function shouldApplyBOGCallbackUpdate(
  currentStatus: string | null | undefined,
  bogStatus: string | null | undefined,
  callbackAlreadyReceived: boolean,
): boolean {
  const nextStatus = resolveTrustedPaymentStatus(currentStatus, bogStatus);
  return !(callbackAlreadyReceived && currentStatus === nextStatus);
}

export function publicPaymentStatus(
  paymentStatus: string | null | undefined,
  bogStatus: string | null | undefined,
): PublicPaymentStatus {
  if (paymentStatus === "paid") return "paid";
  if (paymentStatus === "failed" || paymentStatus === "cancelled") return "failed";
  if (bogStatus === "processing") return "processing";
  return mapBOGStatus(bogStatus).publicStatus;
}
