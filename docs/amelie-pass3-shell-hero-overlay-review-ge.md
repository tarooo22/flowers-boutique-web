# Pass 3 — Shell and Hero Overlay Review

## Evidence

The reviewed viewport overlays are raw, same-dimension 50% blends generated after the shell/hero correction: `768×1024` and `1440×1200`. The corresponding capture manifest records DPR 1, matching CSS viewport dimensions, decoded images for both targets and no scaling/cropping in overlay generation.

## Findings

| Viewport | Geometry result | Controlled difference |
|---:|---|---|
| 768px | Announcement/header stack and hero start align at the reference’s 35px + 87px profile. The local H1, lead, CTA, dots and two-row stats rail now occupy the reference anchor bands; document width was restored to 768px after the tablet footer accordion fix. | The local business copy, icon choices and product/hero imagery differ intentionally, so their superimposed glyphs and subjects appear as expected double edges. |
| 1440px | The hero begins at y=100 against the reference y=99.6. The local inner hero shell is x=80/w=1280; H1/CTA/stats use the x=104 content inset and align with the measured reference anchor bands. | The distinct Flower’s Boutique H1 has a different word length from the reference, so its letter shapes cannot coincide even when its block geometry does. |
| 375px | The local H1 y=306/h=109.4, lead y=429.4/h=46.5, CTA y=528.9/h=47 and stats y=634/h=98.7 closely follow the measured reference boxes y=305.9/h=109.4, y=429.3/h=46.5, y=529.2/h=46.9 and y=634.1/h=101.7. | CTA width remains about 5px narrower because Flower’s Boutique’s legal font/data copy produces different intrinsic inline width; it does not alter the layout edge or interactions. |

The reviews confirm the shell/hero geometry correction; broader section and full-page parity scoring remains a separate Pass 3 phase.
