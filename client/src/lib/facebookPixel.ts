/**
 * Facebook Pixel Integration Helper - Fixed for Proper Event Deduplication
 * 
 * The browser Pixel is initialized only when this brand's public ID is configured.
 * This file provides helper functions to track specific events with complete ecommerce parameters
 * 
 * Each event generates a unique event_id that is sent to both:
 * 1. Meta Pixel (browser-side) using the eventID option for proper deduplication
 * 2. Server (Conversions API) with the same event_id for server-side verification
 * 
 * This deduplication prevents Meta from counting the same event twice.
 */

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

/**
 * Normalize price to a valid number for Meta Pixel/CAPI
 * Returns 0 if price is invalid
 */
function normalizePrice(price: any): number {
  const num = Number(price);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

/**
 * Generate a unique event ID for browser + server deduplication
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current page URL for event tracking
 */
function getCurrentPageUrl(): string {
  return window.location.href;
}

/**
 * Get FBP (Facebook Pixel ID) from cookies
 */
function getFBP(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbp') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Get FBC (Facebook Click ID) from URL parameters
 */
function getFBC(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('fbclid') ? `fb.1.${Date.now()}.${params.get('fbclid')}` : null;
}

/**
 * Send event to server via Conversions API using tRPC JSON-RPC format
 * Includes fbp, fbc, user agent, and IP address for improved match quality
 */
async function sendToConversionsAPI(
  eventName: string,
  eventId: string,
  pageUrl: string,
  userData: Record<string, any> = {},
  customData: Record<string, any> = {}
) {
  try {
    const fbp = getFBP();
    const fbc = getFBC();
    
    // tRPC uses JSON-RPC 2.0 format for POST requests
    const jsonRpcPayload = {
      json: {
        eventName,
        eventId,
        eventSourceUrl: pageUrl,
        fbp: fbp || undefined,
        fbc: fbc || undefined,
        ...(Object.keys(userData).length > 0 && { userData }),
        ...(Object.keys(customData).length > 0 && { customData }),
      },
    };

    const response = await fetch('/api/trpc/tracking.trackEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonRpcPayload),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Facebook Pixel] Server error:', response.status, errorData);
      return;
    }

    // Success - event was sent to Conversions API
    const result = await response.json();
    // Don't log sensitive data
    console.log('[Facebook Pixel] Conversions API event sent:', eventName);
  } catch (error) {
    console.error('[Facebook Pixel] Error sending to Conversions API:', error);
  }
}

/**
 * Check if Meta Pixel is available
 * Pixel is loaded globally in index.html, so we just check if fbq exists
 */
export function initFacebookPixel() {
  if (!PIXEL_ID || (window as any).fbq) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.onload = () => {
    (window as any).fbq?.('init', PIXEL_ID);
    (window as any).fbq?.('track', 'PageView');
  };
  document.head.appendChild(script);
}

/**
 * Track PageView event
 * Called on route changes to track page views
 * Uses eventID option for proper deduplication
 */
export function trackPageView() {
  if (!(window as any).fbq) return;
  try {
    const eventId = generateEventId();
    const pageUrl = getCurrentPageUrl();
    
    // Use eventID option (third parameter) for proper deduplication
    (window as any).fbq('track', 'PageView', {}, {
      eventID: eventId,
    });
    
    sendToConversionsAPI('PageView', eventId, pageUrl);
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking PageView:', error);
  }
}

/**
 * Track ViewContent event (product viewed)
 * Enhanced with complete product data for better match quality
 * Uses eventID option for proper deduplication
 */
export function trackViewContent(productId: number, productName: string, price: any) {
  if (!(window as any).fbq) return;
  try {
    const eventId = generateEventId();
    const pageUrl = getCurrentPageUrl();
    const normalizedPrice = normalizePrice(price);
    
    const pixelData = {
      content_ids: [String(productId)],
      content_name: productName,
      content_type: 'product',
      value: normalizedPrice,
      currency: 'GEL',
    };
    
    // Use eventID option (third parameter) for proper deduplication
    (window as any).fbq('track', 'ViewContent', pixelData, {
      eventID: eventId,
    });
    
    sendToConversionsAPI('ViewContent', eventId, pageUrl, {}, {
      content_ids: [String(productId)],
      content_name: productName,
      content_type: 'product',
      value: normalizedPrice,
      currency: 'GEL',
    });
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking ViewContent:', error);
  }
}

/**
 * Track AddToCart event with complete ecommerce parameters
 * Enhanced with contents array and num_items for better match quality
 * Uses eventID option for proper deduplication
 */
export function trackAddToCart(
  productId: number,
  productName: string,
  quantity: number,
  price: any,
  isAvailable: boolean = true
) {
  // Don't track AddToCart for unavailable products
  if (!isAvailable) return;
  if (!(window as any).fbq) return;
  try {
    const eventId = generateEventId();
    const pageUrl = getCurrentPageUrl();
    const normalizedPrice = normalizePrice(price);
    const totalValue = normalizedPrice * quantity;
    
    // Contents array for better match quality
    const contents = [{
      id: String(productId),
      quantity: quantity,
      item_price: normalizedPrice,
    }];
    
    const pixelData = {
      content_ids: [String(productId)],
      content_name: productName,
      content_type: 'product',
      value: totalValue,
      currency: 'GEL',
      contents: contents,
      num_items: quantity,
    };
    
    // Use eventID option (third parameter) for proper deduplication
    (window as any).fbq('track', 'AddToCart', pixelData, {
      eventID: eventId,
    });
    
    sendToConversionsAPI('AddToCart', eventId, pageUrl, {}, {
      content_ids: [String(productId)],
      content_name: productName,
      content_type: 'product',
      value: totalValue,
      currency: 'GEL',
      contents: contents,
      num_items: quantity,
    });
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking AddToCart:', error);
  }
}

/**
 * Track AddToWishlist event
 * Uses eventID option for proper deduplication
 */
export function trackAddToWishlist(productId: number, productName: string, price: any) {
  if (!(window as any).fbq) return;
  try {
    const eventId = generateEventId();
    const pageUrl = getCurrentPageUrl();
    const normalizedPrice = normalizePrice(price);
    
    const pixelData = {
      content_ids: [String(productId)],
      content_name: productName,
      content_type: 'product',
      value: normalizedPrice,
      currency: 'GEL',
    };
    
    // Use eventID option (third parameter) for proper deduplication
    (window as any).fbq('track', 'AddToWishlist', pixelData, {
      eventID: eventId,
    });
    
    sendToConversionsAPI('AddToWishlist', eventId, pageUrl, {}, {
      content_ids: [String(productId)],
      content_name: productName,
      content_type: 'product',
      value: normalizedPrice,
      currency: 'GEL',
    });
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking AddToWishlist:', error);
  }
}

/**
 * Track InitiateCheckout event with complete cart data
 * Enhanced with contents array and num_items for better match quality
 * Uses eventID option for proper deduplication
 */
export function trackInitiateCheckout(
  items: Array<{ productId: number; quantity: number; price: any }>,
  totalPrice: any
) {
  if (!(window as any).fbq) return;
  try {
    const eventId = generateEventId();
    const pageUrl = getCurrentPageUrl();
    const normalizedTotalPrice = normalizePrice(totalPrice);
    
    // Contents array for better match quality
    const contents = items.map(item => ({
      id: String(item.productId),
      quantity: item.quantity,
      item_price: normalizePrice(item.price),
    }));
    
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const pixelData = {
      content_ids: items.map(item => String(item.productId)),
      content_type: 'product',
      value: normalizedTotalPrice,
      currency: 'GEL',
      contents: contents,
      num_items: totalQuantity,
    };
    
    // Use eventID option (third parameter) for proper deduplication
    (window as any).fbq('track', 'InitiateCheckout', pixelData, {
      eventID: eventId,
    });
    
    sendToConversionsAPI('InitiateCheckout', eventId, pageUrl, {}, {
      content_ids: items.map(item => String(item.productId)),
      content_type: 'product',
      value: normalizedTotalPrice,
      currency: 'GEL',
      contents: contents,
      num_items: totalQuantity,
    });
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking InitiateCheckout:', error);
  }
}

/**
 * Track Purchase event - ONLY called from admin panel when order is confirmed
 * Do NOT call this from WhatsApp/Messenger click
 * Uses eventID option for proper deduplication
 */
export function trackPurchase(
  items: Array<{ productId: number; quantity: number; price: number }>,
  totalPrice: number
) {
  if (!(window as any).fbq) return;
  try {
    const eventId = generateEventId();
    const pageUrl = getCurrentPageUrl();
    
    // Contents array
    const contents = items.map(item => ({
      id: String(item.productId),
      quantity: item.quantity,
      item_price: item.price,
    }));
    
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const pixelData = {
      content_ids: items.map(item => String(item.productId)),
      content_type: 'product',
      value: totalPrice,
      currency: 'GEL',
      contents: contents,
      num_items: totalQuantity,
    };
    
    // Use eventID option (third parameter) for proper deduplication
    (window as any).fbq('track', 'Purchase', pixelData, {
      eventID: eventId,
    });
    
    sendToConversionsAPI('Purchase', eventId, pageUrl, {}, {
      content_ids: items.map(item => String(item.productId)),
      content_type: 'product',
      value: totalPrice,
      currency: 'GEL',
      contents: contents,
      num_items: totalQuantity,
    });
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking Purchase:', error);
  }
}

/**
 * Track Lead event - Called when user clicks WhatsApp or Messenger
 * Do NOT call Purchase from this - Lead is the correct event for contact form submissions
 * Uses eventID option for proper deduplication
 */
export function trackLead(
  items: Array<{ productId: number; quantity: number; price: number }>,
  totalPrice: number
) {
  if (!(window as any).fbq) return;
  try {
    const eventId = generateEventId();
    const pageUrl = getCurrentPageUrl();
    
    // Contents array
    const contents = items.map(item => ({
      id: String(item.productId),
      quantity: item.quantity,
      item_price: item.price,
    }));
    
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const pixelData = {
      content_ids: items.map(item => String(item.productId)),
      content_type: 'product',
      value: totalPrice,
      currency: 'GEL',
      contents: contents,
      num_items: totalQuantity,
    };
    
    // Use eventID option (third parameter) for proper deduplication
    (window as any).fbq('track', 'Lead', pixelData, {
      eventID: eventId,
    });
    
    sendToConversionsAPI('Lead', eventId, pageUrl, {}, {
      content_ids: items.map(item => String(item.productId)),
      content_type: 'product',
      value: totalPrice,
      currency: 'GEL',
      contents: contents,
      num_items: totalQuantity,
    });
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking Lead:', error);
  }
}

/**
 * Track Contact event - Alternative to Lead for contact form submissions
 * Uses eventID option for proper deduplication
 */
export function trackContact(
  items: Array<{ productId: number; quantity: number; price: number }>,
  totalPrice: number
) {
  if (!(window as any).fbq) return;
  try {
    const eventId = generateEventId();
    const pageUrl = getCurrentPageUrl();
    
    // Contents array
    const contents = items.map(item => ({
      id: String(item.productId),
      quantity: item.quantity,
      item_price: item.price,
    }));
    
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const pixelData = {
      content_ids: items.map(item => String(item.productId)),
      content_type: 'product',
      value: totalPrice,
      currency: 'GEL',
      contents: contents,
      num_items: totalQuantity,
    };
    
    // Use eventID option (third parameter) for proper deduplication
    (window as any).fbq('track', 'Contact', pixelData, {
      eventID: eventId,
    });
    
    sendToConversionsAPI('Contact', eventId, pageUrl, {}, {
      content_ids: items.map(item => String(item.productId)),
      content_type: 'product',
      value: totalPrice,
      currency: 'GEL',
      contents: contents,
      num_items: totalQuantity,
    });
  } catch (error) {
    console.error('[Facebook Pixel] Error tracking Contact:', error);
  }
}
