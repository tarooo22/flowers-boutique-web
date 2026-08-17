# Amelie Catalog — გადასატანი UX/UI პატერნები

**წყარო:** [amelie.ge/catalog](https://amelie.ge/catalog)  
**დათვალიერების თარიღი:** 2026-08-17  
**ფარგლები:** მხოლოდ საჯაროდ ხილული visual hierarchy და interaction pattern-ები; ბრენდი, ტექსტები, ფოტოები, ფასები, product data და commercial claims არ გადმოგვაქვს.

## დაკვირვებული პატერნები

| ფენა | საჯაროდ ხილული პატერნი | Flower’s Boutique-ის ორიგინალური ადაპტაცია |
| --- | --- | --- |
| Header | შეკუმშული utility rail, ლოკალის გადამრთველი, ძებნა და commerce actions | არსებული shared Navbar-ის navigation და action hierarchy; Flower’s Boutique-ის საკუთარი wordmark და canonical delivery context რჩება. |
| Catalog masthead | მოკლე H1 და compact filter groups პირდაპირ მის ქვემოთ | Georgian-first H1, მოკლე discovery copy და responsive filter/sort surface. |
| Filters | category, price და occasion chips ანგარიშებით | არსებული კატეგორიები/რეალური მონაცემები, არა სტატიკური counts ან ახალი commercial tags. |
| Search & sort | ფილტრის შემდეგ სრული სიგანის search, პროდუქტის count და sort action | არსებული Catalog query-state-სთან დაკავშირებული search/sort layout და keyboard-focus feedback. |
| Product grid | airy ოთხსვეტიანი grid, დიდი image-first cards, upper-right wishlist action, მოკლე title/price metadata | persistent Manus-storage product images, არსებული wishlist/cart logic და Flower’s Boutique tokenized rounded surfaces. |
| Continuation | grid-ის შემდეგ service/contact invitation და dark footer rhythm | არსებული Footer და რეალური contact/delivery content; ახალი delivery SLA ან support claim არ დაემატოს. |

## ხარისხის საზღვრები

Implementation უნდა დარჩეს presentation-only: არ შეიცვალოს product query, routes, inventory/availability, wishlist/cart behavior, checkout hand-off, authentication, delivery policy (₾5, უფასო ≥₾150, pickup უფასო) ან BOG sandbox. Motion უნდა იყოს მხოლოდ `transform`/`opacity`, 300ms-ზე ნაკლები, და გათვალისწინებული ჰქონდეს `prefers-reduced-motion`.
