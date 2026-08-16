# Amelie.ge visual parity — Wave 1 implementation scope

**სტატუსი:** დამტკიცებულია implementation-ისთვის.  
**ვიზუალური source of truth:** Amelie.ge-ის საჯაროდ დაკვირვებადი design system.  
**business/data source of truth:** Flower’s Boutique-ის არსებული application, მონაცემები და კონტრაქტები.

> Wave 1 ცვლის მხოლოდ shared visual foundation-ს: design tokens, page canvas/container, typography, announcement rail, header/search controls, footer, reusable ProductCard და Catalog-ის შესაბამის visual shell-ს. ის არ იწყებს Home, ProductDetail, Checkout, Profile ან Admin-ის სრულ redesign-ს.

## დამტკიცებული გაზომილი tokens

| Alias | Locked value |
|---|---|
| `--fb-page` | `#FBF7EE` |
| `--fb-bone-2` / `--fb-bone-3` | `#F3EDDF` / `#EAE2CE` |
| `--fb-surface` | `#FFFFFF` |
| `--fb-ink` / `--fb-ink-soft` / `--fb-muted` | `#1A1A1A` / `#3A3A38` / `#6B6B63` |
| `--fb-action` / hover / ink | `#FF5A3C` / `#E0442A` / `#D13B22` |
| `--fb-positive` / surface | `#14532D` / `#E3EFE7` |
| `--fb-line` / soft | `rgba(26,26,26,.12)` / `rgba(26,26,26,.055)` |
| `--fb-scrim` | `rgba(26,26,26,.42)` |
| Shell | `1280px` class with 16px (375/430) and 24px (768/1024+) gutters |
| Motion | `200ms`, `250ms`, `300ms`; `cubic-bezier(.23,1,.32,1)` / `cubic-bezier(.32,.72,0,1)` |

## Deterministic responsive targets

| Width | Header composition | Catalog grid | Gap |
|---:|---|---:|---:|
| 375px | 154px total; 32px rail + 64px control row + 58px nav row | 2 | 12px |
| 430px | 154px total; 32px rail + 64px control row + 58px nav row | 2 | 12px |
| 768px | 87px intermediate composition | 2 | 12px |
| 1024px | 65px compact desktop shell | 3 | 18px |
| 1440px | 65px compact desktop shell; content clamped | 4 | 18px |
| 1920px | 65px compact desktop shell; extra width is whitespace | 4 | 18px |

## Typography decision

`Noto Sans Georgian` remains the Georgian UI/body family. `Space Mono` is loaded from Google Fonts under the SIL Open Font License for compact labels/metadata. The observed Mersad/Amelie display families are not introduced because the discovered public distribution/licensing evidence is not suitable for this production use; display geometry will use a tuned `Noto Sans Georgian` fallback rather than copying font assets.

## Protected areas

Server routers, database schema, API contracts, route names, `cartUtils.ts` identity/schema, checkout submission/delivery fee/payment guards, authentication, product data/imports, product photography, brand wordmark, SEO canonicals/structured data/alternate-language metadata and translation semantics are outside Wave 1. Existing interaction callbacks and URL-query synchronization must remain untouched.

## Accepted deliberate deviations

Flower’s Boutique’s wordmark, content, product imagery, contact details and legal/business text stay unchanged. Reference typography is approximated with lawful public fonts because proprietary or personal-use-only font files cannot be copied into the project.
