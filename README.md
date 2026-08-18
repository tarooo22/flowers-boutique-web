# Flower's Boutique

A premium flower e-commerce storefront. The **public frontend reproduces the
publicly observable design system, composition, proportions and interaction
patterns of [amelie.ge](https://amelie.ge/)** — measured from the live site —
while all content, imagery, copy and brand identity are original to Flower's
Boutique. No Amelie source code, fonts, photography, product names, prices or
proprietary assets were copied; only public UI relationships and behaviour were
recreated with original code.

Built from scratch with **Next.js 16 (App Router) · React 19 · TypeScript ·
Tailwind CSS v4**.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server → http://localhost:3000
npm test           # run unit tests (Vitest)
npm run lint       # ESLint
npm run build      # production build
npm start          # serve the production build
```

Interactive smoke test (needs the dev server running):

```bash
node scripts/smoke.mjs
```

## Project structure

```
src/
  app/                 # routes (App Router)
    page.tsx           # homepage
    catalog/ product/[slug]/ cart/ checkout/ favorites/
    account/{login,register}/ about/ rewards/ journal/[slug]/
    layout.tsx globals.css not-found.tsx
  components/
    layout/  # Header, Footer, AnnouncementBar, MobileNav, Search, ContactStrip…
    home/    # Hero, CategoryChips, ProductSection, CashbackBanner, Editorial, Journal
    catalog/ product/ cart/ checkout/ account/
    ui/      # Button, ProductCard, ProductGrid, Price, QuantityControl, Icons…
  config/    # brand.ts (all business data), nav.ts
  data/      # products.ts, categories.ts, journal.ts (typed demo content)
  lib/       # store.tsx (cart + wishlist + UI), catalog.ts (selectors), format.ts
  types/     # shared TypeScript types
public/images/           # original, self-contained SVG placeholder art
docs/reference/          # measured design spec (tokens, type, layout, components…)
scripts/                 # shoot.mjs (screenshots), smoke.mjs (e2e checks)
```

## Design system

Design tokens are measured from the reference and defined as CSS variables in
`src/app/globals.css` (see `docs/reference/`): warm cream canvas `#FBF7EE`,
ink `#1A1A1A`, coral action `#FF5A3C`, 1280px capped container with 24px
gutters, 3:4 product media, sticky 64px header. Fonts (Noto Sans Georgian,
Playfair Display, Space Mono) are self-hosted via `next/font`; the mono stack
falls back to Noto Sans Georgian so the `₾` glyph renders.

## Languages

The interface ships in **English, Georgian (ქართული) and Russian (Русский)**.
The switch in the header changes the whole UI and the choice is saved to
`localStorage`. All copy lives in `src/lib/translations.ts` — add new strings to
all three dictionaries rather than hardcoding them in components.

```bash
node scripts/lang-check.mjs   # verifies all three languages + persistence
```

## Motion

- **3D** — the hero card stack and the editorial cards tilt toward the pointer
  (`Tilt`, CSS `perspective` + `preserve-3d`), with floating depth chips.
- **Scroll reveals** — sections fade and slide in as they enter the viewport
  (`Reveal`, IntersectionObserver), staggered across product grids.
- **Parallax** — the hero's decorative blooms drift on scroll.
- **Marquee** — the brand band scrolls continuously and pauses on hover.

All of it is disabled under `prefers-reduced-motion`. The reveal start state is
applied only on the client after mount, so server-rendered and no-JS content is
always visible and can never get stuck hidden.

## Bouquet builder

`/builder` has two modes:

**Visual builder** — pick stems from nine flower types, choose paper colour,
ribbon and wrap mode, and the bouquet composes live. Stems are transparent
cutout photos fanned around a shared tie-point by
[`bouquetLayout.ts`](src/lib/bouquetLayout.ts): symmetric left/right pairs,
per-species head scale, depth-sorted z-index and a density scale so the bouquet
stays inside the wrap as it grows. Price updates per stem; the result goes into
the cart as a custom line.

**AI bouquet** — describe the bouquet in any language and
`POST /api/bouquet/generate` returns an image.

- With `OPENAI_API_KEY` set, it calls the OpenAI image API (`mode: "live"`).
- Without a key it matches the description against our studio library and
  returns `mode: "demo"`; the UI says so plainly rather than passing a stock
  photo off as generated output.

Copy `.env.example` to `.env.local` to enable live generation.

## Admin panel

`/admin` (sign in at `/admin/login`) — staff-only, not linked from the site.

- **Overview** — order count, revenue, average order value, latest orders.
- **Orders** — every checkout submission, searchable and filterable by status,
  expandable to items + delivery details, with status changes and delete.
- **Products** — edit price, stock and bestseller flag per product. Edits are
  stored as overrides and are picked up by the storefront (`ProductCard`,
  product page) via `GET /api/catalog/overrides`, so no rebuild is needed.

Auth is a signed httpOnly cookie. `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`
fall back to demo values so the panel works locally out of the box — the panel
shows a warning banner while those defaults are in use. **Set both before
deploying.**

### Order storage

Checkout POSTs to `/api/orders`, which persists to a JSON file at `.data/store.json`
([`lib/server/store.ts`](src/lib/server/store.ts)). On a read-only or ephemeral
filesystem (most serverless hosts) it falls back to an in-process cache — the app
keeps working, but orders won't survive a cold start. Swap that module for a real
database when one is available.

## Features

- Responsive homepage matching the reference section order and geometry
  (375 / 430 / 768 / 1024 / 1280 / 1440 / 1920).
- Catalog with URL-synced category, colour, price, availability, search, sort
  and pagination.
- Product detail with gallery, size variants, quantity, wishlist and related
  items.
- Cart drawer + full cart page, wishlist, checkout form — all client-side with
  `localStorage` persistence.
- Accessible controls (semantic nav, focus-visible, Escape to close drawers,
  `prefers-reduced-motion`).
- Per-page SEO metadata and Open Graph scaffolding.

## Imagery

`public/images/photos/` holds the bouquet photography used across the catalog,
hero, editorial and journal. `public/images/builder/` holds the transparent
cutout stems, wrapping papers and ribbons the visual builder composites.

Some shots are wide scenes where the bouquet sits off-centre, so
[`imageFocus.ts`](src/lib/imageFocus.ts) declares a per-photo focal point used
as `object-position` — portrait cards then crop to the flowers rather than the
middle of the frame.

The catalogue is a demo: 24 products share a smaller pool of photographs, so the
same shot appears on more than one product.

## Not yet wired (future backend integration)

- Real authentication (login/register are front-end only).
- Payments / order submission (checkout uses a mock confirmation).
- i18n backend (the language switch is presentational; Georgian rendering is
  supported by the font stack).
- A products/orders API (data is served from typed local modules).
