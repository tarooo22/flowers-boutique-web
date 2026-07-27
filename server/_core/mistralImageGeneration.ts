/**
 * Mistral AI Image Generation Integration
 * Uses Mistral Agents API with image_generation tool for generating bouquet preview images
 * Based on official Mistral documentation: https://docs.mistral.ai/capabilities/image_generation/
 *
 * Flow:
 * 1. Create/reuse image generation agent with image_generation tool
 * 2. Start conversation with bouquet prompt
 * 3. Extract file_id from tool_file chunk in response
 * 4. Download PNG file using client.files.download()
 * 5. Save to public/generated-bouquets/ folder
 * 6. Return public URL to frontend
 * 7. Fallback to preview library only if Mistral fails
 */

import { Mistral } from '@mistralai/mistralai';
import { ENV } from './env';
import fs from 'fs';
import path from 'path';

interface BouquetPromptInput {
  flowers: Array<{
    nameEn: string;
    nameKa: string;
    quantity: number;
    colorNameEn?: string;
    colorNameKa?: string;
  }>;
}

interface GenerationResult {
  imageUrl: string;
  provider: 'mistral' | 'fallback';
  promptUsed: string;
}

/**
 * Build a detailed prompt for bouquet image generation
 */
function buildBouquetPrompt(input: BouquetPromptInput): string {
  const flowerDescriptions = input.flowers
    .map((f) => {
      const color = f.colorNameEn ? ` ${f.colorNameEn.toLowerCase()}` : '';
      return `${f.quantity}${color} ${f.nameEn.toLowerCase()}${f.quantity > 1 ? 's' : ''}`;
    })
    .join(', ');

  return `Realistic premium flower bouquet product photo using ${flowerDescriptions}. Full bouquet visible from top flowers to bottom wrapping, centered composition, not cropped, not zoomed in, elegant wrapped bouquet, neutral warm beige background, natural daylight, soft shadows, Flower’s Boutique flower boutique style, online flower shop product photography, no text, no watermark, not 3D, not cartoon, not illustration.`;
}

// Cache for the image generation agent ID
let cachedAgentId: string | null = null;

/**
 * Get or create the image generation agent
 */
async function getImageGenerationAgent(client: Mistral): Promise<string> {
  if (cachedAgentId) {
    console.log('[Mistral] Using cached agent ID:', cachedAgentId);
    return cachedAgentId;
  }

  console.log('[Mistral] Creating image generation agent...');

  const agent = await client.beta.agents.create({
    model: 'mistral-medium-latest',
    name: 'Flower’s Boutique Bouquet Image Generator',
    description: 'Agent used to generate realistic bouquet product photos.',
    instructions: 'Use the image generation tool to create realistic bouquet product photos based on the user prompt.',
    tools: [{ type: 'image_generation' }],
    completionArgs: {
      temperature: 0.3,
      topP: 0.95,
    },
  });

  cachedAgentId = agent.id;
  console.log('[Mistral] Agent created with ID:', cachedAgentId);
  return cachedAgentId;
}

/**
 * Ensure public/generated-bouquets directory exists
 */
function ensureOutputDirectory(): string {
  const outputDir = path.join(process.cwd(), 'public', 'generated-bouquets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('[Mistral] Created output directory:', outputDir);
  }
  return outputDir;
}

/**
 * Generate a bouquet image using Mistral AI Agents API with image_generation tool
 * Downloads the generated PNG and saves to public/generated-bouquets/
 * Falls back to preview library if Mistral fails
 */
export async function generateBouquetImageWithMistral(
  input: BouquetPromptInput
): Promise<GenerationResult | null> {
  const prompt = buildBouquetPrompt(input);
  console.log('[Mistral] Starting image generation with prompt:', prompt.substring(0, 100) + '...');

  // Check if Mistral API key is configured
  if (!ENV.mistralApiKey) {
    console.log('[Mistral] API key not configured, using fallback preview library');
    return null;
  }

  console.log('[Mistral] API key exists, proceeding with generation');

  try {
    // Initialize Mistral client
    const client = new Mistral({
      apiKey: ENV.mistralApiKey,
    });

    // Retry logic: attempt up to 2 times
    let lastError: any = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Mistral] Attempt ${attempt}/2: Starting image generation...`);

        // Get or create the image generation agent
        const agentId = await getImageGenerationAgent(client);
        console.log('[Mistral] Using agent ID:', agentId);

        // Start a conversation with the agent
        console.log('[Mistral] Starting conversation with agent...');
        const conversation = await Promise.race([
          client.beta.conversations.start({
            agentId: agentId,
            inputs: prompt,
          }),
          new Promise<any>((_, reject) =>
            setTimeout(() => reject(new Error('Mistral request timeout (30s)')), 30000)
          ),
        ]);

        console.log('[Mistral] Conversation completed');
        console.log('[Mistral] Response outputs count:', conversation.outputs?.length || 0);

        // Extract the file_id from the response
        let fileId: string | null = null;

        if (conversation.outputs && conversation.outputs.length > 0) {
          console.log('[Mistral] Response outputs:', JSON.stringify(conversation.outputs, null, 2));

          for (const output of conversation.outputs) {
            console.log('[Mistral] Output type:', output.type);

            if (output.type === 'message.output' && output.content) {
              console.log('[Mistral] Content chunks:', output.content.length);

              for (const chunk of output.content) {
                console.log('[Mistral] Chunk:', JSON.stringify(chunk));
                if (chunk.type === 'tool_file') {
                  fileId = (chunk as any).file_id || (chunk as any).fileId;
                  console.log('[Mistral] Found file_id:', fileId);
                  break;
                }
              }
              if (fileId) break;
            }
          }
        }

        if (!fileId) {
          console.warn('[Mistral] No file_id found in response');
          console.log('[Mistral] Full response:', JSON.stringify(conversation, null, 2));
          lastError = new Error('No file_id in response');
          continue;
        }

        // Download the image using the file_id
        console.log('[Mistral] Downloading image with file_id:', fileId);
        const fileStream = await Promise.race([
          client.files.download({ fileId: fileId }),
          new Promise<any>((_, reject) =>
            setTimeout(() => reject(new Error('File download timeout (30s)')), 30000)
          ),
        ]);

        // Convert stream to buffer
        const chunks: Uint8Array[] = [];
        for await (const chunk of fileStream) {
          chunks.push(chunk);
        }
        const imageBuffer = Buffer.concat(chunks.map((c) => Buffer.from(c)));
        console.log('[Mistral] Image downloaded, size:', imageBuffer.length, 'bytes');

        // Ensure output directory exists
        const outputDir = ensureOutputDirectory();

        // Save to public/generated-bouquets/ folder
        const filename = `bouquet-${Date.now()}.png`;
        const filePath = path.join(outputDir, filename);
        fs.writeFileSync(filePath, imageBuffer);
        console.log('[Mistral] Image saved to:', filePath);

        // Return public URL
        const publicUrl = `/generated-bouquets/${filename}`;
        console.log('[Mistral] Image successfully generated and saved:', publicUrl);

        return {
          imageUrl: publicUrl,
          provider: 'mistral',
          promptUsed: prompt,
        };
      } catch (error: any) {
        console.error(`[Mistral] Attempt ${attempt} failed:`, error.message);
        lastError = error;

        if (attempt < 2) {
          console.log('[Mistral] Retrying in 2 seconds...');
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    // If we get here, both attempts failed
    console.error('[Mistral] Image generation failed after 2 attempts:', lastError?.message);
    console.log('[Mistral] Falling back to preview library');
    return null;
  } catch (error: any) {
    console.error('[Mistral] Unexpected error:', error.message);
    console.log('[Mistral] Falling back to preview library');
    return null;
  }
}
