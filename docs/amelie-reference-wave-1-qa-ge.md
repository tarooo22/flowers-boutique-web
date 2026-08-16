# Amelie.ge visual parity — Wave 1 implementation and QA record

**სტატუსი:** დასრულებულია; შემდეგი implementation wave არ დაწყებულა.  
**Scope:** shared tokens, canvas/container, typography, announcement rail, header/search controls, footer, reusable ProductCard და Catalog visual shell.

> ვიზუალური reference არის Amelie.ge-ის საჯაროდ ხილული სისტემა; Flower’s Boutique-ის პროდუქტის მონაცემები, მარშრუტები, ფოტოგრაფია და ყველა business flow დარჩა source of truth. [1] [2]

## რეალურად განხორციელებული tokens

| კატეგორია | დამტკიცებული/განხორციელებული მნიშვნელობა | Deviation |
|---|---|---|
| Canvas | `#FBF7EE` | არ არის |
| Soft surfaces | `#F3EDDF`, `#EAE2CE`, `#FFFFFF` | არ არის |
| Text | `#1A1A1A`, `#3A3A38`, `#6B6B63` | არ არის |
| Action | `#FF5A3C`, hover `#E0442A`, ink `#D13B22` | არ არის |
| Positive state | `#14532D`, `#E3EFE7` | არ არის |
| Borders/scrim | `rgba(26,26,26,.12)`, `rgba(26,26,26,.055)`, `rgba(26,26,26,.42)` | არ არის |
| Container | `1280px` class, rendered inner clamp `1232px` | არ არის |
| Motion | `200/250/300ms`, measured easing tokens | არ არის |
| Typography | `Noto Sans Georgian` + public `Space Mono` labels | Display font განსხვავდება: observed Mersad/Amelie family არ დაკოპირდა, რადგან მისი გავრცელებული public licensing evidence არ არის შესაფერისი production re-use-სთვის. |

## განხორციელებული visual corrections

| ზედაპირი | განხორციელებული ცვლილება | შენარჩუნებული behavior |
|---|---|---|
| Global canvas | ერთიანი final stylesheet, Tailwind/shadcn aliases, exact gutter/container tokens | route/data state არ შეცვლილა |
| Header | dark 32px rail, ivory sticky shell, restrained scroll shadow, compact controls, reference-like language pill და mobile two-row nav | navigation, language, search, account, wishlist, cart, admin და skip-link უცვლელია |
| Footer | near-black columns/legal rhythm და coral delivery CTA; მოძველებული high-priority footer declarations მოიხსნა clean cascade-ისთვის | Flower’s Boutique contact/legal/auth-admin entries უცვლელია |
| ProductCard | `4/5` portrait media, upper-right circular favourite action, restrained type/price/action hierarchy, shadow-free surface | names, pricing, wishlist, variant branching, add callback და routes უცვლელია |
| Catalog | chip/filter/search/sort visual treatment და responsive `2/2/2/3/4/4` grid | URL state, search, category, price, availability, sorting, pagination და `products.catalog` input უცვლელია |

## Screenshot comparison evidence

Final full-page screenshots of `/` and `/catalog` were captured after the final footer-cascade correction. The comparison prioritised macro layout, container width, header geometry, card/image proportions, spacing and color hierarchy before micro-detail.

| Viewport | Reference target | Final local observation | Result |
|---:|---|---|---|
| 375px | 16px gutter, 154px mobile header, 2 columns, 12px grid gap | Dark rail + two-row header visually presents the measured mobile density; Catalog renders two cards across with narrow gaps and no horizontal overflow | Pass within Wave 1 scope |
| 430px | 16px gutter, 154px mobile header, 2 columns, 12px gap | Same two-row control/nav composition; cards stay portrait-first and footer stacks safely | Pass within Wave 1 scope |
| 768px | 24px gutter, 87px intermediate header, 2 columns | Header collapses to rail + 55px control row; Catalog remains two columns with 12px gap | Pass within Wave 1 scope |
| 1024px | 24px gutter, compact 65px desktop shell, 3 columns, 18px gap | Desktop nav resumes; Catalog renders three product columns and the horizontal filter surface | Pass within Wave 1 scope |
| 1440px | 1232px inner content within 1280px shell, 4 columns, 18px gap | Content is clamped with whitespace outside the shell; Catalog has four fixed-density columns; footer uses final coral CTA | Pass within Wave 1 scope |
| 1920px | Clamp maintained; no card stretching; 4 columns | Extra width becomes whitespace and the product grid remains four columns | Pass within Wave 1 scope |

## Corrective pass prompted by screenshot review

The first final desktop review showed that a pre-existing `!important` block in `index.css` still overrode the new footer delivery CTA. The block was converted to ordinary declarations. The re-captured 1440px screenshot confirmed the reference-measured coral CTA and dark footer hierarchy now win through a clean final cascade. A complete final screenshot set was then taken at all six required widths.

## Functional regression record

The new `server/ui.wave1-reference-contract.test.ts` asserts the locked tokens, typography import, deterministic header/grid breakpoints, reduced-motion behavior and preserved code paths for language switching, cart opening, search navigation, catalog query/URL synchronization, pagination, localized product names, wishlist persistence, quick add and product-route navigation. The full suite also passed after the final CSS correction.

| Validation | Result |
|---|---|
| `pnpm check` | Passed |
| Focused Wave 1 Vitest file | 5 passed |
| Full `pnpm test` | 37 files passed, 3 skipped; 168 tests passed, 10 skipped |
| `pnpm build` | Passed |
| Runtime console/network QA | No new browser-console errors or failed network responses found in the final log review |

The build continues to emit a Vite bundle-size advisory for an existing minified chunk above 500kB. This Wave 1 uses only CSS/font-head changes and does not introduce a new JS chunk; code-splitting is therefore documented as outside this strictly visual scope.

## Remaining reference-parity differences

Home, ProductDetail, Checkout, Profile and Admin were not redesigned because they are explicitly outside Wave 1. Therefore, their full page layouts and editorial modules retain earlier Flower’s Boutique presentation. The shared header/footer/card/canvas system now provides the intended reference-oriented visual foundation for later approved waves. The Flower’s Boutique wordmark, product imagery, copy and filters remain deliberately distinct because they are business/brand source-of-truth content rather than reference assets.

## Protected areas confirmation

| Protected area | Changed? |
|---|---|
| Server/business logic | **NO** |
| Cart contract | **NO** |
| Checkout behavior | **NO** |
| Routes | **NO** |
| SEO behavior | **NO** |
| Database schema/API contracts | **NO** |
| Product data/imports/photography | **NO** |
| Brand wordmark | **NO** |

## References

[1]: https://amelie.ge/ "Amelie.ge homepage"
[2]: https://amelie.ge/catalog "Amelie.ge catalog"
