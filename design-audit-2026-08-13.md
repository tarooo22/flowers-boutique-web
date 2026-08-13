# Flower’s Boutique — Visual Refinement Baseline

**Scope.** Read-only desktop and 375px mobile review of public storefront, discovery, informational, account, and access-gated admin shell routes. No product edits, orders, customer information, payment information, credentials, or settings were opened.

## Existing strengths to preserve

The current site already has a coherent modern Tbilisi floral-atelier foundation: warm cream canvases, dusty-rose accents, expressive Georgian editorial headlines, generous negative space, persistent contact bar, and a consistent bilingual wordmark. Account entry screens offer a clear editorial image split, and the delivery/discovery content has a calm, trustworthy information hierarchy.

## Refinement opportunities

| Surface | Observation | Refinement direction |
|---|---|---|
| Header and navigation | The desktop header is clean but its compact utility icons and text navigation share similar visual weight. Mobile requires a more intentional compact-navigation rhythm. | Introduce a crisper hierarchy, clearer active states, more tactile utility controls, and a deliberate mobile menu surface while preserving all existing destinations. |
| Product discovery | Catalog, product cards, and builder controls do not yet share the full editorial polish of the home and discovery pages. | Adopt a consistent product-card, chip, filter, empty-state, and action-bar vocabulary inspired by selected 21st patterns. |
| Forms and checkout | Registration is visually strong, while service, checkout, and account controls vary in spacing, grouping, and feedback treatment. | Unify labels, field shells, validation feedback, payment/delivery summary panels, and CTA hierarchy without changing server-authoritative commerce behavior. |
| Informational pages | Delivery, returns, privacy, and terms use readable but repeated card stacks that become dense on long pages. | Create a lighter editorial content-frame rhythm with section anchors, controlled card elevation, and more legible long-form spacing. |
| Admin shell | The anonymous access state is intentionally minimal; the owner-authenticated Products shell was already separately validated. | Preserve role gates and private-data constraints; refine only shared dashboard chrome, tabs, controls, and responsive surfaces. |

## Design direction

**Modern Tbilisi floral atelier:** airy cream canvas, botanical charcoal text, dusty-rose primary accent, restrained leaf-green support, and a single, recognizable floral-emblem detail. Display typography is reserved for heroes and major editorial sections; product, navigation, form, and dashboard UI receives a quieter functional type scale. Interactions should use short transform/opacity transitions and honor reduced-motion preferences.

## 21st inspiration shortlist

The implementation will adapt patterns rather than import an unrelated visual system wholesale. The selected catalog references are compatible with the existing React, Tailwind, and shadcn/ui stack, but Flower’s Boutique typography, bilingual content, product data, and commerce behavior remain project-specific.

| Pattern | 21st reference | Intended adaptation |
|---|---|---|
| E-commerce navigation | [Shop Navigation Menu](https://21st.dev/@bundui/components/navigation-menu4) | More intentional collection hierarchy, compact utility controls, and a mobile-friendly navigation surface. |
| Product discovery | [Product Drop Card](https://21st.dev/@ravikatiyar162/components/product-card-3) | Editorial featured-product treatment for curated storefront surfaces. |
| Product media | [Product Image Card](https://21st.dev/@ruixen.ui/components/product-image-card) | Clearer product-media framing, gallery states, and touch-friendly controls. |
| Product detail | [E-commerce Product Detail](https://21st.dev/@dhileepkumargm/components/e-commerce-product-detail) | Accessible product-detail hierarchy, selection states, and purchase-action grouping. |

## Shared implementation note

The current Navbar already contains the required cart count, authentication state, language selector, accessible search dialog, mobile sheet, contact sheet, and role-aware admin path. The global stylesheet contains multiple historic `fb-*` and `p1-*` visual systems alongside the active design tokens. The refinement should therefore use one scoped modern layer for shared `p1-*` surfaces and reusable component primitives, avoiding destructive replacement of route-specific styles or functional markup.

## Phase 3 verification — shared system

The desktop Home and Catalog checks confirm the refined header retains readable navigation hierarchy, centered utility context, visible cart/account/search controls, and a calmer product-discovery rhythm. Catalog filters remain functional in their existing layout and product cards retain their existing price, wishlist, and cart affordances. The product-detail path used for the visual baseline did not resolve a populated product record, so it is not treated as evidence for the product-detail media interface.

At 375×812, the mobile header preserves a readable Georgian wordmark, menu trigger, and cart access without document-level overflow. The empty-cart view retains an appropriately prominent return-to-collection action and footer hierarchy. The Cart and Checkout entry points did not create a cart or submit an order during this check. A route-specific pass remains required for populated product detail, bouquet builder, checkout form, account, and admin presentation states.

## Phase 4 verification — route-level presentation

Read-only desktop and 375×812 screenshots were captured after the route-level refinement layer for product detail, checkout, bouquet builder, contact, login, registration, and the anonymous admin access surface. No catalog item, order, cart, customer, payment, or account data was created, read, edited, or submitted during this review.

The **product detail** keeps a clear editorial hierarchy between its media surface, signature label, title, availability token, quantity control, purchase CTA, delivery cues, and detail cards. The inspected path presented the existing image-unavailable placeholder instead of a broken browser image. The fallback is legible and visually contained; image-data remediation is outside this presentation-only pass.

The **bouquet builder** preserves its florist-studio composition while gaining a more coherent panel hierarchy and responsive control density. On mobile, the selection panel precedes the ingredient list and summary in a single readable flow; touch controls remain visible and no document-level horizontal overflow was observed.

The **contact, login, and registration** views now share a calmer form cadence with aligned fields, focused card hierarchy, and their existing branded media treatment. Desktop and mobile views show readable labels and single-column form flow without confirmed clipping. The admin route remains an intentionally generic access-denied surface for an anonymous preview; no protected admin tabs or records were opened.

The global refinement leaves delivery, footer, primary navigation, contextual headers, active states, buttons, catalog cards, and data-entry surfaces visually consistent. At 375px the compact header preserves the visible brand, menu trigger, and cart action without competing controls. The remaining step is automated test/build verification plus a final responsive sweep of remaining public routes.

### Account CTA follow-up

The final 375×812 Login and Registration captures confirm an intact stacked field sequence, readable Georgian labels, visible password affordance, clear account-switch link, and a high-contrast full-width submit action. The account hero image remains muted behind the form card so contrast stays suitable for data entry. No user credentials were entered and no registration or login action was submitted. The account CTA intentionally retains its deep, high-contrast treatment against the dusty-rose supporting accents; the final styling layer reserves the same dimensions, focus treatment, and interaction elevation as storefront primary actions.

## Mobile-first baseline — 375px pass

Two read-only 375px capture passes covered the primary storefront and information flows, followed by product, discovery, and account/access surfaces. The review remained non-transactional: no cart line was added, no checkout was submitted, no account credentials were entered, and no protected administrative data was opened.

The compact header, primary navigation controls, catalog discovery surfaces, empty-cart/checkout entry states, informational page rhythm, product/discovery templates, and account forms remain the active target groups for the dedicated mobile-first refinement. The next implementation pass will strengthen shared mobile spacing, compact heading scale, control density, safe-area clearance, and horizontal-overflow safeguards before route-specific mobile styling is adjusted. This baseline does not infer populated product, order, or authenticated admin data states.

### 390px mobile-first audit — 2026-08-13

The second mobile audit pass at **390px** covered storefront, discovery, editorial, account, commerce, legal, and empty-state surfaces without opening protected records or submitting any form, order, or payment. The shared header, compact card density, responsive product media, vertically sequenced account forms, and mobile safe-area clearance remain structurally sound at this width.

The remaining opportunity is presentation refinement rather than a route-breaking issue: small-screen navigation needs clearer active-state feedback and scroll affordance, compact page labels need a more predictable tracking and line-height rhythm, and selected dense filters/forms benefit from slightly stronger grouping, tap feedback, and bottom-action clearance. The next pass will therefore retain the existing layout architecture and strengthen its mobile interaction hierarchy through additive CSS only. Commerce rules, catalog data, authentication behavior, delivery policy, and BOG sandbox state remain out of scope.

## Mobile-first implementation verification — 375px and 390px

The shared mobile layer now provides explicit active-page semantics in the mobile navigation, 44px utility and action targets, a compact type-and-spacing rhythm, fixed bottom-navigation clearance, safe-area awareness, and document-level overflow guards. Its reduced-motion branch removes the non-essential mobile active-state transition and icon offset. The implementation is additive: existing storefront, catalog, authentication, cart, checkout, payment, and delivery behavior remains unchanged.

The route-specific mobile layer was inspected at **390×844** on product detail, bouquet builder, delivery, contact, the anonymous admin gate, and the empty-cart checkout entry state. Product hierarchy, builder step flow, long-form delivery cards, contact form grouping, anonymous-admin access feedback, footer, and header remain readable without a confirmed horizontal clipping defect. The empty-cart checkout path correctly returned to its existing storefront entry state; no cart item was created solely to force a populated checkout form. Consequently, checkout-form refinement is source-scoped and will be covered by automated markup/contracts rather than represented as a populated-cart visual test.

The product route continued to show its pre-existing, contained image-unavailable state rather than a browser-broken image. This is preserved deliberately: asset or catalog-data remediation is not part of the mobile presentation scope. The profile capture did not complete in the automated context; Login and Registration screens were independently rechecked at 375px and remain the evidence for the public account-entry treatment. No credentials, customer data, orders, payment data, or protected admin tabs were accessed.
