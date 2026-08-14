# Flower’s Boutique — Design Master Plan baseline audit

**თარიღი:** 2026-08-14  
**ფარგლები:** public/anonymous storefront-ის read-only ვიზუალური შემოწმება.  
**შეზღუდვები:** არ შექმნილა ანგარიში, შეკვეთა, გადახდა, კალათის ხაზი ან contact-form შეტყობინება. BOG payment flow არ შეცვლილა.

## შემოწმებული route-ები და viewport-ები

| Route ჯგუფი | 1280px desktop | 390px mobile | სტატუსი |
|---|---:|---:|---|
| მთავარი (`/`) | შემოწმდა | შემოწმდა | ვიზუალური baseline დაფიქსირდა |
| კატალოგი (`/catalog`) | შემოწმდა | შემოწმდა | ვიზუალური baseline დაფიქსირდა |
| პროდუქტი (`/product/1`) | შემოწმდა | შემოწმდა | ვიზუალური baseline დაფიქსირდა |
| კალათა / checkout (`/cart`, `/checkout`) | შემოწმდა | შემოწმდა | empty-state გზა დადასტურდა; checkout ფორმა შეგნებულად არ შევსებულა |
| თაიგულის კონსტრუქტორი | შემოწმდა | შემოწმდა | ვიზუალური baseline დაფიქსირდა |
| შესვლა / სურვილები | შემოწმდა | შემოწმდა | ვიზუალური baseline დაფიქსირდა |

## ფაქტობრივი heuristic findings

| პრიორიტეტი | მიგნება | მტკიცებულება და უსაფრთხო მიმართულება |
|---|---|---|
| **Blocker** | დოკუმენტირებული clipping ან document-level horizontal overflow პირველადი 390px/1280px სურათებში არ დადასტურდა. | სხვა ზომებზე (320, 375, 430, 768, 1024, 1440, 1920px) შემოწმება ჯერ საჭიროა. |
| **High** | მთავარი გვერდის მოქმედი hero ეყრდნობა მუქ overlay-სა და carousel-ს. | ეს არ შეესაბამება მოქმედ `homepage.md` override-ს, რომელიც ითხოვს ერთ რეალურ, ღია 45/55 hero გამოსახულებას და კრძალავს carousel/dark overlay-ს. ცვლილება უნდა იყოს კონტენტისა და commerce logic-ისგან იზოლირებული. |
| **High** | `/product/1` route-ზე ნაჩვენებია intentional-looking missing-image placeholder, არა პროდუქტის რეალური ფოტო. | უნდა დადგინდეს, არის თუ არა ეს route-ის რეალური პროდუქტის მონაცემის ხარვეზი თუ test-only ჩანაწერი. მონაცემის შეცვლამდე საჭიროა read-only data audit და owner approval, თუ საკითხი საჭიროებს catalogue content ცვლილებას. |
| **Medium** | მთავარ გვერდზე ერთდროულად ჩანს რამდენიმე editorial/content ჯგუფი. | `homepage.md` ითხოვს მოკლე, მკაცრ 8-ნაწილიან რიგს; საჭიროა hierarchy/whitespace-ის audit და არა ავტომატური content წაშლა. |
| **Medium** | mobile catalog-ზე პროდუქტის grid წასაკითხად ინარჩუნებს ორ სვეტს, თუმცა მეტამონაცემები და პატარა action-controls ძალიან შეკუმშულია. | საჭიროა 320/375/430px touch-target, label, focus და image loading-state შემოწმება. |
| **Medium** | mobile bouquet builder ფუნქციურად ინფორმაციულია, მაგრამ ინგრედიენტების სია და step controls მაღალი ინფორმაციული სიმკვრივისაა. | საჭიროა keyboard, touch target, selected-state და reduced-motion audit; flow-ს ლოგიკა არ უნდა შეიცვალოს. |
| **Polish** | empty cart და wishlist მდგომარეობებს მკაფიო CTA აქვთ, თუმცა desktop-ზე დიდი ცარიელი vertical სივრცე ჩანს. | შეფასდეს design-system spacing წესებით, ფუნქციონალური ქცევის შეცვლის გარეშე. |

## შემდგომი დადასტურების მოთხოვნები

1. შევამოწმო ყველა public route 320, 375, 430, 768, 1024, 1440 და 1920px breakpoint-ზე, მათ შორის footer reachability და fixed mobile controls.
2. შევამოწმო shared header/footer, button, card, form, focus, loading/error და reduced-motion მდგომარეობები source-level და ვიზუალურად.
3. ვიმუშაო პირველ რიგში catalog → product → cart → checkout journey-ზე; რეალური cart/checkout mutation არ შესრულდეს QA-ისთვის.
4. ადრე არსებული design-system override-ებთან შეუსაბამო homepage treatment განვიხილო როგორც იზოლირებული high-priority design decision; არ გადაიწეროს ავტომატურად და არ შეიცვალოს hero ასეტი owner-ის კონტენტური გადაწყვეტილების გარეშე.

## ინფორმაციული, policy და SEO გვერდების გაგრძელებული baseline

| Route ჯგუფი | დაკვირვება | რეკომენდებული შემდეგი მოქმედება |
|---|---|---|
| About / Contact | 390px-ზე სათაურები, საკონტაქტო ბლოკები და CTA-ები ინარჩუნებს ვერტიკალურ რიგს და visually clipped ელემენტი არ დაფიქსირდა. | შემოწმდეს keyboard focus-ის თანმიმდევრობა და third-party contact links-ის ხელმისაწვდომი სახელები. |
| Delivery / Returns | policy content იყენებს ბარათებად დაყოფილ long-form ტექსტს და mobile-ზე readable column აქვს. | შეინარჩუნოს მიმდინარე კომერციული პირობები; მხოლოდ heading rhythm, list spacing და scanability დაიხვეწოს, თუ source-level audit დაადასტურებს საჭიროებას. |
| Privacy / Terms | გრძელი იურიდიული ტექსტი ერთ სვეტში იკითხება და overflow არ დადასტურდა. | შეამოწმდეს anchor/heading hierarchy, 320px line lengths და collapsible disclosure-ების semantics; კონტენტი არ გადაიწეროს სამართლებრივი დადასტურების გარეშე. |
| Flower delivery / Rose bouquets | SEO გვერდები შეიცავს ლოკალურ Georgian-first copy-ს, პროდუქტის ბარათებსა და FAQ/discovery სტრუქტურას. | დაემატოს მხოლოდ evidence-based internal-link/heading/focus polish; არ შეიქმნას fake review, rating ან testimonial. |

> პირველი სრული viewport sweep-ის საფუძველზე **არ დადასტურდა დოკუმენტური horizontal overflow, კონტენტის მოჭრა ან დაუწვდომელი footer**. ეს არ ცვლის მოთხოვნას, რომ შემოწმდეს დამატებითი 320/375/430/768/1024/1440/1920px ზომები და ინტერაქციული მდგომარეობები.

## Shared shell და ტექნიკური baseline

| სფერო | ფაქტობრივი დადასტურება | მნიშვნელობა მომდევნო ეტაპისთვის |
|---|---|---|
| Header / search / account | `Navbar.tsx` აერთიანებს skip-link-ს, desktop/mobile ნავიგაციას, ენების გადამრთველს, global search dialog-ს, cart drawer entry-ს და account/admin entry-ს. | საერთო shell-ში ცვლილება უნდა დარჩეს additive, შეინარჩუნოს `aria-current`, სახელდებული controls და არსებული route-ები. |
| Footer / legal navigation | `Footer.tsx` მართავს კონტაქტის არხებს, legal/info route-ებს, სოციალურ ბმულებსა და mobile `details` disclosure-ებს. | გაუმჯობესება შეიძლება შეეხოს spacing-სა და ფოკუსის იერარქიას; ბმულები, კომერციული ტექსტი და legal copy არ შეიცვალოს მფლობელის დადასტურების გარეშე. |
| Route behavior | `App.tsx` route-tone-ებით გამოყოფს commerce, account, builder, info, discovery და status ჯგუფებს; ასევე ყველა გადასვლისას აბრუნებს scroll-ს main content-ზე. | route-specific polish უნდა დარჩეს ამ ჯგუფების ფარგლებში და არ შეცვალოს public/protected წვდომის საზღვრები. |
| Unit-test baseline | 2026-08-14-ზე `pnpm test --run`: **33 test file / 139 test passed**, 3 opt-in suite / 10 test skipped. | ვიზუალური ცვლილებების წინ არსებული contract baseline სუფთაა; skip-ები დაკავშირებულია opt-in გარე ინტეგრაციებთან და არა UI failure-თან. |

## 320px primary-journey sweep

| Route | ფაქტობრივი დაკვირვება | პრიორიტეტი და უსაფრთხო მიმართულება |
|---|---|---|
| `/` | მთლიან გვერდზე horizontal overflow ან clipped fixed control არ დაფიქსირდა; hero და editorial ბლოკები 320px-ზე ინფორმაციულად ძალიან ვერტიკალური და მაღალია. | **Medium:** განხორციელდეს მხოლოდ spacing/hierarchy polish; hero-ის carousel/asset გადაწყვეტილება ცალკე owner-level კონტენტურ არჩევანად რჩება. |
| `/catalog` | ორ-სვეტიანი grid ინარჩუნებს ფუნქციურ layout-ს, თუმცა card metadata, ფასები და heart/action controls ყველაზე მაღალი სიმკვრივის ზონაა. | **High:** card spacing, label wrapping, 44px interaction target და loading-state source audit პირველ ეტაპზე. |
| `/product/1` | პროდუქტის დეტალის content hierarchy და CTA იკითხება; მთავარი media ზონა intentional missing-image placeholder-ად ჩანს. | **High:** ჩატარდეს read-only data/source audit; catalog კონტენტის ცვლილება არ გაკეთდეს owner approval-ის გარეშე. |
| `/cart`, `/wishlist` | empty state CTA-ები readable-ა და footer accessible რჩება, მაგრამ hero-size vertical whitespace დიდია. | **Medium:** shared empty-state scale/spacing polish, copy და ქცევის უცვლელად დატოვებით. |
| `/checkout` | anonymous empty-cart entry path ფუნქციურად მკაფიოა; ფორმის შევსება და transaction-დაკავშირებული QA განზრახ არ შესრულებულა. | **No mutation:** checkout ფორმისა და payment workflow-ის ცვლილება ამ ეტაპზე არ იგეგმება. |
| `/bouquet-builder` | card stack და total summary პატარა viewport-ზე იკითხება; ინგრედიენტების რაოდენობის controls მაღალი ინფორმაციული სიმკვრივისაა. | **High:** button sizing, selected-state contrast და tab/control keyboard semantics source-level audit. |
| `/login` | ფორმის card და inputs 320px-ზე visually readable და ცენტრშია. | **Low:** შეინარჩუნოს არსებული auth flow; მხოლოდ focus/error state polish თუ source audit დაადასტურებს. |

## პირველი refinement-ის ვიზუალური გადამოწმება

| კომპონენტი | Viewport | დადასტურებული შედეგი | კომერციული საზღვარი |
|---|---:|---|---|
| კატალოგის `ProductCard` | 390px | ორ-სვეტიანი grid, ქართული სახელები, ფასები და action კონტროლები დარჩა წასაკითხად; ახალი action-context და keyboard-focus layer არ იწვევს ვიზუალურ clipping-ს. | პროდუქტის route, ფასი, ვარიანტები, wishlist და კალათის ქცევა არ შეცვლილა. |
| ვიზუალური თაიგულის კონსტრუქტორი | 390px | არჩევის card-ები, რაოდენობის stepper-ები, availability ნიშნები და total-summary იერარქია რჩება მკაფიო; selected/quantity feedback იკითხება. | ინგრედიენტების მონაცემები, ფასის დათვლა, availability guard და კალათაში დამატების ლოგიკა არ შეცვლილა. |
| primary controls | 320px | ხელმისაწვდომი CTA ან document-level overflow არ დადასტურდა; ვიწრო viewport-ზე ახალი presentation layer არ ქმნის მოჭრილ ტექსტს. | რეალური cart/checkout mutation ან payment QA არ შესრულებულა. |
