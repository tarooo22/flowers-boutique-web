# Amelie vs Flower’s Boutique — შედარებითი UX/UI აუდიტი

**სტატუსი:** სამუშაო დოკუმენტი — Phase 1, გარე საიტის დაკვირვებები.  
**კვლევის თარიღი:** 2026-08-15.  
**შეზღუდვა:** ქვემოთ აღწერილი კონკურენტული UI/UX ნიმუშები გამოიყენება მხოლოდ როგორც არქიტექტურული და გამოცდილების რეფერენსი. Flower’s Boutique არ აკოპირებს Amelie-ის ბრენდს, ტექსტებს, აქტივებს, ფასებს, ბიზნესდაპირებებს, ჯილდოების პროგრამას ან მომხმარებლის შინაარსს.

## 1. Amelie-ის მთავარი გვერდი

| დაკვირვებული შრე | დადასტურებული ნიმუში | Flower’s Boutique-ისთვის დასაშვები დასკვნა |
|---|---|---|
| ზედა trust rail | მიწოდების, უფასო-ზღვრის და პირველი შეკვეთის აქციის მოკლე ერთსტრიქონიანი სიგნალი. | შევინარჩუნოთ მხოლოდ ჩვენი canonical ₾5 / უფასო ≥ ₾150 / უფასო გატანის შეტყობინება; არ გადმოვიტანოთ Amelie-ის 90-წუთიანი ან promo დაპირებები. |
| Header | მოკლე ნავიგაცია, შემდეგ ძებნა, ანგარიში, რჩეული და კალათა. | გავაძლიეროთ ჩვენი არსებულ Navbar-ში მკაფიო ჰიერარქია და utility-action თანმიმდევრობა; ყველა route და auth ქცევა უნდა დარჩეს მოქმედი. |
| Hero | ფართო, ფოტოზე დაფუძნებული სლაიდი, ფოტოზე მუქი overlay, დიდი Georgian headline, primary CTA, სამი რაოდენობრივად წარმოდგენილი trust metric და slider dots. | ჩვენი არსებული carousel უნდა დარჩეს. დასაშვებია მისი ინფორმაციული ჰიერარქიის, კონტროლებისა და სტატისტიკური trust ზოლის დახვეწა მხოლოდ ჩვენი დადასტურებული მონაცემებით. |
| Occasion discovery | მოკლე კითხვა და horizontal selection chips: სიყვარული, სიხარული, მადლიერება, ბოდიში, უბრალოდ ასე. | განვიხილოთ route-safe occasion-filter chips მხოლოდ მაშინ, როდესაც underlying catalog taxonomy შეძლებს ზუსტ ფილტრაციას; არ დავამატოთ არამოქმედი კონტროლები. |
| Collection rhythm | ემოციურ მიზეზებზე დაფუძნებული კოლექციები, შემდეგ ბესტსელერები და produktის სწრაფი wishlist action. | გამოვიყენოთ ემოციური discovery hierarchy არსებული კატეგორიებისა და პროდუქტების რეალური ფილტრებით; არ გამოვიგონოთ ბესტსელერების სტატუსი ან შეფასებები. |
| Membership proposition | განსაკუთრებული ფართო cashback ვიზუალი და `/rewards` გვერდზე ლინკი. | Flower’s Boutique-ში rewards route/ბექენდი არ არსებობს. არ ავაშენოთ loyalty claim ან route წინასწარი ბიზნეს-დამტკიცების გარეშე. |
| Content loop | Floristry school, events და editorial guide ბარათები მთავარ გვერდზე. | უკვე არსებული Experiences/editorial შესაძლებლობები შეიძლება გადაიწყოს უფრო მკაფიო funnel-ად, ჩვენი რეალური კონტენტითა და სერვისებით. |
| Footer conversion | გამოყოფილი “დაგვირეკე” კონტაქტური CTA, შემდეგ კატეგორიული footer navigation, საათები და payment ნიშნები. | გამოვიყენოთ კომპაქტური CTA-to-footer რიტმი, მაგრამ შევინარჩუნოთ Flower’s Boutique-ის რეალური 10:00–20:00 საათები, კონტაქტები, იურიდიული გვერდები და გადახდის sandbox შეზღუდვა. |

**წყარო:** [Amelie მთავარი გვერდი](https://amelie.ge/), პირდაპირი ვიზუალური და DOM-დან წაკითხვადი შემოწმება 2026-08-15.

## 2. Amelie-ის კატალოგი

| დაკვირვებული შრე | დადასტურებული ნიმუში | Flower’s Boutique-ისთვის დასაშვები დასკვნა |
|---|---|---|
| ფილტრების სტრუქტურა | Category, ფასი და მიზანი დაყოფილია მკაფიო heading-ებით, chip-ებით და თითოეულში ჩანს რაოდენობა. | ჩვენში უკვე არსებული კატალოგის filters შეიძლება გადაიწყოს action-first, count-aware ფორმად მხოლოდ რეალური კატეგორიების, ფასებისა და query შესაძლებლობების გამოყენებით. |
| ძებნა და sorting | ერთი inline search ველი, პროდუქტების საერთო რაოდენობა და sort trigger ერთ ჰორიზონტალურ ზოლში. | დავხვეწოთ ჩვენი filter/search/sort კონტროლების visual hierarchy და focus states; არ შევცვალოთ მიმდინარე query semantics ან sort წესები. |
| ბარათის იერარქია | დიდი portrait product image, ზედა მარჯვენა wishlist action, შემდეგ მოკლე label/description და ფასი. | ჩვენი არსებული product-card markup შეიძლება მიიღოს უფრო სუფთა quick-action placement, მაგრამ wishlist-ის არსებული რეალური მდგომარეობა და accessibility უნდა შენარჩუნდეს. |
| პროდუქტის სიგნალები | “PREMIUM” და “SIGNATURE” tags გამოიყენება მხოლოდ კონკრეტულ პროდუქტებზე. | არ დავამატოთ tags თუ ეს სტატუსი მონაცემში არ არსებობს; მხოლოდ არსებული `featured`/მონაცემზე დაფუძნებული label-ები შეიძლება აისახოს. |
| შედეგების progressive reveal | ნაჩვენებია „კიდევ 24 თაიგული · ნაჩვენებია 24/313“ affordance. | მხოლოდ მაშინ განვიხილოთ, თუ არსებული pagination/query ინფრასტრუქტურა მხარს უჭერს incremental loading-ს; სხვაგვარად ვიზუალური იმიტაცია დაუშვებელია. |

**წყარო:** [Amelie კატალოგი](https://amelie.ge/catalog), პირდაპირი ვიზუალური და DOM-დან წაკითხვადი შემოწმება 2026-08-15.

## 3. Amelie-ის „ჩვენ შესახებ“ და rewards გამოცდილებები

| გვერდი | დადასტურებული ნიმუში | Flower’s Boutique-ისთვის დასაშვები დასკვნა |
|---|---|---|
| `/about` | ერთი introductory image, მოკლე brand paragraph, შემდეგ „რას ვაკეთებთ“ ბლოკები: Flowers Shop და Floristry School, თითოეულს აქვს თავისივე CTA და ვიზუალი. | ჩვენი About/experience კონტენტი შეიძლება გადაიწყოს `brand premise → core services → action` რიტმით. არსებული bilingual ტექსტი და რეალური სერვისები უნდა დარჩეს პირველწყაროდ. |
| `/about` | კონტაქტის დეტალები და სოციალური არხები მოდის narrative-ის ბოლოს, არა hero-ში. | ჩვენი contact block განვათავსოთ როგორც journey-ის დასრულება; საათები უნდა დარჩეს დადასტურებული 10:00–20:00. |
| `/rewards` | Loyalty value proposition, ოთხსაფეხურიანი spend-based progression, კონკრეტული calculator-like მაგალითი და login CTA. | ეს არის backend/account/commerce ფუნქცია და **არ უნდა დაემატოს** UI-იმიტაციით. ჩვენს App routing-ში `/rewards` და ამ ტიპის ბალანსის მოდელი არ არსებობს; საჭიროა ცალკე owner approval, schema, ledger, terms და abuse-risk design. |
| `/rewards` | ერთ page-ზე მკაფიოდ განიმარტება reward-ის დარიცხვის მომენტი და value equivalence. | თუ მომავალში დამტკიცდება loyalty, ეს განმარტებითი UI არის კარგი არქიტექტურული ნიმუში, მაგრამ ყველა ტექსტი, ზღვარი და წესები ახალი Flower’s Boutique policy-ით უნდა განისაზღვროს. |

**წყაროები:** [Amelie ჩვენ შესახებ](https://amelie.ge/about) და [Amelie ქეშბექი](https://amelie.ge/rewards), პირდაპირი ვიზუალური და DOM-დან წაკითხვადი შემოწმება 2026-08-15.

## 4. Amelie-ის anonymous account და checkout entry მდგომარეობები

| გვერდი | დადასტურებული ნიმუში | Flower’s Boutique-ისთვის დასაშვები დასკვნა |
|---|---|---|
| `/account` | ანონიმურ მომხმარებელს ხვდება მოკლე account prompt, ერთი „შესვლა“ CTA და ცალკე order-code lookup ველი. | ჩვენი არსებული Login/Register/Account journey შეიძლება მიიღოს უფრო მკაფიო account-entry hierarchy და ცარიელი მდგომარეობის narrative, თუმცა order-code lookup მოითხოვს ცალკე backend/authorization/abuse review-ს. |
| `/account` | account-ის ღირებულება ნათლად უკავშირდება orders და rewards-ს. | ჩვენში არ უნდა გავუკეთოთ rewards-ის ან order lookup-ის დაპირება იქამდე, სანამ ეს რეალურად არ არსებობს. შესაძლებელია მხოლოდ რეალური order history/profile affordance-ების ვიზუალური დახვეწა. |
| `/checkout` | ცარიელი კალათა გამოიყენებს ერთ მოკლე empty state-ს და კატალოგისკენ მკაფიო დაბრუნების CTA-ს. | ჩვენში შევადაროთ და, თუ საჭიროა, დავხვეწოთ არსებული cart/checkout empty state მხოლოდ არსებული route-ით, checkout-ის ბიზნეს-ლოგიკის შეხების გარეშე. |
| `/checkout` | არ შევიდა არცერთი payment ან address flow, რადგან cart ცარიელი იყო. | ამ აუდიტში **არ ვიმიტირებთ და არ ვცვლით** გადახდის/მისამართის/შეკვეთის submission UX-ს. BOG დარჩება sandbox/disabled რეჟიმში და მომავალ ცვლილებას ცალკე test plan დასჭირდება. |

**წყაროები:** [Amelie ანგარიში](https://amelie.ge/account) და [Amelie checkout](https://amelie.ge/checkout), პირდაპირი ვიზუალური და DOM-დან წაკითხვადი შემოწმება 2026-08-15. არცერთი პირადი მონაცემი, შეკვეთის კოდი, კალათის დამატება, ფორმის შევსება ან გადახდის ინიციაცია არ შესრულებულა.

## 5. Flower’s Boutique-ის მოქმედი გამოცდილება — desktop baseline

| ზედაპირი | დადასტურებული მდგომარეობა | არქიტექტურული შეფასება |
|---|---|---|
| Shared storefront shell | ზედა delivery rail, ორენოვანი wordmark, გასაგები primary nav, search/language/account/wishlist/cart action-ები და footer ყველგან თანმიმდევრულია. | ეს უნდა დარჩეს სტაბილურ საფუძვლად. პირველი wave არ ცვლის routing-ს, policy ტექსტებს ან მარკის სიტყვიერ ფორმას. |
| Home | ძლიერია Hero carousel, editorial headline scale, floral category visuals, dark builder CTA და experience/contact narrative. | Home უკვე ვიზუალურად მაღალ დონეზეა. Amelie-სგან უნდა ავიღოთ მხოლოდ discovery rhythm, more intentional header utility-state და catalog handoff—not მისი brand copy ან კამპანიები. |
| Catalog | მოქმედი filters/sidebar, card grid, wishlist და რეალური product route-ები ჩანს; ფოტოს წყაროები განსხვავებული სტილითაა და grid იწყებს inventory-style შეგრძნებას. | აუცილებელია product-card, filter hierarchy და image presentation-ის design-system-level კონვერგენცია; query, pagination, pricing და wishlist behavior უცვლელია. |
| About | გვაქვს immersive hero, არსებითი brand narrative, advantages cards, editorial CTA და contact footer. | საინფორმაციო სტრუქტურა უკვე მდიდარია; უფრო ძლიერი „brand → services → conversion“ segmenting იქნება მიზნობრივი, არა ტექსტის მასობრივი ჩანაცვლება. |
| Login | არსებობს მკაფიო full-bleed floral backdrop, glass card, password visibility და Georgain-first hierarchy. | Auth ფუნქციურად და ვიზუალურად უკვე კონკურენტუნარიანია; მხოლოდ micro-layout/field rhythm შეიძლება განვიხილოთ, action flow არა. |
| Cart / Checkout | ცარიელი კალათის მდგომარეობა პირდაპირ აბრუნებს მომხმარებელს კატალოგში და action hierarchy მკაფიოა. | არსებული empty state ხარისხიანია; checkout/payment flow არ შევიცვალოთ ამ redesign wave-ში. |
| Bouquet Builder | რეალური building flow, step state, live visual preview, flower cards, counters და persistent summary მუშაობს; მისი ტონი შედარებით „configurator“-ს ჰგავს. | მეორე wave-ის პრიორიტეტია visual/tactile refinement, თუმცა business rules, calculations და order routing დარჩება ხელუხლებელი. |

**ჩვენი ვიზუალური წყარო:** Flower’s Boutique dev preview, read-only screenshot audit 1280×720, 2026-08-15. `/profile` screenshot ავტომატურად ვერ წარმოიქმნა; protected user state არ გახსნილა და პირადი მონაცემი არ გამოყენებულა.

## 6. Flower’s Boutique-ის მოქმედი გამოცდილება — 390px mobile baseline

| ზედაპირი | დადასტურებული მდგომარეობა | უსაფრთხო დიზაინური მიმართულება |
|---|---|---|
| Header და Home | compact header, hero, trust rail, transparent categories, product grid, builder CTA და footer ტევადია და horizontal overflow არ ჩანს. | shared mobile shell უკვე ფუნქციურია; პირველი ცვლილება უნდა ეხებოდეს მხოლოდ information density-ს, tap hierarchy-სა და vertical rhythm-ს. |
| Catalog | პროდუქტის ორი-სვეტიანი discovery grid ინარჩუნებს რეალურ item action-ებს; sidebar/filter ინფორმაცია ზედა ნაწილშია, მაგრამ შემდგომი discovery შეიძლება უფრო გამოკვეთილი იყოს. | mobile filter/sort control უნდა გახდეს უფრო თვალსაჩინო bottom-sheet ან concise trigger არქიტექტურით მხოლოდ შემდგომი, ცალკე კონტრაქტის ფარგლებში. |
| About | immersive top story და advantage cards მობილურზე readableა; narrative სექციები რიგდება სწორხაზოვნად. | შესაძლებელია editorial section-transition-ისა და CTA grouping-ის დახვეწა ტექსტის, ფაქტების ან მარშრუტების შეცვლის გარეშე. |
| Login და Cart | account card და empty-cart state თავსებადია მობილურთან, action-ები საკმარისად გამოკვეთილია. | Auth/empty-state ფუნქციას არ ვეხებით; შესაძლებელია მხოლოდ visual token consistency და micro-feedback. |
| Bouquet Builder | ეტაპები, preview და summary ვერტიკალურად მუშაობს, თუმცა summary და flower selection ერთ დიდ თანმიმდევრულ ნაკადად ჩანს. | მეორე wave-ში შემოვიდეს sticky/contextual summary hierarchy; გამოთვლები, quantity კონტროლები და order transition უცვლელი უნდა დარჩეს. |

**ჩვენი ვიზუალური წყარო:** Flower’s Boutique dev preview, read-only screenshot audit 390×844, 2026-08-15. არცერთი account session, შეკვეთა, კალათის დამატება, მისამართი ან payment flow არ გამოყენებულა.
