/**
 * Geometry for the visual bouquet preview.
 *
 * Stems are laid out as a hand-tied fan: every stem is anchored at a shared
 * pivot near the wrap knot and rotated outward in symmetric left/right pairs.
 * "Reach" is how far a head sits from the pivot, which also decides its depth
 * (further out = higher in the bouquet = drawn behind).
 */

/** aspect ratio of the wrapper artwork (w/h) */
const WRAPPER_RATIO = 1122 / 1402;
/** where every stem is tied, in % of the canvas */
const PIVOT = { x: 50, y: 72 };
const HALF_SWING_DEGREES = 38;
const TOP_REACH = 46;
const BOTTOM_REACH = 3;
const HEAD_EXTRA_REACH = TOP_REACH * (0.42 - 1.58 * 0.08);

/** angle/reach presets for successive symmetric pairs, outermost first */
const PAIR_PRESETS = [
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

/** per-species head size relative to a rose */
const SPECIES_SCALE: Record<string, number> = {
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

/** where the head sits within its own artwork, used as the scaling anchor */
const SCALE_ANCHOR: Record<string, number> = {
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

export type WrapMode = "paper" | "ribbonOnly";

export interface SelectedStem {
  key: string;
  asset: string;
  quantity: number;
}

export interface BouquetToken {
  id: string;
  key: string;
  asset: string;
  slotIndex: number;
  angle: number;
  reach: number;
  headY: number;
  zIndex: number;
  speciesScale: number;
  scaleAnchor: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** smoothstep, so depth eases instead of ramping linearly */
const smooth = (d: number) => {
  const s = clamp(d, 0, 1);
  return s * s * (3 - 2 * s);
};

const reachForDepth = (depth: number) => TOP_REACH - (TOP_REACH - BOTTOM_REACH) * smooth(depth);

/** invert reachForDepth by bisection */
function depthForReach(reach: number): number {
  const target = clamp(reach, BOTTOM_REACH, TOP_REACH);
  let low = 0;
  let high = 1;
  for (let i = 0; i < 14; i += 1) {
    const mid = (low + high) / 2;
    if (reachForDepth(mid) > target) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

function geometryFromHead(headX: number, headY: number) {
  const dx = (headX - PIVOT.x) * WRAPPER_RATIO;
  const dy = PIVOT.y - headY;
  const angle = clamp(
    (Math.atan2(dx, Math.max(0.01, dy)) * 180) / Math.PI,
    -HALF_SWING_DEGREES,
    HALF_SWING_DEGREES,
  );
  const radius = Math.sqrt(dx * dx + dy * dy);
  const reach = clamp(radius - HEAD_EXTRA_REACH, BOTTOM_REACH, TOP_REACH);
  return { angle, reach, depth: depthForReach(reach), headY };
}

function geometryFromAngleReach(angle: number, reach: number) {
  const a = clamp(angle, -HALF_SWING_DEGREES, HALF_SWING_DEGREES);
  const r = clamp(reach, BOTTOM_REACH, TOP_REACH) + HEAD_EXTRA_REACH;
  const rad = (a * Math.PI) / 180;
  return geometryFromHead(
    PIVOT.x + (Math.sin(rad) * r) / WRAPPER_RATIO,
    PIVOT.y - Math.cos(rad) * r,
  );
}

/** odd counts get a centre stem; the rest fan out in mirrored pairs */
function geometryForSlot(slotIndex: number, total: number) {
  const hasCentre = total % 2 === 1;
  if (hasCentre && slotIndex === 0) return geometryFromAngleReach(0, 38);

  const paired = slotIndex - (hasCentre ? 1 : 0);
  const pairIndex = Math.floor(paired / 2);
  const side = paired % 2 === 0 ? -1 : 1;
  const preset = PAIR_PRESETS[Math.min(pairIndex, PAIR_PRESETS.length - 1)];
  return geometryFromAngleReach(side * preset.angle, preset.reach);
}

/** round-robin the selection so species mix evenly instead of clumping */
function interleave(stems: SelectedStem[]) {
  const max = stems.reduce((m, s) => Math.max(m, s.quantity), 0);
  const out: Array<{ stem: SelectedStem; dup: number }> = [];
  for (let dup = 0; dup < max; dup += 1) {
    stems.forEach((stem) => {
      if (dup < stem.quantity) out.push({ stem, dup });
    });
  }
  return out;
}

export function buildBouquetTokens(stems: SelectedStem[]): BouquetToken[] {
  const list = interleave(stems);
  return list.map(({ stem, dup }, slotIndex) => {
    const g = geometryForSlot(slotIndex, list.length);
    return {
      id: `${stem.key}-${dup}`,
      key: stem.key,
      asset: stem.asset,
      slotIndex,
      angle: g.angle,
      reach: g.reach,
      headY: g.headY,
      zIndex: 20 + Math.round(g.headY * 2) + (slotIndex % 5),
      speciesScale: SPECIES_SCALE[stem.key] ?? 1,
      scaleAnchor: SCALE_ANCHOR[stem.key] ?? 0.32,
    };
  });
}

/** the whole bouquet shrinks as stem count grows so it stays inside the wrap */
export function densityScale(total: number): number {
  if (total <= 1) return 1.1;
  if (total <= 3) return 1.04;
  if (total <= 6) return 0.98;
  if (total <= 10) return 0.92;
  if (total <= 15) return 0.86;
  if (total <= 24) return 0.78;
  if (total <= 36) return 0.7;
  return 0.64;
}

export function tokenVisuals(token: BouquetToken, total: number, wrapMode: WrapMode) {
  const ribbonOnly = wrapMode === "ribbonOnly";
  // without paper the fan opens a little wider
  const fan = ribbonOnly ? 1.18 : 1;
  const push = ribbonOnly && Math.abs(token.angle) > 0.5 ? Math.sign(token.angle) * 1.5 : 0;
  const angle = clamp(token.angle * fan + push, -48, 48);
  const reachDrop = ((TOP_REACH - token.reach) / TOP_REACH) * 100;
  return {
    angle,
    reachDrop,
    // hide the stem where the paper would cover it
    clipBottom: (16 + reachDrop) / 1.58,
    scale: densityScale(total) * (ribbonOnly ? 0.98 : 1),
  };
}
