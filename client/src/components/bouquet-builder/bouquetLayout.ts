import { getBuilderFlowerAsset } from "./builderAssets";
import type {
  BuilderBouquetToken,
  BuilderFlowerAssetKey,
  BuilderWrapMode,
  SelectedBuilderFlower,
} from "./builderTypes";

const WRAPPER_RATIO = 1122 / 1402;
const PIVOT = { x: 50, y: 72 };
const HALF_SWING_DEGREES = 38;
const TOP_REACH = 46;
const BOTTOM_REACH = 3;
const HEAD_EXTRA_REACH = TOP_REACH * (0.42 - 1.58 * 0.08);

const SYMMETRIC_PAIR_PRESETS = [
  { angle: 16, reach: 46 },
  { angle: 31, reach: 39 },
  { angle: 8, reach: 32 },
  { angle: 22, reach: 30 },
  { angle: 37, reach: 27 },
  { angle: 14, reach: 24 },
  { angle: 29, reach: 22 },
  { angle: 5, reach: 19 },
  { angle: 19, reach: 18 },
  { angle: 35, reach: 16 },
  { angle: 11, reach: 13 },
  { angle: 26, reach: 11 },
] as const;

const SPECIES_SCALE: Record<BuilderFlowerAssetKey, number> = {
  rose: 1,
  sprayRose: 0.76,
  lily: 1.16,
  sunflower: 1.58,
  hydrangea: 1.42,
  eustoma: 1,
  alstroemeria: 0.72,
  moluccella: 1,
  peony: 1.2,
};

const SCALE_ANCHOR_RATIO: Record<BuilderFlowerAssetKey, number> = {
  rose: 0.22,
  sprayRose: 0.35,
  lily: 0.3,
  sunflower: 0.34,
  hydrangea: 0.3,
  eustoma: 0.31,
  alstroemeria: 0.31,
  moluccella: 0.58,
  peony: 0.24,
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothDepth(depth: number): number {
  const safeDepth = clamp(depth, 0, 1);
  return safeDepth * safeDepth * (3 - 2 * safeDepth);
}

function reachForDepth(depth: number): number {
  return TOP_REACH - (TOP_REACH - BOTTOM_REACH) * smoothDepth(depth);
}

function depthForReach(reach: number): number {
  const target = clamp(reach, BOTTOM_REACH, TOP_REACH);
  let low = 0;
  let high = 1;

  for (let index = 0; index < 14; index += 1) {
    const middle = (low + high) / 2;
    if (reachForDepth(middle) > target) low = middle;
    else high = middle;
  }

  return (low + high) / 2;
}

function geometryFromHead(headX: number, headY: number) {
  const deltaX = (headX - PIVOT.x) * WRAPPER_RATIO;
  const deltaY = PIVOT.y - headY;
  const angle = clamp(
    (Math.atan2(deltaX, Math.max(0.01, deltaY)) * 180) / Math.PI,
    -HALF_SWING_DEGREES,
    HALF_SWING_DEGREES
  );
  const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const reach = clamp(
    radius - HEAD_EXTRA_REACH,
    BOTTOM_REACH,
    TOP_REACH
  );

  return {
    angle,
    reach,
    depth: depthForReach(reach),
    headX,
    headY,
  };
}

function geometryFromAngleReach(angle: number, reach: number) {
  const safeAngle = clamp(angle, -HALF_SWING_DEGREES, HALF_SWING_DEGREES);
  const safeReach = clamp(reach, BOTTOM_REACH, TOP_REACH);
  const radians = (safeAngle * Math.PI) / 180;
  const radius = safeReach + HEAD_EXTRA_REACH;

  return geometryFromHead(
    PIVOT.x + (Math.sin(radians) * radius) / WRAPPER_RATIO,
    PIVOT.y - Math.cos(radians) * radius
  );
}

function geometryForSlot(slotIndex: number, totalStemCount: number) {
  const hasCenter = totalStemCount % 2 === 1;
  if (hasCenter && slotIndex === 0) {
    return geometryFromAngleReach(0, 38);
  }

  const pairedSlotIndex = slotIndex - (hasCenter ? 1 : 0);
  const pairIndex = Math.floor(pairedSlotIndex / 2);
  const side = pairedSlotIndex % 2 === 0 ? -1 : 1;
  const preset =
    SYMMETRIC_PAIR_PRESETS[
      Math.min(pairIndex, SYMMETRIC_PAIR_PRESETS.length - 1)
    ];

  return geometryFromAngleReach(side * preset.angle, preset.reach);
}

function interleaveSelectedFlowers(
  selectedFlowers: SelectedBuilderFlower[]
): Array<{ item: SelectedBuilderFlower; duplicateIndex: number }> {
  const maximumQuantity = selectedFlowers.reduce(
    (maximum, item) => Math.max(maximum, item.quantity),
    0
  );
  const interleaved: Array<{
    item: SelectedBuilderFlower;
    duplicateIndex: number;
  }> = [];

  for (
    let duplicateIndex = 0;
    duplicateIndex < maximumQuantity;
    duplicateIndex += 1
  ) {
    selectedFlowers.forEach(item => {
      if (duplicateIndex < item.quantity) {
        interleaved.push({ item, duplicateIndex });
      }
    });
  }

  return interleaved;
}

export function buildBouquetTokens(
  selectedFlowers: SelectedBuilderFlower[]
): BuilderBouquetToken[] {
  const interleaved = interleaveSelectedFlowers(selectedFlowers);

  return interleaved.map(
    ({ item, duplicateIndex }, slotIndex) => {
      const asset = getBuilderFlowerAsset(item.product);
      const geometry = geometryForSlot(slotIndex, interleaved.length);

      return {
        id: `${item.product.id}-${duplicateIndex}`,
        productId: item.product.id,
        productNameKa: item.product.nameKa,
        productNameEn: item.product.nameEn,
        assetKey: asset.key,
        assetPath: asset.path,
        slotIndex,
        duplicateIndex,
        ...geometry,
        zIndex: 20 + Math.round(geometry.headY * 2) + (slotIndex % 5),
        speciesScale: SPECIES_SCALE[asset.key],
        scaleAnchorRatio: SCALE_ANCHOR_RATIO[asset.key],
      };
    }
  );
}

export function getBouquetDensityScale(totalStemCount: number): number {
  if (totalStemCount <= 1) return 1.1;
  if (totalStemCount <= 3) return 1.04;
  if (totalStemCount <= 6) return 0.98;
  if (totalStemCount <= 10) return 0.92;
  if (totalStemCount <= 15) return 0.86;
  if (totalStemCount <= 24) return 0.78;
  if (totalStemCount <= 36) return 0.7;
  return 0.64;
}

export function getBouquetTokenVisuals(
  token: BuilderBouquetToken,
  totalStemCount: number,
  wrapMode: BuilderWrapMode
) {
  const ribbonOnly = wrapMode === "ribbonOnly";
  const fanMultiplier = ribbonOnly ? 1.18 : 1;
  const sidePush =
    ribbonOnly && Math.abs(token.angle) > 0.5
      ? Math.sign(token.angle) * 1.5
      : 0;
  const angle = clamp(
    token.angle * fanMultiplier + sidePush,
    -48,
    48
  );
  const reachDrop = ((TOP_REACH - token.reach) / TOP_REACH) * 100;
  const clipBottom = (16 + reachDrop) / 1.58;
  const densityScale =
    getBouquetDensityScale(totalStemCount) * (ribbonOnly ? 0.98 : 1);

  return {
    angle,
    reachDrop,
    clipBottom,
    densityScale,
  };
}
