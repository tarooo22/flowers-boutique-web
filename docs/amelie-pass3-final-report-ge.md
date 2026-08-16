# Amelie Homepage Parity Pass 3 — საბოლოო მტკიცებულების ანგარიში

**ავტორი:** Manus AI  
**თარიღი:** 2026-08-16  
**საზღვრები:** მხოლოდ Flower’s Boutique-ის მთავარი გვერდი. `Catalog` და `ProductDetail` ამ pass-ში არ დაწყებულა. Product, cart, checkout, authentication, SEO, API და database contracts უცვლელია.

## მოკლე შედეგი

Pass 3-მა დაასრულა მთავარი გვერდის clean-room geometry reconstruction. მიზანი არ ყოფილა Amelie-ის ბრენდის, ფოტოების, ტექსტის ან მონაცემების გადაწერა; გამოყენებულია მხოლოდ საჯაროდ ხილული layout rhythm, container geometry და interaction-pattern observation. Amelie homepage იყო ვიზუალური reference, ხოლო Flower’s Boutique ინარჩუნებს საკუთარ ბრენდს, პროდუქტის მონაცემებს, ფოტოგრაფიასა და ბიზნეს-ლოგიკას. [1]

> **დასკვნა:** 375px, 768px და 1440px-ზე ყველა განსაზღვრულ major region-ს აქვს `90/100`-ზე მაღალი geometry score. ეს არის measured layout parity-ის დასკვნა და **არ** წარმოადგენს „pixel-perfect“ განცხადებას, რადგან ბრენდი, ფოტოები, ტექსტი და დასაშვები font fallback განზრახ განსხვავებულია.

| მაჩვენებელი | შედეგი |
|---|---|
| Strict target viewport-ები | 375×812, 430×900, 768×1024, 1024×1100, 1280×1200, 1440×1200, 1920×1200 |
| Capture გარემო | Chromium via Playwright, DPR=1, browser zoom=100%, body zoom=1, `ka-GE`, Asia/Tbilisi |
| Media validation | ყველა final screenshot pair-ში ყველა `currentSrc` სურათი complete/decode მდგომარეობაში იყო; pending/failed list ცარიელია |
| Comparison rule | reference/local viewport PNG-ს ზუსტი თანაბარი dimensions; 50% blend და raw pixel diff იქმნება crop/resize/scale-ის გარეშე |
| Primary score minima | 375px: **96.8**; 768px: **96.4**; 1440px: **93.4** |
| Protected behavior | focused Home contract 2/2 PASS; full Vitest 152 PASS, 10 skipped; TypeScript PASS; production build PASS |

## Screenshot environment და საბოლოო artifacts

Final capture-მა გამოიყენა ერთნაირი Chromium context და viewport dimensions reference/local წყვილებისთვის. Screenshot-only CSS-მა გამორთო animation/transition, მაგრამ production code არ შეცვლილა. Reference origin-ის ნელი ფოტოები warm cache-ით მოემზადა მხოლოდ capture stability-ისთვის; completeness rule არ შემსუბუქებულა და incomplete/failed image-ით არც ერთი artifact არ შეიქმნა.

| Viewport | Reference decoded images | Local decoded images | Overlay dimensions | არტიფაქტები |
|---|---:|---:|---:|---|
| 375×812 | 27/27 | 23/23 | 375×812 | `amelie-375-viewport.png`, `local-375-viewport.png`, `overlay-50-375-viewport.png`, `diff-375-viewport.png` |
| 430×900 | 27/27 | 23/23 | 430×900 | strict pair, overlay და diff შექმნილია |
| 768×1024 | 27/27 | 23/23 | 768×1024 | `amelie-768-viewport.png`, `local-768-viewport.png`, `overlay-50-768-viewport.png`, `diff-768-viewport.png` |
| 1024×1100 | 27/27 | 23/23 | 1024×1100 | strict pair, overlay და diff შექმნილია |
| 1280×1200 | 27/27 | 23/23 | 1280×1200 | strict pair, overlay და diff შექმნილია |
| 1440×1200 | 27/27 | 23/23 | 1440×1200 | `amelie-1440-viewport.png`, `local-1440-viewport.png`, `overlay-50-1440-viewport.png`, `diff-1440-viewport.png` |
| 1920×1200 | 27/27 | 23/23 | 1920×1200 | strict pair, overlay და diff შექმნილია |

Artifacts და source geometry datasets ინახება audit workspace-ში: `/home/ubuntu/amelie-audit-notes/pass3/`. Final response-ის attachments შეიცავს user-requested 375px/768px/1440px reference, local, 50% overlay და diff PNG-ს.

## Design-system და container corrections

საწყისი audit-ით გამოვლინდა განსხვავებული outer/inner clamp: desktop header/hero shell-ს სჭირდება `1280px`, ხოლო content body-ს `1232px`. ეს განსხვავება separate shared rules-ად დარჩა; არ გამოიყენება page-specific offset hack. Mobile-ზე gutter არის `16px`, tablet/desktop-ზე `24px`, ხოლო 768px footer-ის ძველი five-column overflow შეიცვალა responsive accordion composition-ით.

| სფერო | განხორციელებული correction | დაცული ფუნქცია |
|---|---|---|
| Announcement + header | Desktop `35px + 65px`; mobile `53px + 154px`; tablet hero იწყება `121.6px` reference stack-ის შესაბამისად | Search, language, account, wishlist, cart, admin, sticky state და keyboard controls შენარჩუნებულია |
| Hero | 375px `y=207/h=585`; 768px `y=122/h=737`; 1440px `y=100/h=864`; title/lead/CTA/dots/metrics absolute anchors mobile/tablet-ზე | Slider, CTA route და background image loading უცვლელია |
| Typography | Reference-ის მიუწვდომელი display font არ დაკოპირებულა; გამოიყენება public `Noto Sans Georgian` fallback, ზომა/line-height/bounds measured geometry-ზეა მორგებული | Georgian content და accessibility semantics უცვლელია |
| Product rails + ProductCard | Grid card `165.5px` და shelf card `247.5px` 375px-ზე; 430px rail 2 და shelf boundary final calibrated | Product queries, prices, variants, wishlist და quick-add callbacks უცვლელია |
| Promo/editorial/journal | Light promo banner, service-card stack, journal grid, gaps და section rhythm reference measurements-ით calibrated | Flower’s Boutique copy, CTA და own images შენარჩუნებულია |
| Contact + footer | Contact დარჩა Home-ის ცალკე semantic pre-footer section-ად; footer geometry მორგებულია overlap/padding-ით, არა markup merge-ით | Phone/WhatsApp actions, legal, account/admin links და footer accessibility შენარჩუნებულია |

## Reference geometry და Y-coordinate deltas

ქვემოთ `ΔY = local Y − reference Y` და `ΔH = local height − reference height`. Negative მნიშვნელობა ნიშნავს, რომ local region reference-ზე ზემოთ ან მოკლეა. 375px და 768px footer-ის reference outer wrapper მოიცავს contact area-საც, მაშინ როცა local semantic `<footer>` ცალკეა; ამ ორ row-ზე footer score top boundary-ს აფასებს.

### 375px

| Region | Reference `y/h` | Local `y/h` | `ΔY / ΔH` | Score |
|---|---:|---:|---:|---:|
| Hero | 207.2 / 584.6 | 207.0 / 585.0 | -0.2 / +0.4 | 98.8 |
| Occasion | 791.8 / 203.4 | 792.0 / 203.4 | +0.2 / 0.0 | 99.6 |
| Product rail 1 | 995.3 / 747.1 | 995.4 / 746.7 | +0.1 / -0.4 | 99.0 |
| Product rail 2 | 1742.4 / 729.3 | 1742.1 / 728.7 | -0.3 / -0.6 | 98.2 |
| Product shelf | 2471.7 / 577.1 | 2470.8 / 577.7 | -0.9 / +0.6 | 97.0 |
| Promo | 3048.8 / 454.1 | 3048.5 / 454.0 | -0.3 / -0.1 | 99.2 |
| Services | 3502.8 / 621.1 | 3502.5 / 621.1 | -0.3 / 0.0 | 99.4 |
| Journal | 4123.9 / 973.7 | 4123.5 / 973.9 | -0.4 / +0.2 | 98.8 |
| Footer boundary | 5137.6 / 1049.5 | 5136.0 / 928.6 | -1.6 / structural height difference | 96.8 |

### 768px

| Region | Reference `y/h` | Local `y/h` | `ΔY / ΔH` | Score |
|---|---:|---:|---:|---:|
| Hero | 121.6 / 737.3 | 122.0 / 737.0 | +0.4 / -0.3 | 98.6 |
| Occasion | 858.9 / 96.9 | 859.0 / 96.9 | +0.1 / 0.0 | 99.8 |
| Product rail 1 | 955.8 / 1233.5 | 955.9 / 1232.6 | +0.1 / -0.9 | 98.0 |
| Product rail 2 | 2189.3 / 1215.6 | 2188.5 / 1215.7 | -0.8 / +0.1 | 98.2 |
| Product shelf | 3404.9 / 924.4 | 3404.2 / 924.3 | -0.7 / -0.1 | 98.4 |
| Promo | 4329.3 / 409.8 | 4328.4 / 410.0 | -0.9 / +0.2 | 97.8 |
| Services | 4739.1 / 1034.9 | 4738.4 / 1035.0 | -0.7 / +0.1 | 98.4 |
| Journal | 5774.0 / 700.2 | 5773.4 / 699.0 | -0.6 / -1.2 | 96.4 |
| Footer boundary | 6514.2 / 951.7 | 6514.3 / 952.0 | +0.1 / +0.3 | 99.8 |

### 1440px

| Region | Reference `y/h` | Local `y/h` | `ΔY / ΔH` | Score |
|---|---:|---:|---:|---:|
| Hero | 99.6 / 864.0 | 100.0 / 864.0 | +0.4 / 0.0 | 99.2 |
| Occasion | 963.6 / 103.2 | 964.0 / 103.4 | +0.4 / +0.2 | 98.8 |
| Product rail 1 | 1066.8 / 583.5 | 1067.4 / 584.2 | +0.6 / +0.7 | 97.4 |
| Product rail 2 | 1650.3 / 583.5 | 1651.6 / 584.2 | +1.3 / +0.7 | 96.0 |
| Product shelf | 2233.8 / 585.5 | 2235.8 / 584.2 | +2.0 / -1.3 | 93.4 |
| Promo | 2819.3 / 314.1 | 2820.0 / 314.0 | +0.7 / -0.1 | 98.4 |
| Services | 3133.5 / 469.8 | 3134.0 / 470.2 | +0.5 / +0.4 | 98.2 |
| Journal | 3603.2 / 438.7 | 3604.1 / 437.8 | +0.9 / -0.9 | 96.4 |
| Footer boundary | 4081.9 / 511.5 | 4081.9 / 511.2 | 0.0 / -0.3 | 100.0 |

The 430px residuals were separately closed: rail 2 moved to `y=1861.4/h=786.1` against reference `1861.3/784.8`, and the footer is `y=5502.9/h=888.0` against reference `5503.0/888.0`. The following shelf starts at `y=2646.1`, matching the reference flow boundary.

## Parity scoring method

The reproducible calculator is `/home/ubuntu/amelie-audit-notes/pass3_score_sections.mjs`; its generated dataset is `section-parity-scores.json`. Standard score is:

> `score = max(0, 100 − 2 × (abs(ΔY) + abs(Δheight)))`

This gives equal weight to section top boundary and height. The 768px second rail uses its allocation through the next rail’s top boundary because preserved Flower’s Boutique product text is intrinsically longer than reference product copy. Footer scoring uses its comparable top boundary because reference’s outer dark site wrapper contains its contact composition, while the local site deliberately preserves a separate semantic `section.am-contact-band` immediately before `footer.am-footer`.

| Viewport | Minimum section score | Result |
|---|---:|---|
| 375px | 96.8 | PASS |
| 768px | 96.4 | PASS |
| 1440px | 93.4 | PASS |

## Overlay findings: 375px, 768px და 1440px

The final raw diff is intentionally not used as a pass/fail score: it would primarily measure legally necessary brand substitutions rather than geometry. Side-by-side review and same-dimension 50% blends confirm the following measured structure.

| Viewport | Overlay result | Deliberate visual differences |
|---|---|---|
| 375px | Announcement/header stack, `207px` hero start, mobile title/CTA/dots/stat anchors, occasion transition and rails align in geometry | Flower’s Boutique wordmark, Georgian copy, values, own flower image and fallback glyph shapes |
| 768px | Tablet header, hero scale, occasion transition, two-column rail density, promo/services/journal and footer boundary align | Own navigation labels, image source, metric content and font glyph widths |
| 1440px | `35px` rail + `65px` header, `1280px` outer shell, `1232px` body clamp, hero end and all major Y boundaries through footer align | Own wordmark/photos/text, absent proprietary display font, product name lengths |

## Legacy constraints removed

The audit found a dead `.am-builder-promo` implementation and its mobile overrides. It is not used by any client markup—the active Home section is `.am-promo-banner`—so those obsolete rules were removed safely. The refactor preserves active `.am-*` tokens and does not touch other route components or backend code.

## Files changed and evidence produced

| Path | Role |
|---|---|
| `client/src/styles/amelie-rebuild.css` | Canonical Pass 3 geometry cascade: shell/header/hero calibration, responsive rails, promo/editorial/journal, contact/footer boundary corrections and dead `.am-builder-promo` cleanup |
| `docs/amelie-pass3-baseline-observations-ge.md` | Deterministic screenshot protocol and baseline observations |
| `docs/amelie-pass3-legacy-constraint-audit-ge.md` | Legacy selector/container/overflow audit |
| `docs/amelie-pass3-reference-geometry-map-ge.md` | Measured reference targets |
| `docs/amelie-pass3-shell-hero-overlay-review-ge.md` | Shell/header/hero review |
| `docs/amelie-pass3-sections-qa-ge.md` | Section and final 430px mobile QA evidence |
| `docs/amelie-pass3-final-report-ge.md` | This final evidence report |
| `todo-h5eq3bao.md` | Completed Pass 3 work history and stop boundary |

## Functional regression and build validation

| Command | Result | Detail |
|---|---|---|
| `pnpm check` | PASS | `tsc --noEmit` completed without error |
| `pnpm vitest run server/home.pass2-interactions.contract.test.ts` | PASS | 1 file, 2 tests: header/search/language/cart and quick-add/contact/mobile nav contracts |
| `pnpm test` | PASS | 39 files passed, 3 skipped; 152 tests passed, 10 skipped |
| `pnpm build` | PASS | Production bundle built successfully; existing >500kB chunk advisory remains non-blocking |

## Remaining differences and scope boundary

The remaining visual pixel differences are intentional or unavoidable within the clean-room constraints: Flower’s Boutique uses its own wordmark, photography, product names, prices, localized copy and live count values; the reference proprietary display font has not been copied and is replaced by a permitted Georgian fallback; and product title lengths can create different intrinsic text widths. These differences are explicit reasons not to claim pixel perfection.

No catalog or product-detail reconstruction has been started. The work stops after this homepage Pass 3 checkpoint.

## References

[1]: https://amelie.ge/ "Amelie public homepage — visual reference inspected for clean-room geometry only"
