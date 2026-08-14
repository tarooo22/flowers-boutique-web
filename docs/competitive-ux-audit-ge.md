# Flower’s Boutique & Events — კონკურენტული UX აუდიტი

**თარიღი:** 2026-08-14  
**ფარგლები:** არსებული React/Vite/TypeScript storefront-ის read-only, source-level და უკვე დაფიქსირებული responsive ვიზუალური მტკიცებულების audit.  
**მეთოდი:** heuristic review, არა მომხმარებლის ინტერვიუ და არა რაოდენობრივი კვლევა. კონკურენტული ბრენდები გამოყენებულია მხოლოდ UX პრინციპების, არასოდეს ვიზუალური კოპირებისთვის.

> **ბრენდის ფილტრი:** „Quiet Tbilisi Floral Atelier“ — ღია კრემის/თეთრი ზედაპირები, graphite ტექსტი, dusty-rose მთავარი მოქმედება, თავშეკავებული sage მხარდაჭერა, Georgian-first ტექსტური იერარქია, რეალური ფლორალური ფოტო და მშვიდი editorial რიტმი.

## 1. დადასტურებული არსებული ძლიერი მხარეები

| სფერო | დადასტურებული მტკიცებულება | მნიშვნელობა |
|---|---|---|
| საერთო storefront shell | `Navbar.tsx` მოიცავს skip-link-ს, desktop/mobile ნავიგაციას, ენების გადამრთველს, search dialog-ს, cart entry-სა და account/admin გზას. | შეცვლა უნდა იყოს shared, additive და route-safe; არსებული ARIA/ნავიგაციის საზღვრები შენარჩუნდება. |
| ფაქტობრივი ნდობის ინფორმაცია | `siteConfig.ts` ცენტრალიზებულად ინახავს მისამართს, ტელეფონს, ელფოსტას, WhatsApp/Messenger-ს, სოციალურ არხებსა და 10:00–20:00 საათებს. | header/footer ან CTA-ში დაიშვება მხოლოდ ეს public, canonical ფაქტები. |
| კატალოგის recovery states | `/catalog` შეიცავს loading skeleton-ს, query-error retry-ს, no-results copy-ს, reset filters-ს და `aria-live` pagination-ს. | discovery refinement შეიძლება დაეყრდნოს არსებულ რეალურ state model-ს, ახალი API-ის გარეშე. |
| Footer IA | `Footer.tsx` უკვე აერთიანებს shop, information, contact, social და legal გზებს, ხოლო mobile-ზე semantic `details` disclosure-ებს. | საიტის დასრულების/ნდობის გამოცდილება უკვე არსებობს; საჭიროა მხოლოდ rhythm და focus-ის შემდგომი polish. |
| არქიტექტურული საზღვრები | `App.tsx` route-tone-ებით გამოყოფს home, commerce, checkout, builder, account, status, editorial, info და discovery ჯგუფებს. | page-level ცვლილებები არ საჭიროებს routing-ის, auth-ის, API-ის ან payment boundary-ის გადაკეთებას. |
| არსებული responsive QA | წინა baseline audit-მა `/`, `/catalog`, `/product/1`, `/cart`, `/checkout`, `/bouquet-builder`, `/login`, `/wishlist` 1280px და 390px-ზე, ხოლო ძირითადი journey 320px-ზე შეამოწმა. | დოკუმენტური document-level overflow ან დაუწვდომელი footer არ დადასტურდა; შემდგომი QA მაინც უნდა გაფართოვდეს. |

## 2. Assumption-labelled heuristic findings

| პრიორიტეტი | მიგნება | დაზარალებული გზები/კომპონენტები | მტკიცებულება | უსაფრთხო, მინიმალური მიმართულება |
|---|---|---|---|---|
| **P0** | ამ audit-ის ფარგლებში data loss, broken route, გადახდის შეცდომა ან ფართო viewport clipping არ დადასტურდა. | Public storefront | არსებული baseline QA და source-level review. | ახალი P0 არ იქმნება მტკიცებულების გარეშე; production error-ის აღმოჩენისას უნდა იყოს ცალკე defect triage. |
| **P1** | Home hero ვიზუალურად ეყრდნობა carousel-სა და dark overlay-ს, რაც ეწინააღმდეგება მოქმედ `design-system/.../pages/homepage.md` წესს: ერთი ღია 45/55 hero, no carousel, no dark overlay. | `/`, `Home.tsx`, Home CSS | baseline audit და homepage override. | ეს არის **owner-level content/design decision**: არ შეიცვალოს ასეტი ან განლაგება ავტომატურად. ჯერ უნდა დადასტურდეს, რომ ახალი master brief ანაცვლებს ძველ homepage override-ს. |
| **P1** | Home-ზე რამდენიმე editorial/content ჯგუფი ქმნის გახანგრძლივებულ სკროლს, მიუხედავად იმისა, რომ თითოეული ბლოკი ფუნქციურად სწორია. | `/`, `Home.tsx` | baseline audit; page guide ითხოვს მოკლე რვა-ნაწილიან რიგს. | მხოლოდ hierarchy/spacing/CTA grouping audit; არ წაიშალოს არსებული ბლოკი და არ შეიქმნას ახალი claims. |
| **P1** | 320px-ზე Catalog-ის ორ-სვეტიან grid-ში metadata, ფასები და secondary controls მაღალი სიმკვრივის ზონაა. | `/catalog`, `Catalog.tsx`, `ProductCard` | baseline audit და source: filters, sorting და recovery states უკვე არსებობს. | image-to-metadata rhythm, 44px targets, label wrapping და focus-state audit; არ შეიცვალოს პროდუქტის მონაცემი, ფასი ან wishlist/cart contract. |
| **P1** | Bouquet Builder-ის ingredient list და quantity controls პატარა viewport-ზე ინფორმაციულად მკვრივია. | `/bouquet-builder`, builder cards/tabs/summary | baseline 320px audit. | selected-state contrast, touch-target, keyboard semantics და calm feedback audit; არ შეიცვალოს stem pricing, availability ან checkout handoff. |
| **P1** | `/product/1` ვიზუალში missing-image placeholder ჩანს; გაურკვეველია, ეს რეალური catalog record-ის ნაკლი არის თუ route-specific sample/test ჩანაწერი. | `/product/1`, Product Detail media state | baseline audit. | read-only catalog/data-source inspection მხოლოდ; სურათის/პროდუქტის მონაცემის შეცვლა მოითხოვს owner approval-ს. |
| **P2** | Cart და guest wishlist empty state-ებზე desktop vertical whitespace დიდია, თუმცა CTA და footer ხელმისაწვდომია. | `/cart`, `/wishlist`, empty-state styles | baseline 320px/desktop audit. | shared scale/spacing polish, copy და behavior-ის უცვლელად. |
| **P2** | Footer IA სრულია, მაგრამ shared-shell polish-ისას საჭიროა desktop/mobile focus order, target size და visual grouping-ის რეგრესიული დაცვა. | `Footer.tsx`, `Navbar.tsx` | source-level review. | არსებული ბმულებისა და ფაქტების შენარჩუნებით, მხოლოდ additive spacing/focus/active-state layer. |
| **P2** | Checkout-ის ფორმა QA-ისთვის განზრახ არ შევსებულა; brief-ის section hierarchy მიმართულება ფასეულია, მაგრამ მისი ცვლილება commerce-criticalა. | `/checkout`, Checkout form | baseline audit. | მხოლოდ source audit და არსებული test coverage-ის შეფასება; არ შესრულდეს order/payment mutation და არ შეიცვალოს BOG sandbox presentation owner approval-ის გარეშე. |

## 3. კონკურენტული benchmark-ების უსაფრთხო თარგმანი

| Benchmark პრინციპი | Flower’s Boutique-ში დასაშვები თარგმანი | დაუშვებელია |
|---|---|---|
| სწრაფი value proposition და occasion discovery | ერთი Georgian-first promise, რეალურ კატეგორიებზე დაფუძნებული live links, catalog/build duality-ის მკაფიო CTA-ები. | გამოგონილი bestseller, discount, rating ან დროის დაპირება. |
| ფლორისტული atelier ფოტოგრაფია | არსებული persistent-storage, რეალური ან owner-approved crop-safe visual-ის მშვიდი presentation. | პროდუქტის ფოტოს AI substitute-ით ჩანაცვლება ან კონკურენტის ვიზუალის კოპირება. |
| Shop vs Build სერვისული არქიტექტურა | catalog და bouquet-builder მოქმედებების მკაფიო, თანასწორი და route-safe გამოყოფა. | ახალი AI/payment/backend workflow-ის იმიტაცია ან API contract-ის შეცვლა. |
| Editorial hierarchy | ერთიანი cream/graphite/dusty-rose system, მკაფიო headline/CTA/section rhythm. | glassmorphism, ზედმეტი gradients, მუდმივი დეკორატიული animation ან სხვა design system-ის გადმოტანა. |

## 4. უსაფრთხო შემდგომი implementation scope

### P1 — მხოლოდ არსებული შესაძლებლობების polish

1. **Shared shell:** Navbar/Footer-ის navigation rhythm, named controls, focus visibility და mobile touch targets-ის audit და საჭიროებისას additive CSS/semantic hooks.
2. **Home → Catalog → Product journey:** Home-ის hierarchy/CTA grouping; Catalog-ის compact mobile product-card readability; Product Detail-ის media-state და CTA-ordering audit.
3. **Builder:** ინგრედიენტების card/stepper/tab selected states, 44px touch-targets და reduced-motion feedback.
4. **States:** არსებული loading/error/empty UI-ის language, action hierarchy და keyboard recovery path-ის თანმიმდევრობა.

### P2 — მხოლოდ owner approval-ის შემდეგ

| ინიციატივა | რატომ მოითხოვს owner approval-ს |
|---|---|
| Occasion-first links ან budget filters | საჭიროა რეალური category/tag ან pricing mapping-ის დადასტურება. |
| Event/corporate enquiry funnel | საჭიროა რეალური contact destination, პასუხისმგებელი ოპერაციული მფლობელი და follow-up პროცესი. |
| Florist care guidance / gift-message preview | საჭიროა დამტკიცებული customer-facing კონტენტი და checkout-risk review. |
| Recently viewed / saved addresses | მოითხოვს privacy, consent, authentication და data-model შეფასებას. |
| Same-day cut-off, slot capacity, subscriptions | საჭიროებს რეალურ ოპერაციულ წესებს, backend validation-სა და fulfillment/payment brief-ს. |
| Live BOG payment | მოითხოვს credentials, sandbox E2E, webhook/signature validation და ცალკე owner approval-ს. |

## 5. მიღების კრიტერიუმები ნებისმიერი მომდევნო polish-ისთვის

| კატეგორია | Acceptance criteria |
|---|---|
| Visual / brand | Georgian-first hierarchy, approved tokens, რეალური imagery, calm editorial rhythm; არ არსებობს fake review/rating/discount/stock/guarantee. |
| Responsive / accessibility | 320px, 390px და desktop visual QA; keyboard-visible focus; mobile 44px action targets; no hover-only action; no horizontal overflow; reduced-motion fallback. |
| Motion | მხოლოდ `transform`/`opacity`, 300ms-მდე, strong ease-out; არ არსებობს perpetual decorative animation. |
| Functional safety | არსებული routes, catalog data, cart, wishlist, builder calculations, checkout, auth, SEO metadata, delivery policy და BOG sandbox/disabled status უცვლელია. |
| Engineering | focused Vitest regression contracts, full `pnpm test`, `pnpm tsc --noEmit`, production build, clean relevant browser diagnostics. |
| Privacy / commercial integrity | არ იქმნება/არ იხსნება customer, order, payment ან protected admin data; არ იცვლება schema, secrets, contacts, product prices ან policy. |

## 6. რეკომენდებული თანმიმდევრობა

1. Owner-ისგან განისაზღვროს, ცვლის თუ არა ახალი competitive master brief `homepage.md`-ის ერთ-hero/no-carousel წესს.
2. Shared shell და Home/Catalog/Builder-ის მხოლოდ presentation-level P1 audit/implementation დაიგეგმოს route group-ებად.
3. ყოველი ჯგუფის შემდეგ შესრულდეს scoped test, TypeScript/build და 320/390/desktop visual QA.
4. P2 backlog-იდან ნებისმიერი ახალი operational feature დაიწყოს მხოლოდ ცალკე მფლობელის წერილობითი დადასტურებით.

> **ამ დოკუმენტის შექმნისას არაფერი შეცვლილა:** storefront code, style layer, route, database schema, seeds, customer/order/payment data, BOG რეჟიმი, secret, catalog image, ფასი, delivery policy და contact fact.
