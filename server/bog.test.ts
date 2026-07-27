import { describe, it, expect, beforeAll } from 'vitest';
import { isBOGConfigured, createBOGOrder } from './_core/bog';

describe('BOG Payment Integration', () => {
  beforeAll(() => {
    // Verify all required env vars are set
    expect(process.env.BOG_CLIENT_ID).toBeDefined();
    expect(process.env.BOG_CLIENT_SECRET).toBeDefined();
    expect(process.env.BOG_MERCHANT_ID).toBeDefined();
    expect(process.env.BOG_TERMINAL_ID).toBeDefined();
    expect(process.env.BOG_ENV).toBe('sandbox');
  });

  it('should have BOG configured', () => {
    expect(isBOGConfigured()).toBe(true);
  });

  it('should create a BOG payment order', async () => {
    const result = await createBOGOrder({
      orderId: `test-order-${Date.now()}`,
      amount: 10000, // 100 GEL in tetri
      currency: 'GEL',
      description: 'Test Order - Flower’s Boutique',
      customerEmail: 'test@flowers-boutique.example',
      customerPhone: '[Phone placeholder]',
      customerName: 'Test Customer',
      basketItems: [
        {
          name: 'Test Bouquet',
          quantity: 1,
          unitPrice: 10000,
          totalPrice: 10000,
        },
      ],
    });

    console.log('BOG Order Creation Result:', result);

    // Check if order was created successfully
    if (result.success) {
      expect(result.redirectUrl).toBeDefined();
      expect(result.redirectUrl).toContain('bog.ge');
      console.log('✅ BOG Order Created Successfully');
      console.log('Redirect URL:', result.redirectUrl);
    } else {
      // If it fails, log the error for debugging
      console.error('❌ BOG Order Creation Failed:', result.error);
      throw new Error(`BOG order creation failed: ${result.error}`);
    }
  });
});
