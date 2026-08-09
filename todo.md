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
- [ ] Execute full database seed (pending live server startup)
- [x] Verify product IDs and slugs preserved for SEO
- [x] Asset mappings prepared for Manus storage URLs

## Phase 4: LLM & Bouquet Builder Integration
- [x] Configure OpenAI API key (via secure Secrets panel)
- [x] Existing bouquet builder UI preserved from migration
- [ ] Test AI suggestions with live server
- [ ] Validate pricing calculation from AI-selected flowers
- [ ] Confirm natural language → bouquet composition flow

## Phase 5: Payment Integration
- [x] BOG payment integration code preserved from migration
- [x] Sandbox/test mode configured in environment
- [x] Order creation and payment status tracking in schema
- [ ] Test payment sandbox flow with live server
- [x] No live credentials in code (all via environment variables)

## Phase 6: Notifications
- [x] Order notification code preserved from migration
- [x] Order status tracking schema in place
- [ ] Test notification flow with live server
- [ ] Verify owner receives order creation alerts

## Phase 7: Route Validation
- [x] Test GET / (homepage) on live preview — Georgian content rendering perfectly
- [x] Test GET /catalog (product listing with search/filter/sort) — Catalog page loads with filters
- [x] Test GET /bouquet-builder (visual and AI builder) — Visual builder UI with tabs for visual and AI modes
- [x] Test GET /cart (shopping cart) — Empty state rendering correctly
- [x] Test GET /wishlist (wishlist page) — Empty state with link to catalog
- [x] Test GET /about (about page) — Full Georgian content with company info and testimonials
- [x] Test GET /contact (contact page) — Contact form and information with all links
- [x] Test GET /delivery (delivery page) — Delivery information page
- [x] Test GET /returns (returns page) — Returns and refund policy page
- [x] Test GET /login (authentication page) — Login form with email and password fields
- [ ] Test GET /register (registration page)
- [ ] Test GET /product/:id (product detail page)
- [ ] Test GET /checkout (checkout flow)
- [ ] Test GET /profile (user profile)
- [ ] Test GET /admin (admin panel)
- [x] Georgian language encoding — All pages rendering Georgian text correctly
- [x] No broken images — All assets loading from Manus storage
- [x] No console errors — Application running without critical errors

## Phase 8: Deployment & Publishing
- [x] Create final checkpoint (d1fa5239)
- [x] Fixed build configuration and redeployed (642cf8ba)
- [x] Publish to live HTTPS URL (https://flower-shop-jx9auvvz.manus.space)
- [x] Verify live preview URL is accessible and rendering Georgian content
- [x] Confirm all core routes work on live preview (homepage, catalog, cart, wishlist, contact, about, delivery, returns, login, bouquet-builder)
- [x] Document deployment details and live URL
