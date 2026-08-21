export const FLOWER_CIRCLE_LEVELS = [
  { id: "first-bloom", threshold: 0, benefitPercent: 1 },
  { id: "studio-friend", threshold: 1500, benefitPercent: 2 },
  { id: "season-regular", threshold: 4000, benefitPercent: 3 },
  { id: "inner-circle", threshold: 8000, benefitPercent: 5 },
] as const;

export type FlowerCircleSummary = {
  eligibleSpend: number;
  eligibleOrderCount: number;
  currentLevelId: (typeof FLOWER_CIRCLE_LEVELS)[number]["id"];
  benefitPercent: number;
  nextLevelId: (typeof FLOWER_CIRCLE_LEVELS)[number]["id"] | null;
  nextLevelThreshold: number | null;
  remainingToNextLevel: number;
  progressPercent: number;
};

function toMoney(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : 0;
}

export function calculateFlowerCircleRedemption(availableBenefit: number, subtotal: number, requested: boolean) {
  if (!requested) return 0;
  return Math.min(toMoney(availableBenefit), Math.round(toMoney(subtotal) * 0.3 * 100) / 100);
}

export function summarizeFlowerCircle(eligibleSpend: number, eligibleOrderCount: number): FlowerCircleSummary {
  const spend = toMoney(eligibleSpend);
  const currentIndex = FLOWER_CIRCLE_LEVELS.reduce(
    (index, level, candidateIndex) => (spend >= level.threshold ? candidateIndex : index),
    0,
  );
  const current = FLOWER_CIRCLE_LEVELS[currentIndex];
  const next = FLOWER_CIRCLE_LEVELS[currentIndex + 1] ?? null;
  const progressPercent = next
    ? Math.min(100, Math.max(0, ((spend - current.threshold) / (next.threshold - current.threshold)) * 100))
    : 100;

  return {
    eligibleSpend: spend,
    eligibleOrderCount: Math.max(0, Math.floor(eligibleOrderCount)),
    currentLevelId: current.id,
    benefitPercent: current.benefitPercent,
    nextLevelId: next?.id ?? null,
    nextLevelThreshold: next?.threshold ?? null,
    remainingToNextLevel: next ? Math.max(0, Math.round((next.threshold - spend) * 100) / 100) : 0,
    progressPercent: Math.round(progressPercent * 10) / 10,
  };
}
