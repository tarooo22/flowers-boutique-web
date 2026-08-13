import type { CookieOptions, Request } from "express";
import { ENV } from "./env";

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<
  CookieOptions,
  "domain" | "httpOnly" | "partitioned" | "path" | "sameSite" | "secure"
> {
  const secure = ENV.isProduction || isSecureRequest(req);

  return {
    httpOnly: true,
    path: "/",
    // Manus preview can be embedded in a host application. A Lax cookie is
    // not reliably retained in that cross-site storage context after the
    // native login mutation. Partitioned cookies preserve isolation by the
    // top-level site while allowing the HTTPS preview to retain its own
    // HttpOnly session.
    sameSite: secure ? "none" : "lax",
    secure,
    ...(secure ? { partitioned: true } : {}),
  };
}
