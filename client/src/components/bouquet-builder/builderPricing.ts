import type { BuilderProduct } from "./builderTypes";

export function normalizePrice(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const cleaned = value
      .replace(/[^\d.,-]/g, "")
      .replace(/\s/g, "")
      .replace(",", ".");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    for (const key of ["amount", "value", "min", "price", "priceMin"] as const) {
      const normalized = normalizePrice(objectValue[key]);
      if (normalized > 0) return normalized;
    }
  }

  return 0;
}

export function getBuilderProductPrice(product: BuilderProduct): number {
  const minimum = normalizePrice(product.priceMin);
  if (minimum > 0) return minimum;
  return normalizePrice(product.priceMax);
}

export function formatBuilderPrice(value: unknown): string {
  const normalized = normalizePrice(value);
  return `₾${normalized.toFixed(2)}`;
}
