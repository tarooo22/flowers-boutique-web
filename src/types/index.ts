export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  blurb: string;
  count: number;
}

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  compareAt?: number;
  images: string[];
  category: CategoryId;
  sourceUnitType?: string;
  tags: string[];
  colors: string[];
  description: string;
  care: string[];
  variants: ProductVariant[];
  available: boolean;
  bestseller?: boolean;
  isNew?: boolean;
}

export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

/** A bouquet composed in the builder (visual composer or AI) . */
export interface CustomBouquetLine {
  id: string;
  kind: "visual" | "ai";
  /** rendered preview for AI bouquets */
  image?: string;
  /** chosen stems for visually composed bouquets */
  stems?: { key: string; quantity: number }[];
  wrapperId?: string | null;
  ribbonId?: string;
  /** free-text description used to generate an AI bouquet */
  prompt?: string;
  price: number;
  quantity: number;
}

import type { Lang } from "@/lib/translations";

export interface JournalPostContent {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  body: string[];
}

export interface JournalPost {
  id: string;
  slug: string;
  date: string;
  readMinutes: number;
  image: string;
  content: Record<Lang, JournalPostContent>;
}

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "newest";
