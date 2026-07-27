/**
 * Fallback Bouquet Preview Library
 * Pre-generated bouquet images with tags for matching user selections
 */

interface BouquetPreview {
  id: string;
  imageUrl: string;
  tags: string[];
  description: string;
}

/**
 * Fallback bouquet preview library
 * These are pre-generated bouquet images stored in S3
 * Tags help match user selections to the closest preview
 */
const BOUQUET_PREVIEWS: BouquetPreview[] = [
  {
    id: 'classic-red-roses',
    imageUrl: '/manus-storage/bouquet-classic-red-roses.jpg',
    tags: ['roses', 'red', 'classic', 'romantic', 'luxury'],
    description: 'Classic red roses bouquet',
  },
  {
    id: 'pink-tulips-minimal',
    imageUrl: '/manus-storage/bouquet-pink-tulips.jpg',
    tags: ['tulips', 'pink', 'minimal', 'pastel', 'bright'],
    description: 'Pink tulips minimal arrangement',
  },
  {
    id: 'white-lilies-luxury',
    imageUrl: '/manus-storage/bouquet-white-lilies.jpg',
    tags: ['lilies', 'white', 'luxury', 'classic', 'romantic'],
    description: 'White lilies luxury bouquet',
  },
  {
    id: 'yellow-sunflowers-bright',
    imageUrl: '/manus-storage/bouquet-yellow-sunflowers.jpg',
    tags: ['sunflowers', 'yellow', 'bright', 'minimal', 'pastel'],
    description: 'Bright yellow sunflowers',
  },
  {
    id: 'mixed-pastel-romantic',
    imageUrl: '/manus-storage/bouquet-mixed-pastel.jpg',
    tags: ['roses', 'tulips', 'pink', 'white', 'pastel', 'romantic'],
    description: 'Mixed pastel flowers romantic arrangement',
  },
  {
    id: 'luxury-mixed-premium',
    imageUrl: '/manus-storage/bouquet-luxury-mixed.jpg',
    tags: ['roses', 'lilies', 'luxury', 'classic', 'romantic'],
    description: 'Luxury mixed flowers premium bouquet',
  },
];

/**
 * Calculate tag matching score between user selection and preview
 */
function calculateTagMatchScore(userTags: string[], previewTags: string[]): number {
  if (userTags.length === 0) return 0;
  
  const matches = userTags.filter((tag) => previewTags.includes(tag)).length;
  return matches / userTags.length;
}

/**
 * Find the best matching bouquet preview based on user selections
 */
export function findBestBouquetPreview(
  flowers: Array<{
    nameEn: string;
    colorNameEn?: string;
  }>
): BouquetPreview | null {
  // Extract tags from selected flowers and colors
  const userTags: string[] = [];

  flowers.forEach((flower) => {
    const flowerName = flower.nameEn.toLowerCase();
    
    // Map flower names to tags
    if (flowerName.includes('rose')) userTags.push('roses');
    if (flowerName.includes('tulip')) userTags.push('tulips');
    if (flowerName.includes('lily')) userTags.push('lilies');
    if (flowerName.includes('sunflower')) userTags.push('sunflowers');
    
    // Map colors to tags
    if (flower.colorNameEn) {
      const color = flower.colorNameEn.toLowerCase();
      if (color.includes('red')) userTags.push('red');
      if (color.includes('pink')) userTags.push('pink');
      if (color.includes('white')) userTags.push('white');
      if (color.includes('yellow')) userTags.push('yellow');
    }
  });

  // Add style tags based on flower count and types
  if (flowers.length === 1) {
    userTags.push('minimal');
  } else if (flowers.length >= 3) {
    userTags.push('luxury');
  }

  if (flowers.some((f) => f.colorNameEn?.toLowerCase().includes('pink'))) {
    userTags.push('romantic');
  }

  // If no tags were extracted, return null (show "coming soon" message)
  if (userTags.length === 0) {
    return null;
  }

  // Find the best matching preview
  let bestMatch: BouquetPreview | null = null;
  let bestScore = 0;

  BOUQUET_PREVIEWS.forEach((preview) => {
    const score = calculateTagMatchScore(userTags, preview.tags);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = preview;
    }
  });

  // Return match only if score is reasonable (at least 30% match)
  return bestScore >= 0.3 ? bestMatch : null;
}

/**
 * Get a random bouquet preview (for fallback when no match found)
 */
export function getRandomBouquetPreview(): BouquetPreview {
  return BOUQUET_PREVIEWS[Math.floor(Math.random() * BOUQUET_PREVIEWS.length)];
}

/**
 * Check if a preview image URL is available
 * Returns true if the URL is accessible
 */
export async function isPreviewAvailable(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
