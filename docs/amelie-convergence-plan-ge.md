# Amelie-inspired UI/UX კონვერგენციის გეგმა

**სტატუსი:** განხორციელების არქიტექტურა — 2026-08-15  
**საფუძველი:** [შედარებითი აუდიტი](./amelie-comparative-audit-ge.md), Flower’s Boutique-ის მოქმედი codebase და desktop/mobile ვიზუალური baseline.  
**მიზანი:** Amelie-ისგან დავიღოთ მაღალი ხარისხის e-commerce იერარქიის, აღმოჩენისა და utility-state-ების პრინციპები ისე, რომ Flower’s Boutique დარჩეს დამოუკიდებელ ქართულ-ინგლისურ პრემიუმ floral atelier-ად.

> ეს არ არის Amelie-ის კოპირების დავალება. არ გადმოიტანება მათი ბრენდი, ტექსტები, ფოტოგრაფია, აქციები, loyalty policy, შეფასებები, ფასები ან სავაჭრო დაპირებები. ცვლილებები უნდა იყოს Flower’s Boutique-ის რეალური მონაცემების, წესებისა და მომხმარებლის გზების გაგრძელება.

## 1. გადაწყვეტილების ჩარჩო

| პრინციპი | არქიტექტურული გადაწყვეტილება | შემოწმებადი საზღვარი |
|---|---|---|
| ბრენდის დამოუკიდებლობა | ვიყენებთ მხოლოდ interaction და information-architecture ნიმუშებს; ვიზუალი რჩება cream / botanical charcoal / dusty-rose ატელიეს სისტემაში. | `BrandWordmark`, ორენოვანი სათაურები და არსებული persistent floral media არ იცვლება სხვა ბრენდის აქტივით. |
| რეალური commerce | ყველა trust, ფასი, სტატუსი და ქმედება მოდის არსებული წყაროდან. | ₾5 მიწოდება, უფასო ≥ ₾150, უფასო გატანა და 10:00–20:00 საათები რჩება canonical source-თან შესაბამისი. |
| უსაფრთხო კონვერგენცია | ჯერ ვცვლით presentation shell-ს, შემდეგ discovery hierarchy-ს და ბოლოს რთულ journey-ებს. | არ იცვლება cart, checkout, payment, inventory, auth/session და BOG sandbox logic. |
| Georgian-first | ქართული არის საწყისი reading order; ინგლისური არის თანაბარი, მაგრამ secondary locale. | ყველა ახალი label, `aria-label` და empty-state ტექსტი ითარგმნება ორივე ენაზე. |
| responsive by design | desktop-ის დეტალები მობილურზე არ იკუმშება; მათ ენაცვლება მკაფიო action hierarchy. | 44px target, 320px overflow, keyboard focus და `prefers-reduced-motion` ყველა wave-ში მოწმდება. |

## 2. მიმდინარე ინფორმაციული არქიტექტურა და მიზნობრივი მოდელი

| მომხმარებლის მიზანი | მოქმედი გზა | მიზნობრივი გაუმჯობესება | ტექნიკური საზღვარი |
|---|---|---|---|
| სწრაფად იპოვოს თაიგული | Home → კატეგორია / Search → Catalog | header search-ის მკაფიო utility prominence; კატალოგში `search → filter → sort → result context` რიგი. | არსებული `/catalog?search=` query და filtering semantics უცვლელია. |
| შემთხვევისთვის არჩევა | Home category gallery → Catalog | emotion/occasion discovery მხოლოდ route-safe, რეალურ კატეგორიებსა და ფილტრებზე. | არ ემატება არამოქმედი chip ან გამოგონილი taxonomy. |
| შეაფასოს ხარისხი და პირობები | Hero / trust rail / product details | ერთიანი policy-aware trust language header-იდან product/card context-მდე. | არ ემატება delivery speed, promo ან stock claim, რომელიც მონაცემით არ დადასტურდება. |
| შექმნას პერსონალური თაიგული | Header / Home CTA → Bouquet Builder | მეორე wave-ში მეტად tactile step context და contextual summary. | ღირებულება, stems, rules, cart handoff და calculation ხელუხლებელია. |
| მოაგვაროს ანგარიში ან დახმარება | account dropdown / login / contact sheet | გაუმჯობესებული entry hierarchy და explanatory microcopy. | არ ემატება order-code lookup, rewards ან account claim back-end-ის გარეშე. |
| დაასრულოს journey | cart / checkout | არსებული empty state-ის დახვეწილი visual consistency. | checkout steps, address, payment, BOG და order submission არ იცვლება ამ პროგრამაში. |

## 3. კომპონენტური არქიტექტურა

| შრე | საკუთრება | პირველი ცვლილება | შემდეგი ტალღა |
|---|---|---|---|
| Shared shell | `Navbar.tsx`, `Footer.tsx`, `MobileBottomNav.tsx`, `index.css` | utility/action hierarchy, active states, search/account discovery, mobile sheet hierarchy, CTA-to-footer rhythm. | ContactSheet-ის contextual polish მხოლოდ საჭიროებისას. |
| Home | `Home.tsx`, hero/category/product/editorial classes | ამ ეტაპზე დაცულია არსებული carousel და recent editorial rhythm. | real-data occasion discovery ან collection handoff მხოლოდ query audit-ის შემდეგ. |
| Catalog discovery | `Catalog.tsx`, product card components, CSS | ჯერ მხოლოდ architecture spec. | filter/sort/search result-context, card action placement, image-frame consistency. |
| Product confidence | `ProductDetail.tsx` | ჯერ მხოლოდ architecture spec. | variant/wishlist/related visual hierarchy, რეალური perk/context signals. |
| Story and service | `About.tsx` და არსებული editorial surfaces | ჯერ მხოლოდ architecture spec. | `brand premise → services → conversion → contact` segmenting. |
| Configurator | `VisualBouquetBuilder.tsx` | ჯერ მხოლოდ architecture spec. | step framing, sticky contextual summary და tactile selection. |
| Account and checkout | Login/Register/Profile/Cart/Checkout | არ იცვლება ფუნქციური flow. | მხოლოდ ცალკე დამტკიცებული, data-safe visual improvements. |

## 4. განხორციელების ტალღები

### Wave 1 — Shared storefront shell

**ამოცანა:** Home, Catalog, About და სხვა public page-ებზე ერთიანი, უფრო განზრახული high-end storefront frame.

| სამუშაო | შედეგი | დაცული კონტრაქტი |
|---|---|---|
| Header utility hierarchy | canonical delivery message და ტელეფონი დარჩება მოკლე, readable trust layer-ად; შიდა header მიიღებს მკაფიო visual density-ს. | `checkoutPolicy.ts` და `siteConfig` რჩება ერთადერთ წყაროდ. |
| Desktop action cluster | search, language, account, wishlist და cart იღებს თანმიმდევრულ ზომას, hover/focus/active feedback-ს და cart count-ის უკეთეს context-ს. | button/link semantics, login/dropdown, wishlist route და cart drawer უცვლელია. |
| Active navigation | მიმდინარე route-ის აქტიურობა უფრო მკაფიო ხდება tone, underline და `aria-current`-ით. | `isActive()` route-prefix logic უცვლელია. |
| Search dialog | search overlay გადადის უფრო editorial, focus-first presentation-ში. | query generation და `/catalog?search=` უცვლელია. |
| Mobile menu and bottom nav | menu იღებს scan-friendly grouping-ს; bottom nav-ის hidden-route rules არ იცვლება. | checkout/auth/builder-ზე bottom nav არ გამოჩნდება. |
| Footer conversion rhythm | contact CTA, link groups, legal/payment boundary და hours ერთიანდება მკაფიო journey endpoint-ად. | არსებული routes, კონტაქტები, legal pages და BOG sandbox boundary უცვლელია. |

### Wave 2 — Catalog და product discovery

**ამოცანა:** Marketplace-like grid-ის ჩანაცვლება curated boutique discovery cadence-ით, მონაცემის ან query-ის ცვლილების გარეშე.

1. Filter/search/sort-ის action-first hierarchy და visible result context.
2. რეალური კატეგორიების count-aware label-ები მხოლოდ იმ შემთხვევაში, თუ data path იძლევა სიმართლეს.
3. Product card-ის თანმიმდევრული image crop, real `featured` label-ის შეკავებული გამოყენება, wishlist focus state და ფასის მკაფიო წაკითხვა.
4. Mobile-ზე concise filter/sort trigger architecture. Bottom sheet მხოლოდ მაშინ, თუ current filtering UI-ს შეუძლია semantics-ის შენარჩუნება.

### Wave 3 — Product, service და About narrative

**ამოცანა:** გადაწყვეტილების confidence და ბრენდის სიუჟეტი, გაყალბებული social proof-ის გარეშე.

1. Product detail-ზე gallery → selection → cart action → real service context hierarchy.
2. About-ზე `brand premise → services → editorial conversion → contact` რიტმი, არსებულ bilingual text-ზე დაფუძნებით.
3. Home-ის არსებული experiences გამოიყენება რეალური Floristry School და event styling მიმართულებების discovery funnel-ად.

### Wave 4 — Bouquet Builder tactile context

**ამოცანა:** არსებული ფუნქციური configurator უფრო tactile და ადვილად სამართავი გახდეს, ყოველგვარი calculation ცვლილების გარეშე.

1. Step state-ის მკაფიო current/completed visual language.
2. Flower card selection-ის hover/pressed/focus feedback.
3. Responsive contextual summary, რომელიც mobile-ზე არ ფარავს controls-ს და desktop-ზე არ კარგავს order context-ს.
4. Builder cart handoff-ის ვიზუალური დადასტურება არსებული event/data flow-ის უცვლელად.

### Wave 5 — Optional owner-approved capabilities

ეს შესაძლებლობები **არ შედის** მიმდინარე ცვლილებებში და საჭიროებს ცალკე owner approval, data model, terms, abuse/security review და acceptance tests:

| შესაძლებლობა | აუცილებელი წინაპირობა |
|---|---|
| Rewards / cashback | schema, ledger, eligibility rules, expiry policy, terms, profile UX, fraud/abuse controls და order-state integration. |
| Order-code lookup | authorization model, privacy review, rate limit, secure lookup contract, auditing. |
| Express delivery promise | ოპერაციული capacity, ზუსტი SLA, geographic coverage და customer-support commitment. |
| Ratings / testimonials | მხოლოდ რეალური, მოდერირებული customer-generated data და შესაბამისი consent/consumer-protection workflow. |
| Incremental product loading | რეალური backend pagination/query contract, count semantics და loading/error accessibility. |

## 5. Visual and interaction system

| ტოკენი / ნიმუში | გადაწყვეტილება |
|---|---|
| Surface language | airy cream base, restrained translucent layered surfaces, botanical charcoal type და dusty-rose accent; glass მხოლოდ utility/overlay contexts-ში, არა ყველა card-ზე. |
| Image direction | persistent storage-ის არსებული floral media რჩება. ახალ asset-ს სჭირდება თანმიმდევრული editorial ან studio art direction; არ გამოიყენება კონკურენტის imagery. |
| Type hierarchy | Georgian display headlines + modest all-caps English eyebrow მხოლოდ navigation/context labels-ზე; body copy ხელმისაწვდომ ზომაში. |
| Motion | მხოლოდ `transform` და `opacity`; `cubic-bezier(0.23, 1, 0.32, 1)`; micro feedback 120–200ms; normal reveal ≤280ms; reduced-motion fallback. |
| Interaction | visible focus, 44px target, active press `scale(0.97)`, no dead-end placeholder control. |
| 21st reference | 21st-ის შერჩეული ინსპირაცია გამოიყენება მხოლოდ component behavior და implementation craft-ისთვის; საბოლოო markup/style რჩება ორიგინალური და Flower’s Boutique design system-ის ნაწილი. |

## 6. Definition of done და ხარისხის კარიბჭე

1. ყველა ახალი interactive state აქვს keyboard focus, `aria` semantics და საქართველოს/ინგლისის ტექსტი.
2. არ იცვლება API contract, auth/session, route, cart, checkout, payment, pricing, delivery policy, inventory, BOG sandbox ან database schema, თუ ტალღის scope ცალსახად არ მოითხოვს და owner არ ადასტურებს.
3. თითოეული ტალღა იღებს focused Vitest UI contract-ს.
4. 1280px, 390px და 320px screenshot QA; browser-console და dev-server diagnostics უნდა იყოს სუფთა.
5. `pnpm test`, `pnpm tsc --noEmit` და `pnpm build` გადის წარმატებით.
6. მხოლოდ ამის შემდეგ იქმნება auto-published checkpoint და QA ჩანაწერი.

## 7. პირველი შესრულებადი ცვლილება

პირველი განხორციელება არის **Wave 1-ის shared shell refinement**. იგი მოიცავს Navbar/Footer presentation layer-ს და შესაბამის append-only CSS-ს; არ მოიცავს CSS-ის destructive replacement-ს, არც ახალი dependency-ის დამატებას. ამის შედეგად ყველა public გვერდი მიიღებს თანმიმდევრულ, Amelie-inspired მაგრამ დამოუკიდებელ Flower’s Boutique utility და conversion rhythm-ს.

