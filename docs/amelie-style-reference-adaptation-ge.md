# Supplied Amelie-style HTML reference — adaptation notes

**Source:** user-supplied `/home/ubuntu/upload/amelie-style-preview_1.html` preview, reviewed 2026-08-16.

Reference-ის ძირითადი visual language არის თბილი cream canvas (`#faf6ef`), თეთრი card surfaces, რბილი beige panel (`#f4efe6`), ink ტექსტი (`#201d1a`), muted ტექსტი (`#6b6459`), coral primary (`#e4472f`), deep coral hover (`#c8402c`), green support (`#14532d`) და charcoal footer/hero (`#171717`). ტიპოგრაფიული წყვილია `Noto Serif Georgian` სათაურებისთვის და `Noto Sans Georgian` UI/body ტექსტისთვის.

სტრუქტურული პრინციპებია შავი utility/announcement band, sticky translucent cream navigation border-bottom-ით, serif brand wordmark, understated underline active nav, coral primary CTA, rounded 12–16px product cards, editorial section headers with right-aligned “view all” link, green soft service/cashback-style panel, two-column service cards, და dark multi-column footer.

Flower’s Boutique-ში ეს პრინციპები გადაიტანება მხოლოდ ორიგინალური adaptation-ით: არსებული bilingual wordmark, რეალური persistent-storage imagery, catalog/product data, routes, cart, checkout, auth, delivery policy და BOG sandbox რეჟიმი უცვლელი რჩება. Reference-ის unsupported 90-minute delivery, cashback, first-order discount, 200 GEL threshold, fabricated account name და placeholder contact values არ გადმოდის.

Implementation constraint: `client/src/index.css`-ში ცვლილებები append-only იქნება. ახალი motion მხოლოდ `transform`/`opacity`-ზე იმუშავებს, 300ms-ზე ნაკლები ease-out timing-ით, `prefers-reduced-motion` fallback-ით. არსებული `p1-*` semantic hooks და route-safe JSX შენარჩუნდება; საჭიროების შემთხვევაში მხოლოდ presentation classes დაემატება.

## Visual QA findings

1280px full-page preview-ზე reference adaptation-ის cream canvas, coral accents, white rounded product cards, dark builder/contact panels და charcoal footer მკაფიო hierarchy-ს ქმნის. Existing hero carousel untouched დარჩა; მის გარშემო utility/header, discovery sections და conversion rhythm ახალ palette-სთან თანმიმდევრულია.

390px preview-ზე navigation compact რეჟიმში გადადის, category artwork და product grid ინარჩუნებს readable two-column rhythm-ს, builder/contact panels არ იჭრება და footer links readable რჩება. 320px preview-ზე Georgian headings, CTA-ები, delivery cards და footer columns კვლავ within viewport რჩება; horizontal overflow ან text clipping ვიზუალურად არ დაფიქსირდა.
