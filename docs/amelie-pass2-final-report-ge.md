# Flower’s Boutique — Homepage Visual Parity Pass 2

**სტატუსი:** დასრულებულია და მზადაა review-ისთვის. ამ pass-ში შეიცვალა მხოლოდ Homepage-ის public presentation layer. Catalog და ProductDetail-ის შემდეგი reconstruction **არ დაწყებულა**.

> **რეკონსტრუქციის პრინციპი:** Amelie.ge გამოიყენებოდა მხოლოდ საჯაროდ ხილული layout, spacing, typography rhythm და responsive geometry-ის საზომად; Flower’s Boutique-ის ბრენდი, ტექსტი, პროდუქტის მონაცემები, ფოტოები, routes, cart, checkout, localization, SEO და auth/business contracts შენარჩუნდა. [1] [2]

## განხორციელებული ცვლილებები

| არე | Pass 2 შედეგი |
|---|---|
| საერთო design tokens | `amelie-rebuild.css` გახდა გაზომილი presentation cascade: ivory canvas, coral action, 1232px content clamp, measured mobile gutters და responsive geometry. |
| Header და hero | შენარჩუნებულია announcement, navigation, search, language, account, wishlist, cart და sticky behavior; hero იღებს reference-height profile-ს: 585px/648px mobile, 737px tablet, 792px medium desktop, 864px wide desktop. |
| Occasion და rails | აღდგენილია `categories.list` query; ჩიპები იყენებს მაქსიმუმ ხუთ localized Flower’s Boutique category route-ს fallback occasion links-ით. პირველი ორი rail არის grid, მესამე კი scroll-snap shelf. |
| ProductCard | 3:4 media, white bordered body, coral title, secondary description, floating quick-add, favorite state, price hierarchy, hover და responsive card sizes რეკონსტრუირებულია business callbacks-ის შეცვლის გარეშე. |
| Promo | ძველი dark builder split შეიცვალა light/pastel 1.1fr/.9fr promotional banner-ით, მაგრამ `bouquet-builder` CTA და Flower’s Boutique editorial image დარჩა. |
| Editorial | Service cards და Journal grid დაიწერა measured card geometry-ით: desktop service 609×343px და journal 399×312px; 375px-ზე service 343×214px და journal 343×277px. |
| Contact და footer | Home-ში Footer-ის წინ დაემატა დამოუკიდებელი call/WhatsApp action band; footer გახდა measured five-column grid: `1.7fr 1fr 1fr 1fr 1fr`, 28px gap, local shop/info/service/contact/legal data-ით. |

## Section structure და typography

Homepage-ის sequence ახლა არის **hero → occasion chips → two product grids → horizontal product shelf → light promo → paired services → journal → quick-contact band → footer**. ეს ასახავს reference-ის section roles-ს, მაშინ როცა თითოეული link, product, contact და image კვლავ Flower’s Boutique-ის საკუთარია. [1] [2]

Typography შეესაბამება visual geometry-ს legally usable `Noto Sans Georgian`/`Space Mono` stack-ით. Hero H1 გამოიყენებს 400 weight-სა და 1.14 line-height-ს; section headings არის 19–24px measured range-ში; product titles 13–13.5px coral role-შია; footer headings არის 12px/600/.12em, ხოლო links 13px. ეს არჩევანი იმეორებს density-ს და wrap rhythm-ს proprietary font copying-ის გარეშე. [2]

## Screenshot და geometry QA

### ძირითადი screenshot evidence

| Viewport | არტეფაქტი | საზომი დასკვნა |
|---:|---|---|
| 375px | `amelie-375.png`, `local-375.png`, `overlay-diff-375.png` | Header+hero იკავებს reference-ის y=0–792 region-ს. Footer-ს semantic boundary ზუსტად ემთხვევა y=5138 / h=929; local document მხოლოდ 61px-ით გრძელია განსხვავებული localized wrapping-ის გამო. |
| 1440px | `amelie-1440.png`, `local-1440.png`, `overlay-diff-1440.png` | Product grid widths 295px, shelf cards 248px, services 609×343px და journal 399×312px match-დება. Contact-plus-footer dark region local y=4083–4536-ია reference y=4082–4534-ის წინააღმდეგ. |

#### 375px final local homepage

![375px final local homepage](/manus-storage/flowers-boutique-pass2-home-375_42adb506.png)

#### 1440px final local homepage

![1440px final local homepage](/manus-storage/flowers-boutique-pass2-home-1440_4a6ddf5e.png)

### Section-by-section parity table

| Section | 375px | 430px | 768px | 1024px | 1440px | 1920px | დასკვნა |
|---|---|---|---|---|---|---|---|
| Announcement + header | PASS | PASS | PASS | PARTIAL | PARTIAL | PARTIAL | Mobile y=0–207 და tablet hero start y=122 match-დება. 1024px+ header wrapper-ის 5px boundary delta რჩება, behavior სრულად შენარჩუნებულია. |
| Hero | PASS | PASS | PASS | PASS | PASS | PASS | Captured hero heights ემთხვევა: 585, 648, 737, 792, 864, 864px. |
| Occasion chips | PASS | PASS | PASS | PASS | PASS | PASS | Correct number of localized category chips; data query და catalog filters preserved. |
| Product rail 1–2 | PASS | PASS | PARTIAL | PARTIAL | PASS | PASS | 375px card width 166px და desktop width 295px match-დება. 768px/1024px reference-ის vertical density უფრო მაღალია, მაგრამ data count/routes არ შეცვლილა. |
| Product shelf | PASS | PASS | PARTIAL | PARTIAL | PASS | PASS | Horizontal overflow, 18px gap და 248px wide shelf cards align at mobile/wide desktop. |
| Light promo | PASS | PASS | PASS | PASS | PASS | PASS | Light rounded split banner აღადგენს reference role-ს; CTA კვლავ `/bouquet-builder`-ზე გადადის. |
| Services | PASS | PASS | PASS | PASS | PASS | PASS | 375px 343×214px და 1440px 609×343px measured matches. |
| Journal | PASS | PASS | PASS | PASS | PASS | PASS | 375px 343×277px და 1440px 399×312px measured card geometry. |
| Pre-footer contact | PASS | PASS | PASS | PASS | PASS | PASS | დამოუკიდებელი Home section, phone/WhatsApp actions და opening hours local configuration-იდან. |
| Footer + legal band | PASS | PASS | PARTIAL | PARTIAL | PASS | PASS | 375px y5138/h929 და 430px y5503/h888 exact capture match. Tablet reference უფრო გრძელი page rhythm-ს ითხოვს; mobile/desktop role და functionality intact. |

## დარჩენილი განსხვავებები

ვიზუალური diff-ის უმეტესი ნაწილი განზრახ მოდის Flower’s Boutique-ის საკუთარ პროდუქტის ფოტოებზე, localized copy-ზე, ფასებზე და კონტაქტის მონაცემებზე, რომელთა ჩანაცვლებაც scope-ს ეწინააღმდეგებოდა. 768px და 1024px-ზე reference-ს შედარებით უფრო მაღალი vertical rail rhythm აქვს; ამ pass-ში არ შეცვლილა product/API data volume ან pagination მხოლოდ screenshot-height-ის გასაზრდელად. 1024px+ header wrapper-ში დარჩენილი 5px geometry delta არ მოქმედებს navigation, sticky behavior ან hero height-ზე. [2]

## ფაილები და regression coverage

| ფაილი | როლი |
|---|---|
| `client/src/pages/Home.tsx` | Measured homepage sections, category chips, promo, editorial sections და distinct pre-footer contact band. |
| `client/src/components/Navbar.tsx` | Amelie-first header shell, preserved navigation/search/language/account/cart behavior. |
| `client/src/components/product/ProductCard.tsx` | Shared product-card visual presentation, existing data/cart/wishlist behavior intact. |
| `client/src/components/Footer.tsx` | Five-column desktop footer, mobile accordions, legal/contact/account/admin links. |
| `client/src/styles/amelie-rebuild.css` | Canonical Pass 2 tokens, responsive geometry, contact/footer calibration და reduced-motion handling. |
| `server/ui.corrective-am-home.contract.test.ts` | Adds assertion that `.am-contact-band` is rendered by Home before `<Footer />`. |
| `server/home.media-contract.test.tsx`, `server/ui.header-contract.test.ts` | Updated active light-promo contract expectation. |

## Validation

| Check | შედეგი |
|---|---|
| TypeScript | `pnpm check` — PASS |
| Focused Home contract | 7/7 PASS |
| Full Vitest | 39 files PASS, 3 skipped; 152 tests PASS, 10 skipped |
| Production build | PASS; build completed in 3.52s |
| Bundle advisory | მხოლოდ არსებული Rollup advisory: one minified chunk is above 500kB; deployment-blocking error არ არის. |

## Scope confirmation

ამ checkpoint-ში **არ შეცვლილა** server router, database schema, checkout, payment logic, cart contract, SEO contract, product availability/pricing, authentication, admin authorization, Catalog ან ProductDetail composition. Pass 2 აქ სრულდება; Catalog-ის შემდეგი visual phase შეგნებულად არ დაწყებულა.

## References

[1]: https://amelie.ge/ "Amelie.ge public homepage — visual reference"
[2]: ./amelie-pass2-final-overlay-findings-ge.md "Flower’s Boutique Pass 2 local overlay findings"
