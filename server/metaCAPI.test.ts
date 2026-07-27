import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getClientIP,
  getFBPCookie,
  getFBCCookie,
  generateFBCFromFbclid,
  getFbclidFromUrl,
  getStableSessionId,
  generateStableExternalId,
  hashUserData,
} from './_core/metaConversionsAPI';

describe('Meta CAPI Enhancements', () => {
  describe('getClientIP', () => {
    it('should extract IP from cf-connecting-ip header (priority 1)', () => {
      const req = {
        headers: {
          'cf-connecting-ip': '203.0.113.42',
          'x-forwarded-for': '198.51.100.10',
        },
        socket: { remoteAddress: '192.0.2.1' },
      };
      expect(getClientIP(req)).toBe('203.0.113.42');
    });

    it('should extract IP from true-client-ip header (priority 2)', () => {
      const req = {
        headers: {
          'true-client-ip': '203.0.113.42',
          'x-forwarded-for': '198.51.100.10',
        },
        socket: { remoteAddress: '192.0.2.1' },
      };
      expect(getClientIP(req)).toBe('203.0.113.42');
    });

    it('should extract IP from x-real-ip header (priority 3)', () => {
      const req = {
        headers: {
          'x-real-ip': '203.0.113.42',
          'x-forwarded-for': '198.51.100.10',
        },
        socket: { remoteAddress: '192.0.2.1' },
      };
      expect(getClientIP(req)).toBe('203.0.113.42');
    });

    it('should extract first public IP from x-forwarded-for (priority 4)', () => {
      const req = {
        headers: {
          'x-forwarded-for': '203.0.113.42, 198.51.100.10, 192.0.2.1',
        },
        socket: { remoteAddress: '10.0.0.1' },
      };
      expect(getClientIP(req)).toBe('203.0.113.42');
    });

    it('should skip private IPs in x-forwarded-for and use first public IP', () => {
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.1, 203.0.113.42, 10.0.0.1',
        },
        socket: { remoteAddress: '127.0.0.1' },
      };
      expect(getClientIP(req)).toBe('203.0.113.42');
    });

    it('should return first IP from x-forwarded-for if all are private', () => {
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
        },
        socket: { remoteAddress: '127.0.0.1' },
      };
      expect(getClientIP(req)).toBe('192.168.1.1');
    });

    it('should fall back to socket remoteAddress (priority 5)', () => {
      const req = {
        headers: {},
        socket: { remoteAddress: '203.0.113.42' },
      };
      expect(getClientIP(req)).toBe('203.0.113.42');
    });

    it('should return empty string if no IP found', () => {
      const req = {
        headers: {},
        socket: {},
      };
      expect(getClientIP(req)).toBe('');
    });

    it('should skip localhost and private IPs', () => {
      const req = {
        headers: {
          'cf-connecting-ip': '127.0.0.1',
        },
        socket: { remoteAddress: '203.0.113.42' },
      };
      expect(getClientIP(req)).toBe('203.0.113.42');
    });
  });

  describe('FBP/FBC Cookie Extraction', () => {
    it('should extract FBP cookie', () => {
      const req = {
        headers: {
          cookie: '_fbp=fb.1.1234567890.1234567890; other=value',
        },
      };
      expect(getFBPCookie(req)).toBe('fb.1.1234567890.1234567890');
    });

    it('should extract FBC cookie', () => {
      const req = {
        headers: {
          cookie: '_fbc=fb.1.1234567890.IwAR0123456789; other=value',
        },
      };
      expect(getFBCCookie(req)).toBe('fb.1.1234567890.IwAR0123456789');
    });

    it('should return empty string if FBP cookie not found', () => {
      const req = {
        headers: {
          cookie: 'other=value',
        },
      };
      expect(getFBPCookie(req)).toBe('');
    });

    it('should return empty string if FBC cookie not found', () => {
      const req = {
        headers: {
          cookie: 'other=value',
        },
      };
      expect(getFBCCookie(req)).toBe('');
    });

    it('should handle missing cookie header', () => {
      const req = {
        headers: {},
      };
      expect(getFBPCookie(req)).toBe('');
      expect(getFBCCookie(req)).toBe('');
    });
  });

  describe('FBC Generation from fbclid', () => {
    it('should generate FBC in correct format from fbclid', () => {
      const fbclid = 'IwAR0123456789';
      const fbc = generateFBCFromFbclid(fbclid);
      expect(fbc).toMatch(/^fb\.1\.\d+\.IwAR0123456789$/);
    });

    it('should return empty string if fbclid is empty', () => {
      expect(generateFBCFromFbclid('')).toBe('');
    });

    it('should extract fbclid from URL', () => {
      const url = 'https://example.com/product?fbclid=IwAR0123456789&other=param';
      expect(getFbclidFromUrl(url)).toBe('IwAR0123456789');
    });

    it('should return empty string if fbclid not in URL', () => {
      const url = 'https://example.com/product?other=param';
      expect(getFbclidFromUrl(url)).toBe('');
    });

    it('should handle invalid URLs gracefully', () => {
      expect(getFbclidFromUrl('not-a-url')).toBe('');
    });
  });

  describe('Stable Session ID Generation', () => {
    it('should extract existing flowers-boutique_session_id cookie', () => {
      const req = {
        headers: {
          cookie: 'flowers-boutique_session_id=abc123; other=value',
          'user-agent': 'Mozilla/5.0',
        },
        socket: { remoteAddress: '203.0.113.42' },
      };
      const sessionId = getStableSessionId(req);
      expect(sessionId).toBe('abc123');
    });

    it('should fall back to cart_id cookie if no session_id', () => {
      const req = {
        headers: {
          cookie: 'cart_id=xyz789; other=value',
          'user-agent': 'Mozilla/5.0',
        },
        socket: { remoteAddress: '203.0.113.42' },
      };
      const sessionId = getStableSessionId(req);
      expect(sessionId).toBe('xyz789');
    });

    it('should generate stable ID from user agent + IP if no cookies', () => {
      const req = {
        headers: {
          cookie: 'other=value',
          'user-agent': 'Mozilla/5.0',
        },
        socket: { remoteAddress: '203.0.113.42' },
      };
      const sessionId1 = getStableSessionId(req);
      const sessionId2 = getStableSessionId(req);
      
      // Same request should generate same ID
      expect(sessionId1).toBe(sessionId2);
      expect(sessionId1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex
    });

    it('should generate different ID for different IPs', () => {
      const req1 = {
        headers: {
          cookie: '',
          'user-agent': 'Mozilla/5.0',
        },
        socket: { remoteAddress: '203.0.113.42' },
      };
      
      const req2 = {
        headers: {
          cookie: '',
          'user-agent': 'Mozilla/5.0',
        },
        socket: { remoteAddress: '203.0.113.43' },
      };
      
      const sessionId1 = getStableSessionId(req1);
      const sessionId2 = getStableSessionId(req2);
      
      expect(sessionId1).not.toBe(sessionId2);
    });
  });

  describe('External ID Generation', () => {
    it('should generate SHA-256 hash of identifier', () => {
      const identifier = 'test-session-id';
      const externalId = generateStableExternalId(identifier);
      
      expect(externalId).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex
      // Same input should generate same output
      expect(generateStableExternalId(identifier)).toBe(externalId);
    });

    it('should return empty string for empty identifier', () => {
      expect(generateStableExternalId('')).toBe('');
    });

    it('should generate different hash for different identifiers', () => {
      const hash1 = generateStableExternalId('id1');
      const hash2 = generateStableExternalId('id2');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('User Data Hashing', () => {
    it('should hash email correctly', () => {
      const userData = { email: 'test@example.com' };
      const hashed = hashUserData(userData);
      
      expect(hashed.em).toBeDefined();
      expect(hashed.em).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex
      // Email should be lowercased before hashing
      expect(hashed.em).toBe(hashUserData({ email: 'TEST@EXAMPLE.COM' }).em);
    });

    it('should hash phone number correctly (digits only)', () => {
      const userData = { phone: '+995 598 59-8658' };
      const hashed = hashUserData(userData);
      
      expect(hashed.ph).toBeDefined();
      expect(hashed.ph).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should hash first and last name', () => {
      const userData = { firstName: 'John', lastName: 'Doe' };
      const hashed = hashUserData(userData);
      
      expect(hashed.fn).toBeDefined();
      expect(hashed.ln).toBeDefined();
      expect(hashed.fn).toMatch(/^[a-f0-9]{64}$/);
      expect(hashed.ln).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should not hash IP address and user agent', () => {
      const userData = {
        ipAddress: '203.0.113.42',
        userAgent: 'Mozilla/5.0',
      };
      const hashed = hashUserData(userData);
      
      expect(hashed.client_ip_address).toBe('203.0.113.42');
      expect(hashed.client_user_agent).toBe('Mozilla/5.0');
    });

    it('should not hash FBP and FBC', () => {
      const userData = {
        fbp: 'fb.1.1234567890.1234567890',
        fbc: 'fb.1.1234567890.IwAR0123456789',
      };
      const hashed = hashUserData(userData);
      
      expect(hashed.fbp).toBe('fb.1.1234567890.1234567890');
      expect(hashed.fbc).toBe('fb.1.1234567890.IwAR0123456789');
    });

    it('should not hash external_id', () => {
      const externalId = 'abc123def456';
      const userData = { externalId };
      const hashed = hashUserData(userData);
      
      expect(hashed.external_id).toBe(externalId);
    });

    it('should omit empty fields', () => {
      const userData = {
        email: '',
        phone: '',
        firstName: 'John',
      };
      const hashed = hashUserData(userData);
      
      expect(hashed.em).toBeUndefined();
      expect(hashed.ph).toBeUndefined();
      expect(hashed.fn).toBeDefined();
    });
  });

  describe('Complete CAPI Payload Scenario', () => {
    it('should build complete user_data for CAPI event', () => {
      const req = {
        headers: {
          'cf-connecting-ip': '203.0.113.42',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          cookie: '_fbp=fb.1.1234567890.1234567890; flowers-boutique_session_id=session123',
          referer: 'https://flowers-boutique.example/product/123?fbclid=IwAR0123456789',
        },
        socket: { remoteAddress: '192.0.2.1' },
      };

      const clientIP = getClientIP(req);
      const userAgent = req.headers['user-agent'];
      const fbp = getFBPCookie(req);
      const fbc = getFBCCookie(req);
      const sessionId = getStableSessionId(req);
      const externalId = generateStableExternalId(sessionId);

      expect(clientIP).toBe('203.0.113.42');
      expect(userAgent).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
      expect(fbp).toBe('fb.1.1234567890.1234567890');
      expect(fbc).toBe('');
      expect(sessionId).toBe('session123');
      expect(externalId).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});
