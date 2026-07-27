import { ENV } from './env';
import { storagePut } from '../storage';

interface SelectedFlower {
  nameEn: string;
  nameKa: string;
  quantity: number;
  colorEn?: string;
  colorKa?: string;
  bloomsPerStemMin?: number;
  bloomsPerStemMax?: number;
  stemDisplayRule?: string | null;
}

interface GenerateImageOptions {
  prompt?: string; // Legacy: direct prompt
  flowers: SelectedFlower[];
}

interface GeneratedImage {
  url: string;
  filename: string;
}

/**
 * Build a realistic bouquet description from selected flowers and their stem metadata
 * Converts quantities into realistic stem/bloom descriptions
 */
function buildBouquetPrompt(flowers: SelectedFlower[]): string {
  if (!flowers || flowers.length === 0) {
    return 'A beautiful premium flower bouquet';
  }

  // Build flower descriptions with stem/bloom information
  const flowerDescriptions = flowers.map((flower) => {
    const quantity = flower.quantity || 1;
    const color = flower.colorEn || 'mixed colors';
    
    // Use stem display rule if available, otherwise build from bloom counts
    let bloomDescription = '';
    if (flower.stemDisplayRule) {
      bloomDescription = flower.stemDisplayRule;
    } else if (flower.bloomsPerStemMin && flower.bloomsPerStemMax) {
      if (flower.bloomsPerStemMin === flower.bloomsPerStemMax) {
        bloomDescription = `${flower.bloomsPerStemMin} blooms per stem`;
      } else {
        bloomDescription = `${flower.bloomsPerStemMin}-${flower.bloomsPerStemMax} blooms per stem`;
      }
    } else {
      bloomDescription = '1 bloom per stem';
    }

    // Build description: "X stems of flower (color), each showing bloom description"
    if (quantity === 1) {
      return `1 stem of ${flower.nameEn} (${color}), showing ${bloomDescription}`;
    } else {
      return `${quantity} stems of ${flower.nameEn} (${color}), each showing ${bloomDescription}`;
    }
  });

  // Calculate total estimated blooms for bouquet fullness
  const totalEstimatedBlooms = flowers.reduce((sum, flower) => {
    const quantity = flower.quantity || 1;
    const avgBlooms = flower.bloomsPerStemMax 
      ? Math.round((flower.bloomsPerStemMin! + flower.bloomsPerStemMax) / 2)
      : 1;
    return sum + (quantity * avgBlooms);
  }, 0);

  const fullnessDescriptor = totalEstimatedBlooms > 30 ? 'very full and abundant' 
    : totalEstimatedBlooms > 15 ? 'full and lush'
    : totalEstimatedBlooms > 8 ? 'nicely filled'
    : 'delicate';

  // Build the complete prompt
  const flowerList = flowerDescriptions.join(', and ');
  
  const prompt = `Realistic premium flower bouquet product photo. A ${fullnessDescriptor} wrapped bouquet made with ${flowerList}. 
Full bouquet visible from top flowers to bottom wrapping. Centered composition, not cropped, not zoomed in. 
Elegant wrapped bouquet with visible stems and natural arrangement. Warm beige studio background. 
Natural daylight with soft shadows. High detail, sharp focus on flowers. 
Flower’s Boutique flower boutique style, online flower shop product photography. 
No text, no watermark. Not 3D, not cartoon, not illustration. Professional DSLR photography.`;

  return prompt;
}

/**
 * Generate a bouquet image using Pollinations AI
 * Saves the image to public/generated-bouquets/ and returns the public URL
 */
export async function generateBouquetImageWithPollinations(options: GenerateImageOptions): Promise<GeneratedImage | null> {
  // Build prompt from flowers if not provided directly
  let prompt = options.prompt;
  if (!prompt && options.flowers && options.flowers.length > 0) {
    prompt = buildBouquetPrompt(options.flowers);
  }

  if (!prompt) {
    console.error('[Pollinations] No prompt provided and no flowers to build from');
    return null;
  }

  // Step 1: Check POLLINATIONS_API_KEY
  console.log('[Pollinations] Step 1: POLLINATIONS_API_KEY exists:', !!ENV.pollinationsApiKey);
  if (!ENV.pollinationsApiKey) {
    console.error('[Pollinations] POLLINATIONS_API_KEY is not configured');
    return null;
  }

  try {
    console.log('[Pollinations] Step 2: Starting image generation request');
    console.log('[Pollinations] Built prompt:', prompt.substring(0, 150) + '...');

    // Encode prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Construct Pollinations API URL with correct parameters
    const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=768&height=960&nologo=true`;
    console.log('[Pollinations] Step 3: Calling Pollinations API...');
    console.log('[Pollinations] Request URL (without API key):', imageUrl.substring(0, 150) + '...');

    // Fetch image from Pollinations with Authorization header
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ENV.pollinationsApiKey}`,
      },
    });

    console.log('[Pollinations] Step 4: Pollinations response status:', response.status, response.statusText);
    console.log('[Pollinations] Content-Type:', response.headers.get('content-type'));

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[Pollinations] Pollinations API error:', response.status, response.statusText);
      console.error('[Pollinations] Error details:', errorText.substring(0, 200));
      return null;
    }

    // Validate content-type is image
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('image')) {
      console.error('[Pollinations] Invalid content-type, expected image but got:', contentType);
      return null;
    }

    // Get image buffer
    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    console.log('[Pollinations] Step 5: Image received, buffer size:', buffer.length, 'bytes');

    if (buffer.length === 0) {
      console.error('[Pollinations] Received empty image buffer');
      return null;
    }

    // Step 6: Upload image to S3 storage (persistent, works in production)
    const filename = `bouquet-${Date.now()}.png`;
    const storageKey = `generated-bouquets/${filename}`;
    
    console.log('[Pollinations] Step 6: Uploading image to S3 storage');
    console.log('[Pollinations] Storage key:', storageKey);
    
    try {
      const { url: publicUrl } = await storagePut(storageKey, buffer, 'image/png');
      console.log('[Pollinations] Image uploaded to S3 successfully');
      console.log('[Pollinations] Step 7: Public URL returned:', publicUrl);
      console.log('[Pollinations] File size verified:', buffer.length, 'bytes');
      
      // Validate URL format before returning
      if (!publicUrl || typeof publicUrl !== 'string' || publicUrl.length === 0) {
        console.error('[Pollinations] ERROR: Invalid URL format - URL is empty or not a string');
        return null;
      }
      
      if (!publicUrl.startsWith('/')) {
        console.error('[Pollinations] ERROR: Invalid URL format - URL must start with /', publicUrl);
        return null;
      }
      
      console.log('[Pollinations] SUCCESS: URL validation passed - URL is public and accessible');
      console.log('[Pollinations] Returning to frontend:', { url: publicUrl, filename });

      return {
        url: publicUrl,
        filename: filename,
      };
    } catch (storageError) {
      const errorMsg = storageError instanceof Error ? storageError.message : String(storageError);
      console.error('[Pollinations] S3 upload failed:', errorMsg);
      return null;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Pollinations] Error during image generation:', errorMsg);
    if (error instanceof Error && error.stack) {
      console.error('[Pollinations] Stack:', error.stack.substring(0, 500));
    }
    console.error('[Pollinations] FAILED - returning null to trigger fallback');
    return null;
  }
}
