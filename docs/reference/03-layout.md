# 03 — Global layout

## Content width (measured)

- At **1280** viewport: content spans x≈24 → 1240 (grid item edges), i.e. 24px
  gutters, ~1232px content.
- At **1920** viewport: content is centred at x≈338 → 1568 (≈1230px), confirming
  a capped container.

**Implementation:** `.container-fb` = `max-width: 1280px; margin-inline: auto;
padding-inline: 24px` (16px under 640px). Content ≈ 1232px, centred on wide
screens. Full-bleed sections (hero, footer, contact strip) break out and align
their inner text back to the container edge.

## Vertical rhythm

| Band            | Height (measured) | Implementation             |
| --------------- | ----------------- | -------------------------- |
| Announcement    | 35px              | `h-[35px]`                 |
| Header          | 65px              | `h-[64px]`, sticky         |
| Hero            | 518px             | `min-h-[520px]` (460 mob)  |
| Footer          | 511px             | dark, 4-col + legal row    |

Section spacing: `pt-12 sm:pt-16` between homepage bands.

## Product grid (measured)

- Image aspect ratio **3:4** (measured 289×385 = 0.75).
- Desktop **4 columns**, gap **20px** (4×289 + 3×20 ≈ 1232 ✓).
- Responsive: 2 cols (mobile) → 3 (≥768) → 4 (≥1024).
