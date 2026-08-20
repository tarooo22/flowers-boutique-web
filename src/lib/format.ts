import { brand } from "@/config/brand";
import type { Lang } from "@/lib/translations";

/** Format a price in the store currency, e.g. 240 -> "240 ₾". */
export function formatPrice(value: number): string {
  return `${Math.round(value)} ${brand.delivery.currency}`;
}

/** Format a date in the active storefront locale. */
export function formatDate(iso: string, lang: Lang = "en"): string {
  const d = new Date(iso);
  const locale: Record<Lang, string> = { en: "en-GB", ka: "ka-GE", ru: "ru-RU" };
  return d.toLocaleDateString(locale[lang], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
