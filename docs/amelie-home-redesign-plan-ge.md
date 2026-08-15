# Home-only redesign არქიტექტურა

**სტატუსი:** განხორციელებადი Home დიზაინის გეგმა  
**საფუძველი:** [Amelie-ის შედარებითი აუდიტი](./amelie-comparative-audit-ge.md), [საერთო კონვერგენციის გეგმა](./amelie-convergence-plan-ge.md), მოქმედი `Home.tsx` და მიმდინარე desktop/mobile baseline.  
**მიზანი:** Home გვერდი გახდეს უფრო მკაფიო, curated და conversion-oriented Georgian-first flower-shopping journey — Amelie-ის ინფორმაციული რიტმის პრინციპებით, Flower’s Boutique-ის დამოუკიდებელი ატელიეს ენით.

> არსებული hero carousel რჩება. არ იცვლება მისი სურათები, slides, CTA routes, ავტომატური გადართვა ან accessibile controls. არ იცვლება კატალოგის query, პროდუქტის მონაცემები, ფასები, delivery policy, cart/checkout ან BOG sandbox.

## 1. მიმდინარე Home journey და მიზნობრივი რიტმი

| ეტაპი | არსებული სექცია | მომხმარებლის ამოცანა | redesign-ის მიზანი |
|---|---|---|---|
| 01 | Hero carousel + trust rail | გაიგოს შეთავაზება და დაიწყოს არჩევა | hero-ის შემდეგ დაუყოვნებლივ მიიღოს რეალური trust და discovery context, ზედმეტი ვიზუალური ხმაურის გარეშე. |
| 02 | Category gallery | აირჩიოს occasion ან პროდუქტის ტიპი | cutout visual + label-ის ქვეშ დაემატოს მკაფიო, route-safe selection affordance; category cards წაიკითხება როგორც curated editorial index და არა generic tiles. |
| 03 | Signature product collections | რეალური პროდუქტი და ფასი | collection header აჩვენებს, რატომ არის კოლექცია სასარგებლო; card grid ინარჩუნებს real data-ს, მაგრამ იღებს მიზანმიმართულ browsing rhythm-ს. |
| 04 | Bouquet builder CTA | შექმნას პერსონალიზებული თაიგული | კონფიგურატორი აღიქმება როგორც მაღალი ღირებულების secondary path და არა შემთხვევითი dark banner. |
| 05 | Experience/service cards | გაეცნოს ღონისძიებებსა და floristry-ს | სერვისები იყოფა მკაფიო editorial lanes-ად, რომლებიც არ ჰპირდება იმას, რაც routes/data-ს არ აქვს. |
| 06 | Delivery steps | მიხვდეს როგორ სრულდება შეკვეთა | `choose → provide → confirm` იკითხება როგორც უსაფრთხო journey, არა როგორც დუბლირებული marketing. |
| 07 | Contact CTA | მიიღოს დახმარება | contact endpoint გამოიყურება როგორც რეალური concierge handoff; channel actions რჩება მხოლოდ არსებული configured contacts. |

## 2. Home visual hierarchy

| სექცია | დიზაინური გადაწყვეტილება | interaction / accessibility | მონაცემის საზღვარი |
|---|---|---|---|
| Hero to discovery bridge | carousel-ის შემდეგ მცირედით გამკვრივებული editorial divider და short collection cue, უკვე არსებული trust rail-ის კონტექსტში. | დეკორატიული ნაწილი hidden to screen readers; clickable მხოლოდ არსებული links. | ახალი claim არ ემატება. |
| Category gallery | asymmetric editorial header, collection count-ის ნაცვლად bilingual curated note და finer text-link. | მთლიანი tile რჩება ერთ anchor-ად; focus ring და 44px-capable label. | არსებული category link + persistent cutout URL უცვლელია. |
| Collection headers | eyebrow → Georgian H2 → explanatory line → clear catalog link; რიტმი ცვლის მხოლოდ presentation-ს. | heading hierarchy და link label სპეციფიკური. | პროდუქტის query და result ordering უცვლელია. |
| Product cards | არსებული card component/real product data; Home wrapper უზრუნველყოფს density, hover zone და readable CTA distance. | keyboard focus, motion gated, hover არაა ერთადერთი state. | prices/images/availability არ გარდაიქმნება. |
| Builder feature | off-black surface რჩება, ემატება bounded preview/frame, process cue და route-safe primary action. | CTA route უცვლელია; decorative flourish inert. | builder rules/calculations უცვლელია. |
| Experiences | story cards იღებს shared editorial metadata pattern-ს და action spacing-ს. | არ ემატება fake session dates, testimonials, reviews ან offers. | არსებული real route/action საზღვრები. |
| Delivery | სამნაბიჯიანი blocks გადადის უფრო მკაფიო sequential composition-ში. | controlled reading order და `aria-hidden` ornaments. | canonical policy რჩება header/footer-იდან, არ დუბლირდება გაურკვეველი პირობებით. |
| Contact | concise concierge card; CTA group responsive stack. | external links retain `rel=noreferrer`; phone link untouched. | მხოლოდ `siteContact`-ის არსებული მნიშვნელობები. |

## 3. განხორციელების scope — ამ ტალღა

### ჩასატარებელი ცვლილებები

1. **სექციური anchors და context hooks:** Home-ის მოქმედ სექციებს დაემატება presentation-focused კლასები და data attributes მხოლოდ სტილისა და focused regression-ისთვის.
2. **Discovery hierarchy:** category და product collection headers იღებს უფრო მკაფიო Georgian-first eyebrow/copy/link rhythm-ს.
3. **Collection cadence:** მოქმედი products grid package იღებს section-level surface, spacing და progressive reveal styling-ს; card component, cart action და route არ იცვლება.
4. **Builder story:** builder CTA მიიღებს clearer value framing, action alignment და non-essential decorative desktop accent-ს.
5. **Editorial service and delivery cards:** არსებული cards მიიღებს sharper grouping, larger visual rest, consistent forward actions და responsive stacking.
6. **Conversion endpoint:** contact CTA-ს დაემატება accessible internal hierarchy და tactile action group, არსებული WhatsApp/Messenger/phone URLs-ის უცვლელად.
7. **CSS:** ყველა ახალი წესი ემატება `index.css`-ის ბოლოში. Motion მხოლოდ `transform` და `opacity`, მაქსიმუმ 280ms, `prefers-reduced-motion` fallback-ით.

### შეგნებულად გამოტოვებული ცვლილებები

| არ შედის ამ ტალღაში | მიზეზი |
|---|---|
| Carousel replacement ან მესამე მხარის slider | მოქმედი carousel უკვე owner-selected და QA-validated კომპონენტია. |
| ახალი ფოტო/ვიდეო აქტივები | Home-ის არქივში მხოლოდ არსებული persistent storage imagery გამოიყენება; art direction ცვლილება საჭიროებს ცალკე asset task-ს. |
| Product data, feature labels ან prices | Home არის UI discovery layer; catalog truth არ უნდა შეიცვალოს presentation სამუშაოში. |
| Promotions, free-delivery hard-coded copy, timers ან reviews | შეიძლება იყოს არაზუსტი, policy-breaking ან მომხმარებლის მიერ გენერირებული კონტენტის გაყალბება. |
| New backend/API/database work | არ არის საჭირო Home presentation wave-ისთვის. |

## 4. Responsive და quality bar

| Viewport | აუცილებელი შედეგი |
|---|---|
| 1280px | hero-to-category flow იღებს premium editorial pacing; three-column cards არ კარგავს readable action hierarchy-ს. |
| 390px | category/product grids არ ქმნის შეჭიდებულ text/image composition-ს; CTA-ები არაა 44px-ზე მცირე; contact actions wrap/stack. |
| 320px | არ არის horizontal overflow; Georgian headings არ იჭრება; fixed bottom navigation clearance შენარჩუნებულია. |

შემოწმდება keyboard navigation, visible focus, reduced motion, semantic H2/H3 order, focused UI contract, browser/dev-server diagnostics, სრული Vitest, `tsc --noEmit` და production build.

## 5. მიღების კრიტერიუმი

Home redesign წარმატებულია, თუ Home-ის მომხმარებელი სწრაფად ხედავს რეალურ არჩევანის გზას — **ნახე კოლექცია → აირჩიე კატეგორია ან პროდუქტი → შექმენი პერსონალური თაიგული ან მოითხოვე დახმარება** — და ამ პროცესში გვერდი რჩება ქართული პრემიუმ flower atelier-ის თვითმყოფად გამოცდილებად, არა სხვა ბრენდის კოპიად.

