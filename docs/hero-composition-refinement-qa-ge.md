# Hero Composition Refinement — Visual QA ჩანაწერი

**თარიღი:** 2026-08-15  
**Scope:** Home Page-ის მოქმედი carousel Hero; კონტენტი, slide state და CTA routes უცვლელია.

## დადასტურებული ცვლილებები

- Desktop view-ში Hero copy, CTA-ები და slide indicators ერთ კომპოზიციურ სიბრტყეზე განლაგდა; legacy grid-ის შედეგად CTA-ების პირველ viewport-ს ქვემოთ გადასვლა გასწორდა append-only წესით.
- 390px view-ში ქართული title აღარ იჭრება viewport-ის საზღვარზე; მისი ზომა და line-height მორგებულია ქართული სიტყვების ბუნებრივ გადატანაზე.
- Supporting copy-ს აქვს გაუმჯობესებული contrast, ხოლო primary და secondary CTA-ები ინარჩუნებს მკაფიო hierarchy-ს.
- Mobile slide controls CTA-ების შემდეგ არსებული სრულსიგანე list-იდან გადავიდა ზედა მხარეს compact selector-ად; კონტროლები კვლავ ღილაკებია შესაბამისი `aria-current`/`aria-pressed` semantics-ით.

## საბოლოო mobile დაკვირვება

- 390px view-ში slide-control group-ს აქვს `fit-content` pill layout; კონტროლები აღარ ფარავს ზედა image area-ს ზედმეტი სიგანით და CTA hierarchy უცვლელად იკითხება.

## უცვლელი საზღვრები

- Carousel slide array, timing, image URLs, hero text, CTA routes, reduced-motion behavior, catalog/cart/checkout logic, delivery policy და BOG sandbox არ შეცვლილა.
