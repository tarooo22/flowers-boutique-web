import "dotenv/config";

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  mistralApiKey: process.env.MISTRAL_API_KEY ?? "",
  pollinationsApiKey: process.env.POLLINATIONS_API_KEY ?? "",
  metaPixelId: process.env.META_PIXEL_ID ?? "",
  metaCapiAccessToken: process.env.META_CAPI_ACCESS_TOKEN ?? "",
  metaTestEventCode: process.env.META_TEST_EVENT_CODE ?? "",
  metaCapiEnabled: process.env.META_CAPI_ENABLED !== "false",
};

/**
 * Fail fast only for deployments that are expected to persist customer data.
 * Local UI work remains possible without a database, but the warning makes it
 * explicit that catalog and order persistence are disabled.
 */
export function validateEnvironment(): void {
  const missingProductionVariables = [
    ["DATABASE_URL", ENV.databaseUrl],
    ["JWT_SECRET", ENV.cookieSecret],
    ["VITE_SITE_URL", process.env.VITE_SITE_URL ?? ""],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (ENV.isProduction && missingProductionVariables.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missingProductionVariables.join(", ")}`
    );
  }

  if (!ENV.isProduction && !ENV.databaseUrl) {
    console.warn("[Environment] DATABASE_URL is not configured; local catalog and order persistence are disabled.");
  }
}

/**
 * Get the current BOG card payment mode with safe defaults.
 * Safe default is "admin_only" - never defaults to "public"
 */
export function getBogCardPaymentMode(): "public" | "admin_only" | "disabled" {
  const mode = process.env.BOG_CARD_PAYMENT_MODE;
  
  if (mode === "public") return "public";
  if (mode === "disabled") return "disabled";
  
  // Safe default: admin_only
  return "admin_only";
}
