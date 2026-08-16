# Homepage Visual Parity Pass 2 — section-by-section source map

The public Amelie homepage is treated as the structural reference. Flower’s Boutique retains its own brand, inventory, images, copy, routes, and business behavior. The mapping below therefore specifies **geometry and position**, not copying Amelie’s commercial content. [1]

## Measured desktop sequence

At 1440px and 1920px, the reference has a 35px information strip, a 65px main header, and an 864px hero. Its next direct major blocks start at 964px, 1067px, 1650px, 2234px, 2819px, 3133px, and 3603px; footer starts at 4082px. The local baseline has a 101px header, a 668px hero, and footer at approximately 5000px. [2]

| # | Amelie reference geometry | Flower’s Boutique content placed into the same role | Pass 2 local implementation target |
|---:|---|---|---|
| 00 | 35px dark information rail | Existing Flower’s Boutique delivery/free-delivery facts | Match rail height, density and placement; do not copy Amelie’s values. |
| 01 | 65px ivory header, wordmark/nav/actions in one row | Existing brand wordmark, public routes, language/search/account/wishlist/cart actions | Match reference header height, alignment, gaps and icon spacing. |
| 02 | 864px image-led hero, editorial copy, CTA, dots and three-stat rail | Existing Flower’s Boutique hero images/copy/catalog CTA/delivery facts | Match hero height, crop, overlays, left copy column, CTA and metric geometry. |
| 03 | ~103px prompt plus horizontally constrained chips | Existing Flower’s Boutique occasions/categories | Match prompt/chip heights, baseline and overflow. |
| 04 | ~584px product rail 01 | Flower’s Boutique love/occasion products | Match visible card count, rail width, 4-card desktop geometry and horizontal behavior. |
| 05 | ~584px product rail 02 | Flower’s Boutique joy/occasion products | Same reference card/heading/view-all geometry. |
| 06 | ~586px product rail 03 | Flower’s Boutique selected products | Same reference card/heading/view-all geometry. |
| 07 | ~314px wide light promotional banner | Flower’s Boutique bouquet-builder or delivery value proposition | Replace dark split banner with a light/pastel horizontal image-plus-content card. |
| 08 | ~470px paired editorial/service cards | Existing florist studio / event styling routes | Match card count, overlay, image ratio, text placement and gutter. |
| 09 | ~439px journal row | Existing Flower’s Boutique guidance/editorial links | Match three-column image/text card geometry. |
| 10 | narrow pre-footer contact/quick action band | Existing Flower’s Boutique phone, messaging and opening-hours actions | Add new measured contact bar before footer; no copied contact data. |
| 11 | ~452px dark footer and legal band | Existing contacts, shop/info/legal/account/admin links | Rebuild container/columns/legal rhythm to reference geometry. |

## Mobile reference sequence

At 375px, the reference header begins after a 53px information strip and is 154px tall; the 585px hero begins at y=207 and sections then start at y=792, 995, 1742, 2472, 3049, 3503, and 4124. The reference footer begins at y=5138. At 430px, the same header begins at y=53 and is 154px tall; hero height is 648px. [2]

This means mobile cannot simply inherit a shrunken desktop grid. In Pass 2, chips, product rails, the light promo card, editorial cards, contact bar and footer will be rearranged to the measured mobile section sequence.

## Implementation exclusions

Catalog, ProductDetail, CartDrawer markup, checkout, API procedures, server routes, database/schema, product data, pricing, availability, localization, auth and admin logic are outside this mapping.

## References

[1]: https://amelie.ge/ "Amelie.ge — public homepage visual reference"

[2]: `/home/ubuntu/amelie-audit-notes/pass2/section-summary.md` "Fresh normalized Pass 2 six-viewport geometry capture"
