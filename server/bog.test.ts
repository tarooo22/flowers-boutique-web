import { describe, it, expect, beforeAll } from 'vitest';
import { isBOGConfigured, createBOGOrder } from './_core/bog';

describe('BOG Payment Integration', () => {
  const sandboxIt = process.env.RUN_BOG_SANDBOX_TESTS === 'true' && isBOGConfigured() && process.env.BOG_ENV === 'sandbox'
    ? it
    : it.skip;

  it('reports BOG configuration state without exposing credentials', () => {
    expect(typeof isBOGConfigured()).toBe('boolean');
  });

  sandboxIt('creates a BOG payment order in explicitly enabled sandbox validation', async () => {
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
      // The public failure contract intentionally exposes only a safe code/message pair.
      console.error('BOG sandbox order creation failed:', {
        errorCode: result.errorCode,
        userMessage: result.userMessage,
      });
      throw new Error(`BOG sandbox order creation failed: ${result.errorCode ?? 'unknown'}`);
    }
  });
});
