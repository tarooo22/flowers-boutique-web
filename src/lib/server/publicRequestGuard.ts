type LimitPolicy = { limit: number; windowMs: number };
type LimitResult = { allowed: boolean; retryAfterSeconds: number };
type Bucket = { count: number; resetAt: number };

const STORE_KEY = "__flowersBoutiquePublicRequestBuckets";

function buckets() {
  const host = globalThis as typeof globalThis & { [STORE_KEY]?: Map<string, Bucket> };
  host[STORE_KEY] ??= new Map<string, Bucket>();
  return host[STORE_KEY];
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("cf-connecting-ip") || forwarded || request.headers.get("x-real-ip") || "unknown";
}

/**
 * Small process-local safety rail for sensitive public actions. This deliberately
 * does not persist IP data, and is complemented by platform/WAF controls in production.
 */
export function takePublicRequest(request: Request, scope: string, policy: LimitPolicy): LimitResult {
  const now = Date.now();
  const store = buckets();
  if (store.size > 2_000) {
    for (const [key, bucket] of store) if (bucket.resetAt <= now) store.delete(key);
  }

  const key = `${scope}:${clientKey(request)}`;
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + policy.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= policy.limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
