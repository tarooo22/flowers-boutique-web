# Homepage Pixel-Clone Pass 3 — Deterministic Baseline Observations

## Screenshot protocol confirmation

The 375px and 1440px viewport overlays were generated from raw **same-pixel-dimension** screenshots: 375×812 and 1440×1200 respectively. Both targets used Playwright Chromium, DPR 1, 100% effective zoom, the same CSS viewport, loaded-font state, a screenshot-only motion freeze and `overflow-y: scroll`. The overlay driver rejects dimension mismatches before creating an overlay or diff; it never crops, resizes or stretches a screenshot.

## Initial observations before code correction

| Viewport | Verified geometry finding | Excluded from geometry judgement |
|---:|---|---|
| 375px | Header composition, inline navigation row, hero text block, CTA position and stats rail create obvious double-edge displacement in the 50% overlay. The category heading and its pill row also start at different visual positions. | Brand mark, Georgian copy length and product photography differ by design and are not treated as parity defects. |
| 1440px | The overlay shows independent reference/local header labels and icon positions, a misaligned hero text block/CTA/stats rail, and divergent vertical start at the category region. The local content wrapper and reference grid edges require numerical audit rather than a token-only assumption. | The image subjects, text strings and commercial/product data intentionally differ and are not evidence of a layout defect. |

## Evidence scope

The raw deterministic artifacts are stored under `/home/ubuntu/amelie-audit-notes/pass3/`, including viewport and full-page screenshots for 375, 430, 768, 1024, 1280, 1440 and 1920px. 50% viewport overlays and pixel difference images are available for each width. Full-page comparisons will be judged through coordinate maps, not by rescaling unequal document heights.
