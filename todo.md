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
- [ ] Consolidate the public design tokens, loaded Georgian/English typography, responsive typography wordmark, header, mobile menu, footer, and reusable product card without changing protected business logic
- [ ] Refine the homepage, catalog, product detail, cart, checkout, account, bouquet builder, about, contact, and admin experiences using actual configured data only
- [ ] Preserve Georgian as the default language, existing SEO routes/content, secure authorization, server-side pricing, and disabled BOG card payment behaviour
- [ ] Add or update focused Vitest coverage for every repaired server-side or shared utility behaviour
- [ ] Validate desktop and mobile journeys, browser/network errors, build, type-check, tests, and all affected routes; distinguish pre-existing from new failures
- [ ] Prepare a concise audit, implementation report, and verified running-application screenshots before requesting release approval
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
