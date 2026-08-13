import { describe, expect, it } from "vitest";
import type { Request } from "express";
import { getSessionCookieOptions } from "./cookies";

function request(protocol: "http" | "https", forwardedProto?: string) {
  return {
    protocol,
    headers: forwardedProto ? { "x-forwarded-proto": forwardedProto } : {},
  } as Request;
}

describe("getSessionCookieOptions", () => {
  it("uses a browser-compatible cookie on local HTTP", () => {
    expect(getSessionCookieOptions(request("http"))).toMatchObject({
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    });
  });

  it("uses the embedded-preview cookie contract on HTTPS", () => {
    expect(getSessionCookieOptions(request("https"))).toMatchObject({
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
  });

  it("honours HTTPS forwarded by the deployment proxy", () => {
    expect(getSessionCookieOptions(request("http", "https"))).toMatchObject({
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
  });
});
