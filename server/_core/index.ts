import express from "express";
import { createServer } from "http";
import net from "net";
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
import { validateEnvironment } from "./env";
import { disabledBOGCallbackHandler } from "../paymentAvailability";

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

  // Reserved callback path. BOG is intentionally disabled until official
  // merchant credentials and a verified callback fixture are available.
  app.post("/api/payments/bog/callback", disabledBOGCallbackHandler);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerUploadRoutes(app);
  registerSitemapRoute(app);

  console.warn("[BOG] Card payments are intentionally disabled pending merchant configuration");

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

  app.use(handleProductRoute);
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
