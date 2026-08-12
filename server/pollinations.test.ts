import { describe, it, expect } from "vitest";

describe("Pollinations API Key Validation", () => {
  const integrationIt = process.env.POLLINATIONS_API_KEY ? it : it.skip;

  integrationIt(
    "validates the configured Pollinations connection",
    async () => {
    const apiKey = process.env.POLLINATIONS_API_KEY;

    // Test API connectivity with a simple request
    const prompt = "test";
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=768&height=960&nologo=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log(`[Pollinations Test] Response status: ${response.status}`);
    console.log(`[Pollinations Test] Content-Type: ${response.headers.get("content-type")}`);

    // Should not be 412 (suspended) or 401 (unauthorized)
    expect(response.status).not.toBe(412);
    expect(response.status).not.toBe(401);

    // Should be 200 (success) or 200-299 range
    expect(response.ok || response.status < 400).toBe(true);

    console.log(`[Pollinations Test] API key is valid and account is active ✅`);
    },
    { timeout: 15000 }
  );
});
