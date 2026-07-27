import { describe, it, expect } from 'vitest';
import { isBOGCallbackVerificationAvailable } from './server/_core/bog';

describe('BOG Public Key Configuration', () => {
  it('should have BOG_PUBLIC_KEY configured', () => {
    const isAvailable = isBOGCallbackVerificationAvailable();
    expect(isAvailable).toBe(true);
    console.log('✅ BOG_PUBLIC_KEY is properly configured');
  });

  it('should have BOG_PUBLIC_KEY value set to 10008700', () => {
    const publicKey = process.env.BOG_PUBLIC_KEY;
    expect(publicKey).toBe('10008700');
    console.log(`✅ BOG_PUBLIC_KEY value verified: ${publicKey}`);
  });
});
