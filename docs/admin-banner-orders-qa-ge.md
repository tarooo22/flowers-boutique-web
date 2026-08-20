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
| Orders analytics — desktop | PASS | Published workspace-ში რეალური ერთი შეკვეთიდან გამოითვალა 164 ₾ შემოსავალი, 164 ₾ საშუალო, 1 ახალი რიგში; status chart, date chart და recent-orders table აჩვენებს იმავე `FLR-600001` ჩანაწერს. |
| Chart rendering | PASS | Desktop render-ში status chart-ის მხოლოდ „ახალი“ სვეტი არის 1, ხოლო daily trend-ის `Aug 20` სვეტი არის 1; chart values ემთხვევა metric card-სა და order table-ს. |
| Orders queue consistency | PASS | ანალიტიკის ქვემოთ არსებული სამუშაო queue ასევე აჩვენებს 1 ახალ შეკვეთას და იმავე customer/total/status მნიშვნელობებს; დამატებითი demo/mock order არ არის. |
| Order detail workflow | PASS | `FLR-600001` card გაიხსნა და აჩვენა რეალური custom bouquet, 149 ₾ subtotal, 15 ₾ delivery, 164 ₾ total, recipient, address, დრო, შენიშვნა, click-to-call, Google Maps და სტატუსის მოქმედებები. QA-ში სტატუსი არ შეცვლილა. |
| Order non-destructive QA | PASS | Detail expansion, workspace navigation და scroll შემოწმებების შემდეგ order დარჩა „ახალი“ სტატუსით და 164 ₾ total-ით. |

> ამ ეტაპზე database-ში არცერთი Banner ჩანაწერი არ იყო, ამიტომ ცარიელი state მოსალოდნელია და არ მიუთითებს loading/runtime შეცდომაზე.
