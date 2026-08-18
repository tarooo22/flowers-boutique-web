import type { Metadata } from "next";
import { Noto_Sans_Georgian, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/brand";
import { ClientProviders } from "@/components/ClientProviders";
import { listLiveProducts } from "@/lib/production/catalog";

export const dynamic = "force-dynamic";

const body = Noto_Sans_Georgian({
  subsets: ["latin", "georgian"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flowersboutique.co"),
  title: {
    default: `${brand.name} — Fresh bouquets delivered in Tbilisi`,
    template: `%s · ${brand.name}`,
  },
  description: brand.tagline,
  openGraph: {
    type: "website",
    title: `${brand.name} — Fresh bouquets delivered in Tbilisi`,
    description: brand.tagline,
    siteName: brand.name,
  },
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await listLiveProducts();
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-[var(--page)] antialiased">
        <ClientProviders products={products}>{children}</ClientProviders>
      </body>
    </html>
  );
}
