/**
 * Color variant types for products
 */

export interface ProductVariant {
  id: string; // UUID or unique identifier
  colorNameKa: string; // Georgian color name
  colorNameEn: string; // English color name
  colorHex: string; // Hex color code (e.g., #f6a5b8)
  imageUrl?: string; // Optional variant-specific image
  imageKey?: string; // Storage key for variant image
  priceMin?: number; // Optional price override
  priceMax?: number; // Optional price override
  available: boolean; // Is this variant available
  isDefault: boolean; // Is this the default variant
}

export interface ProductWithVariants {
  id: number;
  nameKa: string;
  nameEn: string;
  descriptionKa?: string;
  descriptionEn?: string;
  priceMin?: number;
  priceMax?: number;
  priceOnRequest: boolean;
  unitType: string;
  categoryId: number;
  imageUrl?: string;
  imageKey?: string;
  isRose: boolean;
  isAvailable: boolean;
  featured: boolean;
  variants?: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemWithVariant {
  productId: number;
  quantity: number;
  selectedVariantId?: string;
  selectedColorNameKa?: string;
  selectedColorNameEn?: string;
  selectedColorHex?: string;
  selectedVariantImage?: string;
}
