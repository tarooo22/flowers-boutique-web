# Homepage Visual Parity Pass 2 — overlay baseline findings

**Evidence:** fresh normalized Amelie/local captures at equal 375px and 1440px widths, with a 50% overlay and per-pixel difference image. The visual reference is public Amelie homepage presentation; local copy, product media, names and prices are intentionally different. [1]

## Immediate high-displacement findings

| Priority | Reference-versus-local finding | Required Pass 2 response |
|---:|---|---|
| 1 | The hero overlay reveals different content block scale, title wrapping, CTA placement, metrics rhythm and below-hero transition. | Re-measure hero/header/stats at each breakpoint before replacing values. |
| 2 | Local repeat product grids are visually denser and their card bodies/price hierarchy do not follow reference card geometry. | Rebuild ProductCard body/media relationship and rail count/overflow rather than only tuning grid columns. |
| 3 | The current dark builder split banner does not align with the light horizontal promo surface in the reference sequence. | Remove this composition and replace it with a light/pastel image-plus-content promotional banner. |
| 4 | Mobile overlay indicates local section starts and product rail lengths compress the page differently from the reference. | Use recorded section Y boundaries and tune each section’s padding, visible count and horizontal overflow. |
| 5 | A pre-footer contact/quick-action band is absent locally. | Add the Flower’s Boutique contact-bar equivalent in the measured pre-footer position. |
| 6 | Footer is directionally dark but its visible start, column rhythm and legal-band placement need a separate parity pass. | Re-measure footer and rebuild its geometry only after contact bar insertion. |

## Baseline conclusion

The local Home is not accepted as visually close at this stage. The next pass must replace non-matching section formats rather than apply incremental theme changes. No Catalog or ProductDetail composition work is included.

## Top-of-page reconstruction checkpoint

After the first measured reconstruction, the 1440px local shell now uses the reference-equivalent 35px rail, 65px header and 864px hero. The 375px local shell now uses the 53px information rail, 154px header and 585px hero start sequence. The screenshot review confirms that macro vertical boundaries are now aligned; remaining visible work is concentrated in ProductCard/card-body geometry, product-rail typography and density, the non-matching dark promo banner, missing contact bar, and footer rhythm.

## Commerce reconstruction checkpoint

The reconstructed product cards now use the reference-equivalent 3:4 media ratio, white bordered body, coral name role, one-line secondary description, price line, top-right favourite and floating coral quick action. The 375px screenshot shows the required two-column card geometry, while 1440px shows a four-card rail. The former dark builder split was replaced by the light rounded image-plus-content banner. Remaining Pass 2 work is the pre-footer contact bar, footer geometry, and final overlay-driven spacing correction.

## Measured rail verification

Fresh DOM measurements show that at 375px Amelie’s first two grids use 165.5px columns and cards approximately 314–332px tall; local cards now measure 166px wide and 325px tall. At 1440px, Amelie’s first two grids use a 1232px container with four 294.5px cards; local now uses a 1232px container and four equal grid columns. The third reference product section is a horizontal shelf with 248px cards, 18px gaps and overflow; local now mirrors this as a 66vw touch shelf on mobile and 248px maximum shelf on desktop. [2]

## References

[1]: https://amelie.ge/ "Amelie.ge — public homepage visual reference"
