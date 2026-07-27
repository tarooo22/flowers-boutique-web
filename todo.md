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
- [ ] Test GET / (homepage) on live preview
- [ ] Test GET /catalog (product listing with search/filter/sort)
- [ ] Test GET /product/:id (product detail page)
- [ ] Test GET /bouquet-builder (visual and AI builder)
- [ ] Test GET /cart (shopping cart)
- [ ] Test GET /checkout (checkout flow)
- [ ] Test GET /wishlist (wishlist page)
- [ ] Test GET /about, /contact, /delivery, /returns (static pages)
- [ ] Test GET /login, /register (authentication pages)
- [ ] Test GET /profile (user profile)
- [ ] Test GET /admin (admin panel)
- [ ] Verify responsive layouts at 375, 390, 430, 768, 1024, 1440 px
- [ ] Confirm no broken images, console errors, or Georgian encoding issues

## Phase 8: Deployment & Publishing
- [ ] Create final checkpoint
- [ ] Publish to Manus HTTPS preview URL (https://flowers-boutique.manus.space)
- [ ] Verify live preview URL is accessible
- [ ] Confirm all routes work on live preview
- [ ] Document any compatibility changes or owner-supplied decisions
