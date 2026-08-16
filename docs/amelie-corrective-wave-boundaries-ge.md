# Corrective wave — presentation/business boundary map

## Reusable business logic retained

| Existing area | Retained contract | Presentation action |
|---|---|---|
| `Home.tsx` | `products.list`, `categories.list`, `useSEO`, localised copy, hero state, `quickAdd`, CartDrawer render | Legacy hero/category/builder/experience/delivery/contact section composition is replaced |
| `Navbar.tsx` | location routing, language state, `useAuth`, cart count events, search submit, mobile Sheet, ContactSheet, user/admin menu | Header and navigation DOM hierarchy can be rebuilt; callbacks and routes remain |
| `ProductCard.tsx` | `getProductName`, price policy, availability, variants choice, wishlist `localStorage`, `onAdd`, product route | Card DOM/media/text/action geometry is rebuilt |
| `Footer.tsx` | contact config, social destinations, legal/shop/account/admin links and identity | Grid/accordion/footer composition is rebuilt |
| `CartDrawer.tsx` | cart calculations, cart data, checkout entry | No changes in this corrective wave |
| `Catalog.tsx` / `ProductDetail.tsx` | filtering/sort/pagination/variant/gallery/cart/SEO behavior | Explicitly out of scope until user approval |

## Legacy presentation structures intentionally discarded

The existing Home’s large rounded builder promo, three-step delivery section, final contact banner, archive-reveal system, oversized category-gallery cards and current sequential editorial layout are not retained as the page’s composition. Current `p1-*` presentation classes will not be extended for the reconstructed areas; new neutral `am-*` classes will own the rebuilt shell.

## Data-safe reconstruction strategy

The rebuilt homepage will surface Flower’s Boutique’s own hero image pool, product image URLs, localized product/category names, prices, delivery values, site-contact records and existing routes. Occasions and editorial/service headings are only navigational or grouping copy and do not create inventory, promotions, rewards or customer claims that the business does not currently support.
