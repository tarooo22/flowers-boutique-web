# Manus data handoff

Only non-customer business/catalog exports are stored under `public-catalog`.

Included datasets may be used to seed a fresh Manus database idempotently:

- categories
- products
- product images
- banners
- SEO keywords
- SEO monitoring tasks
- keyword rankings
- order-source mappings without customer/order payloads

Not included in the upload package:

- users
- password reset tokens
- orders
- customer orders
- customer addresses

Use `drizzle/schema.ts` as the schema source of truth. Never delete existing production rows during import. Store a source identifier or use stable IDs/slugs so repeated imports update rather than duplicate catalog records.
