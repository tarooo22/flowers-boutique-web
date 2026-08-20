# Admin Banner და შეკვეთების QA

## გამოქვეყნებული Manager session — 20 აგვისტო 2026

| შემოწმება | შედეგი | მტკიცებულება |
| --- | --- | --- |
| Admin role gate | PASS | Manager session-ში `/admin` ხსნის ოპერაციულ პანელს; unauthenticated Admin Banner endpoint დაბრუნებს `401`-ს. |
| პროდუქტის data load | PASS | გამოქვეყნებული manager workspace-ში იტვირთება 170 რეალური პროდუქტი, კატეგორიები, ფასი, მარაგის toggle და edit/delete მოქმედებები. |
| Banner საწყისი მდგომარეობა | PASS | „ბანერები“ tab-ში ჩანს ქართული სათაური, ახალი ბანერის მოქმედება და ცარიელი state: „ბანერი ჯერ არ არის“. |
| Banner editor | PASS | Modal შეიცავს ქართულ/ინგლისურ სათაურსა და ქვესათაურს, CTA label/link, რიგითობას, publish checkbox-ს, device upload-სა და Cancel/Save action-ებს. |
| Banner მედია არჩევა | PASS | Editor-იდან იხსნება არსებული media library და აჩვენებს რეალური კატალოგის ასობით ატვირთულ ფოტოს საძიებო ველით; ახალი მედია არ შექმნილა. |
| Modal safety | PASS | Media library-ის explicit „დახურვა“ მოქმედება აბრუნებს ოპერატორს Banner editor-ში; QA-ში არცერთი field/data ცვლილება არ შენახულა. |
| Banner persistence | მიმდინარეობს | მომხმარებელმა დაადასტურა დროებითი, inactive test banner-ის create → edit/publish toggle → delete შემოწმება; editor საწყისად გამოუქვეყნებელია. |

> Persistence test-ის შექმნამდე editor-ში შეტანილია მხოლოდ სათაურები „ტექნიკური შემოწმება — წასაშლელია“ და „Temporary QA banner — delete after test“. Publish toggle არ ჩართულა.

> **შეჩერებული უსაფრთხოების აღმოჩენა:** media library-ში არჩევისთვის გამოჩნდა legacy external asset (`https://example.com/rose1.jpg`). Banner API მიზანმიმართულად მიიღებს მხოლოდ `/manus-storage/` + `admin-media/` წყვილს, ამიტომ ამ არჩევნით შენახვა არ გაგრძელებულა. საჭიროა client-side filter, რათა Banner editor-ში მხოლოდ API-სთან თავსებადი managed media ჩანდეს.

> Compatibility filter-ის production release `fe1c6897`-ის შემდეგ authenticated manager session ხელახლა დადასტურდა; Banner workspace ამჟამად ცარიელია და წინა შეუნახავი QA draft არ შექმნილა.

> **Filter verification — PASS:** Banner editor-ის media library უკვე ცარიელია იმ გარემოში, სადაც ადრე legacy external catalog images ჩანდა. ეს ადასტურებს, რომ picker მხოლოდ `/manus-storage/` + `admin-media/` assets-ს ეძებს; ამჟამად ასეთი წინასწარ არსებული asset არ არის, ამიტომ დროებითი Banner-ის persistence test-ს ახალი managed ფოტო სჭირდება.

> **Upload handoff:** Banner-ის native device upload control ხელმისაწვდომია და საჭიროებს ერთი JPG/PNG/WebP ფაილის არჩევას. Remote QA browser-ში hidden `<input type="file">` ინდექსად არ ჩანს, ამიტომ ამ automated channel-იდან ფაილის მიმაგრება ვერ შესრულდა; Banner ჩანაწერი და მედია არც შექმნილა.

> **Managed upload — PASS:** მომხმარებელმა native selector-ით ატვირთა ერთი QA image; UI-მ დაადასტურა `1 ფოტო აიტვირთა და მედია ბიბლიოთეკაში დაემატა`, ხოლო editor-ში არჩეული key არის `admin-media/2026-08-20/42d0f4c3-c894-486b-a1dd-6882f8ab9ace.png`. დროებითი draft-ის active toggle გამორთულია.

> **Create — PASS:** დროებითი Banner `ტექნიკური შემოწმება — წასაშლელია` / `Temporary QA banner — delete after test` შეიქმნა `/catalog` CTA-ითა და რიგითობით `0`. UI ადასტურებს „ახალი ბანერი შეიქმნა. გამოსაჩენად ჩართეთ publish.“ და card არის `draft`/`არ ჩანს` — არ გამოქვეყნებულა.

> **Publish → storefront — PASS:** publish toggle-მა Banner card გადაიყვანა „გამოქვეყნებულია / მთავარ გვერდზე ჩანს“ მდგომარეობაში. Public homepage-მ ამ მოკლე QA ინტერვალში რეალურად აჩვენა დროებითი ქართული სათაური `ტექნიკური შემოწმება — წასაშლელია`, რაც ადასტურებს active-only homepage feed-ს. შემდეგი ნაბიჯი: დროებითი ჩანაწერის დაუყოვნებლივ წაშლა.

> **Delete — PASS:** My Browser extension-მა delete click-ზე 504 timeout დააბრუნა, ამიტომ მისი მდგომარეობა ჯერ read-only database query-ით დავადგინე: არსებობდა მხოლოდ `id = 1`, active QA Banner. მომხმარებლის წინასწარი დადასტურების შესაბამისად, ზუსტად ეს record წაიშალა `id` + სრული temporary title-ით. შემდგომმა read-only count query-მ დააბრუნა `0`; reusable managed image დარჩა media library-ში.

> **Post-delete UI confirmation — PASS:** manager Banner workspace კვლავ აჩვენებს „ბანერი ჯერ არ არის“, რაც database count-ის `0` შედეგს ემთხვევა. შემდეგი, narrowly scoped QA ნაბიჯი შეამოწმებს editor-ის text update/save interaction-ს იმავე reusable managed image-ით.

> **New media-library persistence defect:** QA upload-ისას `admin-media/...42d0f4c3...png` წარმატებით აირჩა Banner editor-ში, მაგრამ ახალი editor session-ის media library ცარიელია. ეს ნიშნავს, რომ upload response დროებით არსებობს client state-ში, თუმცა managed asset persistent admin-media listing-ში არ ინახება/იბრუნება. Editor update QA შეჩერდა, რათა workflow defect ჯერ გამოსწორდეს.

> **Registry release:** `885547f5` ამატებს persistent `adminMediaAssets` registry-სა და უკვე ატვირთული QA asset-ის ერთჯერად backfill-ს. გამოქვეყნებული authenticated Banner workspace განახლების შემდეგ სუფთად იტვირთება; ახლა მოწმდება cross-session picker-იდან არსებული managed asset-ის დაბრუნება.

> **Registry ordering defect:** persistent registry უკვე იკითხება, მაგრამ მის assets-ს media list-ში legacy product cover/gallery entries-ის შემდეგ ამატებს. 120-item list limit-ის გამო managed asset Banner picker-მდე ვერ აღწევს. გამოსწორება: managed uploads უნდა იყოს list-ის სათავეში, რათა ყველაზე ახალი reusable uploads პრიორიტეტულად გამოჩნდეს.

> **Ordering repair release:** `cb12096d` გამოაქვეყნებს managed assets-first ordering-ს. Publish შემდეგ authenticated Banner workspace სუფთად იტვირთება და შემდგომი picker check მზადაა.

> **Deployment timing note:** deployment completion-მდე გაკეთებულ authenticated `/api/admin/media` შემოწმებაში QA key ჯერ არ გამოჩნდა. Release-ის deploy success notification ამის შემდეგ მივიღეთ; შესაბამისად, picker/API validation მეორდება ახლად დასრულებული production release-ის წინააღმდეგ და წინარე cache პასუხი საბოლოო მტკიცებულებად არ ითვლება.

> **Runtime mismatch diagnosis:** direct database query ადასტურებს `adminMediaAssets`-ში QA row-ის არსებობას, მაგრამ authenticated production `/api/admin/media?release=cb12096d-final` პასუხი ისევ `cover-1`-ით იწყება და key არ შეიცავს. ეს მიუთითებს ძველი route runtime-ის ან release-propagation mismatch-ზე და არა დაკარგულ metadata-ზე; საჭიროა release retry, შემდეგ კი API/picker-ის ხელახალი check.
| Orders analytics — desktop | PASS | Published workspace-ში რეალური ერთი შეკვეთიდან გამოითვალა 164 ₾ შემოსავალი, 164 ₾ საშუალო, 1 ახალი რიგში; status chart, date chart და recent-orders table აჩვენებს იმავე `FLR-600001` ჩანაწერს. |
| Chart rendering | PASS | Desktop render-ში status chart-ის მხოლოდ „ახალი“ სვეტი არის 1, ხოლო daily trend-ის `Aug 20` სვეტი არის 1; chart values ემთხვევა metric card-სა და order table-ს. |
| Orders queue consistency | PASS | ანალიტიკის ქვემოთ არსებული სამუშაო queue ასევე აჩვენებს 1 ახალ შეკვეთას და იმავე customer/total/status მნიშვნელობებს; დამატებითი demo/mock order არ არის. |
| Order detail workflow | PASS | `FLR-600001` card გაიხსნა და აჩვენა რეალური custom bouquet, 149 ₾ subtotal, 15 ₾ delivery, 164 ₾ total, recipient, address, დრო, შენიშვნა, click-to-call, Google Maps და სტატუსის მოქმედებები. QA-ში სტატუსი არ შეცვლილა. |
| Order non-destructive QA | PASS | Detail expansion, workspace navigation და scroll შემოწმებების შემდეგ order დარჩა „ახალი“ სტატუსით და 164 ₾ total-ით. |

> ამ ეტაპზე database-ში არცერთი Banner ჩანაწერი არ იყო, ამიტომ ცარიელი state მოსალოდნელია და არ მიუთითებს loading/runtime შეცდომაზე.
