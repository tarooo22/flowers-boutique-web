# 04 — Components

Shared, reusable components (no duplicated card/header variants).

## UI primitives (`src/components/ui`)

- `Button` — polymorphic (renders `<button>` or Next `<Link>`); variants
  `primary | dark | outline | ghost | light`, sizes `sm | md | lg`.
- `IconButton` — round header action with optional count badge.
- `ProductCard` — **single** card used everywhere: 3:4 media, wishlist chip
  (top-right), quick-add (bottom-right, reveal on hover / always on mobile),
  Sale/New/Sold-out badges, uppercase title, muted subtitle, `Price`.
- `ProductGrid` — 2→3→4 responsive columns, 20px gap.
- `Price` — body font, `₾`, optional struck compare-at.
- `FavoriteButton` — wishlist toggle (store-backed, floating or bordered).
- `QuantityControl` — accessible − / value / + stepper.
- `SectionHeader`, `Breadcrumbs`, `Icons` (thin-line SVG set).

## Layout (`src/components/layout`)

`AnnouncementBar`, `Header` (sticky, scroll shadow), `Logo`, `DesktopNav`,
`MobileNav` (left drawer), `HeaderActions`, `Search` (overlay w/ live results),
`LanguageSelector`, `ContactStrip` (dark pre-footer CTA), `Footer`.

## Feature components

- `home/` — `Hero` (slider + stats rail), `CategoryChips`, `ProductSection`,
  `CashbackBanner`, `EditorialSection`, `JournalSection`.
- `catalog/` — `CatalogView` (URL-synced filters/sort/pagination),
  `FavoritesView`.
- `product/` — `ProductGallery`, `ProductInfo`, `RelatedProducts`.
- `cart/` — `CartDrawer` (right slide-in), `CartView` (full page).
- `checkout/`, `account/` — forms with mock submission.

## State

`src/lib/store.tsx` — one `StoreProvider` holding cart + wishlist + UI drawer
state, persisted to `localStorage` (`fb_cart_v1`, `fb_favorites_v1`), hydrated
after mount to avoid SSR mismatch.
