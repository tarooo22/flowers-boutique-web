# Uploaded skill.zip — implementation notes

Source: user-provided `/home/ubuntu/upload/skill.zip`, inspected in `/home/ubuntu/upload/skill_inspection/` on 2026-08-14.

## Relevant skill roles

- **UX Architect** (`SKILL (1).md`): foundation-first CSS architecture, semantic tokens, responsive mobile-first layout, clear information hierarchy, accessible interaction patterns.
- **UX Researcher** (`SKILL (2).md`): validate user flows, reduce cognitive load, prioritize clear navigation and conversion-oriented CTA placement.
- **Brand Guardian** (`SKILL (3).md`): protect Flower’s Boutique identity, keep Georgian-first bilingual voice, preserve typography/color consistency, and avoid copying a competitor’s exact identity.
- **UI Designer** (`SKILL (5).md`): component foundations, reusable card states, WCAG AA contrast, 44px touch targets, reduced-motion support, responsive breakpoints, and performance-conscious assets.
- **Frontend Developer** (`SKILL (6).md`): React/TypeScript implementation, mobile-first accessibility, semantic HTML/ARIA, keyboard navigation, performance-aware imagery, and regression testing.
- **Senior Developer** (`SKILL (8).md`): premium craftsmanship, deliberate CSS, restrained micro-interactions, and performance/beauty balance; the Laravel/Livewire-specific parts do not apply to this React/Vite project.
- **Image Prompt Engineer** (`SKILL.md`): detailed original photography prompts, intentional composition and negative space, no logos/text/watermarks, and consistent brand direction.

## Constraints applied to this project

- Preserve existing React/Vite/TypeScript architecture, routes, APIs, admin/cart/checkout/database behavior, bilingual brand, prices, delivery policy, and BOG sandbox-only mode.
- All image assets must use persistent `/manus-storage/...` URLs in application code; no local project media paths.
- New motion uses transform/opacity only, stays under 300ms where UI interaction is involved, and honors `prefers-reduced-motion`.
- Keep existing contract class names and accessibility hooks unless tests and implementation are intentionally updated together.
- New Home page work should be additive and should use original collection/editorial designs inspired by component principles rather than reproducing another site exactly.

## Reference source

21st community component reference supplied by user: https://21st.dev/community/components
