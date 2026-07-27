/**
 * Meta Conversions API Helper
 * 
 * Sends server-side conversion events to Meta's Conversions API
 * Supports event deduplication using event_id
 * Hashes user data according to Meta's requirements
 */

import crypto from 'crypto';
import { ENV } from './env';

const API_VERSION = 'v20.0';

function getConversionsApiUrl(): string {
  if (!ENV.metaPixelId) {
    throw new Error('META_PIXEL_ID not configured');
  }
  return `https://graph.facebook.com/${API_VERSION}/${ENV.metaPixelId}/events`;
}

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  ipAddress?: string;
  userAgent?: string;
  externalId?: string;
  fbp?: string;
  fbc?: string;
}

interface ConversionEvent {
  eventName: string;
  eventId: string;
  eventTime: number;
  userData: UserData;
  customData?: Record<string, any>;
  testEventCode?: string;
  eventSourceUrl?: string;
}

/**
 * Hash a value using SHA256
 */
function hashValue(value: string): string {
  if (!value) return '';
  return crypto
    .createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex');
}

/**
 * Hash user data according to Meta's requirements
 */
export function hashUserData(userData: UserData): Record<string, string> {
  const hashed: Record<string, string> = {};

  if (userData.email) {
    hashed.em = hashValue(userData.email);
  }

  if (userData.phone) {
    // Remove all non-numeric characters
    const cleanPhone = userData.phone.replace(/\D/g, '');
    hashed.ph = hashValue(cleanPhone);
  }

  if (userData.firstName) {
    hashed.fn = hashValue(userData.firstName);
  }

  if (userData.lastName) {
    hashed.ln = hashValue(userData.lastName);
  }

  // IP address and user agent are sent as-is (not hashed)
  if (userData.ipAddress) {
    hashed.client_ip_address = userData.ipAddress;
  }

  if (userData.userAgent) {
    hashed.client_user_agent = userData.userAgent;
  }

  // External ID (user ID) is sent as-is
  if (userData.externalId) {
    hashed.external_id = userData.externalId;
  }

  // FBP and FBC are sent as-is
  if (userData.fbp) {
    hashed.fbp = userData.fbp;
  }

  if (userData.fbc) {
    hashed.fbc = userData.fbc;
  }

  return hashed;
}

/**
 * Send a conversion event to Meta's Conversions API
 */
export async function sendConversionsAPIEvent(event: ConversionEvent): Promise<boolean> {
  // Check if CAPI is enabled
  if (!ENV.metaCapiEnabled) {
    console.log('[Meta Conversions API] CAPI disabled (META_CAPI_ENABLED=false)');
    return true; // Don't fail, just skip
  }

  const accessToken = ENV.metaCapiAccessToken;
  const testEventCode = event.testEventCode || ENV.metaTestEventCode;

  if (!accessToken) {
    console.warn('[Meta Conversions API] META_CAPI_ACCESS_TOKEN not configured');
    return false;
  }

  if (!ENV.metaPixelId) {
    console.warn('[Meta Conversions API] META_PIXEL_ID not configured');
    return false;
  }

  try {
    const hashedUserData = hashUserData(event.userData);

    const payload = {
      data: [
        {
          event_name: event.eventName,
          event_id: event.eventId,
          event_time: event.eventTime,
          action_source: 'website',
          user_data: hashedUserData,
          custom_data: event.customData || {},
          event_source_url: event.eventSourceUrl || '',
          ...(testEventCode && { test_event_code: testEventCode }),
        },
      ],
      access_token: accessToken,
    };

    const conversionsApiUrl = getConversionsApiUrl();
    const response = await fetch(conversionsApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Meta Conversions API] Error:', error);
      return false;
    }

    const result = await response.json();
    // Don't log sensitive data
    console.log('[Meta Conversions API] Event sent successfully:', {
      eventName: event.eventName,
      eventId: event.eventId,
    });

    return true;
  } catch (error) {
    console.error('[Meta Conversions API] Exception:', error);
    return false;
  }
}

/**
 * Generate a unique event ID for browser + server deduplication
 */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if IP is private/internal
 */
function isPrivateIP(ip: string): boolean {
  if (!ip) return true;
  const privatePatterns = [
    /^127\./, // 127.0.0.0/8
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^::1$/, // IPv6 loopback
    /^fc00:/i, // IPv6 unique local
    /^fe80:/i, // IPv6 link-local
  ];
  return privatePatterns.some(pattern => pattern.test(ip));
}

/**
 * Extract IP address from request with priority header order
 * Priority: cf-connecting-ip > true-client-ip > x-real-ip > x-forwarded-for > req.ip
 */
export function getClientIP(req: any): string {
  // Priority 1: Cloudflare
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  if (cfConnectingIp && !isPrivateIP(cfConnectingIp)) {
    return cfConnectingIp.trim();
  }

  // Priority 2: Akamai / Cloudflare
  const trueClientIp = req.headers['true-client-ip'];
  if (trueClientIp && !isPrivateIP(trueClientIp)) {
    return trueClientIp.trim();
  }

  // Priority 3: Nginx
  const xRealIp = req.headers['x-real-ip'];
  if (xRealIp && !isPrivateIP(xRealIp)) {
    return xRealIp.trim();
  }

  // Priority 4: Standard proxy header (take first public IP)
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map((ip: string) => ip.trim());
    for (const ip of ips) {
      if (ip && !isPrivateIP(ip)) {
        return ip;
      }
    }
    // If all are private, return the first one
    if (ips[0]) {
      return ips[0];
    }
  }

  // Priority 5: Direct socket connection
  const socketIp = req.socket?.remoteAddress || req.connection?.remoteAddress || '';
  if (socketIp) {
    return socketIp;
  }

  return '';
}

/**
 * Get user agent from request
 */
export function getUserAgent(req: any): string {
  return req.headers['user-agent'] || '';
}

/**
 * Extract FBP cookie from request headers
 */
export function getFBPCookie(req: any): string {
  const cookies = req.headers.cookie || '';
  const fbpMatch = cookies.match(/_fbp=([^;]+)/);
  return fbpMatch ? fbpMatch[1] : '';
}

/**
 * Extract FBC cookie from request headers
 */
export function getFBCCookie(req: any): string {
  const cookies = req.headers.cookie || '';
  const fbcMatch = cookies.match(/_fbc=([^;]+)/);
  return fbcMatch ? fbcMatch[1] : '';
}

/**
 * Generate FBC value from fbclid when _fbc cookie is missing
 * Format: fb.1.{timestamp}.{fbclid}
 */
export function generateFBCFromFbclid(fbclid: string): string {
  if (!fbclid) return '';
  const timestamp = Date.now();
  return `fb.1.${timestamp}.${fbclid}`;
}

/**
 * Extract fbclid from URL query parameters
 */
export function getFbclidFromUrl(url: string): string {
  try {
    const urlObj = new URL(url, 'https://example.com');
    return urlObj.searchParams.get('fbclid') || '';
  } catch {
    return '';
  }
}

/**
 * Generate stable anonymous external_id from session/cart identifier
 * Uses SHA-256 hash of a stable identifier
 */
export function generateStableExternalId(identifier: string): string {
  if (!identifier) return '';
  return crypto
    .createHash('sha256')
    .update(identifier)
    .digest('hex');
}

/**
 * Extract or generate stable session identifier from cookies
 * Looks for: flowers-boutique_session_id, cart_id, or generates from user agent + IP
 */
export function getStableSessionId(req: any): string {
  const cookies = req.headers.cookie || '';
  
  // Try to find existing session ID
  const sessionMatch = cookies.match(/flowers-boutique_session_id=([^;]+)/);
  if (sessionMatch) {
    return sessionMatch[1];
  }
  
  const cartMatch = cookies.match(/cart_id=([^;]+)/);
  if (cartMatch) {
    return cartMatch[1];
  }
  
  // Generate stable ID from user agent + IP (consistent across requests from same user)
  const userAgent = getUserAgent(req);
  const clientIp = getClientIP(req);
  const stableInput = `${userAgent}:${clientIp}`;
  
  return crypto
    .createHash('sha256')
    .update(stableInput)
    .digest('hex');
}
