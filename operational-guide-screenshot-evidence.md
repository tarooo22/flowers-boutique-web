# Operational Guide Screenshot Evidence

## 2026-08-14 — Desktop public-storefront capture

The following public routes were captured in a full-page 1280×720 viewport. The capture deliberately excluded `/admin`, `/admin/orders`, `/admin/orders/:id`, and `/profile` to avoid exposing administrator, customer, order, payment, or account information.

| Group | Captured public routes | Visual confirmation |
|---|---|---|
| Commerce and editorial | `/`, `/catalog`, `/product/1`, `/cart`, `/checkout`, `/bouquet-builder`, `/about`, `/contact` | Homepage, catalog, product detail, empty-cart state, empty-cart checkout entry, builder interface, about, and contact layouts rendered. |
| Account, policy, and discovery | `/login`, `/register`, `/wishlist`, `/delivery`, `/returns`, `/privacy`, `/terms`, `/flower-delivery-tbilisi` | Anonymous account-entry forms, wishlist empty state, policy pages, and a representative SEO/discovery page rendered. |

These captures are presentation evidence only. No product was added to cart, no contact form was submitted, no account was created or accessed, and no order or payment operation was initiated.

## 2026-08-14 — Mobile public-storefront capture

The same public route groups were captured at a 390×844 mobile viewport. The capture confirms the compact navigation, account-entry screens, empty wishlist/cart states, information pages, responsive SEO content, and fixed/mobile-safe presentation of the public storefront.

| Group | Captured mobile routes | Privacy boundary |
|---|---|---|
| Core storefront | `/`, `/catalog`, `/product/1`, `/cart`, `/checkout`, `/bouquet-builder`, `/about`, `/contact` | No cart item, customer detail, delivery address, checkout form submission, or payment was created or submitted. |
| Account and information | `/login`, `/register`, `/wishlist`, `/delivery`, `/returns`, `/privacy`, `/terms`, `/flower-delivery-tbilisi` | Anonymous forms and published policy content only; no credentials were entered and no account/profile page was accessed. |

## 2026-08-14 — Remaining public route coverage

The remaining public discovery and payment-status routes were captured in both 1280×720 desktop and 390×844 mobile full-page formats.

| Route group | Captured routes | Interpretation boundary |
|---|---|---|
| SEO/discovery | `/flower-shop-tbilisi`, `/rose-bouquets`, `/lily-bouquets`, `/spray-roses`, `/birthday-flowers` | Public editorial and catalog-discovery content only. |
| Payment status | `/payment/success`, `/payment/fail`, `/payment/pending` | Static status surfaces were captured without a payment transaction, payment identifier, or personal order data. Card payment processing remains disabled/sandbox-only. |

The visual package now covers the public route map in desktop and mobile presentation. Authenticated pages remain intentionally excluded from screenshots because they can expose private personal, operational, or payment data.
