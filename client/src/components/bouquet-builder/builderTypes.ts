export interface BuilderProductVariant {
  id?: number | string;
  colorNameKa?: string | null;
  colorNameEn?: string | null;
  colorHex?: string | null;
  imageUrl?: string | null;
  priceMin?: unknown;
  priceMax?: unknown;
  available?: boolean | null;
  isDefault?: boolean | null;
}

export interface BuilderProduct {
  id: number;
  nameKa: string;
  nameEn: string;
  priceMin?: unknown;
  priceMax?: unknown;
  priceOnRequest?: boolean | null;
  unitType?: string | null;
  imageUrl?: string | null;
  categoryId: number;
  isAvailable?: boolean | null;
  published?: boolean | null;
  variants?: BuilderProductVariant[] | null;
}

export interface SelectedBuilderFlower {
  product: BuilderProduct;
  quantity: number;
  unitPrice: number;
}

export type BuilderWrapMode = "paper" | "ribbonOnly";

export type BuilderFlowerAssetKey =
  | "rose"
  | "sprayRose"
  | "lily"
  | "sunflower"
  | "hydrangea"
  | "eustoma"
  | "alstroemeria"
  | "moluccella"
  | "peony";

export interface BuilderAssetMatch {
  key: BuilderFlowerAssetKey;
  path: string;
  isFallback: boolean;
}

export interface BuilderBouquetToken {
  id: string;
  productId: number;
  productNameKa: string;
  productNameEn: string;
  assetKey: BuilderFlowerAssetKey;
  assetPath: string;
  slotIndex: number;
  duplicateIndex: number;
  angle: number;
  reach: number;
  depth: number;
  headX: number;
  headY: number;
  zIndex: number;
  speciesScale: number;
  scaleAnchorRatio: number;
}

export interface BuilderWrapperOption {
  id: string;
  nameKa: string;
  nameEn: string;
  color: string;
  backPath: string;
  frontPath: string;
}

export interface BuilderRibbonOption {
  id: string;
  nameKa: string;
  nameEn: string;
  color: string;
  assetPath: string;
}
