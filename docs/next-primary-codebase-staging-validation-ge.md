# Next.js Primary Codebase — Isolated Staging Validation

## მიმდინარე სტატუსი

ახალი ატვირთული Next.js პროექტი გამოყოფილ staging directory-ში მოამზადეს როგორც მომავალი **primary codebase**. მოქმედი production repository, domain, database rows, secrets და მიმდინარე live deployment ამ ეტაპზე არ გადაწერილა.

## Staging-ში განხორციელებული production adapters

| სფერო | Static/demo ZIP behavior | Staging replacement |
|---|---|---|
| Catalog, Home, Product | `src/data/products.ts` / static slug lookup | `DATABASE_URL` MySQL adapter; live published/available products, categories, variants, price and image URL mapping |
| Legacy gallery compatibility | unconditionally queried `productImages` | missing-table tolerant fallback to existing `products.imageUrl`; schema migration არ შესრულებულა |
| Cart and favorites | static product lookup after localStorage hydration | root server-supplied live catalog snapshot via StoreProvider |
| Checkout/orders | client-trusted values written to `.data/store.json` | canonical MySQL `orders` insert; server-side product validation/repricing, delivery calculation, order number and production statuses |
| Customer auth | no-op demo form | database-backed `users`/`authSessions` register/login/logout using opaque `app_session_id` cookie and bcrypt hashes |
| Admin auth | fallback password + local signed cookie | existing database session token + user `role === admin` gate; no deployable demo credential fallback |
| Admin data | `.data/store.json` orders/overrides | canonical MySQL order/product reads, status updates and non-destructive product updates; order delete intentionally not auto-enabled |
| AI Builder flower choice | static `builderFlowers` data | real production `single-stems` category products, prices and image URLs |
| Visual Builder flower choice | static `builderFlowers` data | real production `single-stems` category products; wrappers/ribbons remain visual configuration, not catalog/order data |

## Data preservation evidence

The production database inventory found that category `single-stems` is the canonical live individual-flower source. It contains 70 published products and uses `unitType = 'single stem'`. The staging adapters therefore retrieve this category rather than import or seed ZIP flower data.

The existing production database does not currently contain a `productImages` table, despite a type-level schema reference. The Next adapter catches only the documented missing-table condition and continues with the current live `products.imageUrl` value. No schema change, reset or backfill has occurred.

## Validation executed in isolation

| Check | Result |
|---|---|
| Staging dependency installation | Pass; lifecycle scripts disabled |
| TypeScript after catalog/order/auth/admin/Builder adapter integration | Pass — `pnpm exec tsc --noEmit` |
| Next production build | Pass — `NODE_ENV=production pnpm build` |
| Existing staging Vitest suite | Pass — 1 file / 18 tests |
| Production-mode HTTP smoke | Pass (200): `/`, `/catalog`, `/product/90001`, `/cart`, `/checkout`, `/builder`, `/account/login` |
| Runtime resource cleanup | Staging dev/production server processes stopped after checks |

> A non-standard inherited `NODE_ENV=development` caused the ZIP’s baseline `next build` prerender hook error. Explicit `NODE_ENV=production` produces a passing Next.js build. The deployment/start scripts will set production mode explicitly.

## Conditions before replacing the active runtime

1. Commit/copy the isolated validated Next codebase into the active managed project only as a controlled change after creating an immediately-restorable checkpoint.
2. Preserve system-injected `DATABASE_URL`, session/OAuth values, Forge/AI keys, storage helpers and analytics values; do not copy ZIP `.env` files or demo credentials.
3. Ensure the active project start/build scripts run Next in production mode and are compatible with the managed deployment contract.
4. Re-run production build, server smoke checks, current database read checks and customer/admin flow checks from the active project path.
5. Publish only after live deployment validates the retained domain and necessary public routes.

## Remaining non-data presentation configurations

The staging source still contains ZIP-provided visual configuration for wrapper/ribbon art, editorial assets and static navigation copy. These are presentation assets/configuration, not operational product/order/auth data. Remaining static catalog references are limited to visual fallback or utility code and must not be wired into production commerce/API paths during the active-codebase switch.
