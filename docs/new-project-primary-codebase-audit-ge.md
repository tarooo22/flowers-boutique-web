# ახალი Primary Codebase — უსაფრთხო Migration Audit

## მოკლე დასკვნა

ახალი ატვირთული `flower-shopv3(2).zip` არის დამოუკიდებელი **Next.js 16.3.1** storefront prototype. მიმდინარე production project კი არის **React 19 + Vite + Express 4 + tRPC 11 + Drizzle/MySQL** application. ამიტომ ZIP-ის პირდაპირი file-for-file replacement დაუყოვნებლივ გააუქმებდა მოქმედ მონაცემთა, ავტორიზაციის, შეკვეთების, storage-ის, tracking-ისა და deployment contracts-ს.

> უსაფრთხო გადაწყვეტილება: ახალი ZIP შეიძლება გახდეს primary **presentation/application codebase** მხოლოდ მას შემდეგ, რაც მისი static/demo data, filesystem store და demo admin auth ჩანაცვლდება მოქმედი წარმოების integrations-ით. პირდაპირი overwrite არ შესრულებულა.

## Architecture comparison

| სფერო | მიმდინარე production პროექტი | ახალი ატვირთული პროექტი | უსაფრთხო migration-ის აუცილებელი მოქმედება |
|---|---|---|---|
| Framework/runtime | Vite SPA + Express server + tRPC | Next.js App Router + Next route handlers | Next runtime-ის managed deployment compatibility ან existing runtime adapter-ის დაგეგმვა |
| Package management | `pnpm` | ZIP-ში `package-lock.json` და `pnpm-lock.yaml`; manifest Next/npm stack | ერთიანი package-manager გადაწყვეტა isolated validation-ში |
| Catalog | MySQL/Drizzle products, categories, variants, availability, S3 image references | `src/data/products.ts` static catalog | static seed/demo catalog-ის ჩანაცვლება live product queries-ით |
| Orders | canonical MySQL `orders`, customer data, delivery, payment/delivery statuses, BOG references | `.data/store.json`/in-memory fallback | filesystem store-ის სრულად ჩანაცვლება canonical order persistence-ით |
| Authentication | Manus OAuth + native sessions + database roles | signed admin-only cookie; demo fallback password/secret | demo cookie auth-ის ჩანაცვლება production auth/role checks-ით |
| Admin | database-backed products/orders and user roles | static products + local override store | admin routes უნდა დაუკავშირდეს მოქმედ protected API/data model-ს |
| Checkout/payment | current order security and payment status model | simple route handler/local order creation | checkout payload validation და order/payment flow უნდა გადავიდეს მოქმედ production contract-ზე |
| AI bouquet | existing data-aware Builder/AI integration | optional image key, static studio-library demo fallback | live current flower inventory, pricing და safe generation flow integration |
| Tracking/config | production environment contract includes database, session, Forge, AI and Meta keys | `.env.example` შეიცავს მხოლოდ `OPENAI_API_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | ახალი key names მხოლოდ საჭიროებისამებრ; existing secrets არ გადაიწერება/არ გაჟონავს |
| Domain/deployment | `flower-shop-jx9auvvz.manus.space`, managed fullstack deployment | no matching deployment configuration in ZIP | domain/DNS/SSL unchanged; only validated replacement deployment may receive the domain |

## მიმდინარე production data/contracts, რომლებიც დაცული უნდა დარჩეს

| Contract | Evidence in current project | Migration requirement |
|---|---|---|
| Users and sessions | `users`, `authSessions` schema and OAuth/native auth infrastructure | tables and active auth behavior must remain; no new demo admin bypass |
| Product catalog | `products`, `categories`, `productImages`, live variants and availability | New UI routes must read existing catalog rather than static ZIP inventory |
| Orders/customer delivery | canonical `orders`, address fields, recipient/delivery fields and status history | preserve rows and IDs; use non-destructive adapters/migrations only |
| Payment references | BOG-related fields and canonical payment state | no data reset; payment result UI must use current status contract |
| Storage and images | product/banner references and production storage helpers | retain existing storage URLs/keys; do not import ZIP demo assets as production data |
| Tracking | Meta Pixel/CAPI configuration contract | retain existing configuration and server behavior |
| SEO/public routes | existing product IDs, canonical URLs and public route coverage | create compatibility redirects/adapters before retiring a public route |

## New-project risks requiring explicit handling

The new ZIP’s `src/lib/server/store.ts` writes orders and catalog overrides to `.data/store.json`, with in-memory fallback when storage is read-only. That is unsuitable for production because order/admin changes would not be guaranteed persistent and would split data from the current database. Its `src/lib/server/auth.ts` falls back to public demo credentials if admin variables are absent. Those defaults must never be deployed as the production admin mechanism.

The ZIP’s route and data architecture uses static seed products and string slugs, while the existing production application uses database-backed numeric IDs, product variants, pricing/availability fields, customer addresses, order security and payment metadata. A direct replacement would therefore discard live catalog management and operational functionality from the deployed experience.

## Required safe migration path

| Step | Safe action | Prohibited action |
|---|---|---|
| 1 | Preserve current checkpoint and database without writing migrations | Reset/drop/seed current production database |
| 2 | Extract new project to an isolated staging directory and install dependencies without lifecycle scripts | Run ZIP-provided scripts or build on production path before review |
| 3 | Replace static `src/data/*` and `.data` persistence through adapters to current product/order APIs | Ship static demo products or filesystem order persistence |
| 4 | Replace demo admin cookie with current auth/role guards | Deploy fallback demo credentials |
| 5 | Map existing image/data/route semantics and create redirects where needed | Remove current production routes before compatibility is tested |
| 6 | Validate new codebase in isolation using real but non-destructive read paths | Overwrite active repository or production configuration before validation |
| 7 | Switch the active codebase only after end-to-end build/runtime/data/auth/order tests pass | Change domain/DNS or erase the current deployment prematurely |

## Current decision gate

The requested full replacement is technically possible only as a substantial migration, not a safe copy operation. The next implementation choice changes the production architecture materially:

1. **True Next.js replacement:** Port the current database/auth/order/storage/payment/analytics integrations into the new Next.js codebase, then make it the managed production app. This satisfies “new codebase as source of truth” but requires rebuilding backend integrations in Next.
2. **Production adapter path:** Retain the managed fullstack runtime and port only the new project’s user-interface/application structure into it, using existing APIs. This is significantly safer but does not make the raw Next.js project the literal deployment runtime.

No files in the active production codebase, no environment variables, no database rows and no domain settings have been overwritten during this audit.
