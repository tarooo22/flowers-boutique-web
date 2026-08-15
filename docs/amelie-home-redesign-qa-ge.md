# Home-only Amelie-inspired redesign — QA ჩანაწერი

**თარიღი:** 2026-08-15  
**ფარგლები:** Home page-ის არაჰერო discovery და conversion სექციები.

ამ wave-ში გაუმჯობესდა კატეგორიების აღმოჩენა, curated collection-ის რიტმი, bouquet builder-ის პროცესის ხილვადობა, გამოცდილებების ბარათები, delivery context და contact conversion surface. Hero carousel, catalog query, routes, cart, checkout, ავტორიზაცია, BOG sandbox რეჟიმი, persistent image URL-ები და canonical delivery policy უცვლელად დარჩა.

| შემოწმება | შედეგი |
| --- | --- |
| Desktop visual QA — 1280px | წარმატებით შემოწმდა; editorial hierarchy, product grid, builder და conversion surfaces იკითხება თანმიმდევრულად. |
| Mobile visual QA — 390px | წარმატებით შემოწმდა; category, product, builder, delivery და contact სექციები responsive რეჟიმშია. |
| Narrow mobile QA — 320px | წარმატებით შემოწმდა; headings, CTA-ები და ერთსვეტიანი builder preview კითხვისთვის ხელმისაწვდომია. |
| Focus და touch safeguards | დაემატა თვალსაჩინო `:focus-visible`, 44px-მდე CTA სიმაღლეები და mobile safe-area მხარდაჭერა. |
| Motion | ახალი ინტერაქციები იყენებს მხოლოდ `transform`/`opacity`-ს, 180–220ms ease-out transition-ებს და `prefers-reduced-motion` fallback-ს. |
| Regression, types, build | სრული Vitest suite, `tsc --noEmit` და production build წარმატებით დასრულდა. |
| Browser/dev diagnostics | QA-ის შემდეგ ახალი warning ან error არ გამოვლენილა. |

შედეგი არის **Flower’s Boutique-ის ორიგინალური Georgian-first დიზაინის გამყარება**: Amelie-ისგან აღებულია მხოლოდ უსაფრთხო ინფორმაციული რიტმისა და premium discovery hierarchy-ის პრინციპები; ბრენდი, ტექსტი, პროდუქტები, ფასები, სურათები და კომერციული დაპირებები არ დაკოპირებულა.
