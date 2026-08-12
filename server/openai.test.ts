import { describe, it, expect } from 'vitest';
import { ENV } from './_core/env';

describe('OpenAI Configuration', () => {
  const integrationIt = process.env.RUN_EXTERNAL_INTEGRATION_TESTS === 'true' && ENV.openaiApiKey ? it : it.skip;

  it('reads the OpenAI configuration as an optional server-side secret', () => {
    expect(typeof ENV.openaiApiKey === 'string' || ENV.openaiApiKey === undefined).toBe(true);
  });

  integrationIt('calls the OpenAI API with the configured key', async () => {
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

  integrationIt('has access to the configured image model', async () => {
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
