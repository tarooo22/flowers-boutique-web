# AI ტაიგული — კატალოგი და preview QA

## მიმდინარე მიგნება

AI picker აქამდე იღებდა მხოლოდ `builderFlowers`-ის ცხრა სტატიკურ ჩანაწერს. Live კატალოგში `single-stems` კატეგორიაში 70 ჩანაწერია, რომელთაგან 43 გამოქვეყნებული და მარაგშია; ყველა მათგანს აქვს primary image. ახალი mapper `listLiveProducts()` შედეგიდან სწორედ ამ ხელმისაწვდომ individual flowers-ს აგროვებს, ამიტომ მომავალში Admin-იდან დამატებული/გამოქვეყნებული ყვავილიც ავტომატურად გამოჩნდება AI picker-ში.

## Preview boundary

არჩეული ყვავილები აღარ არის rotated fan elements. Preview იყენებს fixed-inset grid-ს, სადაც თითოეული item არის `overflow-hidden` cell, ხოლო 36 stem-მდე row tracks `minmax(0, 1fr)`-ით თავსდება card-ის შიგნით. თითოეული არჩეული ყვავილი ჩანს რაოდენობის badge-ით და არცერთი item არ უნდა გასცდეს preview card-ს.

## Responsive evidence

| Viewport | Status | Observation |
|---|---|---|
| 375 × 812 | PASS | Builder page shell, preview frame, flower cards და summary სრულად იკითხება და horizontal overflow არ ჩანს. |
| 768 × 1024 | PASS | Preview და two-column flower control cards ინარჩუნებს layout-ს clipping-ისა და overlay overlap-ის გარეშე. |
| 1440 × 900 | PASS | ფართო layout-ში preview/control columns, summary და footer სტაბილურია; ახალი server-side data flow-ს არ შეუცვლია Visual Builder geometry. |

> Headless browser environment-ში AI tab state click-ის შემდეგ არ იცვლება მიუხედავად page error-ის არქონისა, ამიტომ იქ interactive smoke test არ არის reproducible QA signal. მის ნაცვლად დაცულია source-contract test (all selected flowers render as clipped cells), live mapper unit tests და სრული suite. TypeScript, 57 Vitest tests და production build წარმატებით დასრულდა.
