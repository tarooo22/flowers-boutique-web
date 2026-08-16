# Homepage Pixel-Clone Pass 3 — DOM/CSS Constraint Audit

## Scope

This audit reviews only the public Home presentation structure and its canonical `am-*` CSS cascade. It does not alter tRPC queries, cart callbacks, routes, SEO, authentication, database or checkout behavior.

## Active structural constraints

| Location | Current rule or structure | Classification | Pass 3 treatment |
|---|---|---|---|
| `Navbar.tsx` + `.am-header__main` | Header uses its own `width: min(--am-shell, viewport − gutters)` wrapper. | **Reference-required, remeasure** | Keep a single measured header shell; recalibrate its exact width, x-edge and gaps from the strict capture. |
| `Home.tsx` hero content + `.am-home-hero__content` | Hero uses `--am-shell` while lower page sections use a separate `.am-home__body`. | **Reference-required, conflicting** | Replace with explicit shared tokens only when the geometry map proves identical edges; avoid unexplained nested clamps. |
| `Home.tsx` occasion `.am-shell` | Occasion is a separate shell from the lower body. | **Reference-required, remeasure** | Keep only if its measured x-edges match reference; otherwise unify with the measured page section shell. |
| `.am-home__body` | Late cascade clamps body at `min(1232px, viewport − gutters)`, while `--am-shell` remains 1280px. | **Legacy/duplicate width constraint** | Rebuild as one source of truth after numeric width audit; do not preserve a 1280/1232 split merely by token precedent. |
| `.am-product-rail` | `repeat(4, minmax(0,1fr))` desktop and `repeat(2,...)` through all ≤1023px widths. | **Reference-required, breakpoint remeasure** | Recalculate columns and card geometry independently for 375/768/1440 anchors. |
| `Home.tsx` `productRail()` | Modifier (`--grid`/`--shelf`) is placed on inner `.am-product-rail`, not outer `.am-home-rail` section. | **Defective selector contract** | Move semantic rail modifier to the outer section or rewrite selectors. Existing `.am-home__body > .am-home-rail--grid` and `.am-home-rail--shelf` vertical rules never match their intended wrapper. |
| `.am-builder-promo` | Old dark builder CSS remains but Home renders `.am-promo-banner`. | **Obsolete visual residue** | Remove during safe CSS cleanup after confirming no other route uses it. |
| `.am-home-rail`, `.am-occasion`, promo, services and journal | Three overlapping generations of base, Pass 2 commerce and late rhythm overrides change the same properties. | **Conflicting legacy cascade** | Consolidate into one ordered Pass 3 component block after reference mapping; retain only current intended state. |
| `.am-footer` mobile negative margin/padding | 375px uses `margin-top:-252px; padding-top:266px`; 400–767px uses `-215px/+225px`. | **Artificial boundary hack** | Replace with natural measured contact/footer geometry. The semantic pre-footer contact component must remain independent. |
| `header-refinement.css`, `wave1-reference.css` | Contain legacy `p1-*` rules. Current Home markup uses `am-*`. | **Isolated legacy, preserve** | Do not remove globally until a selector usage audit confirms they do not style public non-Home routes. |

## Preliminary width conclusion

The deterministic 1440px screenshot proves a 1440 CSS-pixel viewport for both targets, but does not alone prove a global 1280px shell. The currently visible width system contains a 1280px header/hero shell and a separate 1232px body clamp. Pass 3 will use the numerical reference geometry map—not either pre-existing value—as the authority.

## Implementation guardrails

The upcoming reconstruction will preserve `products.list`, `categories.list`, `quickAdd`, `phoneHref`, `siteContact`, `CartDrawer`, `Footer`, nav routes and structured-data calls. Only Home markup classes, Home-specific CSS geometry and visual-contract tests are eligible for modification.
