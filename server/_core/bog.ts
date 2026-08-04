/**
 * Bank of Georgia (BOG) Payment Integration Helper
 * Handles secure communication with BOG Payments API
 * 
 * SECURITY NOTES:
 * - All credentials are server-side only (never exposed to frontend)
 * - Callback signature verification requires BOG_PUBLIC_KEY
 * - Until BOG_PUBLIC_KEY is available, callbacks are NOT trusted
 * - Payment status remains pending_payment until verified
 * 
 * ENDPOINTS:
 * - OAuth Token: https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token
 * - Order Creation: https://api.bog.ge/payments/v1/ecommerce/orders
 */

import crypto from 'crypto';
import { fromMinorUnits, toMinorUnits } from '../paymentSecurity';

// Environment variables
const BOG_ENV = process.env.BOG_ENV || 'sandbox';
const BOG_CLIENT_ID = process.env.BOG_CLIENT_ID;
const BOG_CLIENT_SECRET = process.env.BOG_CLIENT_SECRET;
const BOG_MERCHANT_ID = process.env.BOG_MERCHANT_ID;
const BOG_TERMINAL_ID = process.env.BOG_TERMINAL_ID;
const BOG_PUBLIC_KEY = process.env.BOG_PUBLIC_KEY;
const BOG_CALLBACK_URL = process.env.BOG_CALLBACK_URL;
const BOG_SUCCESS_URL = process.env.BOG_SUCCESS_URL;
const BOG_FAIL_URL = process.env.BOG_FAIL_URL;

// Official BOG endpoints
const BOG_OAUTH_ENDPOINT = 'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token';
const BOG_ORDER_ENDPOINT = 'https://api.bog.ge/payments/v1/ecommerce/orders';

// Diagnostic error codes
export enum BOGErrorCode {
  AUTH_FAILED = 'BOG_AUTH_FAILED',
  ORDER_REJECTED = 'BOG_ORDER_REJECTED',
  CONFIG_ERROR = 'BOG_CONFIGURATION_ERROR',
  TEMPORARILY_UNAVAILABLE = 'BOG_TEMPORARILY_UNAVAILABLE',
  INVALID_RESPONSE = 'BOG_INVALID_RESPONSE',
  NETWORK_ERROR = 'BOG_NETWORK_ERROR',
}

// Diagnostic result
export interface BOGDiagnosticResult {
  stage: string;
  success: boolean;
  localOrderId?: string;
  externalOrderId?: string;
  upstreamStatus?: number;
  upstreamError?: string;
  errorCode?: BOGErrorCode;
  timestamp: string;
  requestId: string;
  envStatus: {
    clientIdExists: boolean;
    clientSecretExists: boolean;
    merchantIdExists: boolean;
    terminalIdExists: boolean;
    publicKeyExists: boolean;
    callbackUrlExists: boolean;
  };
}

/**
 * Check if BOG payment is properly configured
 */
export function isBOGConfigured(): boolean {
  return !!(BOG_CLIENT_ID && BOG_CLIENT_SECRET && BOG_MERCHANT_ID && BOG_TERMINAL_ID);
}

/**
 * Check if BOG callback signature verification is available
 */
export function isBOGCallbackVerificationAvailable(): boolean {
  // Silent check - no console warnings
  return !!BOG_PUBLIC_KEY;
}

/**
 * Get environment variable status (safe masked form)
 */
function getEnvStatus() {
  return {
    clientIdExists: !!BOG_CLIENT_ID,
    clientSecretExists: !!BOG_CLIENT_SECRET,
    merchantIdExists: !!BOG_MERCHANT_ID,
    terminalIdExists: !!BOG_TERMINAL_ID,
    publicKeyExists: !!BOG_PUBLIC_KEY,
    callbackUrlExists: !!BOG_CALLBACK_URL,
  };
}

/**
 * Retrieve BOG OAuth token
 */
async function getBOGAccessToken(requestId: string): Promise<{
  token?: string;
  error?: string;
  status?: number;
  diagnostic?: BOGDiagnosticResult;
}> {
  try {
    if (!BOG_CLIENT_ID || !BOG_CLIENT_SECRET) {
      const diagnostic: BOGDiagnosticResult = {
        stage: 'BOG_AUTH_REQUEST',
        success: false,
        errorCode: BOGErrorCode.CONFIG_ERROR,
        upstreamError: 'Missing BOG_CLIENT_ID or BOG_CLIENT_SECRET',
        timestamp: new Date().toISOString(),
        requestId,
        envStatus: getEnvStatus(),
      };
      console.error('[BOG Payment] Configuration error:', diagnostic);
      return { error: 'BOG configuration missing', diagnostic };
    }

    const credentials = `${BOG_CLIENT_ID}:${BOG_CLIENT_SECRET}`;
    const authHeader = 'Basic ' + Buffer.from(credentials).toString('base64');

    const response = await fetch(BOG_OAUTH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const diagnostic: BOGDiagnosticResult = {
        stage: 'BOG_AUTH_REQUEST',
        success: false,
        errorCode: BOGErrorCode.AUTH_FAILED,
        upstreamStatus: response.status,
        upstreamError: errorBody.substring(0, 500),
        timestamp: new Date().toISOString(),
        requestId,
        envStatus: getEnvStatus(),
      };
      console.error('[BOG Payment] OAuth failed:', diagnostic);
      console.error('[BOG Payment] OAuth error body:', errorBody);
      console.error('[BOG Payment] OAuth request details:', {
        endpoint: BOG_OAUTH_ENDPOINT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic [MASKED]',
        },
        clientIdLength: BOG_CLIENT_ID?.length,
      });
      return { error: 'BOG authentication failed', status: response.status, diagnostic };
    }

    const data = await response.json();
    
    if (!data.access_token) {
      const diagnostic: BOGDiagnosticResult = {
        stage: 'BOG_AUTH_RESPONSE',
        success: false,
        errorCode: BOGErrorCode.INVALID_RESPONSE,
        upstreamStatus: 200,
        upstreamError: 'access_token missing from response',
        timestamp: new Date().toISOString(),
        requestId,
        envStatus: getEnvStatus(),
      };
      console.error('[BOG Payment] Invalid OAuth response:', diagnostic);
      return { error: 'Invalid BOG response', diagnostic };
    }

    console.log('[BOG Payment] OAuth token retrieved successfully', { requestId });
    return { token: data.access_token };
  } catch (error) {
    const diagnostic: BOGDiagnosticResult = {
      stage: 'BOG_AUTH_REQUEST',
      success: false,
      errorCode: BOGErrorCode.NETWORK_ERROR,
      upstreamError: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId,
      envStatus: getEnvStatus(),
    };
    console.error('[BOG Payment] OAuth network error:', diagnostic);
    return { error: 'Network error', diagnostic };
  }
}

/**
 * Create BOG payment order
 */
export async function createBOGOrder(params: {
  orderId: string; // external_order_id (e.g., FLR-600016)
  userId?: number; // Authenticated user ID (optional for guest orders)
  localOrderId?: number; // Local order ID for linking
  amount: number; // product subtotal in GEL, per the payload contract below
  currency: string; // GEL
  description: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  basketItems: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  deliveryAmount?: number; // delivery fee in GEL
}): Promise<{
  success: boolean;
  redirectUrl?: string;
  bogOrderId?: string; // BOG's order ID
  bogExternalOrderId?: string; // Our external order ID (FLR-600016)
  errorCode?: BOGErrorCode;
  userMessage?: string;
  diagnostic?: BOGDiagnosticResult;
}> {
  const requestId = crypto.randomUUID();
  
  try {
    if (!isBOGConfigured()) {
      const diagnostic: BOGDiagnosticResult = {
        stage: 'LOCAL_VALIDATION',
        success: false,
        localOrderId: params.orderId,
        errorCode: BOGErrorCode.CONFIG_ERROR,
        upstreamError: 'BOG payment is not configured',
        timestamp: new Date().toISOString(),
        requestId,
        envStatus: getEnvStatus(),
      };
      console.error('[BOG Payment] Configuration error:', diagnostic);
      return {
        success: false,
        errorCode: BOGErrorCode.CONFIG_ERROR,
        userMessage: 'ბარათით გადახდა დროებით არ არის ხელმისაწვდომი',
        diagnostic,
      };
    }

    // Step 1: Get OAuth token
    const tokenResult = await getBOGAccessToken(requestId);
    if (!tokenResult.token) {
      return {
        success: false,
        errorCode: tokenResult.diagnostic?.errorCode || BOGErrorCode.AUTH_FAILED,
        userMessage: 'ბარათით გადახდის დაწყება ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა რამდენიმე წუთში.',
        diagnostic: tokenResult.diagnostic,
      };
    }

    // Step 2: Validate payload - amounts must be in GEL
    const productSubtotalMinor = toMinorUnits(params.amount);
    const deliveryFeeMinor = toMinorUnits(params.deliveryAmount ?? 0);
    const expectedTotalMinor = productSubtotalMinor + deliveryFeeMinor;
    const productBasketTotalMinor = params.basketItems.reduce((sum, item) => {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return Number.NaN;
      }
      const unitPriceMinor = toMinorUnits(item.unitPrice);
      const lineTotalMinor = toMinorUnits(item.totalPrice);
      if (unitPriceMinor * item.quantity !== lineTotalMinor) {
        return Number.NaN;
      }
      return sum + lineTotalMinor;
    }, 0);

    const productBasketMismatch = productBasketTotalMinor !== productSubtotalMinor;
    const productSubtotal = fromMinorUnits(productSubtotalMinor);
    const deliveryFee = fromMinorUnits(deliveryFeeMinor);
    const expectedTotal = fromMinorUnits(expectedTotalMinor);
    const productBasketTotal = Number.isFinite(productBasketTotalMinor)
      ? fromMinorUnits(productBasketTotalMinor)
      : Number.NaN;
    
    if (expectedTotalMinor <= 0 || productBasketMismatch) {
      const diagnostic: BOGDiagnosticResult = {
        stage: 'PAYLOAD_VALIDATION',
        success: false,
        localOrderId: params.orderId,
        errorCode: BOGErrorCode.ORDER_REJECTED,
        upstreamError: productBasketMismatch ? 'BOG_PRODUCT_BASKET_MISMATCH' : 'Invalid total amount',
        timestamp: new Date().toISOString(),
        requestId,
        envStatus: getEnvStatus(),
      };
      console.error('[BOG Payment] Amount validation FAILED:', {
        productBasketTotal,
        deliveryAmount: deliveryFee,
        expectedTotal,
        productSubtotal,
        productBasketMismatch,
        validationResult: 'REJECTED',
      });
      return {
        success: false,
        errorCode: BOGErrorCode.ORDER_REJECTED,
        userMessage: 'შეკვეთის თანხა არ არის სწორი',
        diagnostic,
      };
    }
    
    console.log('[BOG Payment] Amount validation PASSED:', {
      productBasketTotal,
      deliveryAmount: deliveryFee,
      expectedTotal,
      productSubtotal,
      validationResult: 'ACCEPTED',
    });

    // Step 3: Create order payload (following BOG API specification)
    // https://api.bog.ge/docs/en/payments/standard-process/create-order
    const idempotencyKey = crypto.randomUUID();
    
    // Build basket items - do NOT include delivery as basket item
    const basketItems = params.basketItems.map((item, index) => ({
      product_id: `product-${index}`,
      description: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
    }));
    
    const payload = {
      callback_url: BOG_CALLBACK_URL,
      external_order_id: params.orderId,
      purchase_units: {
        currency: params.currency,
        total_amount: expectedTotal,
        basket: basketItems,
        ...(deliveryFee > 0 && {
          delivery: {
            amount: deliveryFee,
          },
        }),
      },
      redirect_urls: {
        success: BOG_SUCCESS_URL,
        fail: BOG_FAIL_URL,
      },
      ...(BOG_TERMINAL_ID && {
        config: {
          account: {
            tag: BOG_TERMINAL_ID,
          },
        },
      }),
      ...(params.customerEmail || params.customerPhone || params.customerName) && {
        buyer: {
          full_name: params.customerName,
          masked_email: params.customerEmail,
          masked_phone: params.customerPhone,
        },
      },
    };

    // Step 4: Create order with BOG
    const orderResponse = await fetch(BOG_ORDER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenResult.token}`,
        'Accept-Language': 'ka',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    if (!orderResponse.ok) {
      const errorBody = await orderResponse.text();
      const diagnostic: BOGDiagnosticResult = {
        stage: 'BOG_ORDER_CREATION',
        success: false,
        localOrderId: params.orderId,
        externalOrderId: params.orderId,
        errorCode: BOGErrorCode.ORDER_REJECTED,
        upstreamStatus: orderResponse.status,
        upstreamError: errorBody.substring(0, 500),
        timestamp: new Date().toISOString(),
        requestId,
        envStatus: getEnvStatus(),
      };
      console.error('[BOG Payment] Order creation failed:', diagnostic);
      console.error('[BOG Payment] Order error body:', errorBody);
      console.error('[BOG Payment] Order request details:', {
        endpoint: BOG_ORDER_ENDPOINT,
        method: 'POST',
        payloadStructure: {
          callback_url: 'present',
          external_order_id: 'present',
          purchase_units: 'present',
          redirect_urls: 'present',
          config: BOG_TERMINAL_ID ? 'present' : 'not set',
          buyer: params.customerEmail ? 'present' : 'not set',
        },
        totalAmount: payload.purchase_units.total_amount,
        basketItemCount: payload.purchase_units.basket.length,
      });

      let userMessage = 'ბარათით გადახდის დაწყება ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა რამდენიმე წუთში.';
      if (orderResponse.status === 503) {
        userMessage = 'BOG სერვერი დროებით მიუწვდომელია. გთხოვთ, სცადოთ ხელახლა რამდენიმე წუთში.';
      } else if (orderResponse.status === 401 || orderResponse.status === 403) {
        userMessage = 'ბარათის გადახდის კონფიგურაცია არ არის სწორი.';
      } else if (orderResponse.status === 400) {
        userMessage = 'ბარათის გადახდის მოთხოვნა არ არის სწორი. გთხოვთ, დაუკავშირდით ადმინისტრატორს.';
      }

      return {
        success: false,
        errorCode: orderResponse.status === 503 ? BOGErrorCode.TEMPORARILY_UNAVAILABLE : BOGErrorCode.ORDER_REJECTED,
        userMessage,
        diagnostic,
      };
    }

    const orderData = await orderResponse.json();
    
    if (!orderData.id || !orderData._links?.redirect?.href) {
      const diagnostic: BOGDiagnosticResult = {
        stage: 'BOG_ORDER_RESPONSE',
        success: false,
        localOrderId: params.orderId,
        externalOrderId: params.orderId,
        errorCode: BOGErrorCode.INVALID_RESPONSE,
        upstreamStatus: 200,
        upstreamError: 'Missing id or redirect URL in response',
        timestamp: new Date().toISOString(),
        requestId,
        envStatus: getEnvStatus(),
      };
      console.error('[BOG Payment] Invalid order response:', diagnostic);
      return {
        success: false,
        errorCode: BOGErrorCode.INVALID_RESPONSE,
        userMessage: 'ბარათის გადახდის პროცესი ვერ დაიწყო. გთხოვთ, სცადოთ ხელახლა.',
        diagnostic,
      };
    }

        console.log('[BOG Payment] Order created successfully:', {
      requestId,
      externalOrderId: params.orderId,
      bogOrderId: orderData.id,
      localOrderId: params.localOrderId,
    });

    // Update local order with BOG metadata if localOrderId provided
    if (params.localOrderId) {
      try {
        const { updateOrderBOGPayment } = await import('../db');
        await updateOrderBOGPayment(params.localOrderId, {
          bogOrderId: orderData.id,
          bogExternalOrderId: params.orderId,
          bogPaymentStatus: 'pending',
        });
      } catch (error) {
        console.error('[BOG Payment] Failed to update local order with BOG metadata:', error);
      }
    }

    return {
      success: true,
      redirectUrl: orderData._links.redirect.href,
      bogOrderId: orderData.id,
      bogExternalOrderId: params.orderId,
    };
  } catch (error) {
    const diagnostic: BOGDiagnosticResult = {
      stage: 'BOG_ORDER_CREATION',
      success: false,
      localOrderId: params.orderId,
      errorCode: BOGErrorCode.NETWORK_ERROR,
      upstreamError: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId,
      envStatus: getEnvStatus(),
    };
    console.error('[BOG Payment] Unexpected error:', diagnostic);
    return {
      success: false,
      errorCode: BOGErrorCode.NETWORK_ERROR,
      userMessage: 'ბარათით გადახდის დაწყება ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა რამდენიმე წუთში.',
      diagnostic,
    };
  }
}

/**
 * Verify BOG callback signature
 */
export function verifyBOGCallbackSignature(
  payload: string,
  signature: string
): boolean {
  if (!BOG_PUBLIC_KEY) {
    // Silent check - BOG_PUBLIC_KEY not configured
    return false;
  }

  try {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(payload);
    return verifier.verify(BOG_PUBLIC_KEY, signature, 'base64');
  } catch (error) {
    console.error('[BOG Payment Callback] Signature verification error:', error);
    return false;
  }
}

/**
 * Parse BOG callback response
 */
export function parseBOGCallback(body: string): {
  orderId?: string;
  status?: string;
  amount?: number;
  transactionId?: string;
  error?: string;
} {
  try {
    const parsed = JSON.parse(body);
    return {
      orderId: parsed.external_order_id,
      status: parsed.status,
      amount: parsed.amount,
      transactionId: parsed.id,
    };
  } catch (error) {
    console.error('[BOG Payment Callback] Parse error:', error);
    return { error: 'Invalid callback format' };
  }
}


/**
 * Get BOG order status for reconciliation
 */
export async function getBOGOrderStatus(externalOrderId: string): Promise<{
  success: boolean;
  status?: string; // 'completed', 'failed', 'cancelled', 'pending'
  bogOrderId?: string;
  amount?: number;
  error?: string;
}> {
  try {
    if (!isBOGConfigured()) {
      return {
        success: false,
        error: 'BOG payment is not configured',
      };
    }

    // Get OAuth token
    const tokenResult = await getBOGAccessToken(crypto.randomUUID());
    if (!tokenResult.token) {
      return {
        success: false,
        error: 'Failed to get BOG access token',
      };
    }

    // Query BOG for order status
    // BOG API endpoint: GET /payments/v1/ecommerce/orders/{orderId}
    const queryUrl = `${BOG_ORDER_ENDPOINT}/${externalOrderId}`;
    
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenResult.token}`,
        'Accept-Language': 'ka',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[BOG Status Query] Failed:', {
        status: response.status,
        url: queryUrl,
        method: 'GET',
        error: errorBody.substring(0, 200),
      });
      
      // If 405 (Method Not Allowed), the endpoint may not support GET
      if (response.status === 405) {
        console.error('[BOG Status Query] 405 Method Not Allowed - BOG API may not support GET on this endpoint');
        console.error('[BOG Status Query] Attempted URL:', queryUrl);
        console.error('[BOG Status Query] BOG API may require callback mechanism for status updates instead of polling');
      }
      
      return {
        success: false,
        error: `BOG API error: ${response.status}`,
      };
    }

    const orderData = await response.json();
    
    // Map BOG status to our status
    const status = orderData.status || 'pending';
    
    console.log('[BOG Status Query] Retrieved status:', {
      externalOrderId,
      bogOrderId: orderData.id,
      status: status,
    });

    return {
      success: true,
      status: status,
      bogOrderId: orderData.id,
      amount: orderData.purchase_units?.total_amount,
    };
  } catch (error) {
    console.error('[BOG Status Query] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
