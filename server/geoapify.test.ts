import { describe, it, expect } from "vitest";

describe("Geoapify API Key Validation", () => {
  const integrationIt = process.env.VITE_GEOAPIFY_API_KEY ? it : it.skip;

  integrationIt("validates the configured key with a reverse-geocoding request", async () => {
    const apiKey = process.env.VITE_GEOAPIFY_API_KEY;

    // Test with a simple reverse geocoding request (Tbilisi coordinates)
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=41.7151&lon=44.7671&apiKey=${apiKey}`
    );

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data).toHaveProperty("features");
    expect(Array.isArray(data.features)).toBe(true);
    expect(data.features.length).toBeGreaterThan(0);
  });

  integrationIt("validates the configured key with an autocomplete request", async () => {
    const apiKey = process.env.VITE_GEOAPIFY_API_KEY;

    // Test autocomplete with Tbilisi
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=Tbilisi&apiKey=${apiKey}`
    );

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data).toHaveProperty("features");
    expect(Array.isArray(data.features)).toBe(true);
  });
});
