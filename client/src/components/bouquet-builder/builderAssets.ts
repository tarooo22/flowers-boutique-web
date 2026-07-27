import type {
  BuilderAssetMatch,
  BuilderFlowerAssetKey,
  BuilderProduct,
  BuilderRibbonOption,
  BuilderWrapperOption,
} from "./builderTypes";

const ASSET_ROOT = "/flower-assets/builder";

export const BUILDER_FLOWER_ASSETS: Record<BuilderFlowerAssetKey, string> = {
  rose: `${ASSET_ROOT}/builder-rose-red-long_c5da74d4.png`,
  sprayRose: `${ASSET_ROOT}/builder-spray-rose-white-long_bc97f140.png`,
  lily: `${ASSET_ROOT}/builder-lily-pink-long_87ec2a84.png`,
  sunflower: `${ASSET_ROOT}/builder-sunflower-yellow-photo_4e110129.png`,
  hydrangea: `${ASSET_ROOT}/builder-hydrangea-blue-long_1720a777.png`,
  eustoma: `${ASSET_ROOT}/builder-eustoma-white-long_aa868811.png`,
  alstroemeria: `${ASSET_ROOT}/builder-alstroemeria-white-long_21ac0fd9.png`,
  moluccella: `${ASSET_ROOT}/builder-moluccella-green-photo_a18f1036.png`,
  peony: `${ASSET_ROOT}/builder-peony-pink-long_9274ca38.png`,
};

const PRODUCT_ASSET_OVERRIDES: Partial<Record<number, BuilderFlowerAssetKey>> = {
  690003: "rose",
  30001: "sprayRose",
  90001: "lily",
  90003: "sunflower",
  90008: "hydrangea",
  180001: "eustoma",
  90011: "alstroemeria",
  90017: "moluccella",
  60001: "peony",
};

export const PHASE_ONE_BUILDER_PRODUCT_IDS = new Set(
  Object.keys(PRODUCT_ASSET_OVERRIDES).map(Number)
);

export const BUILDER_WRAPPERS: BuilderWrapperOption[] = [
  {
    id: "cream",
    nameKa: "კრემისფერი",
    nameEn: "Cream",
    color: "#f2dad4",
    backPath: `${ASSET_ROOT}/builder-wrap-cream-back_e0513a4a.png`,
    frontPath: `${ASSET_ROOT}/builder-wrap-cream-front_bd5ce91f.png`,
  },
  {
    id: "light-pink",
    nameKa: "ღია ვარდისფერი",
    nameEn: "Light pink",
    color: "#f3a8d0",
    backPath: `${ASSET_ROOT}/builder-wrap-light-pink-back_b213e159.png`,
    frontPath: `${ASSET_ROOT}/builder-wrap-light-pink-front_afee8d50.png`,
  },
  {
    id: "light-green",
    nameKa: "ღია მწვანე",
    nameEn: "Light green",
    color: "#9fca7b",
    backPath: `${ASSET_ROOT}/builder-wrap-light-green-back_19a8c092.png`,
    frontPath: `${ASSET_ROOT}/builder-wrap-light-green-front_d1e6fddc.png`,
  },
  {
    id: "yellow",
    nameKa: "ყვითალი",
    nameEn: "Yellow",
    color: "#f5cf4e",
    backPath: `${ASSET_ROOT}/builder-wrap-yellow-back_118c3221.png`,
    frontPath: `${ASSET_ROOT}/builder-wrap-yellow-front_c75c9b96.png`,
  },
  {
    id: "burgundy",
    nameKa: "შინდისფერი",
    nameEn: "Burgundy",
    color: "#8b273d",
    backPath: `${ASSET_ROOT}/builder-wrap-burgundy-back_1a0d76b3.png`,
    frontPath: `${ASSET_ROOT}/builder-wrap-burgundy-front_f777cdfc.png`,
  },
];

export const BUILDER_RIBBONS: BuilderRibbonOption[] = [
  {
    id: "burgundy",
    nameKa: "შინდისფერი",
    nameEn: "Burgundy",
    color: "#9e2b3e",
    assetPath: `${ASSET_ROOT}/builder-ribbon-burgundy-photo_fcbee894.png`,
  },
  {
    id: "ivory",
    nameKa: "კრემისფერი",
    nameEn: "Ivory",
    color: "#e7dfcb",
    assetPath: `${ASSET_ROOT}/builder-ribbon-ivory-photo_dee04a66.png`,
  },
  {
    id: "light-green",
    nameKa: "ღია მწვანე",
    nameEn: "Light green",
    color: "#a8b97c",
    assetPath: `${ASSET_ROOT}/builder-ribbon-light-green-photo_bee113a6.png`,
  },
  {
    id: "white",
    nameKa: "თეთრი",
    nameEn: "White",
    color: "#ffffff",
    assetPath: `${ASSET_ROOT}/builder-ribbon-white-photo_6c92e12e.png`,
  },
];

export const BUILDER_FALLBACK_FLOWER_ASSET = BUILDER_FLOWER_ASSETS.rose;

function matchAssetKey(product: BuilderProduct): BuilderFlowerAssetKey | null {
  const override = PRODUCT_ASSET_OVERRIDES[product.id];
  if (override) return override;

  const text = `${product.nameKa ?? ""} ${product.nameEn ?? ""}`.toLowerCase();

  if (text.includes("სპრეი") || text.includes("spray")) return "sprayRose";
  if (
    text.includes("ალსტრომ") ||
    text.includes("alstro")
  ) return "alstroemeria";
  if (
    text.includes("ჰორტენზ") ||
    text.includes("hydrangea")
  ) return "hydrangea";
  if (
    text.includes("ეუსტომ") ||
    text.includes("ლისიანთ") ||
    text.includes("eustoma") ||
    text.includes("lisianthus")
  ) return "eustoma";
  if (
    text.includes("მოლუცელ") ||
    text.includes("მოლუკელ") ||
    text.includes("moluccella")
  ) return "moluccella";
  if (text.includes("მზესუმზირ") || text.includes("sunflower")) return "sunflower";
  if (text.includes("პიონ") || text.includes("peony")) return "peony";
  if (
    text.includes("ლილი") ||
    text.includes("შროშან") ||
    text.includes("lily")
  ) return "lily";
  if (
    text.includes("ვარდ") ||
    text.includes("rose") ||
    text.includes("austin")
  ) return "rose";

  return null;
}

export function getBuilderFlowerAsset(product: BuilderProduct): BuilderAssetMatch {
  const key = matchAssetKey(product);
  if (key) {
    return { key, path: BUILDER_FLOWER_ASSETS[key], isFallback: false };
  }

  return {
    key: "rose",
    path: BUILDER_FALLBACK_FLOWER_ASSET,
    isFallback: true,
  };
}

export function isPhaseOneBuilderProduct(product: BuilderProduct): boolean {
  return PHASE_ONE_BUILDER_PRODUCT_IDS.has(product.id);
}

export function getWrapperOption(id: string): BuilderWrapperOption {
  return BUILDER_WRAPPERS.find(option => option.id === id) ?? BUILDER_WRAPPERS[0];
}

export function getRibbonOption(id: string): BuilderRibbonOption {
  return BUILDER_RIBBONS.find(option => option.id === id) ?? BUILDER_RIBBONS[0];
}
