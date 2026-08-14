# Amelie-inspired shared storefront shell — Wave 1 QA

**თარიღი:** 2026-08-15  
**Scope:** Navbar/Footer presentation refinement და append-only shared-shell CSS.  
**არ შეცვლილა:** კატალოგის მონაცემები, routes, search semantics, auth/session, wishlist/cart behavior, checkout/payment flow, delivery policy, BOG sandbox mode და persistent image URLs.

## ვიზუალური შემოწმება

| Viewport | გვერდები | შედეგი | დადასტურებული მიგნება |
|---|---|---|---|
| 1280px | Home, Catalog, About | გავლილია | Header-ის utility/action hierarchy და route-aware navigation ერთიანდება public journey-ში; footer-ის delivery CTA და contact/link group-ები მოქმედი route-ებით არის წარმოდგენილი. Home-ის carousel და editorial cadence შეუცვლელია. |
| 390px | Home, Catalog, About | გავლილია | Header და trust strip იკავებს წასაკითხ, კომპაქტურ სიმაღლეს; CTA-ები და card/grid ლეიაუთები არ იკვეთება. About-ის editorial content და footer link rhythm ერთსვეტიან რეჟიმში იკითხება. |
| 320px | Home, Catalog, About | გავლილია | Shared header, trust messaging, product-card columns, About storytelling და footer CTA ინარჩუნებს წასაკითხად განლაგებას ჰორიზონტალური overflow-ისა და fixed-control გადაფარვის გარეშე. |

## შემდგომი აუცილებელი შემოწმება

1. შემდეგი wave-ის დაწყებამდე catalog-ის მიუწვდომელი source-image მდგომარეობის ცალკე investigation; ეს არ არის Wave 1-ის მიერ წარმოქმნილი ცვლილება და არ იცვლება owner-approved data remediation-ის გარეშე.

## ავტომატური და runtime შემოწმება

| შემოწმება | შედეგი | შენიშვნა |
|---|---|---|
| Focused UI contract | გავლილია | `server/ui.header-contract.test.ts`: 30/30 ტესტი. |
| სრული Vitest | გავლილია | 36 test file / 160 ტესტი წარმატებით; 3 opt-in suite / 10 ტესტი გამოტოვებულია. |
| TypeScript | გავლილია | `pnpm tsc --noEmit` დასრულდა შეცდომის გარეშე. |
| Production build | გავლილია | `pnpm build` დასრულდა წარმატებით. არსებული bundle-size warning არ არის Wave 1-ის შეცდომა. |
| Browser/dev-server diagnostics | გავლილია | მიმდინარე ლოგებში ახალი error, TypeError, ReferenceError ან server failure არ ფიქსირდება. |
