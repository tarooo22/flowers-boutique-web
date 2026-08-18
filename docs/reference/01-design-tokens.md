# 01 — Design tokens

Values measured from the public Amelie.ge homepage (computed styles at 1280 / 1920)
and reproduced as CSS variables in `src/app/globals.css`. Colours are original
brand tokens tuned to the measured relationships — not copied assets.

## Colour (measured → token)

| Role            | Measured (rgb)        | Token            | Hex       |
| --------------- | --------------------- | ---------------- | --------- |
| Page canvas     | `251, 247, 238`       | `--page`         | `#FBF7EE` |
| Hero / promo    | `243, 237, 223`       | `--surface-warm` | `#F3EDDF` |
| Card surface    | `255, 255, 255`       | `--surface`      | `#FFFFFF` |
| Primary text    | `26, 26, 26`          | `--ink`          | `#1A1A1A` |
| Secondary text  | `110, 110, 102`       | `--muted`        | `#6E6E66` |
| Action (coral)  | `255, 90, 60`         | `--action`       | `#FF5A3C` |
| Action deep     | `209, 59, 34`         | `--action-deep`  | `#D13B22` |
| Footer bg       | `26, 26, 26`          | `--footer`       | `#1A1A1A` |
| Footer text     | `255,255,255 / .82`   | `--footer-ink`   | rgba      |

Support tokens (`--green`, `--green-soft`) drive the rewards/cashback surfaces.

## Radius

- Buttons: `--radius-sm` = **3px** (measured on the primary CTA).
- Cards / panels: `--radius` 8px, `--radius-lg` 14px.

## Elevation

Soft, low-contrast shadows only (`--shadow-card`, `--shadow-pop`, `--shadow-float`).
The reference is nearly flat; shadows appear on the cart drawer and floating chips.

## Notes

- The primary button uses **dark ink text on coral** (`--action-ink` = `#1A1A1A`),
  matching the measured `color: rgb(26,26,26)` on the reference CTA.
- Everything is theme-stable (single warm light palette); there is no dark mode
  on the reference, so none is implemented.
