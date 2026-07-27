/**
 * JSON-LD Structured Data Helpers
 * Generate schema.org compliant JSON-LD for better SEO and rich snippets
 */

import { siteContact } from "./siteConfig";

export interface Product {
  id: number;
  name: string;
  description?: string;
  priceMin: number;
  priceMax: number;
  image?: string;
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Variant {
  name: string;
  price: number;
  color?: string;
  isAvailable: boolean;
}

const BASE_URL =
  import.meta.env.VITE_SITE_URL || "https://flowers-boutique.example";

/**
 * Generate Product schema JSON-LD
 * Includes pricing, availability, images, and variants
 */
export function generateProductSchema(product: Product, variants?: Variant[]) {
  const offers = [];

  // Add main product offer
  if (product.priceMin === product.priceMax) {
    offers.push({
      "@type": "Offer",
      price: product.priceMin.toString(),
      priceCurrency: "GEL",
      availability: product.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${BASE_URL}/product/${product.id}`,
    });
  } else {
    // Price range
    offers.push({
      "@type": "AggregateOffer",
      priceCurrency: "GEL",
      lowPrice: product.priceMin.toString(),
      highPrice: product.priceMax.toString(),
      availability: product.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${BASE_URL}/product/${product.id}`,
      offerCount: (variants || []).length || 1,
    });

    // Add variant offers
    if (variants && variants.length > 0) {
      variants.forEach(variant => {
        offers.push({
          "@type": "Offer",
          name: variant.name,
          price: variant.price.toString(),
          priceCurrency: "GEL",
          availability: variant.isAvailable
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${BASE_URL}/product/${product.id}`,
        });
      });
    }
  }

  const schema: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    url: `${BASE_URL}/product/${product.id}`,
    image: product.image || `${BASE_URL}/default-product.jpg`,
    offers: offers.length === 1 ? offers[0] : offers,
  };

  // Add rating if available
  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    };
  }

  return schema;
}

/**
 * Generate Breadcrumb schema JSON-LD
 * Helps search engines understand site hierarchy
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Organization schema JSON-LD
 * Provides business information to search engines
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Flower’s Boutique",
    url: BASE_URL,
    logo: `${BASE_URL}/brand/flowers-boutique-logo.png`,
    description:
      "Premium flower shop in Tbilisi offering fresh bouquets, arrangements, and flower delivery services",
    sameAs: [siteContact.facebook, siteContact.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteContact.phone,
      email: siteContact.email,
      contactType: "Customer Service",
      availableLanguage: ["Georgian", "English"],
    },
  };
}

/**
 * Generate LocalBusiness schema JSON-LD
 * Optimized for local search and Google Maps
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Flower’s Boutique - Premium Flower Shop",
    image: `${BASE_URL}/brand/flowers-boutique-logo.png`,
    description:
      "Premium flower shop in Tbilisi offering fresh bouquets, arrangements, and flower delivery services",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteContact.address,
      addressLocality: "Tbilisi",
      addressCountry: "GE",
    },
    url: BASE_URL,
    telephone: siteContact.phone,
    email: siteContact.email,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    sameAs: [siteContact.facebook, siteContact.instagram],
  };
}

/**
 * Generate WebPage schema JSON-LD
 * For product detail pages
 */
export function generateWebPageSchema(
  title: string,
  description: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    isPartOf: {
      "@type": "WebSite",
      name: "Flower’s Boutique",
      url: BASE_URL,
    },
  };
}

/**
 * Render JSON-LD script tag
 * Use in React component: <div dangerouslySetInnerHTML={{ __html: renderJsonLd(schema) }} />
 */
export function renderJsonLd(schema: any): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
