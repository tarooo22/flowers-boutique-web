export type EditorialImageSlot = "builder" | "brand";

export const editorialImageSources: Record<EditorialImageSlot, string> = {
  builder: "/flower-assets/editorial/pink-roses.webp",
  brand: "/flower-assets/editorial/mixed-bouquet.webp",
};

export function resolveEditorialImageSource(
  slot: EditorialImageSlot,
  fallbackImages: string[],
  failed: boolean
) {
  if (!failed) return editorialImageSources[slot];

  const fallbackIndex = slot === "brand" ? 1 : 0;
  return fallbackImages[fallbackIndex] ?? fallbackImages[0] ?? null;
}
