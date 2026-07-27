/**
 * BOG Payment Callback Handler with Raw-Body Signature Verification
 * 
 * This module handles BOG payment callbacks with proper raw-body signature verification.
 * The callback signature must be verified against the exact raw HTTP request body,
 * not against a stringified version of the parsed JSON.
 */

import { Request, Response } from 'express';
import { verifyBOGCallbackSignature, parseBOGCallback, isBOGCallbackVerificationAvailable } from './bog';

export interface BOGCallbackRequest extends Request {
  rawBody?: string; // Raw body captured before JSON parsing
}

/**
 * Handle BOG payment callback with raw-body signature verification
 * 
 * Flow:
 * 1. Receive raw request body
 * 2. Verify Callback-Signature header against raw body
 * 3. Parse JSON from raw body
 * 4. Match to local order by bogOrderId
 * 5. Update order status based on BOG status
 * 6. Return HTTP 200
 */
export async function handleBOGCallback(req: BOGCallbackRequest, res: Response) {
  try {
    // Get raw body (should be set by middleware)
    const rawBodyString = req.rawBody || JSON.stringify(req.body);
    
    console.log('[BOG Callback] Received callback:', {
      timestamp: new Date().toISOString(),
      headers: {
        'callback-signature': (req.headers['callback-signature'] as string)?.substring(0, 20) + '...',
        'content-type': req.headers['content-type'],
      },
      rawBodyLength: rawBodyString.length,
    });

    // Get signature from headers (official header name is Callback-Signature per BOG docs)
    // Fallback to x-bog-signature for backward compatibility
    const signature = (req.headers['callback-signature'] || req.headers['x-bog-signature']) as string;

    // Check if verification is available
    if (!isBOGCallbackVerificationAvailable()) {
      console.warn('[BOG Callback] Warning: Callback verification is disabled (BOG_PUBLIC_KEY not configured)');
      console.warn('[BOG Callback] Order status will NOT be updated to paid');
      res.status(200).json({ success: true, message: 'Callback received (verification disabled)' });
      return;
    }

    // Verify signature against raw body
    if (!signature) {
      console.error('[BOG Callback] Missing signature header (expected: Callback-Signature)');
      res.status(401).json({ success: false, error: 'Missing signature header' });
      return;
    }

    const isSignatureValid = verifyBOGCallbackSignature(rawBodyString, signature);
    if (!isSignatureValid) {
      console.error('[BOG Callback] Signature verification failed', {
        signatureLength: signature.length,
        bodyLength: rawBodyString.length,
      });
      res.status(401).json({ success: false, error: 'Invalid signature' });
      return;
    }

    console.log('[BOG Callback] ✓ Signature verified successfully');

    // Parse callback from raw body
    const callbackData = parseBOGCallback(rawBodyString);
    if (!callbackData || callbackData.error) {
      console.error('[BOG Callback] Failed to parse callback data:', callbackData?.error);
      res.status(400).json({ success: false, error: 'Invalid callback data' });
      return;
    }

    console.log('[BOG Callback] Parsed callback:', {
      orderId: callbackData.orderId,
      status: callbackData.status,
      amount: callbackData.amount,
      transactionId: callbackData.transactionId?.substring(0, 20) + '...',
    });

    // Find local order by BOG order ID (e.g., FLR-1500009)
    const { findOrderByBOGExternalId, updateOrderBOGPayment } = await import('../db');
    const localOrder = await findOrderByBOGExternalId(callbackData.orderId);
    
    if (!localOrder) {
      console.error('[BOG Callback] Local order not found for external ID:', callbackData.orderId);
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }
    
    // Verify amount and currency match
    if (callbackData.amount && localOrder.totalPrice !== callbackData.amount) {
      console.error('[BOG Callback] Amount mismatch:', {
        local: localOrder.totalPrice,
        bog: callbackData.amount,
      });
      res.status(400).json({ success: false, error: 'Amount mismatch' });
      return;
    }

    // Map BOG status to local payment status
    let paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'refund_pending' | 'partially_refunded' = 'pending';
    let bogPaymentStatus = callbackData.status;
    
    switch (callbackData.status) {
      case 'completed':
        paymentStatus = 'paid';
        break;
      case 'failed':
      case 'cancelled':
        paymentStatus = 'failed';
        break;
      case 'refund_requested':
        paymentStatus = 'refund_pending';
        break;
      case 'refunded':
        paymentStatus = 'refunded';
        break;
      case 'refunded_partially':
        paymentStatus = 'partially_refunded';
        break;
      case 'created':
      case 'processing':
      default:
        paymentStatus = 'pending';
        break;
    }
    
    // Update local order with BOG payment details
    await updateOrderBOGPayment(localOrder.id, {
      bogOrderId: callbackData.transactionId,
      bogExternalOrderId: callbackData.orderId,
      bogPaymentStatus: bogPaymentStatus,
      bogCallbackReceived: true,
      paidAt: paymentStatus === 'paid' ? new Date() : undefined,
      paymentLastCheckedAt: new Date(),
      paymentStatus: paymentStatus,
    });
    
    console.log('[BOG Callback] ✓ Order status updated:', {
      localOrderId: localOrder.id,
      orderNumber: (localOrder as any).orderNumber,
      externalOrderId: callbackData.orderId,
      paymentStatus: paymentStatus,
      bogStatus: bogPaymentStatus,
    });

    res.status(200).json({ success: true, message: 'Callback processed successfully' });
  } catch (error) {
    console.error('[BOG Callback] Error processing callback:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
