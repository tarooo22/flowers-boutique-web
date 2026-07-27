/**
 * Meta Attribution Capture Utility
 * 
 * Captures Meta attribution values (fbc, fbp) early on page load,
 * before React router changes the URL. Values are stored in sessionStorage
 * and reused throughout the user journey (catalog → product → cart → checkout).
 * 
 * Frontend captures and stores exact values.
 * Backend receives them as opaque strings and stores unchanged.
 * CAPI Purchase uses stored values without regeneration.
 */

const STORAGE_KEY_FBC = 'meta_fbc';
const STORAGE_KEY_FBP = 'meta_fbp';
const STORAGE_KEY_FBCLID = 'meta_fbclid';

/**
 * Extract fbclid from current URL query parameters
 * Reads only once on landing, before SPA navigation changes the URL
 */
function extractFbclidFromUrl(): string {
  try {
    const url = new URL(window.location.href);
    const fbclid = url.searchParams.get('fbclid');
    return fbclid || '';
  } catch {
    return '';
  }
}

/**
 * Extract _fbc cookie value
 * Returns exact value without modification
 */
function extractFbcCookie(): string {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbc' && value) {
      return decodeURIComponent(value);
    }
  }
  return '';
}

/**
 * Extract _fbp cookie value
 * Returns exact value without modification
 */
function extractFbpCookie(): string {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbp' && value) {
      return decodeURIComponent(value);
    }
  }
  return '';
}

/**
 * Generate fbc from fbclid (only once on landing)
 * Format: fb.1.<timestamp_ms>.<exact_raw_fbclid>
 * 
 * This is called ONLY on initial landing when fbclid is present.
 * The generated value is then stored and reused for all events.
 */
function generateFbcFromFbclid(fbclid: string): string {
  if (!fbclid) return '';
  const timestamp = Date.now();
  return `fb.1.${timestamp}.${fbclid}`;
}

/**
 * Capture Meta attribution on initial page load
 * 
 * Called once from App.tsx useEffect (before any navigation)
 * 
 * Priority for FBC:
 * 1. Existing _fbc cookie (Meta Pixel already set it)
 * 2. Generate from fbclid (if landing URL has fbclid)
 * 3. Undefined (no attribution available)
 * 
 * Priority for FBP:
 * 1. Existing _fbp cookie
 * 2. Undefined (do not fabricate)
 */
export function captureMetaAttribution(): void {
  // Check if already captured (avoid re-capturing on SPA navigation)
  if (sessionStorage.getItem(STORAGE_KEY_FBC) || sessionStorage.getItem(STORAGE_KEY_FBP)) {
    return;
  }

  // Capture FBC
  let fbc = extractFbcCookie();
  if (!fbc) {
    const fbclid = extractFbclidFromUrl();
    if (fbclid) {
      fbc = generateFbcFromFbclid(fbclid);
      sessionStorage.setItem(STORAGE_KEY_FBCLID, fbclid);
    }
  }
  if (fbc) {
    sessionStorage.setItem(STORAGE_KEY_FBC, fbc);
  }

  // Capture FBP
  const fbp = extractFbpCookie();
  if (fbp) {
    sessionStorage.setItem(STORAGE_KEY_FBP, fbp);
  }

  // Log safe diagnostics (no full values)
  console.log('[Meta Attribution] Captured on landing:', {
    fbc_source: fbc ? (extractFbcCookie() ? 'cookie' : 'fbclid') : 'unavailable',
    fbc_present: !!fbc,
    fbp_present: !!fbp,
  });
}

/**
 * Get stored FBC value
 * Returns the exact value captured on landing
 * Undefined if not available
 */
export function getStoredMetaFbc(): string | undefined {
  const fbc = sessionStorage.getItem(STORAGE_KEY_FBC);
  return fbc || undefined;
}

/**
 * Get stored FBP value
 * Returns the exact value captured on landing
 * Undefined if not available
 */
export function getStoredMetaFbp(): string | undefined {
  const fbp = sessionStorage.getItem(STORAGE_KEY_FBP);
  return fbp || undefined;
}

/**
 * Get stored fbclid (for diagnostics only)
 * Not sent to backend
 */
export function getStoredFbclid(): string | undefined {
  const fbclid = sessionStorage.getItem(STORAGE_KEY_FBCLID);
  return fbclid || undefined;
}

/**
 * Clear stored attribution (for testing)
 */
export function clearStoredMetaAttribution(): void {
  sessionStorage.removeItem(STORAGE_KEY_FBC);
  sessionStorage.removeItem(STORAGE_KEY_FBP);
  sessionStorage.removeItem(STORAGE_KEY_FBCLID);
}

/**
 * Get safe diagnostics for logging (no sensitive values)
 */
export function getMetaAttributionDiagnostics() {
  const fbc = getStoredMetaFbc();
  const fbp = getStoredMetaFbp();
  const fbclid = getStoredFbclid();

  return {
    fbc_present: !!fbc,
    fbc_length: fbc?.length || 0,
    fbc_starts_with_fb: fbc?.startsWith('fb.') || false,
    fbp_present: !!fbp,
    fbp_length: fbp?.length || 0,
    fbp_starts_with_fb: fbp?.startsWith('fb.') || false,
    fbclid_present: !!fbclid,
  };
}
