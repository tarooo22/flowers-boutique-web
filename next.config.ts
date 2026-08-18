import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
