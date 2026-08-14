# Flower’s Boutique — Design Master Plan: პირველი პრიორიტეტების ჩანაწერი

**თარიღი:** 2026-08-14  
**საფუძველი:** `design-master-baseline-audit-ge.md`, მოქმედი design-system და Master Plan.  
**პრინციპი:** ქვემოთ აღწერილია მხოლოდ ფაქტობრივად ნანახი ან source-level შემოწმებით დადასტურებული presentation/accessibility გაუმჯობესებები. ჩანაწერი არ ეფუძნება გამოგონილ მომხმარებლის კვლევას და არ ცვლის კომერციულ წესებს.

## მიღებული პრიორიტეტები

| პრიორიტეტი | მიზანი | დადასტურებული evidence | უსაფრთხო ცვლილების ფარგლები | უცვლელი რჩება |
|---|---|---|---|---|
| P0 | კატალოგისა და homepage-ის პროდუქტის ბარათების action hierarchy | 320px sweep-ზე ბარათები რჩება გამოყენებადი, თუმცა სურათის, title-ის, ფასისა და action-ის ვერტიკალური რიტმი მეტად მკაფიო უნდა იყოს; action-ები ერთიანი shared component-იდან მოდის | `ProductCard` და additive CSS: touch-safe ზომა, ხილული focus, unavailable-state contrast, თანმიმდევრული action spacing | პროდუქტის URL, ფასი, ვარიანტის არჩევის წესი, wishlist local-storage, კალათის mutation და მონაცემთა წყარო |
| P0 | AI თაიგულის კონსტრუქტორის რაოდენობრივი არჩევის readability | source review-მა და 320px baseline-მა დაადასტურა compact card/stepper გარემო; არსებული controls უკვე 44px-ია, მაგრამ selected/limit/disabled feedback შეიძლება მეტად გასაგები იყოს | `FlowerBuilderCard`-ის presentation semantics და CSS: selected outline, available status, quantity counter, focus-visible და reduced-motion polish | ყვავილების სია, ფასი, 24-ღეროს ლიმიტი, total calculation და კალათაში დამატების ლოგიკა |
| P1 | საერთო ინტერაქციის თანმიმდევრულობა | public route-ებზე ერთნაირი CTA და navigation patterns მუშაობს, თუმცა focus/pressed/motion წესები უნდა დარჩეს ერთიანი | მხოლოდ additive token-aligned CSS; transform/opacity motion <300ms და `prefers-reduced-motion` fallback | Navbar-ის route map, ენის შეცვლა, კალათა, login, footer-ის ლინკები |
| P1 | loading, empty და status მდგომარეობების დახვეწა | baseline-ში დადასტურდა რომ commerce გვერდებს სჭირდებათ მკაფიო status hierarchy; ეს ცალკე მოწმდება შემდგომი ეტაპის source review-ით | შესაბამისი page-level non-data markup და existing status components; მხოლოდ არსებული query contract-ებით | tRPC API კონტრაქტები, database schema, validation და payment flow |

## განზრახ გადადებული ან უცვლელი მიმართულებები

| საკითხი | გადაწყვეტილება | მიზეზი |
|---|---|---|
| ფასები, მიწოდება, pickup და სამუშაო საათები | უცვლელია | ეს არის დადასტურებული კომერციული პოლიტიკა და არ არის ვიზუალური polish-ის ნაწილი |
| BOG გადახდის ინტეგრაცია | sandbox/გამორთულ რეჟიმში რჩება | production payment activation მოითხოვს მფლობელის ცალკე გადაწყვეტილებას და end-to-end გარიგების შემოწმებას |
| Auth, profile და admin მონაცემები | არ იხსნება და არ იცვლება | baseline შესრულდა public/anonymous ზედაპირზე; კონფიდენციალური მონაცემები არ არის საჭირო ამ refinement-ისთვის |
| ახალი testimonial/rating/user-generated content | არ ემატება | მომხმარებლის მიმოხილვების გამოგონება დაუშვებელია |
| ახალი გენერირებული გამოსახულებები | ამ ტალღაში არ არის საჭირო | არსებული persistent-storage აქტივები ბრენდისა და hero/category/editorial კომპოზიციისთვის საკმარისია; ვიზუალური პრობლემა საჭიროების შემთხვევაში ცალკე დადასტურდება |

## Implementation gate

პირველ ტალღაში დაიშვება მხოლოდ P0 shared product-card და bouquet-builder presentation refinement. ყოველი ცვლილება უნდა დარჩეს TypeScript-safe, იყოს კლავიატურით მისაწვდომი, არ შექმნას document-level horizontal overflow 320px-ზე და არ შეცვალოს cart, checkout, pricing, inventory, auth ან payment behavior. დასრულებამდე შესრულდება targeted tests, სრული test suite, TypeScript check, production build და 320px/390px/desktop ვიზუალური გადამოწმება.
