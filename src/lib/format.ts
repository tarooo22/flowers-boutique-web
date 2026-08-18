import { brand } from "@/config/brand";

/** Format a price in the store currency, e.g. 240 -> "240 ₾". */
export function formatPrice(value: number): string {
  return `${Math.round(value)} ${brand.delivery.currency}`;
}

/** Format a date like "2026-08-02" -> "2 Aug 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
