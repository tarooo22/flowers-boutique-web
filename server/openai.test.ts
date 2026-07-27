import { describe, it, expect } from 'vitest';
import { ENV } from './_core/env';

describe('OpenAI Configuration', () => {
  it('should have OPENAI_API_KEY configured', () => {
    expect(ENV.openaiApiKey).toBeTruthy();
    expect(ENV.openaiApiKey).toMatch(/^sk-/);
  });

  it('should be able to call OpenAI API with the key', async () => {
    if (!ENV.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Test the API key by making a simple API call
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${ENV.openaiApiKey}`,
      },
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = (await response.json()) as { data?: Array<{ id: string }> };
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should have access to gpt-image-1-mini model', async () => {
    if (!ENV.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${ENV.openaiApiKey}`,
      },
    });

    const data = (await response.json()) as { data?: Array<{ id: string }> };
    const hasGPTImage = data.data?.some((model) => model.id === 'gpt-image-1-mini');

    expect(hasGPTImage).toBe(true);
  });
});
