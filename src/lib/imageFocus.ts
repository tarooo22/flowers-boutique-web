/**
 * Focal point per photograph, used as CSS `object-position`.
 *
 * Several of our shots are wide scenes where the bouquet sits off-centre (a
 * gift set next to a teddy bear, a market wall). Cropping those to a portrait
 * card with the default centre focus would frame the wrong subject, so each
 * such photo declares where the flowers actually are.
 */
const FOCUS: Record<string, string> = {
  "/manus-storage/shot-3_db9224d2.webp": "8% 45%",
  "/manus-storage/shot-4_5da681a6.webp": "72% 62%",
  "/manus-storage/shot-1_c1aaea3a.webp": "50% 45%",
  "/manus-storage/shot-5_966554ed.webp": "45% 50%",
  "/manus-storage/editorial-mixed_89b233bb.webp": "50% 40%",
  "/manus-storage/editorial-roses_39a060f9.webp": "50% 38%",
};

export function focusFor(src: string): string {
  return FOCUS[src] ?? "50% 50%";
}
