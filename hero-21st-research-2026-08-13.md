# Homepage Hero — 21st Community Research

## Reviewed sources

The 21st community catalog was reviewed on 2026-08-13 for a premium editorial flower-shop hero. The useful patterns were selected for **composition and interaction principles only**; no third-party source code or external runtime dependency will be added to the storefront.

| Pattern | Source | Applicable principle |
|---|---|---|
| Editorial Collage Hero | https://21st.dev/@felipemenezes098/components/hero-04 | Layered image composition with restrained overlap, serif-led editorial hierarchy, and adjacent CTA grouping. |
| Editorial Image Hero | https://21st.dev/@felipemenezes098/components/hero-07 | Deliberate image framing paired with clear copy and action hierarchy. |
| Spatial Product Showcase | https://21st.dev/@daiwiikharihar/components/spatial-product-showcase | Stateful image transitions and a controlled visual depth model. |
| 21st component catalog | https://21st.dev/community/components | Community catalog used to discover compatible hero, image, and motion patterns. |

## Local adaptation decision

The Flower’s Boutique implementation will use the above references to improve the existing hero rather than transplant a foreign component. The refinement should preserve Georgian-first content, the existing persistent image sources, accessibility, motion limits (transform/opacity only, under 300ms), and reduced-motion behavior. The image treatment will use layered still-image depth, a subtle reveal transition, and a stable crop frame so the product photography does not appear to jump, stretch, or clash with the page background.

## Access note

21st metadata research completed successfully. The free code-retrieval quota was exhausted before code retrieval, so no 21st component code was copied. This does not block an original, source-informed implementation using the project’s existing React and CSS architecture.
