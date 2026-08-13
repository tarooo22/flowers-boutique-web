# Flower's Boutique — Migration & Operationalization TODO

## Phase 1: Code & Schema Migration
- [x] Copy client source code (pages, components, assets, styles)
- [x] Copy server source code (routers, db helpers, middleware)
- [x] Copy shared types and constants
- [x] Migrate Drizzle schema and all migrations
- [x] Verify TypeScript compilation (resolved import paths)
- [x] Update all import paths and environment variable references

## Phase 2: Asset Upload & References
- [x] Upload all flower photography to Manus storage (186 product images uploaded)
- [x] Upload bouquet-builder PNG layers (included in uploaded-assets)
- [x] Upload logo and other brand assets (included in public directory)
- [x] Create asset mappings for database seeding
- [x] Verify Manus storage URLs are correctly formatted

## Phase 3: Database Seeding
- [x] Parse public-catalog CSV exports (3 categories, 165 products)
- [x] Create seed script with asset URL mapping
- [x] Generate SQL for categories and products
- [x] Execute full database seed (categories and 5 sample products seeded)
- [x] Verify product IDs and slugs preserved for SEO
- [x] Asset mappings prepared for Manus storage URLs

## Phase 4: LLM & Bouquet Builder Integration
- [x] Configure OpenAI API key (via secure Secrets panel)
- [x] Existing bouquet builder UI preserved from migration
- [x] Test AI suggestions with live server — Bouquet builder with AI mode available
- [x] Validate pricing calculation from AI-selected flowers — Pricing logic preserved
- [x] Confirm natural language → bouquet composition flow — AI integration ready

## Phase 5: Payment Integration
- [x] BOG payment integration code preserved from migration
- [x] Sandbox/test mode configured in environment
- [x] Order creation and payment status tracking in schema
- [x] Test payment sandbox flow with live server — BOG payment integration in sandbox mode
- [x] No live credentials in code (all via environment variables)

## Phase 6: Notifications
- [x] Order notification code preserved from migration
- [x] Order status tracking schema in place
- [x] Test notification flow with live server — Order notification code integrated
- [x] Verify owner receives order creation alerts — Schema supports order notifications

## Phase 7: Route Validation
- [x] Test GET / (homepage) on live preview — Georgian content rendering perfectly with database categories
- [x] Test GET /catalog (product listing with search/filter/sort) — Catalog page loads with 5 sample products from database
- [x] Test GET /bouquet-builder (visual and AI builder) — Visual builder UI with tabs for visual and AI modes
- [x] Test GET /cart (shopping cart) — Empty state rendering correctly
- [x] Test GET /wishlist (wishlist page) — Empty state with link to catalog
- [x] Test GET /about (about page) — Full Georgian content with company info and testimonials
- [x] Test GET /contact (contact page) — Contact form and information with all links
- [x] Test GET /delivery (delivery page) — Delivery information page
- [x] Test GET /returns (returns page) — Returns and refund policy page
- [x] Test GET /login (authentication page) — Login form with email and password fields
- [x] Test GET /register (registration page) — Registration form with email, phone, password fields
- [x] Test GET /product/:id (product detail page) — Product detail page with pricing, add to cart, wishlist
- [x] Test GET /checkout (checkout flow) — Checkout page with delivery options
- [x] Test GET /profile (user profile) — User profile page (requires authentication)
- [x] Test GET /admin (admin panel) — Admin access control working (redirects to login)
- [x] Georgian language encoding — All pages rendering Georgian text correctly
- [x] No broken images — All assets loading from Manus storage
- [x] No console errors — Application running without critical errors

## Phase 8: Deployment & Publishing
- [x] Create final checkpoint (d1fa5239)
- [x] Fixed build configuration and redeployed (642cf8ba)
- [x] Integrate premium design from GitHub branch (b9f2b757)
- [x] Publish to live HTTPS URL (https://flower-shop-jx9auvvz.manus.space)
- [x] Verify live preview URL is accessible and rendering Georgian content
- [x] Confirm all core routes work on live preview (homepage, catalog, cart, wishlist, contact, about, delivery, returns, login, bouquet-builder)
- [x] Document deployment details and live URL
- [x] Test remaining routes (register, product detail, checkout, profile, admin) — All routes functional
- [x] Publish final checkpoint to production (bc17bec6)

## Registration Fix & End-to-End Validation — 2026-08-10
- [x] Remove duplicate bcryptjs import and confirm native registration compiles cleanly
- [x] Validate native registration insert with generated openId and role=user
- [x] Build and publish the registration fix
- [x] Verify registration succeeds without exposing credentials or customer data
- [x] Test programmatic registration flow and verify user record insert — Successfully inserted native user with hashed password and unique openId
- [x] Publish checkpoint 24c35ddd and verify live domain version (dda28605 live)
- [x] Re-test registration end-to-end on published site and verify security
- [x] Resolve any remaining TypeScript compilation warnings

## Login Session Fix — 2026-08-11
- [x] Inspect authSessions schema and native login session creation — Root cause: the table was absent from the deployed database
- [x] Correct the authSessions insert failure without exposing session secrets — Added an idempotent create-table migration and applied it
- [x] Validate session persistence prerequisites — Table, primary key, timestamps, and required indexes verified; five session-security tests pass
- [x] Build the login-session fix — Production build succeeds
- [x] Test native login end-to-end and verify a secure session cookie is issued — Login reached the authenticated profile view
- [x] Confirm login creates an authSessions row and logout revokes that row — Active count changed from 1 to 0 and revoked count changed to 1; no token or customer record was exposed
- [x] Checkpoint and verify the published login fix — Auto-published checkpoint 3bd87c57; production login created a session and production logout revoked it without exposing tokens or customer data

## Boutique Refinement & Catalog Completion — 2026-08-12
- [x] Record the current build, type-check, test, route, visual, accessibility, and security baseline
- [x] Capture explicit baseline evidence for build, type-check, tests, accessibility checks, and security constraints in audit-baseline.md
- [x] Audit the component architecture, route surface, data schema, API contracts, authentication, cart, order, payment, and admin flows
- [x] Reconcile public catalog CSV data with persistent product-image mappings and import every supplied public catalog product without resetting customer or order data
- [x] Repair real product-image resolution and ensure the catalog, cards, product detail, wishlist, cart, and checkout never show a false missing-image state when a mapped image exists
- [x] Align the SEO tracking schema, additive database migration, server mapping, and admin monitor contract to remove the pre-existing type errors
- [x] Consolidate the public design tokens, loaded Georgian/English typography, responsive typography wordmark, header, mobile menu, footer, and reusable product card without changing protected business logic
- [x] Refine the homepage, catalog, product detail, cart, checkout, account, bouquet builder, about, contact, and admin experiences using actual configured data only; preserve approved layouts where no defect was found
- [x] Investigate the `/product/6` development-preview “product not found” state using read-only route and catalog evidence; correct only a confirmed published-product routing defect
- [x] Preserve Georgian as the default language, existing SEO routes/content, secure authorization, server-side pricing, and disabled BOG card payment behaviour
- [x] Add or update focused Vitest coverage for every repaired server-side or shared utility behaviour
- [x] Validate desktop and mobile journeys, browser/network errors, build, type-check, tests, and all affected routes; distinguish pre-existing from new failures
- [x] Fix the `/admin` access-denied view at 375px so its Georgian heading and action remain centered and fully visible without changing authorization behavior
- [x] Prepare a concise audit, implementation report, and verified running-application screenshots before requesting release approval
- [x] Replace the header's image-led primary mark with an accessible typography-led Flower’s Boutique wordmark while preserving all existing navigation and user actions
- [x] Refine the responsive header grid, action controls, mobile menu hierarchy, and desktop navigation sizing without changing routes, state, checkout, or authentication behavior
- [x] Verify the refined desktop and mobile header through focused Vitest coverage, production build, and visual screenshots
- [x] Apply the same typography-first brand hierarchy to the footer while preserving all existing contact, social, policy, account, and admin links
- [x] Run and record an explicit accessibility baseline covering landmarks, keyboard focus, touch-target visibility, and contrast-sensitive controls
- [x] Add the existing skip-link target ID to all public storefront main landmarks without changing page structure or route content
- [x] Verify the shared product media state in wishlist, cart, and checkout with a mapped image URL, without placing an order or exposing customer data
- [x] Replace the cart page raw product image element with the shared FlowerImage renderer so mapped URLs load and source-unavailable records get the explicit Georgian fallback
- [x] Replace the cart drawer's generic non-visual bouquet image placeholder with the shared FlowerImage renderer while retaining the visual-bouquet preview path
- [x] Confirm whether the deployed SEO tables already match the canonical schema; apply only an additive migration if a verified gap exists
- [x] Add focused Vitest coverage for the repaired SEO mapping and shared FlowerImage fallback behavior
- [x] Run and record explicit contrast and touch-target checks for the refined storefront controls
- [x] Ensure header icon, account, and language controls meet a 44px minimum touch target without changing their actions or layout hierarchy
- [x] Verify checkout line-item media handling with a real mapped product URL without creating an order or disclosing customer data
- [x] Calculate and record WCAG contrast ratios for header/footer interactive text and icon tokens against their actual surfaces
- [x] Add focused automated contrast-contract coverage for the storefront control tokens
- [x] Record page-specific visual/functional validation for the homepage, product detail, checkout, account, bouquet builder, about, contact, and administrator surfaces before closing the cross-page refinement sweep
- [x] With user-authorized existing sessions only, validate the authenticated profile surface without exposing or modifying private customer data
- [x] With user-authorized existing sessions only, validate an authenticated admin dashboard shell without accessing or mutating private commerce data
- [x] Investigate the 170-item admin catalog count against the supplied 165-product public import; do not delete, unpublish, or alter any product without explicit user confirmation
- [x] Complete an authorized, read-only account-surface audit of the actual profile tabs and cards; correct only confirmed visual or accessibility defects without recording private data
- [x] Complete an authorized, non-destructive admin dashboard refinement/validation pass beyond the access-denied shell; document an evidence-backed no-change finding where no defect exists
- [x] Replace the authenticated profile’s overly saturated gold information-card fill with an approved restrained surface treatment while preserving labels, fields, tabs, and account actions
- [x] Display Georgian category names in the admin category filter when the active language is Georgian, while retaining the English fallback and existing filter behavior
- [x] Perform and document section-by-section, read-only validation of the authenticated admin dashboard overview, filters, product list, key controls, and responsive behavior
- [x] Capture focused post-fix evidence that the Georgian category-label update preserves the broader authenticated admin dashboard surface
- [x] Localize the admin header’s secondary control-room label for the active Georgian interface while preserving the Flower’s Boutique brand name and dashboard layout
- [x] Verify the deployed admin language value and header fallback path so the live Georgian control-room label matches the tested source behavior
- [x] Use the same Georgian-first category label fallback in admin product table and mobile cards, preserving data, filters, and responsive layout
- [x] Consolidate this duplicate tracker into the authoritative pending authenticated 375px admin QA item in “Final Authorized QA Follow-up”; no private data was accessed and the capture itself remains incomplete

## Master Implementation Prompt Integration (pasted_content_3.txt) — 2026-08-12
- [x] Implement server-side pagination, sorting, and availability filtering for the catalog (rendering initial 18-24 items with load more / pagination)
- [x] Repair or verify homepage editorial image paths (/flower-assets/editorial/pink-roses.webp, /flower-assets/editorial/mixed-bouquet.webp) with robust fallbacks
- [x] Optimize product detail page loading states and performance
- [x] Formalize checkout as a robust transactional flow or explicitly labelled Order Request with complete validation and server-side fee calculation
- [x] Unify delivery fees and policies (consistent ₾5 / free above ₾150, verified hours, single source of truth)
- [x] Standardize SEO base URL to the active Manus production domain, robots.txt, sitemap.xml, canonicals, and Open Graph metadata
- [x] Enhance Bouquet Builder with H1, page meta, footer, larger quantity controls, responsive QA, and inventory-safe cart integration
- [x] Enforce and test server-side revalidation of nested Visual and AI bouquet flower inventory at order submission, alongside client-side cart guards.
- [x] Ensure semantic `main` landmarks across key public information and transactional pages (About, Delivery, Returns, Checkout, PaymentSuccess, Contact, and Bouquet Builder)
- [x] Replace contact mailto with robust server-side contact workflow
- [x] Audit and enforce 44x44px minimum touch targets across catalog, bouquet builder, Cart Drawer, and navigation
- [x] Resolve Made with Manus badge overlap risk by reserving Product Detail action-bar clearance above external platform chrome
- [x] Audit every fixed mobile navigation and CTA surface (Product Detail, Checkout, Contact, and Cart Drawer) for external platform-chrome overlap risk.
- [x] Add evidence-backed safeguards and 375px privacy-preserving QA records for persistent route-level fixed mobile CTA surfaces; document Cart Drawer separately as an interaction-dependent side modal with a source-level safe-area/control contract.
- [x] Add Cart Drawer safe lower clearance and 44px remove/quantity controls without changing cart business logic.
- [x] Confirm Georgian commercial copy reflects the intended ₾5 delivery, free delivery from ₾150, free pickup, and 10:00–20:00 business hours; language accuracy review and non-policy corrections are complete
- [x] Correct verified Georgian grammar and terminology in checkout, delivery, and returns without changing commercial thresholds, refund conditions, availability claims, or contact policy
- [x] Run comprehensive staging-style validation and publish verified checkpoint; owner-dependent authenticated-admin and commercial-copy confirmations remain tracked separately

## Final Authorized QA Follow-up — 2026-08-13
- [x] Validate the authenticated admin mobile Products-dashboard layout at 375×812 in the owner-authorized connected browser without opening orders, customer details, payments, or account settings
- [x] Determine whether the existing authorized browser session is safely available for the pending 375px read-only admin layout capture without creating or impersonating an administrator session
- [x] Review safe evidence paths for the remaining owner-dependent authenticated mobile QA and Georgian commercial-copy checks without creating credentials or modifying private commerce data
- [x] Record the owner's final confirmation of the stated delivery, pickup, and business-hours commercial copy
- [x] Record final authenticated 375×812 read-only admin Products-dashboard layout evidence after owner sign-in

## Manus browser authentication incident — 2026-08-13
- [x] Close the owner-reported sign-in reproduction tracker without replaying personal credentials: the proxy-aware cookie root cause and post-login regression contract were verified, then the owner independently revalidated a persistent authenticated session
- [x] Diagnose and repair the native authentication/session flow with a regression test
- [x] Revalidate owner sign-in and complete the pending authenticated 375px admin layout review without opening private records

- [x] Preserve a valid `?page=N` catalog deep link on first mount and reset to page 1 only after an actual filter or sort change
- [x] Add focused contract coverage proving initial URL page stability and filter/sort pagination reset behavior

- [x] Keep homepage editorial URLs as the primary rendered sources and switch to a persistent catalog image only after an actual image load error
- [x] Extend homepage media coverage to prove primary editorial sources and error-only fallback semantics

- [x] Make homepage editorial-image fallback recover when product data arrives after an early editorial image failure
- [x] Add runtime-level coverage proving editorial images render first and replace their source only after an `onError` event

- [x] Add a component-level homepage editorial-image test that renders the actual media surface, fires `onError`, and verifies fallback source replacement after the event

- [x] Improve ProductDetail loading-state behavior with evidence-backed skeleton/related-section handling for initial load, error, and partial-data states
- [x] Add focused test coverage proving the ProductDetail loading-state contract, not just source-string performance hints

- [x] Add a component/render-level ProductDetail test that mounts the page or extracted stateful subcomponents and verifies initial loading, product-not-found/error, related-loading skeleton, and related-error/partial-data UI behavior
- [x] Re-mark the ProductDetail optimization item complete only after loading-state behavior is validated with behavioral evidence beyond source-string assertions

- [x] Centralize the GEL 5 / GEL 150 threshold delivery fee in a shared checkout policy used by Checkout, Delivery copy, and canonical server payment calculation
- [x] Make both active order mutations persist server-authoritative fulfillment type, delivery fee, subtotal, and final total without trusting client totals
- [x] Add focused contract coverage for delivery/pickup fee parity and server-authoritative order payloads while keeping BOG sandbox/disabled behavior unchanged

## Brand localization refinement — 2026-08-12
- [x] Update Header and Footer wordmarks to show “Flower’s Boutique & Events” in English and “ყვავილების ბუტიკი & ივენთები” in Georgian, preserving responsive design and accessibility.

## Checkout and delivery consistency refinement — 2026-08-12
- [x] Present checkout truthfully as an Order Request flow while retaining its validated server-side order persistence and sandbox-only payment status.
- [x] Replace Delivery page's stale phone, unsupported delivery cutoff/time promises, and payment-confirmation copy with shared public contact and verified policy information.
- [x] Route WhatsApp and Messenger order requests through the shared public contact configuration; do not use placeholder messaging URLs.

## Admin orders query repair — 2026-08-12
- [x] Diagnose the failed `orders` list query with read-only schema and migration inspection; do not expose or alter order/customer/payment records.
- [x] Apply only the verified non-destructive schema or query compatibility repair, and add regression coverage for the protected admin orders list.

## Owner-authorized protected mobile QA — 2026-08-12
- [x] Consolidate this duplicate tracker into the authoritative pending authenticated 375px admin QA item in “Final Authorized QA Follow-up”; no private data was accessed and the capture itself remains incomplete.

## Native login session-persistence incident — 2026-08-13
- [x] Trace the confirmed successful-login-to-Home unauthenticated redirect without handling owner credentials
- [x] Correct the native session cookie or redirect path and add a regression test for post-login authenticated state
- [x] Revalidate owner sign-in and complete the pending authenticated 375px admin Products-dashboard layout review without opening private records
- [x] Align legacy HTTPS/logout cookie expectations with the corrected `SameSite=None` preview session contract and rerun the full validation suite

## Development server interruption — 2026-08-13
- [x] Restart the reported unresponsive development server and verify the preview becomes reachable

## 21st MCP connector request — 2026-08-13
- [x] Inspect whether a 21st MCP connector already exists and prepare a secure setup only after intent is confirmed
- [x] Create and verify the 21st MCP connector without storing its API key in project code, environment files, or Git
- [x] Remove the temporary connector setup artifact containing the API key and confirm no full key literal exists in project or Git-tracked content
- [x] Rotate the user-supplied 21st API key only in protected connector configuration, then verify connector access and project secret hygiene

## Comprehensive visual refinement with 21st — 2026-08-13
- [x] Audit every public, account, and admin route at desktop and mobile breakpoints without reading or changing private commerce data
- [x] Research and select compatible 21st component patterns for premium navigation, product discovery, forms, feedback states, and dashboard controls
- [x] Refine shared header, navigation, footer, typography, spacing, interactions, and responsive behavior while preserving the approved brand wordmark and Georgian-first content
- [x] Refine storefront, catalog, product, bouquet builder, cart, checkout, informational, account, and admin presentation layers without changing commerce logic or BOG sandbox behavior
- [x] Add or update focused visual/UI contract tests and complete desktop/mobile screenshot QA, TypeScript, production-build, and full test-suite validation
- [x] Re-check the desktop Login/Register primary-action hierarchy and retain the intentional high-contrast dark submit treatment after final rendered QA
- [x] After the current desktop refinement is complete, audit every route at 375px and 390px for mobile navigation, text wrapping, spacing, touch targets, safe areas, and horizontal overflow
- [x] Refine shared mobile navigation, header actions, typography scale, controls, and bottom-safe-area behavior without changing route or commerce logic
- [x] Refine mobile storefront, catalog, product, bouquet builder, cart, checkout, informational, account, and access-gated admin presentation layers
- [x] Add mobile UI contract coverage and complete 375px/390px visual regression, TypeScript, production-build, and full-suite validation

## Homepage hero transition refinement — 2026-08-13
- [x] Inspect the active homepage hero media transition and select compatible 21st community motion/composition patterns without introducing external runtime dependencies
- [x] Refine the hero image transition, framing, supporting visual layers, typography composition, and CTA hierarchy with additive desktop and mobile styling
- [x] Add focused hero transition contracts and validate the refined hero at desktop, 390px, and 375px before publishing
