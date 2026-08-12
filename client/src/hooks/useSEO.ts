/**
 * useSEO — lightweight per-page meta tag manager.
 *
 * Sets <title>, <meta name="description">, Open Graph, Twitter card,
 * canonical, and hreflang tags dynamically based on the current language.
 *
 * Usage:
 *   useSEO({
 *     titleKa: "კატალოგი | Flower’s Boutique",
 *     titleEn: "Catalog | Flower’s Boutique",
 *     descriptionKa: "...",
 *     descriptionEn: "...",
 *     canonical: "/catalog",
 *     ogImage: "/manus-storage/...",
 *   });
 */

import { useEffect } from "react";

const BASE_URL = (
  import.meta.env.VITE_SITE_URL || "https://flower-shop-jx9auvvz.manus.space"
).replace(/\/$/, "");
const DEFAULT_OG_IMAGE = `${BASE_URL}/flowers-boutique-hero-placeholder.svg`;

interface SEOProps {
  titleKa: string;
  titleEn: string;
  descriptionKa: string;
  descriptionEn: string;
  /** Path relative to root, e.g. "/catalog" */
  canonical?: string;
  /** Full URL or manus-storage path */
  ogImage?: string;
  /** Schema.org JSON-LD object(s) to inject as a <script> tag */
  structuredData?: object | object[];
  lang?: "ka" | "en";
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.href = href;
}

const STRUCTURED_DATA_ID = "page-structured-data";

export function useSEO({
  titleKa,
  titleEn,
  descriptionKa,
  descriptionEn,
  canonical,
  ogImage,
  structuredData,
  lang = "ka",
}: SEOProps) {
  useEffect(() => {
    const title = lang === "ka" ? titleKa : titleEn;
    const description = lang === "ka" ? descriptionKa : descriptionEn;
    const image = ogImage
      ? ogImage.startsWith("http")
        ? ogImage
        : `${BASE_URL}${ogImage}`
      : DEFAULT_OG_IMAGE;
    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

    // Document title
    document.title = title;

    // html lang attribute
    document.documentElement.lang = lang;

    // Standard meta
    setMeta("description", description);

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", image, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", "Flower’s Boutique & Events", "property");
    setMeta("og:locale", lang === "ka" ? "ka_GE" : "en_US", "property");

    // Twitter
    setMeta("twitter:title", lang === "ka" ? titleKa : titleEn);
    setMeta("twitter:description", lang === "ka" ? descriptionKa : descriptionEn);
    setMeta("twitter:image", image);
    setMeta("twitter:card", "summary_large_image");

    // Canonical
    setLink("canonical", canonicalUrl);

    // hreflang
    setLink("alternate", `${BASE_URL}${canonical ?? ""}`, "ka");
    setLink("alternate", `${BASE_URL}${canonical ?? ""}`, "en");
    setLink("alternate", `${BASE_URL}${canonical ?? ""}`, "x-default");

    // Structured data
    if (structuredData) {
      let el = document.getElementById(STRUCTURED_DATA_ID) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement("script");
        el.id = STRUCTURED_DATA_ID;
        el.type = "application/ld+json";
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(
        Array.isArray(structuredData) ? structuredData : structuredData
      );
    }

    return () => {
      // Restore defaults when component unmounts
      document.title = "Flower’s Boutique";
      document.documentElement.lang = "ka";
    };
  }, [titleKa, titleEn, descriptionKa, descriptionEn, canonical, ogImage, lang, structuredData]);
}
