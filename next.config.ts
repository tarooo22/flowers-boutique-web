import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const frameAncestors = isDevelopment
  ? "'self' https://manus.im https://*.manus.im https://manus.computer https://*.manus.computer"
  : "'self'";
const developmentScriptSource = isDevelopment ? " 'unsafe-eval'" : "";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["3000-i2pfjamc2e6vvxjvr0sej-59b127c0.us3.manus.computer", "127.0.0.1"],
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors ${frameAncestors}; form-action 'self'; script-src 'self' 'unsafe-inline'${developmentScriptSource}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self'; frame-src https://maps.google.com https://www.google.com; media-src 'self' data: blob: https:` },
        ...(isDevelopment ? [] : [{ key: "X-Frame-Options", value: "SAMEORIGIN" }]),
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=()" },
      ],
    }];
  },
  images: {
    // All placeholder assets are trusted, locally-generated SVGs.
    // These settings let next/image serve them safely (no embedded scripts).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
