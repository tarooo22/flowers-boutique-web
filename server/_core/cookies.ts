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
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  const secure = ENV.isProduction || isSecureRequest(req);

  return {
    httpOnly: true,
    path: "/",
    // Authentication happens on the same site. Lax blocks cross-site POSTs
    // while still allowing normal top-level navigation back to the shop.
    sameSite: "lax",
    secure,
  };
}
