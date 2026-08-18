# 02 — Typography

## Reference stacks (measured)

- Body: `"Noto Sans Georgian", -apple-system, sans-serif` — base **14px**.
- Display: `"Amelie Display", "Noto Sans Georgian"` (proprietary — replaced).
- Mono: `"Space Mono"` — used for stats, labels and eyebrows.
- Prices render in the **body** font, not mono (measured `Noto Sans Georgian`).

## Clean-room replacement

Proprietary faces (`Amelie Display`, `Mersad Caps`) are **not** used. Chosen
originals loaded via `next/font/google` (self-hosted at build):

| Role      | Family (ours)          | CSS var          | Notes                          |
| --------- | ---------------------- | ---------------- | ------------------------------ |
| Body/nav  | Noto Sans Georgian     | `--font-body`    | Latin + Georgian coverage      |
| Display   | Playfair Display       | `--font-display` | Premium boutique serif         |
| Mono      | Space Mono             | `--font-mono`    | Stats, eyebrows, badges        |

`.mono` falls back to Noto Sans Georgian so the `₾` (Lari) glyph renders, since
Space Mono lacks it.

## Geometry (matched to reference)

| Element        | Size / line-height        | Weight | Notes                        |
| -------------- | ------------------------- | ------ | ---------------------------- |
| H1 (hero)      | 62px desktop / lh ~1.14   | 600    | clamps 40→52→62 by breakpoint|
| H2 (section)   | 24px                      | 600    | display font                 |
| Nav links      | 13px                      | 600    | —                            |
| Body           | 14px / 1.55               | 400    | —                            |
| Product title  | 12.5px, uppercase, +0.03em| 600    | matches reference card style |
| Price          | 13px, tabular             | 600    | body font, ink               |
| Button         | 13.5px                    | 600    | —                            |
| Eyebrow/label  | 11px, +0.16em, uppercase  | 500    | mono                         |

Georgian rendering is verified through the Noto Sans Georgian stack; the demo
content ships in English with the brand identity of Flower's Boutique.
