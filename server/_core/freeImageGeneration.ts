/**
 * Free image generation provider using a fallback approach
 * 
 * TEMPORARY IMPLEMENTATION: This uses a free placeholder service for bouquet preview generation.
 * This should be replaced with a stable paid image generation API (e.g., Manus AI, DALL-E, Midjourney)
 * if the feature becomes critical or requires higher quality/reliability.
 * 
 * Current approach: Generate a styled placeholder image that represents the selected flowers.
 * This provides visual feedback while avoiding API rate limits and timeouts.
 * 
 * No API keys or credentials are exposed in frontend code.
 */

export type FreeGenerateImageOptions = {
  flowers: Array<{ nameKa: string; nameEn: string; quantity: number }>;
};

export type FreeGenerateImageResponse = {
  imageUrl: string;
};

/**
 * Generate a bouquet preview image using a styled SVG data URL approach
 * @param options - Generation options with flowers array
 * @returns Data URL to the generated image
 * @throws Error if generation fails
 */
export async function generateBouquetImageFree(
  options: FreeGenerateImageOptions
): Promise<FreeGenerateImageResponse> {
  if (!options.flowers || options.flowers.length === 0) {
    throw new Error("At least one flower is required for image generation");
  }

  try {
    // Generate minimal SVG with styled placeholder
    const svg = `<svg width="520" height="650" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#f7f1ec"/><stop offset="100%" style="stop-color:#faf8f5"/></linearGradient></defs><rect width="520" height="650" fill="url(#bg)"/><ellipse cx="260" cy="580" rx="140" ry="70" fill="rgba(200,150,100,0.1)"/><path d="M 200 350 Q 180 380 190 450 L 330 450 Q 340 380 320 350 Z" fill="#e8dcc8" stroke="#d4c4b0" stroke-width="2"/>${generateFlowerElements(options.flowers)}<path d="M 180 350 Q 170 380 175 420" stroke="#4caf50" stroke-width="2" fill="none" opacity="0.7"/><path d="M 340 350 Q 350 380 345 420" stroke="#66bb6a" stroke-width="2" fill="none" opacity="0.7"/><text x="260" y="550" font-family="serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#8b6f47">Flower’s Boutique</text><text x="260" y="600" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#999">AI preview</text></svg>`;

    // Convert SVG to base64 data URL
    const base64Svg = Buffer.from(svg).toString("base64");
    const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

    console.log("[Bouquet] Generated SVG data URL successfully");
    return {
      imageUrl: dataUrl,
    };
  } catch (error: any) {
    console.error("Bouquet image generation error:", error);
    throw new Error(
      `Failed to generate bouquet preview: ${error.message || "Unknown error"}`
    );
  }
}

/**
 * Generate SVG flower elements based on selected flowers
 */
function generateFlowerElements(
  flowers: Array<{ nameKa: string; nameEn: string; quantity: number }>
): string {
  const colors = ["#e74c3c", "#e91e63", "#f44336", "#ec407a", "#d32f2f", "#fff9c4"];
  let elements = "";
  let flowerIndex = 0;
  flowers.forEach((flower) => {
    for (let q = 0; q < Math.min(flower.quantity, 3); q++) {
      const angle = (flowerIndex / Math.max(flowers.length, 3)) * Math.PI * 2;
      const radius = 60 + (q * 15);
      const x = 260 + Math.cos(angle) * radius;
      const y = 300 + Math.sin(angle) * radius;
      const color = colors[flowerIndex % colors.length];
      elements += `<circle cx="${x}" cy="${y}" r="${20 + q * 2}" fill="${color}" opacity="${0.9 - q * 0.1}"/>`;
      flowerIndex++;
    }
  });
  return elements;
}
