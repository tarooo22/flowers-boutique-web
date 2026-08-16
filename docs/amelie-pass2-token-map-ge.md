# Homepage Visual Parity Pass 2 — measured token map

This map isolates public visual rules from Amelie’s homepage. It does not import or distribute proprietary font files, text, imagery, prices, loyalty values or source code. Flower’s Boutique keeps its own brand and data. [1]

| System | Public reference observation | Pass 2 Flower’s Boutique implementation rule |
|---|---|---|
| Canvas | `--bone` page canvas with dark `--ink` content anchor | Use the measured warm light canvas / near-black hierarchy already present in the storefront, not a new palette. |
| Ink | `#1A1A1A`, muted `#6B6B63`, thin line `rgba(26,26,26,.12)` | Adopt exact visual relationship for primary, muted and divider roles. |
| Accent | coral ink `#D13B22`, pale coral `#FFD9CF` | Use coral only where reference uses CTA/name emphasis; avoid unobserved gradients. |
| Radius | `3 / 6 / 10 / 14 / 999px` | Use 14px for the light promo banner, 6px cards/controls, pill only for chips. |
| Container | `1280px` reference maximum | Keep max content shell at 1280px with measured responsive gutters. |
| UI font | Public `Noto Sans Georgian` 400/500/600/700 | Use `Noto Sans Georgian` for nav, body, chips, utilities and localized content. |
| Mono/meta font | Public `Space Mono` 400/700 | Reserve for micro-labels/stat metadata only. |
| Display reference | Proprietary `Amelie Display`, with Noto fallback in its declared stack | Do **not** copy it. Use a tuned Noto Georgian display fallback: 400 weight, neutral tracking, reference line-height and size constraints per breakpoint. |
| Product-name reference | Proprietary `Mersad Caps`, with Noto fallback | Do **not** copy it. Use Noto fallback plus muted coral, 400–500 weight and subtle tracking; preserve localized original-casing data. |
| Desktop shell | 35px information rail + 65px header | Reconstruct as 100px total before hero at 1024px+. |
| Mobile shell | 53px information rail + 154px header | Reconstruct as 207px total before hero at 375/430px. |
| Hero desktop | 864px at 1440/1920; H1 `clamp(32px, 5.5vw, 62px)`, 1.14 leading, max 900px | Match this measured height and copy geometry with Flower’s Boutique image/text. |
| Hero mobile | 585px at 375, 648px at 430 | Match measured mobile hero / stats geometry rather than inheriting desktop height. |
| Section rhythm | Desktop sections use 56px vertical padding; product rails are ~584–586px at 1440 | Tune every section from reference Y boundaries, not the former local page density. |
| Promo banner | Light, rounded split banner: 1.1fr content / .9fr image, min 220px | Replace the dark builder split surface with this exact structural role using local content. |
| Footer desktop | Five columns, `1.7fr 1fr 1fr 1fr 1fr`, 28px gap, 52px/40px padding, then legal base band | Rebuild footer geometry from this role map with local links and contacts. |

## Separate typography treatment

| Element | Pass 2 typography tuning direction |
|---|---|
| Hero H1 | `Noto Sans Georgian` 400; reference-like 1.14 leading, no negative display-style tracking, max 900px desktop; measured natural wrapping mobile. |
| Section heading | `Noto Sans Georgian` 400; `clamp(19px, 2.6vw, 24px)` direction, balanced width; avoid the previous oversized expressive heading scale. |
| Product title | Noto fallback in product-name role; 13–13.5px, muted coral, small positive tracking, two-line boundary and visible secondary description. |
| Navigation | Noto UI 13–14px; regular/medium rather than headline weight; measured gaps and visible desktop alignment. |
| Footer heading | Noto UI 12px, 600, `.12em` tracking; footer links 13px with 4px vertical rhythm. |

## References

[1]: https://amelie.ge/ "Amelie.ge — public visual and CSS token reference"
