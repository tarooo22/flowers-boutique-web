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
