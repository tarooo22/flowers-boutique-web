# Flower’s Boutique — Canonical Public Design System

> Read `design-system/flower-s-boutique/pages/[page-name].md` before page work. Page files may override composition, but never accessibility, truthfulness, typography, responsive, or interaction rules below.

**Project:** Flower’s Boutique  
**Direction:** light, calm, modern flower ecommerce  
**Density:** comfortable and product-focused  
**Motion:** restrained; 140–300ms for controls and overlays

## Brand principles

- Real Flower’s Boutique photography supplies most of the colour.
- White, soft cream and warm grey are the dominant public surfaces.
- Dusty rose is the primary accent; muted sage supports delivery and botanical information.
- Interface decoration stays quiet and product browsing stays obvious.
- Georgian is the default language; English is an equal secondary language.
- The result must remain original. Reference sites may inform clarity and density, never brand or code.

## Canonical semantic tokens

| Token                |     Value | Use                            |
| -------------------- | --------: | ------------------------------ |
| `--surface-page`     | `#FAF9F7` | page background                |
| `--surface-card`     | `#FFFFFF` | cards, sheets, dialogs         |
| `--surface-soft`     | `#F5F2EE` | section contrast               |
| `--text-primary`     | `#282828` | headings and primary UI        |
| `--text-secondary`   | `#44413F` | body copy                      |
| `--text-muted`       | `#6F6B68` | secondary metadata             |
| `--accent-primary`   | `#9C727A` | accessible dusty-rose action   |
| `--accent-soft`      | `#F3E9EB` | quiet selected/feature surface |
| `--accent-botanical` | `#7E8A78` | botanical support              |
| `--border-default`   | `#E5E1DD` | thin borders                   |
| `--focus-ring`       | `#8B5F68` | keyboard focus                 |
| `--success`          | `#52704F` | semantic success               |
| `--warning`          | `#946A35` | semantic warning               |
| `--error`            | `#A33F47` | semantic error                 |

Supporting palette: white `#FFFFFF`, soft cream `#F5F2EE`, warm grey `#ECE8E4`, soft panel `#F1EEEA`, soft rose `#E3D3D6`, pale sage `#E8ECE5`, warm clay `#B88E7E`.

Do not use dominant gold, large black public sections, saturated pink gradients, low-contrast grey copy, or random component colours.

## Typography

- Georgian body, UI, navigation, products and prices: `Noto Sans Georgian`.
- Selected Georgian brand statements only: `Noto Serif Georgian`.
- English uses the compatible loaded sans-serif; serif is limited to small brand moments.
- Hero: `clamp(2.1rem, 4.4vw, 4.5rem)`.
- Section heading: `clamp(1.65rem, 2.7vw, 2.8rem)`.
- Product name and price: 15–17px.
- Body: 15–17px.
- Navigation: 14–16px.
- Avoid wide Georgian letter spacing, ultra-light weights and more than two active families.

## Layout

- Wide container: 1400px; normal content: 1320px; readable prose: 680px.
- Gutter: 16px minimum, 18–20px near 390px, 28–36px tablet, 48–64px desktop.
- Section spacing: 64–88px mobile, 96–120px desktop.
- Corners: 8–12px on imagery/cards; smaller controls may use 7–8px.
- Borders stay thin; shadows are rare and subtle.

## Components

### Buttons

- Minimum touch target: 44×44px; primary actions are 48px high.
- Primary action: accessible dusty rose with white text.
- Secondary: white or transparent with a visible border.
- Always include hover, active, disabled and 3px focus-visible states.

### Navigation

- Sticky white/cream header with a thin border, a discreet real-contact utility strip and only a small scrolled shadow.
- Desktop places the Flower's Boutique brand at the left, clear primary links in the middle and practical utility actions at the right.
- Mobile uses a 44px menu target, centred brand and practical search/cart actions.
- Bottom navigation appears only on public shopping routes and never covers checkout/admin/builder controls.

### Product card

- One canonical card for homepage and catalog.
- Real product photography at 3:4; no dark overlay, heavy shadow or fake badge.
- Sans-serif two-line product name and immediately visible GEL price.
- 44×44px wishlist target and understandable mobile action.
- Only a subtle image scale may run on hover.

### Forms and overlays

- Reuse Radix/shadcn primitives.
- Inputs have visible labels, 44px minimum height and clear errors.
- Drawers/dialogs trap focus, close on Escape and restore focus.

## Responsive and accessibility

- Test at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px.
- Two-column mobile products remain readable; no horizontal page overflow.
- WCAG 2.2 AA contrast; no body copy uses decorative accent colours.
- Icon-only actions require localized labels.
- Respect safe areas and `prefers-reduced-motion`.

## Performance and truthfulness

- Keep route splitting; homepage must not load admin, checkout, map, builder or payment bundles.
- Preload only the real hero asset; lazy-load below-fold imagery with explicit dimensions.
- Never invent reviews, ratings, delivery promises, contact data, discounts or stock.
- Preserve server, auth, sessions, database, payments, analytics, cart and order logic.
