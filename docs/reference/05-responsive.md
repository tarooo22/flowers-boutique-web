# 05 — Responsive behaviour

Each width is treated as an explicit layout state and verified against the live
reference (screenshots in `qa/shots`).

| Width | Header            | Product grid | Hero H1 | Notable stacking            |
| ----- | ----------------- | ------------ | ------- | --------------------------- |
| 375   | hamburger + icons | 2 columns    | 40px    | promo/editorial/journal 1-col; footer 2-col |
| 430   | hamburger + icons | 2 columns    | 40px    | as 375                      |
| 768   | hamburger + icons | 3 columns    | 52px    | promo/editorial 2-col       |
| 1024  | full nav appears  | 4 columns    | 62px    | —                           |
| 1280  | full nav          | 4 columns    | 62px    | container fills to 24px gutters |
| 1440  | full nav          | 4 columns    | 62px    | container capped, centred   |
| 1920  | full nav          | 4 columns    | 62px    | ~1230px content, centred    |

Breakpoints: desktop nav switches at **lg (1024px)** — matching the reference,
which also collapses to a hamburger at 768. Product columns use Tailwind
`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.

Chips (occasions, catalog facets) scroll horizontally on narrow screens
(`hide-scrollbar`). The cart is a right-side drawer on all sizes (full-width
under 420px). Motion respects `prefers-reduced-motion`.
