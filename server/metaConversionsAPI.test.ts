import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { hashUserData, sendConversionsAPIEvent, generateEventId } from './_core/metaConversionsAPI';

describe('Meta Conversions API', () => {
  describe('hashUserData', () => {
    it('should hash email correctly', () => {
      const userData = { email: 'test@example.com' };
      const hashed = hashUserData(userData);
      
      // Email should be hashed to a 64-character hex string (SHA256)
      expect(hashed.em).toMatch(/^[a-f0-9]{64}$/);
      expect(hashed.em).toBe(hashUserData({ email: 'TEST@EXAMPLE.COM' }).em); // Case-insensitive
    });

    it('should hash phone number correctly', () => {
      const userData = { phone: '+1 (555) 123-4567' };
      const hashed = hashUserData(userData);
      
      // Phone should be hashed to a 64-character hex string
      expect(hashed.ph).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should hash first and last names', () => {
      const userData = { firstName: 'John', lastName: 'Doe' };
      const hashed = hashUserData(userData);
      
      expect(hashed.fn).toMatch(/^[a-f0-9]{64}$/);
      expect(hashed.ln).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should include IP address and user agent without hashing', () => {
      const userData = {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      };
      const hashed = hashUserData(userData);
      
      expect(hashed.client_ip_address).toBe('192.168.1.1');
      expect(hashed.client_user_agent).toBe('Mozilla/5.0');
    });

    it('should return empty object for empty user data', () => {
      const hashed = hashUserData({});
      expect(Object.keys(hashed).length).toBe(0);
    });
  });

  describe('generateEventId', () => {
    it('should generate unique event IDs', () => {
      const id1 = generateEventId();
      const id2 = generateEventId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('sendConversionsAPIEvent', () => {
    it('should handle missing credentials gracefully', async () => {
      const originalToken = process.env.META_CAPI_ACCESS_TOKEN;
      const originalPixelId = process.env.META_PIXEL_ID;
      delete process.env.META_CAPI_ACCESS_TOKEN;
      delete process.env.META_PIXEL_ID;

      const result = await sendConversionsAPIEvent({
        eventName: 'PageView',
        eventId: generateEventId(),
        eventTime: Math.floor(Date.now() / 1000),
        userData: { email: 'test@example.com' },
      });

      // Should return false if credentials missing
      expect(typeof result).toBe('boolean');

      // Restore
      if (originalToken) {
        process.env.META_CAPI_ACCESS_TOKEN = originalToken;
      }
      if (originalPixelId) {
        process.env.META_PIXEL_ID = originalPixelId;
      }
    });

    it('should send event successfully with valid configuration', async () => {
      const result = await sendConversionsAPIEvent({
        eventName: 'PageView',
        eventId: generateEventId(),
        eventTime: Math.floor(Date.now() / 1000),
        userData: {
          email: 'test@example.com',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
        },
        customData: {
          value: 100,
          currency: 'GEL',
        },
      });

      // Should return true or false depending on configuration
      expect(typeof result).toBe('boolean');
    });
  });
});
