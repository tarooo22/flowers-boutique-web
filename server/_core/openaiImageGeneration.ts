import { storagePut } from '../storage';
import { ENV } from './env';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

interface GenerateImageOptions {
  prompt: string;
  flowers: Array<{ nameEn: string; nameKa: string; quantity: number; colorEn?: string; colorKa?: string }>;
}

interface GeneratedImage {
  url: string;
  filename: string;
}

/**
 * Generate a bouquet image using OpenAI GPT Image models
 * Saves the image to S3 storage and returns the public URL
 */
export async function generateBouquetImage(options: GenerateImageOptions): Promise<GeneratedImage | null> {
  const { prompt } = options;

  // Step 1: Check OPENAI_API_KEY
  console.log('[OpenAI] Step 1: OPENAI_API_KEY exists:', !!ENV.openaiApiKey);
  if (!ENV.openaiApiKey) {
    console.error('[OpenAI] OPENAI_API_KEY is not configured');
    return null;
  }

  try {
    console.log('[OpenAI] Step 2: Starting image generation request with prompt:', prompt.substring(0, 100) + '...');

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: ENV.openaiApiKey,
    });

    // Call OpenAI Image API with gpt-image-1-mini
    console.log('[OpenAI] Calling OpenAI Images API with model: gpt-image-1-mini');
    
    const result = await openai.images.generate({
      model: 'gpt-image-1-mini',
      prompt: prompt,
      size: '1024x1536',
      quality: 'medium',
      response_format: 'b64_json',
      n: 1,
    });

    console.log('[OpenAI] Step 3: OpenAI response received successfully');

    // Step 4: Check if b64_json exists
    console.log('[OpenAI] Step 4: result.data[0].b64_json exists:', !!result.data?.[0]?.b64_json);

    if (!result.data?.[0]?.b64_json) {
      console.error('[OpenAI] No b64_json in response:', JSON.stringify(result));
      return null;
    }

    const base64Data = result.data[0].b64_json;
    console.log('[OpenAI] Base64 data length:', base64Data.length);

    // Decode base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    console.log('[OpenAI] Buffer size:', buffer.length, 'bytes');

    // Step 5: Save to S3 storage
    const filename = `bouquet-${Date.now()}.png`;
    console.log('[OpenAI] Step 5: Saving image to S3 with filename:', filename);

    const { url } = await storagePut(`generated-bouquets/${filename}`, buffer, 'image/png');

    console.log('[OpenAI] Image saved to S3');
    console.log('[OpenAI] Step 6: Public URL returned:', url);

    console.log('[OpenAI] Step 7: Returning to frontend:', { url, filename });

    return {
      url: url,
      filename: filename,
    };
  } catch (error) {
    console.error('[OpenAI] Error during image generation:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) {
      console.error('[OpenAI] Stack:', error.stack);
    }
    return null;
  }
}
