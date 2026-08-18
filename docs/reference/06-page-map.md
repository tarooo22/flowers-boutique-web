# 06 — Page map

Homepage section order mirrors the reference composition:

1. Announcement bar
2. Header (sticky)
3. **Hero** — full-bleed slider, left text, CTA, dots, stats rail
4. Category chips — "What are you looking for?"
5. Product section — **Romance** (4 cards)
6. Product section — **Joy** (4 cards)
7. Product section — **Bestsellers** (4 cards)
8. **Cashback banner** — image + light-green content panel
9. **Editorial** — "We also teach and arrange" (2 overlay cards)
10. **Journal** — 3 article cards
11. Contact strip (dark) + Footer (dark, 4 columns)

## Routes

| Route                | Type   | Notes                                    |
| -------------------- | ------ | ---------------------------------------- |
| `/`                  | Static | Homepage                                 |
| `/catalog`           | Static | URL-synced filters/sort/pagination       |
| `/product/[slug]`    | SSG    | 24 products; gallery, variants, related  |
| `/cart`              | Static | Full cart page (drawer is global)        |
| `/checkout`          | Static | Form + summary, mock submission          |
| `/favorites`         | Static | Wishlist grid                            |
| `/account/login`     | Static | Front-end auth form                      |
| `/account/register`  | Static | Front-end auth form                      |
| `/about`             | Static | Studio, services, contact                |
| `/rewards`           | Static | Cashback/petals tiers                    |
| `/journal`           | Static | Article list                             |
| `/journal/[slug]`    | SSG    | 3 articles                               |
| `/_not-found`        | Static | 404                                      |

Reference parity was checked page-by-page (homepage, catalog, product, rewards)
against live screenshots before moving on.
