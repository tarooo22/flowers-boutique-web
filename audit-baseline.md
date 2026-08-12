# Flower’s Boutique — Initial Audit Notes

## Governing Specification

This audit is governed by the user-provided source file [`/home/ubuntu/upload/pasted_content.txt`](../upload/pasted_content.txt). It requires a phase-based refinement of the existing React/Vite/TypeScript, Express, tRPC and Drizzle application rather than a blind rebuild. Georgian remains the default language, English is secondary, and the brand name remains `Flower’s Boutique`.

Non-negotiable constraints recorded from that specification are: keep existing working business logic; preserve secure sessions, server-side pricing, protected admin procedures and address ownership; keep BOG/card payments disabled until official merchant configuration is supplied; use only actual configured business/contact/catalogue data; never fabricate reviews, ratings, delivery promises, product stock or product images; preserve SEO routes and functionality; and do not surface credentials, tokens or personal information.

The requested visual system is light, warm, editorial and product-focused, with real flower photography providing most colour. The supplied palette calls for a warm off-white page, warm cream panels, dark neutral text, restrained dusty rose, botanical sage and sparing warm-gold accents; it excludes a dark luxury treatment, saturated gradients, excess decoration, heavy glass/blur, excessive shadows and artificial animation. The desktop wordmark must prioritise `Flower’s Boutique` with the Georgian subtitle `ყვავილების ბუტიკი`; the existing circular mark may remain as a small secondary detail only.

The acceptance workflow requires a recorded baseline, controlled implementation phases, validation of the actual application across desktop and mobile sizes, updated build/check/test results, and real screenshots rather than mockups. The user has asked not to auto-deploy or auto-merge; the managed project is currently configured with automatic publication upon checkpoint creation, so no release checkpoint will be created until the intended implementation phase is verified and ready for explicit handoff.

## Verified Technical Baseline

The local development server is running. The current database contains only the runtime tables `authSessions`, `banners`, `categories`, `orders`, `products`, and `users` (plus Drizzle's migration table). The code-level schema additionally declares `productImages`, customer-address/order tables, and SEO tracking tables, but those tables are not present in the current database. The product-media relation must therefore be planned as a forward, additive migration only after the existing public catalogue data and current image URLs are reconciled.

The active TypeScript check reports 34 pre-existing failures inside `server/seoRankingTracker.ts`: it inserts `impressions` (and related incompatible shapes) into `keywordRankings`, whereas the Drizzle schema exposes only `keywordId`, `rank`, `searchVolume`, `difficulty`, and `createdAt`. This mismatch is unrelated to the existing public rendering work, but it blocks a clean type-check and needs a schema/implementation decision before final validation.

The data layer recalculates checkout item pricing from the product record on the server before persisting a canonical order. Profile and address operations are protected, and address updates/deletions are scoped to the authenticated owner. Admin product/category/banner and order-list operations are behind the `adminProcedure`; the existing admin order delete operation is a hard delete and must not be invoked during this audit or later refinement without an explicit, separate business decision.

The current live homepage confirms the primary catalogue issue: all five displayed featured product image URLs point to `example.com` placeholders rather than persistent Flower’s Boutique assets, while the hero and editorial images load from local public paths. The next catalogue phase must therefore replace public product media data with the already uploaded persistent mappings, rather than introducing synthetic imagery or a client-only fallback. The live navigation, Georgian copy, catalogue/category links, bouquet-builder entry point, contact links and footer are present. Screenshot evidence is recorded at `/home/ubuntu/screenshots/flower-shop-jx9auvvz_2026-08-11_22-45-02_7085.webp`.

Current preview screenshots at 375px confirm that the present source has a compact menu trigger and hides the desktop navigation at the expected mobile breakpoint; the older uploaded mobile capture does not fully reflect the current stylesheet. The current mobile implementation also includes a persistent bottom navigation; it is not required by the uploaded specification, which defines the header as menu, compact wordmark, search, and cart plus a full-height menu sheet. Its usefulness and duplication with the header need an explicit design reconciliation before any navigation refactor. The current preview also confirms that catalogue and product-detail pages render the same empty branded media tile and that the bouquet-builder shell stays usable while its flower dataset remains incomplete.

The first canonical `/manus-storage/products/...` reference from the supplied public CSV resolves through the published site to a storage request that returns `AccessDenied` instead of image bytes. The supplied CSV values therefore cannot be assumed to be valid current public URLs. Before seeding, the canonical source asset archive and its persistent WebDev upload mapping must be located or rebuilt from user-supplied originals; this prevents replacing one placeholder state with broken external media.

The original user-supplied deployment archive contains 186 files under its product-media directory. Of the 163 distinct image basenames referenced by the supplied public product CSV, 143 match a basename in that archive exactly. This gives a high-confidence, non-synthetic source for most catalogue images, while 20 distinct CSV references need a deliberate reconcile path before import. The importer must emit a structured unmatched-media report and must not silently substitute one product's photograph for another.

Media reconciliation was repeated with a quoted-CSV parser and the ZIP's actual `uploaded-assets/photos/products` directory. The supplied public catalog contains 165 products: 160 have a unique exact archive-photo match, and 5 have no matching original file (`1710001`, `1710002`, `1740001`, `1740002`, `1740003`). The 160 matched image files were successfully extracted from the user-provided archive to `/home/ubuntu/webdev-static-assets/flowers-boutique-catalog/products` (13,517,528 bytes total). The five unmatched records are preserved in the external reconciliation report and will remain explicitly image-unavailable until the user supplies their canonical original files; no substitute image will be assigned.

## Uploaded Homepage Screenshot: First Verified Findings

The desktop homepage screenshot shows a light, editorial layout with a dark utility strip, a navigation header, a split hero and an image-led composition. The existing hero image renders correctly and supports the intended warm floral direction. The visible header already contains catalogue, bouquet builder, about and contact links, language controls, account, favourites and cart actions.

The primary visual issues confirmed in the first two vertical screenshot regions are: the circular logo remains prominent in the desktop header despite the requested typography-first wordmark; the wordmark does not visibly include the requested Georgian subtitle; and there is a large unproductive gap between the category navigation and featured-product section. Further screenshot regions must be inspected before drawing conclusions about product imagery, lower homepage sections, mobile layouts, and remaining routes.

The next two screenshot regions confirm a critical catalogue presentation defect: all five visible featured-product cards show the branded beige fallback tile rather than their product photography. Product names and price ranges render, as do wishlist and cart controls, which indicates a media-resolution/data-mapping problem rather than an empty product query. This visual failure directly conflicts with the supplied photography-first product-card requirement and is the highest-priority storefront repair.

The bouquet-builder promotion uses a real floral editorial image, pale rose panel, Georgian copy and a clear call-to-action. It is visually coherent with the requested warm, refined direction. The following order-process section starts after a noticeably oversized vertical gap; the final layout should retain the real promotional asset while tightening spacing only after responsive verification.

The order-process cards are visibly legible and use neutral iconography, restrained borders and a three-step hierarchy. The brand-story section uses authentic flower-shop photography rather than generated product imagery. The light contact panel renders configured contact methods and the displayed phone number, so its content should be kept data-driven and not replaced by invented business information. The current homepage uses several large vertical intervals; those should be calibrated against desktop and mobile screens rather than uniformly compressed.

The footer remains light and structured, but repeats the circular logo as a prominent visual element next to the English wordmark. It contains visible contact details, social links, policy links and a supported copyright notice. The requested final identity should make the typography treatment primary while retaining the circle mark only as an optional small seal or footer accent.

## Mobile Screenshot: Verified Findings

The mobile capture does not use a true small-screen navigation pattern: the desktop navigation links, language control and utility icons remain horizontally compressed in the header. This causes the wordmark and Georgian menu labels to render at impractically small sizes. The hero itself becomes a readable image-backed banner, but it no longer matches the desktop split-hero hierarchy. The category treatment in the following section also becomes disproportionately oversized and visually cramped. Mobile refinement must introduce a compact menu trigger and preserve readable brand, navigation and control sizing without changing navigation destinations.

The following mobile region shows the brand-story image and Georgian content at a usable scale, confirming that the photographic assets themselves can display on mobile. Further regions are required to confirm the product cards and footer.

The lower mobile region shows four values/service cards and a compact delivery call-to-action. The card labels are readable, but their body copy is too dense for their width. The footer does responsively stack into a small grid; however, its body copy, contact details and legal links are rendered noticeably too small to satisfy the requested touch-target and body-text standards. Mobile adjustments should increase minimum text sizes and interactive target areas without introducing a floating bottom bar or changing current footer destinations.

## Other Uploaded Screens: Verified Findings

The catalogue screenshot confirms the same product-image-resolution failure across its full grid: five product cards have names, prices, filter counts and action icons, but all use the branded placeholder rather than actual product media. The sidebar filtering and sort control already exist, so the appropriate repair is to correct data/media mapping and preserve those interactions.

The bouquet builder has a structured three-step composition, visual/AI mode segmentation, selected-flower summary, live price panel, wrapping colour swatches and packaging options. Its empty state and disabled add-to-cart control appear intentional before selection. This existing functionality should be preserved and only improved after real product data makes flower choices available.

The AI bouquet-builder view renders authentic example bouquet images and a clear prompt-led empty state. Its search/filter area shows zero flowers, confirming that the incomplete public catalogue is now also constraining AI/visual bouquet selection. This is a data-completion issue, not a reason to invent default bouquet selections.

The contact page has a well-defined split layout with contact details, a map-area callout, social routes and an enquiry form. It uses configured phone, email, address and business-hours content. The hero title remains readable at the supplied desktop width, but the very large display scale requires mobile testing before any typography change.

The login and registration pages use a consistent card-on-photographic-backdrop treatment with Georgian labels, password visibility controls and clear account-switch links. These screenshots contain only generic placeholder text and do not expose credentials. The form controls appear visually usable at the captured viewport; accessibility and error-state labelling must be validated in the running app rather than inferred from static images.

The authenticated profile view provides tabs for profile information, addresses, orders and favourites, along with edit, password-change and sign-out controls. A real account capture was supplied for visual review; this audit deliberately does not reproduce its personal details. The cards currently apply a saturated gold fill that is inconsistent with the otherwise restrained floral palette; future visual adjustment should use the approved neutral/gold accents only after preserving the underlying account controls and access model.

The product-detail view exposes the same critical placeholder-media failure in the primary image and related-product card. Its product name, price range, quantity selector, availability, add-to-cart control, delivery information and details grid render. Correcting image resolution and replacing placeholder media with mapped real images is therefore the primary improvement before any merchandising redesign.

The cart drawer opens over the catalogue with an accessible-looking close affordance, a line item, quantity control, delete action, total and checkout action. The line item uses the same branded fallback tile, so repair of a single shared product-image resolver should correct the card, detail and cart media states together. Cart data must remain client/session state until checkout persists an order, and no card payment action should be enabled while BOG remains unconfigured for production.

## Evidence Recorded

| Source | Verified scope |
| --- | --- |
| `flower-shop-jx9auvvz.manus.space_(4).png`, tiles 1–2 | Desktop header, hero, category strip, and start of featured-products section |
| `flower-shop-jx9auvvz.manus.space_(4).png`, tiles 3–4 | Featured product-card imagery, prices, wishlist and cart controls |
| `flower-shop-jx9auvvz.manus.space_(4).png`, tiles 5–6 | Bouquet-builder promotion and start of order-process section |
| `flower-shop-jx9auvvz.manus.space_(4).png`, tiles 7–8 | Order-process cards, brand-story image, contact panel |
| `flower-shop-jx9auvvz.manus.space_(4).png`, tile 9 | Contact-panel conclusion and footer |
| `flower-shop-jx9auvvz.manus.space_(8).webp`, tiles 1–2 | Mobile header/hero, category strip, and brand-story section |
| `flower-shop-jx9auvvz.manus.space_(8).webp`, tiles 3–4 | Mobile value cards, delivery CTA, and footer |
| `flower-shop-jx9auvvz.manus.space_(5).webp` | Catalogue filters, sort control, product-card image state, and footer |
| `flower-shop-jx9auvvz.manus.space_(6).webp` | Bouquet-builder visual/AI mode, configuration controls and empty selection state |
| `flower-shop-jx9auvvz.manus.space_(7).webp` | AI bouquet-builder prompts, image examples, flower search and summary state |
| `flower-shop-jx9auvvz.manus.space_(9).webp` | Contact hero, contact methods, enquiry form and footer |
| `flower-shop-jx9auvvz.manus.space_(10).webp` | Login form and account access layout |
| `flower-shop-jx9auvvz.manus.space_(11).webp` | Registration form and account creation layout |
| `flower-shop-jx9auvvz.manus.space_(12).webp` | Authenticated profile tabs and account actions (visual review only; no personal data retained) |
| `flower-shop-jx9auvvz.manus.space_(13).webp` | Product-detail media, pricing, quantity, cart and related-product section |
| `flower-shop-jx9auvvz.manus.space_(14).webp` | Cart drawer, quantity/delete controls and checkout action |

## Catalog Recovery Implementation — 2026-08-11

The supplied public-catalog import was applied as a single explicit transaction. It upserted the 3 supplied categories and 165 supplied public products, with no customer, authentication, order, payment, or address table writes. The earlier five sample products were preserved but unpublished rather than deleted. Legacy-only categories remain in the database for referential safety and are now excluded from the public category feed because they have no published products.

Of the 165 public products, 160 have a verified one-to-one persistent media URL extracted from the supplied project archive and uploaded to project storage. Current preview screenshots confirm that those genuine images load on the homepage and catalog. The source archive contains no canonical asset for product IDs `1710001`, `1710002`, `1740001`, `1740002`, and `1740003`; these records deliberately remain image-unavailable and no unrelated flower photograph has been assigned.

## Post-Recovery Preview Validation — 2026-08-12

The desktop homepage, catalog, canonical product detail (`/product/60001`), bouquet builder, cart, login, and registration routes rendered successfully in the current preview after the public-catalog import. The detail route resolved its verified persistent source image while retaining existing pricing, availability, cart, wishlist, and related-product behaviour.

The catalog’s full-page capture shows genuine images in the initially visible cards. The lower cards retain native lazy loading; because a full-page capture does not scroll every card into its loading threshold, an empty tile below the initial viewport alone is not evidence that the persistent image URL is unavailable. The shared `FlowerImage` fallback now explicitly distinguishes the five source-unavailable records without assigning them misleading imagery.

## Header Refinement Validation — 2026-08-12

The live desktop homepage at 1280px now presents Flower’s Boutique as a modest, typography-led serif/italic wordmark rather than an image-led primary mark. The original four Georgian navigation destinations, search, language selector, account control, wishlist, and cart control remain visible and retain their existing destinations and behavior.

The live 375px viewport confirms the required compact mobile arrangement: the hamburger occupies the left grid column, the wordmark remains centered at a readable scale, and the cart stays isolated on the right. Neither visual capture showed overlap, clipped text, or displaced header actions. Keyboard-visible focus treatment and responsive sizing are protected by the focused `ui.header-contract` Vitest specification.

Full-page desktop and 375px mobile captures also confirm that the footer now uses the same typography-first Flower’s Boutique treatment. Existing social, contact, policy, account, and conditional admin destinations remain in their original footer groups; the mobile accordion hierarchy remains compact and visible without a duplicated image-led mark.

## Public Route Validation — 2026-08-12

Current 1280px preview captures verified the homepage, catalog, public product `60001`, visual bouquet builder, empty cart, login, registration, and wishlist routes. The catalog and product detail use persistent `/manus-storage/` product media; the sampled peony detail correctly renders its source image, price, availability, related-products section, wishlist control, and cart action. The bouquet builder still preserves its existing visual and AI modes, live selection controls, wrapping controls, and disabled empty cart action.

The empty-cart page displays its explicit Georgian empty state and collection recovery action, without exposing any customer data. The login and registration pages retain their existing form labels, password controls, and account-switch actions. The wishlist empty-state rendering and footer routes are also visually intact. These screenshot checks do not substitute for a live BOG payment submission, authenticated profile edit, or protected-admin authorization test; those checks remain intentionally separate and must use no real payment credentials or private order/customer data.

## Accessibility, Media, and SEO Contract Validation — 2026-08-12

The focused Vitest validation passed seven assertions across the header/footer, cart media, and SEO schema contracts. It verifies that the shared `FlowerImage` renderer handles catalog-derived media in the cart, cart drawer, and wishlist; that a persistent mapped `/manus-storage/` URL survives cart normalization; and that the explicit Georgian unavailable-image treatment only applies where a source image is unavailable. The visual-bouquet thumbnail path remains isolated from the ordinary product-image path.

The storefront has a keyboard-targetable skip link, a route-time `main-content` landmark target, labelled desktop and mobile navigation, labelled menu controls, and an explicit `:focus-visible` accent outline. Desktop and 375px screenshots recorded above confirm that the refined header/footer controls retain readable spacing and do not overlap. The full Vitest suite, a zero-error TypeScript check, and a production build passed after the refinements; the only build output was Vite’s informational large-chunk warning, not a compile failure.

The deployed database initially had none of the three canonical SEO tracking tables. A read-only schema inspection confirmed this gap, after which an idempotent additive migration created empty `seoKeywords`, `keywordRankings`, and `seoMonitoringTasks` tables without modifying customer, order, payment, catalogue, or authentication rows. A follow-up schema inspection confirmed all three tables and the canonical `rank`, `searchVolume`, and `difficulty` fields. Drizzle’s generated draft proposed only an unrelated `users.role` alteration, so it was reviewed and deliberately removed rather than executed; the applied migration is the dedicated, reviewed `drizzle/migrations/create_seo_tracking_tables.sql` file.

## Touch-Target and Checkout Media Validation — 2026-08-12

The refined header now enforces 44px minimum inline and block dimensions for icon, account, and language controls, while preserving the existing actions and desktop/mobile grid hierarchy. Fresh desktop (1280px) captures of the homepage and catalog, plus 375px captures of both routes, show no overlap, clipping, or displacement of the wordmark, menu trigger, language controls, or cart action. The design continues to use high-contrast dark text/icons on a warm light surface and a visible accent-colour keyboard outline.

Checkout order summaries are intentionally non-visual: cart line items retain their mapped persistent image URL as optional data, but the checkout summary renders name, quantity, and price without an image element. The focused tests verify both the URL-preservation contract and this no-image summary policy, so a valid product image cannot turn into a broken image or false unavailable state in checkout. No cart submission, BOG payment operation, customer lookup, or private order data was created during this validation.

## WCAG Contrast Contract Validation — 2026-08-12

The warm storefront accent token was refined from `#9c727a` to `#8b5f68` so the same brand colour satisfies **WCAG AA (4.5:1)** for normal interactive text on the actual white `#ffffff` and page `#faf9f7` surfaces. The new `accessibility.contrast` Vitest contract calculates relative luminance from the real CSS tokens and verifies AA contrast for primary text, secondary navigation text, accent text, and white-on-accent controls; it separately verifies the visible focus ring at the required 3:1 non-text threshold.

Fresh 1280px and 375px captures of the homepage and catalogue show the revised accent in its practical CTA, active navigation, and language-control contexts. The desktop and mobile grids remain free of overlap or clipped controls, while 44px header touch targets remain visually aligned with the existing quiet, product-focused design.

The measured contrast ratios are: primary ink `#282828` on white `#ffffff` **14.74:1**; secondary ink `#44413f` on white **10.13:1**; accent/focus `#8b5f68` on white **5.34:1**; accent on page surface `#faf9f7` **5.07:1**; and white on the accent control **5.34:1**. These exceed the 4.5:1 AA threshold for normal text and the 3:1 threshold for the focus indicator.

## Critical Route Regression Capture — 2026-08-12

Fresh 1280px captures confirm that the public product detail, visual/AI bouquet builder, empty cart, checkout, wishlist, login, and registration routes continue to render after the shared header, media, and contrast refinements. The sampled peony detail shows its persistent product image and existing unavailable/add-to-cart state; the bouquet builder retains both modes and product availability markers; empty cart and wishlist states retain their recovery actions. Login and registration retain their labelled account forms without exposing any real customer information.

An unauthenticated visit to `/admin` renders the existing Georgian access-denied state and a return action, confirming that the protected admin route remains gated. Checkout was observed as a non-submitting presentation only; no BOG request, payment attempt, customer lookup, profile modification, cart submission, or order creation was initiated by this audit.
