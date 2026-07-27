import express from "express";
import { createServer } from "http";
import net from "net";
import crypto from "crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerUploadRoutes } from "../uploadRouter";
import { registerSitemapRoute } from "../sitemapRouter";
import { registerStorageProxy } from "./storageProxy";
import { handleProductRoute } from "../productNotFoundHandler";
import { handleSeoMonitoring } from "../handlers/seoMonitoringHandler";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { isBOGCallbackVerificationAvailable, isBOGConfigured } from "./bog";
import { validateEnvironment } from "./env";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { orders, customerOrders } from "../../drizzle/schema";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  validateEnvironment();
  const app = express();
  const server = createServer(app);
  
  // ============================================================
  // BOG Payment Callback Handler
  // Must be registered BEFORE express.json() to capture raw body
  // ============================================================
  const BOG_CALLBACK_PATH = "/api/payments/bog/callback";
  
  app.post(BOG_CALLBACK_PATH, express.raw({ type: "application/json" }), async (req, res) => {
    const diagnosticId = crypto.randomUUID().substring(0, 8);
    const receivedAt = new Date().toISOString();
    
    try {
      // Step 1: Verify raw body is a Buffer
      if (!Buffer.isBuffer(req.body)) {
        console.error(`[BOG Callback ${diagnosticId}] Raw body is not a Buffer:`, typeof req.body);
        return res.status(400).json({
          success: false,
          error: "BOG_CALLBACK_RAW_BODY_MISSING",
          diagnosticId
        });
      }

      const rawBody = req.body as Buffer;
      const contentType = req.get("content-type");
      
      // Step 2: Get signature header
      const signature = req.get("Callback-Signature");
      
      console.log(`[BOG Callback ${diagnosticId}] Received:`, {
        timestamp: receivedAt,
        contentType,
        rawBodyLength: rawBody.length,
        signaturePresent: !!signature,
      });

      // Step 3: Verify signature is present
      if (!signature) {
        console.error(`[BOG Callback ${diagnosticId}] Missing Callback-Signature header`);
        return res.status(401).json({
          success: false,
          error: "BOG_CALLBACK_SIGNATURE_MISSING",
          diagnosticId
        });
      }

      // Step 4: Check if verification is available
      if (!isBOGCallbackVerificationAvailable()) {
        console.error(`[BOG Callback ${diagnosticId}] BOG_PUBLIC_KEY not configured - rejecting unverified callback`);
        return res.status(500).json({
          success: false,
          error: "BOG_CALLBACK_VERIFICATION_NOT_CONFIGURED",
          diagnosticId
        });
      }

      // Step 5: Verify signature using RSA-SHA256
      const verifier = crypto.createVerify("RSA-SHA256");
      verifier.update(rawBody);
      verifier.end();

      const isSignatureValid = verifier.verify(
        process.env.BOG_PUBLIC_KEY!,
        signature,
        "base64"
      );

      console.log(`[BOG Callback ${diagnosticId}] Signature verification:`, {
        valid: isSignatureValid,
        signatureLength: signature.length,
      });

      if (!isSignatureValid) {
        console.error(`[BOG Callback ${diagnosticId}] Signature verification failed`);
        return res.status(401).json({
          success: false,
          error: "BOG_CALLBACK_SIGNATURE_INVALID",
          diagnosticId
        });
      }

      // Step 6: Parse verified JSON
      let payload: any;
      try {
        payload = JSON.parse(rawBody.toString("utf8"));
      } catch (parseError) {
        console.error(`[BOG Callback ${diagnosticId}] JSON parse error:`, parseError);
        return res.status(400).json({
          success: false,
          error: "BOG_CALLBACK_JSON_INVALID",
          diagnosticId
        });
      }

      // Step 7: Validate event type
      if (payload.event !== "order_payment") {
        console.warn(`[BOG Callback ${diagnosticId}] Unexpected event type:`, payload.event);
        return res.status(400).json({
          success: false,
          error: "BOG_CALLBACK_UNEXPECTED_EVENT",
          diagnosticId
        });
      }

      // Step 8: Extract order ID
      const bogOrderId = payload.body?.order_id;
      if (!bogOrderId) {
        console.error(`[BOG Callback ${diagnosticId}] Missing order_id in payload`);
        return res.status(400).json({
          success: false,
          error: "BOG_CALLBACK_MISSING_ORDER_ID",
          diagnosticId
        });
      }

      const bogStatus = payload.body?.status;
      if (!bogStatus) {
        console.error(`[BOG Callback ${diagnosticId}] Missing status in payload`);
        return res.status(400).json({
          success: false,
          error: "BOG_CALLBACK_MISSING_STATUS",
          diagnosticId
        });
      }

      console.log(`[BOG Callback ${diagnosticId}] Payload validated:`, {
        bogOrderId: bogOrderId.substring(0, 10) + "...",
        bogStatus,
      });

      // Step 9: Find local order by BOG order ID
      const db = getDb();
      const localOrder = await db.query.orders.findFirst({
        where: eq(orders.bogExternalOrderId, bogOrderId),
      });

      if (!localOrder) {
        console.error(`[BOG Callback ${diagnosticId}] Local order not found for BOG ID:`, bogOrderId);
        return res.status(404).json({
          success: false,
          error: "BOG_CALLBACK_ORDER_NOT_FOUND",
          diagnosticId
        });
      }

      console.log(`[BOG Callback ${diagnosticId}] Local order matched:`, {
        localOrderId: localOrder.id,
        orderNumber: (localOrder as any).orderNumber,
      });

      // Step 10: Map BOG status to local payment status
      let paymentStatus: "pending" | "paid" | "failed" | "refund_pending" | "refunded" | "partially_refunded" | "authorized" = "pending";
      
      switch (bogStatus) {
        case "completed":
          paymentStatus = "paid";
          break;
        case "rejected":
          paymentStatus = "failed";
          break;
        case "refund_requested":
          paymentStatus = "refund_pending";
          break;
        case "refunded":
          paymentStatus = "refunded";
          break;
        case "refunded_partially":
          paymentStatus = "partially_refunded";
          break;
        case "blocked":
          paymentStatus = "authorized";
          break;
        case "created":
        case "processing":
        default:
          paymentStatus = "pending";
          break;
      }

      // Step 11: Extract additional fields
      const transactionId = payload.body?.transaction_id;
      const paymentMethod = payload.body?.payment_method;
      const authorizationCode = payload.body?.authorization_code;
      const rejectReason = payload.body?.reject_reason;
      const paidAt = payload.body?.paid_at ? new Date(payload.body.paid_at) : undefined;

      // Step 12: Update order (idempotent - only update if status is changing or if pending)
      const currentStatus = (localOrder as any).paymentStatus;
      
      // Idempotency: don't revert paid orders to pending
      if (currentStatus === "paid" && paymentStatus === "pending") {
        console.log(`[BOG Callback ${diagnosticId}] Idempotency check: ignoring pending status for already-paid order`);
        return res.status(200).json({
          success: true,
          message: "Callback processed (idempotent - order already paid)",
          diagnosticId
        });
      }

      // Idempotency: don't create duplicate updates
      if (currentStatus === paymentStatus && (localOrder as any).bogCallbackReceived) {
        console.log(`[BOG Callback ${diagnosticId}] Idempotency check: status unchanged and callback already received`);
        return res.status(200).json({
          success: true,
          message: "Callback processed (idempotent - no change)",
          diagnosticId
        });
      }

      // Update order in database
      await db.update(orders).set({
        bogOrderId: transactionId,
        bogExternalOrderId: bogOrderId,
        bogPaymentStatus: bogStatus,
        bogCallbackReceived: true,
        paidAt: paymentStatus === "paid" ? (paidAt || new Date()) : undefined,
        paymentLastCheckedAt: new Date(),
        paymentStatus: paymentStatus,
        paymentFailureReason: rejectReason || null,
      }).where(eq(orders.id, localOrder.id));

      console.log(`[BOG Callback ${diagnosticId}] ✓ Order updated:`, {
        orderNumber: (localOrder as any).orderNumber,
        paymentStatus,
        bogStatus,
        httpStatus: 200,
      });

      res.status(200).json({
        success: true,
        message: "Callback processed successfully",
        diagnosticId
      });

    } catch (error) {
      console.error(`[BOG Callback ${diagnosticId}] Unexpected error:`, error);
      res.status(500).json({
        success: false,
        error: "BOG_CALLBACK_INTERNAL_ERROR",
        diagnosticId
      });
    }
  });
  
  // Configure body parser with larger size limit for file uploads
  // This runs AFTER the BOG callback route, so it doesn't affect it
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerUploadRoutes(app);
  registerSitemapRoute(app);
  
  // Log BOG configuration status
  if (isBOGConfigured()) {
    console.log('[BOG] Payment integration configured');
    if (isBOGCallbackVerificationAvailable()) {
      console.log('[BOG] Callback signature verification enabled');
    } else {
      console.warn('[BOG] Callback signature verification disabled (BOG_PUBLIC_KEY not configured)');
    }
  } else {
    console.warn('[BOG] Payment integration not fully configured');
  }

  // tRPC middleware
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: createContext,
    })
  );

  // In development, Vite must own the HTML fallback so it can transform the
  // client entrypoint. The production static fallback would otherwise answer
  // every request before Vite gets a chance to handle it.
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Handle product not found
  app.use(handleProductRoute);

  // Handle SEO monitoring
  app.use(handleSeoMonitoring);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
