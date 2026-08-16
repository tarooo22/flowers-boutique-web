# Typography System — განხორციელების ანგარიში

**თარიღი:** 2026-08-16  
**საზღვრები:** ეს ცვლილება არის მხოლოდ typography system-ის ცენტრალიზებული განახლება. Layout, spacing, colors, components, images, routes, functionality და responsive behavior არ შეცვლილა.

## შედეგი

საიტის რეგულარული UI ტექსტი გადაყვანილია ერთიან `Noto Sans Georgian` სისტემაზე. Design system-ში დაემატა display architecture, რომელიც მომავალში შეძლებს ლოკალურად, კანონიერად მოწოდებული `Amelie Display` font asset-ის მიღებას; ამ ეტაპზე იგი უსაფრთხოდ ეცემა public, Georgian-safe `Noto Serif Georgian` fallback-ზე. ეს serif fallback შეგნებულად გამოიყენება მხოლოდ editorial/display headings-ისთვის, რათა სათაურები UI ტექსტისგან ვიზუალურად გამოეყოს.

> Repository audit-მა ვერ იპოვა არცერთი local `.woff`, `.woff2`, `.ttf` ან `.otf` font asset. შესაბამისად, **Amelie Display არ ჩატვირთულა და არც მესამე მხარის წყაროდან გადმოწერილა**.

| სფერო | განხორციელება |
|---|---|
| Primary UI font | `Noto Sans Georgian`, შემდეგ `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif` |
| Display architecture | `Amelie Display`, შემდეგ `Noto Serif Georgian`, შემდეგ `Noto Sans Georgian` და system serif stack |
| UI weights | Body `400`; navigation/metadata `500`; buttons/labels `600`; emphasis `700` — არსებული component weight hierarchy უცვლელად არის დაცული |
| Font delivery | Google Fonts-ის `Noto Sans Georgian` და `Noto Serif Georgian` requests (400/500/600/700); Space Mono request ამოღებულია |
| Legacy inline fonts | ძველი Cormorant Garamond, Noto Serif Georgian და DM Sans inline declarations final shared cascade-ით Noto Sans Georgian-ზე გადადის |

## შექმნილი typography tokens

```css
--f-ui: "Noto Sans Georgian", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--f-display: "Amelie Display", "Noto Serif Georgian", "Noto Sans Georgian", Georgia, serif;
```

`--f-ui` არის primary regular UI token. ის იკვებება Wave 1 aliases (`--fb-font-ui`, `--fb-font-label`) და Amelie-first aliases (`--am-ui`, `--am-label`). `--f-display` არის editorial heading token; ლოკალური Amelie font file-ის არქონისას იგი რეალურად იტვირთება როგორც `Noto Serif Georgian`, ხოლო navigation, buttons, controls და body copy რჩება `Noto Sans Georgian`-ზე.

## გამოყენების სფერო

| Typography class | გამოყენებული ადგილები |
|---|---|
| `var(--f-ui)` | Body, navigation, buttons, form controls, labels, filters, product card title/description/price, footer, dialogs, mobile navigation და regular UI text |
| `var(--f-display)` | Homepage hero H1, Home section headings, promo heading, editorial service headings, catalog intro H1, shared brand/wordmark selectors და public route H1 headings |
| Hero calibration | `font-weight: 400`, `line-height: 1.05`, `letter-spacing: -0.02em`; არსებული responsive H1 size clamp და layout შენარჩუნებულია |

## შეცვლილი ფაილები

| ფაილი | ცვლილება |
|---|---|
| `client/src/index.css` | `--f-ui`, `--f-display`, global heading/body aliases და shared legacy brand selectors |
| `client/index.html` | Noto Sans Georgian UI და Noto Serif Georgian display fallback requests; Space Mono request ამოღებულია |
| `client/src/styles/wave1-reference.css` | Wave 1 UI/label aliases გადაყვანილია shared token-ზე; heading architecture არის `--f-display` |
| `client/src/styles/amelie-rebuild.css` | Amelie UI/label aliases გადაყვანილია shared token-ზე; final UI/display selector cascade დაემატა |
| `server/typography.system.contract.test.ts` | ახალი typography contract: tokens, aliases და permitted font request-ის source coverage |

## Responsive visual QA

სკრინშოტები შემოწმდა რეალური public routes-ზე: Home (`/`), Catalog (`/catalog`) და არსებული Product Detail (`/product/60001`). Georgian სიმბოლოების, control labels-ის, product card typography-ის, hero heading-ისა და CTA ტექსტის clipping ან mixed font fallback არ გამოვლენილა.

| Viewport | შემოწმებული surface | შედეგი |
|---|---|---|
| 375px | Mobile header, hero, category controls, catalog filters/product labels, real Product Detail CTA | PASS — Georgian glyphs იკითხება და ტექსტი არ იჭრება |
| 768px | Tablet header/hero, catalog filters/product cards | PASS — heading/body hierarchy და card labels თანმიმდევრულია |
| 1024px | Desktop-style Home hero, navigation, catalog heading/filters/card grid | PASS — UI font weights სტაბილურია და overflow არ გამოჩნდა |
| 1440px | Home, Catalog, real Product Detail title/price/CTA/detail cards | PASS — serif display headings ვიზუალურად გამოირჩევა, UI text კი Noto Sans Georgian-ზე რჩება |

Footer ასევე იღებს `--f-ui`-ს shared final cascade-იდან; mobile navigation და modal/control content იგივე font system-ს ეყრდნობა.

## Runtime computed-style verification

Playwright audit-მა პირდაპირ running application-ის DOM-დან დაადასტურა, რომ ორივე public font resource იტვირთება (`document.fonts.check` ორივესთვის `true`). Computed `font-family` chain ყველა display heading-ზე არის `"Amelie Display", "Noto Serif Georgian", "Noto Sans Georgian", Georgia, serif`, ხოლო UI controls-ზე არის `"Noto Sans Georgian", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

| Route | Display element | Computed size / weight | UI element | Computed font family |
|---|---|---|---|---|
| Home | `.am-home-hero h1` | 56px / 400 | `.am-primary-nav a` | Noto Sans Georgian stack |
| Catalog | `.fb-catalog-intro h1` | 56px / 500 | `.fb-filter-list button` | Noto Sans Georgian stack |
| Product Detail | `.fb-product-copy h1` | 72px / 500 | `.fb-product-add` | Noto Sans Georgian stack |

## Validation

| შემოწმება | შედეგი |
|---|---|
| Focused typography/Home contracts | PASS — `typography.system.contract` და protected Home interaction contract |
| `pnpm test` | PASS — 40 test files passed, 3 skipped; 153 tests passed, 10 skipped |
| `pnpm check` | PASS — `tsc --noEmit` |
| `pnpm build` | PASS — production bundle შეიქმნა წარმატებით |

Production build-ში არსებული >500 kB chunk advisory კვლავ non-blocking warning-ია და ამ typography-only ცვლილებასთან კავშირი არ აქვს.
