# Homepage Pass 2 — Interaction Regression Record

## Browser smoke-check

| Flow | Result | Evidence |
|---|---|---|
| Language switch | PASS | The Home header language control switched the page from Georgian to English. The document title, hero, chips, rail labels and editorial content re-rendered in English without a route change. |
| Header cart drawer | PASS | The header cart control opened the empty Cart drawer over the Home page; the close control restored the Home view. No cart item was created or removed. |
| Hero rotation | PASS | Successive Home snapshots displayed the existing localized hero slides while preserving CTA, metrics and layout. |
| Search dialog | STATIC CONTRACT PASS | `Navbar.tsx` retains `setSearchOpen(true)` and the search submit route contract. Direct browser re-snapshotting timed out after the successful language/cart checks, so no further live click was attempted. |
| Navigation, quick-add and mobile quick navigation | STATIC CONTRACT PASS | `home.pass2-interactions.contract.test.ts` explicitly verifies catalog/builder/about/contact route controls, ProductCard quick-add, and `MobileBottomNav` catalog/wishlist/cart controls; 2/2 focused tests pass. |
| Pre-footer call/WhatsApp actions | STATIC CONTRACT PASS | The focused interaction contract verifies the distinct pre-footer action band precedes `Footer`, contains `phoneHref` and `siteContact.whatsapp`; 2/2 focused tests pass. |

## Note

The user browser extension returned HTTP 504 while refreshing the snapshot after the cart check. This was a browser automation timeout, not a client-side application error: TypeScript, the full test suite, the production build, HMR logs and screenshot capture remained healthy. The focused source contract was added to provide automated coverage for every protected control that could not be clicked live. No post, purchase, phone call, WhatsApp message or cart mutation was performed.
