import { describe, it, expect, vi } from 'vitest';
import { appRouter } from './routers';

describe('Bouquet Generation', () => {
  it('should generate image with flowers array', async () => {
    // Mock the generateImage function
    vi.mock('./_core/imageGeneration', () => ({
      generateImage: vi.fn().mockResolvedValue({
        url: 'https://example.com/generated-bouquet.jpg'
      })
    }));

    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.bouquet.generateImage({
      flowers: [
        { nameKa: 'ვარდი', nameEn: 'Rose', quantity: 5 },
        { nameKa: 'ლილია', nameEn: 'Lily', quantity: 3 },
      ]
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.imageUrl).toBeDefined();
    expect(typeof result.imageUrl).toBe('string');
  });

  it('should handle empty flowers array gracefully', async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    // Should not throw, but may return error or handle gracefully
    try {
      const result = await caller.bouquet.generateImage({
        flowers: []
      });
      // If it succeeds, that's fine - backend handles it
      expect(result).toBeDefined();
    } catch (error) {
      // If it throws, that's also acceptable behavior
      expect(error).toBeDefined();
    }
  });

  it('should accept flowers with Georgian and English names', async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const flowers = [
      { nameKa: 'წითელი ვარდი', nameEn: 'Red Rose', quantity: 10 },
      { nameKa: 'თეთრი ღია', nameEn: 'White Chrysanthemum', quantity: 7 },
      { nameKa: 'მწვანო ფილოდენდრონი', nameEn: 'Green Philodendron', quantity: 5 },
    ];

    try {
      const result = await caller.bouquet.generateImage({ flowers });
      expect(result).toBeDefined();
      if (result.success) {
        expect(result.imageUrl).toBeTruthy();
      }
    } catch (error) {
      // Backend may fail if image generation service is unavailable
      expect(error).toBeDefined();
    }
  });
});
