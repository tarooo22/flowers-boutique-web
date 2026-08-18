import { permanentRedirect } from "next/navigation";

/**
 * Legacy public route retained for bookmarks and external links from the
 * pre-migration storefront. The new primary codebase uses `/builder`.
 */
export default function LegacyBouquetBuilderPage() {
  permanentRedirect("/builder");
}
