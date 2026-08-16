# Homepage Pixel-Clone Pass 3 — Numerical Reference Geometry Map

## Measurement protocol

All values below come from the public Amelie homepage’s live DOM in the Pass 3 deterministic Chromium protocol: CSS pixel viewport, DPR 1, 100% zoom, settled fonts, strict decoded-image screenshot baseline, and no screenshot resizing. Values are rounded to one decimal CSS pixel. The Flower’s Boutique product, text and photo differences are intentionally excluded from visual parity judgement.

## Reference region map

| Region | 375px reference `x / y / w / h` | 768px reference `x / y / w / h` | 1440px reference `x / y / w / h` |
|---|---:|---:|---:|
| Announcement strip | `0 / 0 / 375 / 53.2` | `0 / 0 / 768 / 34.6` | `0 / 0 / 1440 / 34.6` |
| Header | `0 / 53.2 / 375 / 154` | `0 / 34.6 / 768 / 87` | `0 / 34.6 / 1440 / 65` |
| Header content shell | `0 / 53.2 / 375 / 153` | `0 / 34.6 / 768 / 86` | `80 / 34.6 / 1280 / 64` |
| Hero | `0 / 207.2 / 375 / 584.6` | `0 / 121.6 / 768 / 737.3` | `0 / 99.6 / 1440 / 864` |
| Occasion section | `0 / 791.8 / 375 / 203.4` | `0 / 858.9 / 768 / 96.9` | `0 / 963.6 / 1440 / 103.2` |
| Product rail 1 | `0 / 995.3 / 375 / 747.1` | `0 / 955.8 / 768 / 1233.5` | `0 / 1066.8 / 1440 / 583.5` |
| Product rail 2 | `0 / 1742.4 / 375 / 729.3` | `0 / 2189.3 / 768 / 1215.7` | `0 / 1650.3 / 1440 / 583.5` |
| Product rail 3 | `0 / 2471.7 / 375 / 577.1` | `0 / 3404.9 / 768 / 924.4` | `0 / 2233.8 / 1440 / 585.5` |
| Promotional banner | `0 / 3048.8 / 375 / 454.1` | `0 / 4329.3 / 768 / 409.8` | `0 / 2819.3 / 1440 / 314.1` |
| Services/editorial | `0 / 3502.8 / 375 / 621.1` | `0 / 4739.1 / 768 / 1034.9` | `0 / 3133.5 / 1440 / 469.8` |
| Journal | `0 / 4123.9 / 375 / 973.7` | `0 / 5774 / 768 / 700.2` | `0 / 3603.2 / 1440 / 438.7` |
| Contact bar visual region | `16 / 5113.6 / 343 / 175.6` | `24 / 6484.2 / 720 / 116.6` | `104 / 4051.9 / 1232 / 96` |
| Footer outer region | `0 / 5137.6 / 375 / 1049.5` | `0 / 6514.2 / 768 / 951.7` | `0 / 4081.9 / 1440 / 511.5` |
| Footer columns region | `16 / 5295.2 / 343 / 836.2` | `24 / 6612.9 / 720 / 797.5` | `104 / 4159.9 / 1232 / 377.9` |

## Hero and typography bounding targets

| Anchor | Hero H1 box | Lead box | CTA button box | Dots region | Stats rail | Required type geometry |
|---|---:|---:|---:|---:|---:|---|
| 375px | `16 / 305.9 / 343 / 109.4` | `16 / 429.3 / 343 / 46.5` | `16 / 529.2 / 178.5 / 46.9` | `16 / 598.1 / 343 / 16` | `16 / 634.1 / 343 / 101.7` | H1 is `32px / 36.48px / 400`; standard section headings are `19px / 29.45px / 400`. |
| 768px | `24 / 418 / 720 / 96.3` | `24 / 528.3 / 460 / 46.5` | `24 / 628.2 / 178.5 / 46.9` | `24 / 697.1 / 720 / 16` | `24 / 733.1 / 720 / 69.8` | H1 is `42.24px / 48.1536px / 400`; standard section headings are `19.968px / 30.9504px / 400`. |
| 1440px | `104 / 490.7 / 900 / 141.3` | `104 / 646 / 460 / 46.5` | `104 / 745.9 / 175.3 / 46.9` | `104 / 814.8 / 1232 / 16` | `104 / 856.8 / 1232 / 50.8` | Use the legally usable Georgian fallback only if it produces the measured H1 and heading boxes; do not prioritize nominal font size over wrap/line-height geometry. |

## Global width and inset targets

The desktop page uses two distinct measured widths: **1280px** for the header/hero outer shell (x=80 at 1440px), and **1232px** for the product, contact and lower-page content shell (x=104). At 768px the lower shell is **720px** (24px inset). At 375px it is **343px** (16px inset). Any shared token implementation must reproduce these observed edges rather than apply a generic one-width container.

## Initial local deltas to correct first

The initial strict 1440px local probe placed the hero at y=105.4 rather than the reference y=99.6, while its hero H1 began at x=80/y=465.1 and measured 900×212px. The reference H1 begins at x=104/y=490.7 and measures 900×141.3px. Shell/header alignment, hero text anchoring and local heading wrap/line-height were therefore the highest-impact first corrections. At 375px, the local hero outer geometry already approximated the reference, but its text started substantially lower and used a different wrapping profile; this required a separate mobile text-layout rule rather than a desktop transform.
