# Admin Operations Audit — 2026-08-20

## საწყისი რეალური მდგომარეობა

Authenticated manager session-ში Products tab წარმატებით ჩაიტვირთა **170 პროდუქტით**. თითოეულ პროდუქტზე ჩანს ფასი, მარაგის toggle, edit/delete entry point და category filter; source კონტრაქტი ამ მოქმედებებს role-protected `/api/admin/products` route-ს უკავშირებს. Categories tab-ში ხელმისაწვდომია add/edit/delete entry point-ები და თითოეულ კატეგორიას ნაჩვენები აქვს პროდუქტის რეალური რაოდენობა. Delete ქმედება server-side ბლოკდება, თუ კატეგორიას პროდუქტები აქვს მიბმული.

| Audit surface | არსებული კონტრაქტი | დადასტურებული ხარვეზი/გაფართოება |
|---|---|---|
| პროდუქტები და მედია | Create/edit/delete, ფასი, ხელმისაწვდომობა, მრავალფოტოიანი managed upload/picker | საჭიროა workflow-ის სრული regression audit და უფრო მკაფიო შედეგის/შეცდომის feedback. |
| კატეგორიები | Protected CRUD და `category_in_use` delete guard | საჭიროა სრული browser/API audit; data model ხელმისაწვდომია. |
| შეკვეთები | Protected სტატუსის ცვლილება და detail card | ცხრილი/metrics/chart dashboard არ არსებობს; მონაცემები ჯერ მხოლოდ client-side list/filter-ად ჩანს. |
| ბანერები | Admin tab მხოლოდ informational placeholder-ია | **რეალური persistence, protected API და storefront integration არ არსებობს.** |

## Data findings

Order schema-ში უკვე არის total, delivery fee, fulfillment/status, delivery date/time და created-at ველები; ამ მონაცემებიდან შესაძლებელია რეალური, არა-მოკირებული სტატუსების, შემოსავლისა და დროის aggregate dashboard-ის გამოთვლა. Banner table პროექტის production schema-ში არ არის, ამიტომ ბანერების მართვა უნდა დაემატოს schema-first migration-ით და მხოლოდ არსებული storefront target-ებისთვის.

## Live manager findings

Categories tab-ში ექვსივე კატეგორია ჩანს რეალური პროდუქტის count-ით და protected add/edit/delete entry point-ებით. UI-ში პროდუქტი-შემავსებელი კატეგორიებიც სწორად არის იდენტიფიცირებული, რაც server-side delete guard-ს შეესაბამება.

Orders tab-ში ამჟამად მხოლოდ სტატუსის ხუთი counter card, ძიება და expandable ერთი-სტრიქონიანი order card არსებობს. Live მონაცემი აჩვენებს ერთ ახალ შეკვეთას (**FLR-600001**, 164 ₾), მაგრამ არ არის aggregate revenue/AOV/trend visualization, დროის/სტატუსის chart ან კომპაქტური ოპერაციული table. ამიტომ გაუმჯობესებული dashboard უნდა დაეყრდნოს მხოლოდ რეალური orders payload-ის aggregate-ებს და არ უნდა დაამატოს mock data.
