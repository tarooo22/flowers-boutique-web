# New-arrivals product grid — 21st pattern research

**Source library:** [21st Community Components](https://21st.dev/community/components)

| Pattern | Source | Design principle adapted for Flower’s Boutique |
|---|---|---|
| Product Reveal Card | [21st component](https://21st.dev/@isaiahbjork/components/product-reveal-card) | Keep purchase intent close to the image through a restrained action reveal and a clear visual-first hierarchy. |
| Product Card | [21st component](https://21st.dev/@ravikatiyar162/components/product-card) | Use a subtle image lift and quiet surface contrast rather than decorative effects. |
| Hover Detail Card | [21st component](https://21st.dev/@isaiahbjork/components/hover-detail-card) | Reveal contextual detail only when the pointer or keyboard focus indicates intent. |

## Implementation boundaries

The implementation uses the existing `ProductCard` component and CSS only. It does not import 21st source code, add runtime dependencies, modify product data, or change cart, wishlist, availability, pricing, or product-route behavior. Motion remains limited to `opacity` and `transform`, uses the existing ease-out token, stays below 300 ms for interaction feedback, and is disabled for reduced-motion preferences.
