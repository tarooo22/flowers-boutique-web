# Customer-facing route override

Apply the canonical `MASTER.md` system to every customer-facing route, not just the homepage.

## Route groups

- **Commerce:** catalog, product detail, cart, checkout and wishlist. Keep photography and price first; actions must be immediately visible.
- **Account:** login, registration and profile. Use a calm, readable form surface with visible labels and a clear primary action.
- **Bouquet Builder:** retain the transparent-layer composition and price logic. Keep the canvas and order summary visually distinct, but use the same ivory, graphite and dusty-rose tokens.
- **Editorial / contact:** About and Contact use one strong real image at a time, never an invented testimonial or claim.
- **Information / payment status:** Delivery, returns, privacy, terms and payment status pages use compact readable copy, semantic success/warning/error colours, and a clear next action.
- **Discovery / SEO pages:** local flower, category and delivery pages use the same light surfaces, no yellow/pink gradient treatment, and their existing data/routing remain intact.

## Consistency rules

- Customer pages have the shared header, utility contact strip, mobile navigation and footer unless a focused transactional flow deliberately omits secondary navigation.
- Page backgrounds use `--surface-page`; cards use `--surface-card`; separators use `--border-default`.
- The sole primary action in a local context uses `--accent-primary`; semantic payment/error colours remain semantic.
- Use 8–12px card/image corners, thin borders and low-elevation shadows only where they clarify hierarchy.
- At mobile widths, never rely on hover, keep controls at least 44px, and preserve vertical reading order.
