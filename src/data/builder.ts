/**
 * Bouquet-builder catalog: single stems, wrapping papers and ribbons.
 * Assets are transparent cutout PNGs composited by the preview canvas.
 */

export type FlowerKey =
  | "rose"
  | "sprayRose"
  | "lily"
  | "sunflower"
  | "hydrangea"
  | "eustoma"
  | "alstroemeria"
  | "moluccella"
  | "peony";

export interface BuilderFlower {
  key: FlowerKey;
  /** translation key suffix: `builder.flower.<key>` */
  nameEn: string;
  price: number;
  asset: string;
  colorHex: string;
}

export const builderFlowers: BuilderFlower[] = [
  { key: "rose", nameEn: "Red rose", price: 8, asset: "/manus-storage/builder-rose-red-long_27f9586b.png", colorHex: "#c5203a" },
  { key: "sprayRose", nameEn: "Spray rose", price: 9, asset: "/manus-storage/builder-spray-rose-white-long_3c1d1e45.png", colorHex: "#f3ece1" },
  { key: "peony", nameEn: "Peony", price: 16, asset: "/manus-storage/builder-peony-pink-long_b13d00f5.png", colorHex: "#ef8fb3" },
  { key: "lily", nameEn: "Lily", price: 12, asset: "/manus-storage/builder-lily-pink-long_115f27dc.png", colorHex: "#f2a0bd" },
  { key: "hydrangea", nameEn: "Hydrangea", price: 18, asset: "/manus-storage/builder-hydrangea-blue-long_e5c5f9ea.png", colorHex: "#7fa8d9" },
  { key: "eustoma", nameEn: "Eustoma", price: 10, asset: "/manus-storage/builder-eustoma-white-long_c7c7aacd.png", colorHex: "#f7f3ea" },
  { key: "alstroemeria", nameEn: "Alstroemeria", price: 7, asset: "/manus-storage/builder-alstroemeria-white-long_f9b4e42c.png", colorHex: "#f0ead9" },
  { key: "sunflower", nameEn: "Sunflower", price: 11, asset: "/manus-storage/builder-sunflower-yellow-photo_413e779f.png", colorHex: "#f0be2c" },
  { key: "moluccella", nameEn: "Moluccella", price: 6, asset: "/manus-storage/builder-moluccella-green-photo_617bdfd3.png", colorHex: "#9bb87c" },
];

export const flowerByKey = Object.fromEntries(
  builderFlowers.map((f) => [f.key, f]),
) as Record<FlowerKey, BuilderFlower>;

export interface WrapperOption {
  id: string;
  nameEn: string;
  color: string;
  back: string;
  front: string;
  price: number;
}

export const wrappers: WrapperOption[] = [
  { id: "cream", nameEn: "Cream", color: "#f2dad4", back: "/manus-storage/builder-wrap-cream-back_de8e41ea.png", front: "/manus-storage/builder-wrap-cream-front_de90fdc3.png", price: 12 },
  { id: "light-pink", nameEn: "Light pink", color: "#f3a8d0", back: "/manus-storage/builder-wrap-light-pink-back_3d88d37b.png", front: "/manus-storage/builder-wrap-light-pink-front_b2ae2f91.png", price: 12 },
  { id: "light-green", nameEn: "Light green", color: "#9fca7b", back: "/manus-storage/builder-wrap-light-green-back_d9d5d0f1.png", front: "/manus-storage/builder-wrap-light-green-front_e3c90ca8.png", price: 12 },
  { id: "yellow", nameEn: "Yellow", color: "#f5cf4e", back: "/manus-storage/builder-wrap-yellow-back_7e59f541.png", front: "/manus-storage/builder-wrap-yellow-front_4f2f8089.png", price: 12 },
  { id: "burgundy", nameEn: "Burgundy", color: "#8b273d", back: "/manus-storage/builder-wrap-burgundy-back_9f04c0f4.png", front: "/manus-storage/builder-wrap-burgundy-front_f9e83def.png", price: 14 },
];

export interface RibbonOption {
  id: string;
  nameEn: string;
  color: string;
  asset: string;
}

export const ribbons: RibbonOption[] = [
  { id: "ivory", nameEn: "Ivory", color: "#e7dfcb", asset: "/manus-storage/builder-ribbon-ivory-photo_6accd292.png" },
  { id: "burgundy", nameEn: "Burgundy", color: "#9e2b3e", asset: "/manus-storage/builder-ribbon-burgundy-photo_ddccf164.png" },
  { id: "light-green", nameEn: "Light green", color: "#a8b97c", asset: "/manus-storage/builder-ribbon-light-green-photo_1b8f1575.png" },
  { id: "white", nameEn: "White", color: "#ffffff", asset: "/manus-storage/builder-ribbon-white-photo_d82af43c.png" },
];

export const getWrapper = (id: string) => wrappers.find((w) => w.id === id) ?? wrappers[0];
export const getRibbon = (id: string) => ribbons.find((r) => r.id === id) ?? ribbons[0];

export const MAX_STEMS = 36;
export const MAX_PER_FLOWER = 24;
