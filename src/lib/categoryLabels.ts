import type { Category } from "@/types";

/**
 * Prefer the localized category dictionary over a legacy API-provided raw key.
 * An unknown future category deliberately falls back to its server name.
 */
export function localizedCategoryName(
  category: Category,
  translate: (key: string) => string,
) {
  const key = `category.${category.id}`;
  const localized = translate(key);
  return localized === key ? category.name : localized;
}
