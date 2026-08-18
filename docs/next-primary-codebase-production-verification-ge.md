# Next.js Primary Codebase — Production Verification Log

## 2026-08-18: Public runtime switch

Public domain `https://flower-shop-jx9auvvz.manus.space/` initially continued to serve the previous Vite HTML because the default managed deployment attempted to upload `dist/public/*`. The new primary codebase is a server-rendered Next.js app and deliberately has no such static artifact.

The deployment path was changed to a root Next.js server container. After the container build/start cycle completed, the cache-busted raw production HTML changed from two `/assets/` occurrences to **244 `/_next/` occurrences**. This confirms that the public origin now serves the new Next.js runtime rather than the prior Vite build.

## Live public-surface checks

| Check | Result |
|---|---|
| Domain | `flower-shop-jx9auvvz.manus.space` remains assigned |
| Public title | `Flower's Boutique — Fresh bouquets delivered in Tbilisi` |
| Homepage shell | New primary-codebase header, catalogue/Builder routes, hero and product rails render on the public domain |
| Live catalog names/prices | Public HTML contains real examples such as ლილია / Lily / 25 ₾ and გიფსოფილა / Baby’s Breath / 10 ₾ |
| Storage proxy | `/manus-storage/img_7363_c02e777c_8ec0ff7b.webp` returns `307` to a Forge-issued presigned asset URL |
| Secondary storage path | `/manus-storage/hero-studio_bdd6f4fe.webp` also returns `307` to a Forge-issued presigned asset URL |

## Remaining verification

Public desktop visual capture reached the new page while client image painting was still settling. A direct production storage request already proved the required presign redirects work. The next QA step is a refreshed browser visual check followed by non-destructive Catalog, Product, Builder, Cart/Checkout and protected-admin endpoint verification.
