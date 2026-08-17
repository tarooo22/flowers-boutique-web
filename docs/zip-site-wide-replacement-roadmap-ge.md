# ZIP-derived Full-Site Presentation Replacement Roadmap

## მიზანი და ფარგლები

ამ ეტაპზე მიმდინარე **Flower’s Boutique** storefront-ის presentation სრულად უნდა გადავიდეს ატვირთული `flower-shopv3.zip` reference-ის ვიზუალურ სისტემაზე. სამუშაო შესრულდება **clean-room** პრინციპით: ZIP-ის source code, პროდუქტების ტექსტი, მონაცემები, ლოგოები და ფოტოგრაფია არ გადაიტანება. მისგან გამოიყენება მხოლოდ თვალსაჩინო სტრუქტურისა და დიზაინის წესების ანალიზი.

არსებული Flower’s Boutique მონაცემები, კატალოგის რეალური პროდუქტი/ფასი/ხელმისაწვდომობა, route-ები, SEO, ავტორიზაცია, admin access, კალათა, checkout, შეკვეთის გაგზავნა, Builder state და AI-generation flow უცვლელი რჩება.

## დადასტურებული ZIP visual system

| ფენა | ZIP reference-ის დადასტურებული წესი | მიმდინარე პროექტში clean-room დანერგვა |
|---|---|---|
| Canvas | თბილი cream გვერდის ფონი, სუფთა white surfaces და restrained 1px საზღვრები | `--zip-*` semantic tokens და არსებული legacy token aliases-ის კონტროლირებადი mapping |
| Typography | UI sans, display serif headings, მჭიდრო uppercase utility labels | Georgian-safe `Noto Sans Georgian` / `Noto Serif Georgian` fallback-ებით, არსებული language state-ის შენარჩუნებით |
| Container | 1280px desktop მაქსიმუმი, 24px desktop / 16px mobile gutter | საერთო `.zip-container` primitive და shared page shells |
| Geometry | 3/8/14/20px radius scale, მხოლოდ მსუბუქი shadow, 3:4 product media | ერთიანი card, panel, field, button, product-media primitives |
| Action | coral primary action, charcoal ink controls, dark footer | არსებული click handlers უცვლელად, მხოლოდ shared appearance layer იცვლება |
| Responsive | mobile-first; 480/768/1024/1280px hierarchy shifts; touch controls მინიმუმ 44px | 375, 430, 768, 1024, 1440 და 1920px regression checkpoints |
| Motion | მოკლე opacity/transform transitions, hover არის დამატებითი და არა აუცილებელი interaction | `prefers-reduced-motion` დაცვა; transitions მაქს. 300ms |

## ZIP surface inventory და მიმდინარე route mapping

| ZIP surface group | მიმდინარე Flower’s Boutique route/component | დაცული behavior/data contract | Replacement priority |
|---|---|---|---|
| Global CSS + layout | `client/src/index.css`, `App.tsx` | Theme, page restoration, analytics, route state | 1 |
| Header/Desktop/Mobile navigation | `components/Navbar.tsx`, mobile components | Search, language, account, admin shortcut, wishlist, cart count/drawer, contact sheet | 1 |
| Footer/contact | `components/Footer.tsx` | არსებული contact, legal და information links | 1 |
| Home sections | `pages/Home.tsx` | Live rails, CTA links, product links, contact actions, scroll-reveal behavior | 2 |
| Catalog + shared product card | `pages/Catalog.tsx`, `components/product/ProductCard.tsx` | Query filtering, URL parameters, sorting, pagination, quick add, wishlist, stock states | 2 |
| Product detail | `pages/ProductDetail.tsx`, `ProductDetailStates.tsx` | Gallery, variants, quantity, add-to-cart, delivery data, sticky mobile purchase action | 3 |
| Cart/drawer | `pages/Cart.tsx`, `components/CartDrawer.tsx` | Quantity/remove, persisted cart state, checkout path and messaging handoff | 3 |
| Checkout | `pages/Checkout.tsx` | Customer/delivery/recipient state, calendar/slots, orders, payment status routing | 3 |
| Account/auth | `pages/Login.tsx`, `Register.tsx`, `Profile.tsx` | Auth mutations, validation, profile/address/order functions | 4 |
| Wishlist | `pages/Wishlist.tsx` | Existing storage/data selection and product navigation | 4 |
| Informational + SEO landing pages | `About`, `Contact`, `Delivery`, `Returns`, `Privacy`, `Terms`, SEO catalog pages | SEO text, links, contact facts and legal content | 4 |
| Builder | `pages/AIBouquetBuilder.tsx`, `components/bouquet-builder/*` | Visual/AI modes, real `single-stems` inventory, pricing, availability, AI generation, cart payloads | 5 |
| Admin | `pages/Admin*.tsx` | Role gate, product/order mutation and database contracts | 5 |
| Payment + not-found states | `Payment*`, `NotFound.tsx` | Payment/route semantics and recovery links | 5 |

## Presentation/data boundary

| შეიძლება შეიცვალოს | არ იცვლება |
|---|---|
| Markup grouping, class names, shared CSS tokens, layout grids, whitespace, hierarchy, panel geometry, hover/focus/transition treatment, non-semantic presentation copy wrappers | tRPC/API calls, server router procedures, database schema/queries, cart keys/payloads, prices, inventory, category metadata, product images, auth, payment, checkout validation, SEO metadata fields, routes and identifiers |

## განხორციელების თანამიმდევრობა

პირველ რიგში შეიქმნება isolated ZIP-derived token and primitive layer, რათა არსებული 15k-line legacy stylesheet-ის arbitrary overrides აღარ იყოს ახალი page work-ის საფუძველი. შემდეგ განახლდება `Navbar`, `Footer`, shared product-card and form/control geometry. ამ foundation-ის შემდეგ გადაეწყობა discovery routes, მოგვიანებით transaction/account surfaces, და ბოლოს Builder/Admin/status surfaces.

ყოველი surface ცვლილება ინარჩუნებს semantic HTML-ს, keyboard flow-ს, focus indication-ს, 44px touch targets-სა და reduced-motion fallback-ს. ყოველი ფაზის ბოლოს შესრულდება targeted Vitest contracts, TypeScript validation, production build და desktop/mobile screenshot QA.

## ვიზუალური QA matrix

| Viewport | სავალდებულო შემოწმება |
|---|---|
| 375px | header/drawer, 2-column product media, field/action touch targets, sticky actions |
| 430px | mobile spacing boundary, title wrapping, chips and cart controls |
| 768px | tablet navigation, catalog filters, transaction layout shifts |
| 1024px | desktop grid activation, sidebars, product two-column layout |
| 1440px | max-container, header rhythm, product rails, footer columns |
| 1920px | large-screen blank-space balance and background continuity |

## Explicit non-goals

ეს სამუშაო არ ცვლის branding identity-ს, backend business rules-ს ან მონაცემებს reference ZIP-ის მონაცემებით. არც ZIP-ის კოდი, არც მისი ფოტოები, პროდუქტის ინფორმაცია ან source implementation არ ჩაიკოპირება მიმდინარე აპლიკაციაში.
