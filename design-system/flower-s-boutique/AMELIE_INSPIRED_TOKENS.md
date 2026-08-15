# Flower’s Boutique — Amelie-inspired token extension

**სტატუსი:** Implementation-ready foundation  
**ფარგლები:** მხოლოდ Flower’s Boutique-ის ორიგინალური visual system. Reference-იდან აღებულია light editorial density, warm cream surfaces, coral action hierarchy, botanical support და rounded-card rhythm; არ არის გადმოტანილი სხვისი ბრენდი, ტექსტი, asset-ები, ფასები ან კომერციული დაპირებები.

> **დიზაინის მიმართულება:** Georgian-first floral atelier — თბილი, editorial და პროდუქტისკენ ორიენტირებული. რეალური თაიგულები რჩება მთავარი ვიზუალური ფოკუსი; interface მათ არ ეჯიბრება.

## 1. Color roles

| როლი | Token | მნიშვნელობა | გამოყენება |
| --- | --- | --- | --- |
| Canvas | `--fb-token-page` | `#FAF6EF` | ძირითადი page canvas და ფართო editorial სივრცეები |
| Surface | `--fb-token-surface` | `#FFFDF9` | product card, dialog, elevated content |
| Soft panel | `--fb-token-panel` | `#F4EFE6` | მშვიდი section contrast და secondary surfaces |
| Ink | `--fb-token-ink` | `#211E1B` | headings, ფასები და მთავარი UI ტექსტი |
| Muted ink | `--fb-token-muted` | `#6B6459` | supporting copy და metadata |
| Action coral | `--fb-token-coral` | `#D65C47` | primary CTA, selected action და key conversion |
| Action coral hover | `--fb-token-coral-hover` | `#B94737` | pointer hover/active hierarchy |
| Soft coral | `--fb-token-coral-soft` | `#F8E5DF` | selected surface, soft promotion, inline highlight |
| Botanical | `--fb-token-botanical` | `#1F5C3B` | delivery/service support და calm secondary action |
| Soft botanical | `--fb-token-botanical-soft` | `#E5EFE7` | botanical information panel |
| Quiet border | `--fb-token-line` | `#E7DED2` | cards, inputs, navigation separation |
| Charcoal | `--fb-token-charcoal` | `#1B1A18` | dark conversion/footer sections |
| Inverse text | `--fb-token-inverse` | `#FFFDF9` | dark-surface copy |

**Contrast rule.** `--fb-token-coral` გამოიყენება მხოლოდ თეთრ/თითქმის თეთრ ტექსტთან primary CTA-ზე ან როგორც დეკორატიული/selected accent; body copy იყენებს მხოლოდ `--fb-token-ink` ან `--fb-token-muted`.

## 2. Typography

| დონე | Token | ზომა | Line-height | გამოყენება |
| --- | --- | ---: | ---: | --- |
| Display | `--fb-type-display` | `clamp(2.35rem, 5.2vw, 5.25rem)` | `0.98` | მხოლოდ დიდ editorial/brand moments |
| Hero | `--fb-type-hero` | `clamp(2.1rem, 4.4vw, 4.5rem)` | `1.02` | არსებული hero carousel |
| Section | `--fb-type-section` | `clamp(1.8rem, 3vw, 3.1rem)` | `1.1` | section headlines |
| Title | `--fb-type-title` | `clamp(1.3rem, 1.8vw, 1.65rem)` | `1.2` | cards, dialogs, product-group labels |
| Body | `--fb-type-body` | `1rem` | `1.6` | default Georgian-first copy |
| Small | `--fb-type-small` | `0.875rem` | `1.5` | metadata/navigation |
| Micro | `--fb-type-micro` | `0.75rem` | `1.4` | utility labels only |

`--font-heading` რჩება `Noto Serif Georgian`-ად და გამოიყენება მხოლოდ display, hero და section headings-ზე. `--font-body` რჩება `Noto Sans Georgian`-ად და გამოიყენება navigation, product UI, ფასები, forms და explanatory copy-ისთვის. Georgian ტექსტზე არ გამოიყენება გაფართოებული letter spacing.

## 3. Space, layout, and shape

| კატეგორია | Tokens | მნიშვნელობა |
| --- | --- | --- |
| Base unit | `--fb-token-unit` | `4px` |
| Space scale | `--fb-token-space-1` … `--fb-token-space-10` | `4, 8, 12, 16, 24, 32, 48, 64, 96, 128px` |
| Responsive gutter | `--fb-token-gutter` | `clamp(16px, 3.3vw, 64px)` |
| Reading width | `--fb-token-prose` | `680px` |
| Standard container | `--fb-token-content` | `1320px` |
| Wide container | `--fb-token-wide` | `1400px` |
| Radius small | `--fb-radius-sm` | `8px` — compact controls |
| Radius medium | `--fb-radius-md` | `12px` — cards and inputs |
| Radius large | `--fb-radius-lg` | `16px` — editorial/service panels |
| Radius pill | `--fb-radius-pill` | `999px` — chips and compact filters only |

Section space გამოიყენებს `clamp(64px, 8vw, 120px)`; card padding იყენებს `16px` mobile-ზე და `24px` desktop-ზე. Card radius არ იზრდება `16px`-ზე ზემოთ, რათა flower photography და product density premium, მაგრამ წასაკითხად მარტივი დარჩეს.

## 4. Elevation, states, and motion

| როლი | Token / Rule | მნიშვნელობა |
| --- | --- | --- |
| Hairline | `--fb-line-hairline` | `1px solid var(--fb-token-line)` |
| Quiet elevation | `--fb-shadow-quiet` | `0 8px 22px rgba(38, 28, 20, 0.055)` |
| Raised elevation | `--fb-shadow-raised` | `0 18px 42px rgba(38, 28, 20, 0.11)` |
| Focus | `--fb-focus-token` | `0 0 0 3px rgba(214, 92, 71, 0.28)` |
| Fast motion | `--fb-duration-fast` | `160ms` |
| Standard motion | `--fb-duration-base` | `220ms` |
| Easing | `--fb-ease-token` | `cubic-bezier(0.23, 1, 0.32, 1)` |

Hover გამოიყენებს მხოლოდ `transform`, `opacity`, `color`, `background-color`, `border-color` და `box-shadow` ცვლილებებს. Interactive control-ებს აქვს 44px მინიმალური target, `:focus-visible` ring, `:active` scale(0.97) და `prefers-reduced-motion` fallback. Scroll/reveal effect-ები არ ცვლიან layout-ს და არ აჭარბებენ 300ms-ს.

## 5. Adoption boundary

Token layer დაემატება **append-only** წესით `client/src/index.css`-ის ბოლოში. თავდაპირველად ის visual roles-ს მიამაგრებს საერთო header/footer, shared CTA, card და Home editorial surfaces-ზე; არ ცვლის routes, JSX structure, catalog data, cart, checkout, auth, delivery policy, BOG sandbox behavior ან persistent-storage image URL-ებს.

შემდგომი გვერდები token-ებს გამოიყენებენ იმავე სახელებით: Catalog → Product Detail → Builder → Cart/Checkout → Auth → Account/Admin. ასე თავიდან ავიცილებთ ერთჯერად hard-coded colors-სა და არათანმიმდევრულ spacing-ს.

## 6. Validation record — 2026-08-16

Token layer შემოწმდა Home და Catalog route-ებზე **1280px**, **390px** და **320px** viewport-ებში. warm-canvas palette, Georgian display hierarchy, product surfaces, action contrast და compact mobile grid თითოეულ breakpoint-ზე წასაკითხად დარჩა.

Source-level regression coverage, სრული Vitest suite, `tsc --noEmit` და production build წარმატებით დასრულდა. QA-ის შემდეგ browser და development-server diagnostics-ში ახალი runtime error არ გამოვლენილა. Production build-ში დარჩა არსებული main-client-bundle size advisory; იგი არ არის blocking და token layer-ს არ დაუმატებია ახალი dependency ან runtime logic.

ამ wave-ში არ შეცვლილა catalog data, persistent media, routes, cart, checkout, authentication, canonical delivery values, database state, payment integration ან BOG sandbox configuration.
