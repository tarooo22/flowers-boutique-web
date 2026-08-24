import type { Metadata } from "next";
import { Noto_Sans_Georgian, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/brand";
import { ClientProviders } from "@/components/ClientProviders";
import { listLiveProducts } from "@/lib/production/catalog";

export const dynamic = "force-dynamic";
const siteUrl = "https://flower-shop-jx9auvvz.manus.space";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — Fresh bouquets delivered in Tbilisi`,
    template: `%s · ${brand.name}`,
  },
  description: brand.tagline,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    title: `${brand.name} — Fresh bouquets delivered in Tbilisi`,
    description: brand.tagline,
    siteName: brand.name,
    locale: "ka_GE",
    images: [{ url: brand.socialImage, width: 1200, height: 630, alt: `${brand.name} — florist studio in Tbilisi` }],
  },
  twitter: { card: "summary_large_image", title: `${brand.name} — Fresh bouquets delivered in Tbilisi`, description: brand.tagline, images: [brand.socialImage] },
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await listLiveProducts();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: brand.name,
    url: siteUrl,
    email: brand.email,
    telephone: brand.phone,
    address: { "@type": "PostalAddress", streetAddress: brand.address, addressLocality: "Tbilisi", postalCode: "0179", addressCountry: "GE" },
    openingHours: "Mo-Su 09:00-21:00",
    sameAs: [brand.social.instagram, brand.social.facebook],
  };
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-[var(--page)] antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <ClientProviders products={products}>{children}</ClientProviders>
      </body>
    </html>
  );
}
