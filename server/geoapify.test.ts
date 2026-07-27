import { describe, it, expect } from "vitest";

describe("Geoapify API Key Validation", () => {
  it("should validate Geoapify API key with a test request", async () => {
    const apiKey = process.env.VITE_GEOAPIFY_API_KEY;
    
    if (!apiKey) {
      throw new Error("VITE_GEOAPIFY_API_KEY is not set");
    }

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

  it("should validate Geoapify API key with autocomplete request", async () => {
    const apiKey = process.env.VITE_GEOAPIFY_API_KEY;
    
    if (!apiKey) {
      throw new Error("VITE_GEOAPIFY_API_KEY is not set");
    }

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
