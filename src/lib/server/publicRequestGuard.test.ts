import { describe, expect, it } from "vitest";
import { takePublicRequest } from "@/lib/server/publicRequestGuard";

describe("public request guard", () => {
  it("bounds a client within a rolling fixed window", () => {
    const request = new Request("https://flower.example/api", { headers: { "cf-connecting-ip": "198.51.100.42" } });
    expect(takePublicRequest(request, "vitest", { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
    expect(takePublicRequest(request, "vitest", { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
    const limited = takePublicRequest(request, "vitest", { limit: 2, windowMs: 60_000 });
    expect(limited.allowed).toBe(false);
    expect(limited.retryAfterSeconds).toBeGreaterThan(0);
  });
});
