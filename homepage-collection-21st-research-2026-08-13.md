# Homepage Collection Discovery Research — 2026-08-13

## Scope

The requested homepage revision should separate public catalog discovery into clearly titled collection sections while keeping Flower’s Boutique’s Georgian-first content, public category routes, pricing, cart, wishlist, and product data intact. It should be an original implementation, not a reproduction of a third-party store.

## 21st Community Findings

The 21st Community Components catalog exposes relevant categories for product-discovery composition, including **Cards**, **Grids & Bento**, **Galleries**, **Images**, **Buttons**, **Links**, and **Carousels**. The catalog was reviewed at <https://21st.dev/community/components>.

The project-aware inspiration lookup returned metadata-only references that support three reusable principles: a compact collection header with a clear all-items link, consistent visual media frames, and a responsive card grid. The references were:

| Reference | Intended principle | Source |
|---|---|---|
| Product Card | Image-forward card hierarchy | <https://21st.dev/@ravikatiyar162/components/product-card-2> |
| Product Image Card | Bounded product media frame | <https://21st.dev/@ruixen.ui/components/product-image-card> |
| Card Grid | Consistent multi-column discovery rhythm | <https://21st.dev/@ravikatiyar162/components/card-grid> |

The free account had no remaining code retrievals during this review, so no third-party component source is copied into the project. The implementation should adapt only the general interaction and layout principles above using the project’s established `ProductCard`, design tokens, and responsive system.

## Public Category Metadata

The current public category table includes real entries for `Wedding bouquet` / `საქორწინო თაიგული` (ID 150001), `Bouquet` / `თაიგული` (ID 180001), and `Single Stems` / `ცალკეული ყვავილები` (ID 210001). These IDs will be used only to group products already returned by the public homepage query and to retain route-safe links of the form `/catalog?category=<id>`.
