import { describe, it, expect } from 'vitest';
import { isBOGCallbackVerificationAvailable } from './_core/bog';

describe('BOG Public Key Configuration', () => {
  it('reports callback-verification availability without exposing configuration', () => {
    expect(typeof isBOGCallbackVerificationAvailable()).toBe('boolean');
  });
});
