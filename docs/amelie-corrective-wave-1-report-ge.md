# Amelie-first corrective wave 1 — final report

**სტატუსი:** დასრულებულია და გაჩერებულია მომხმარებლის მითითებული საზღვრით.  
**Scope:** global canvas, announcement rail, header/navigation, Home, shared ProductCard და footer.  
**Explicitly not started:** Catalog composition rebuild, ProductDetail composition rebuild, CartDrawer markup rebuild და account/public secondary-page rebuild.

> Corrective wave 1 აღარ იყენებს Flower’s Boutique-ის ძველ visual structure-ს როგორც დიზაინის საწყისს. Page composition-ის source of truth არის Amelie.ge-ის საჯაროდ ხილული homepage; Flower’s Boutique რჩება საკუთარი მონაცემების, ფოტოების, ტექსტის, ფასების, routes-ისა და business logic-ის source of truth. [1]

## ზუსტად შეცვლილი ფაილები

| ფაილი | ცვლილება |
|---|---|
| `client/src/components/Navbar.tsx` | ჩანაცვლდა header/announcement/navigation markup ახალი `am-*` structure-ით; search, language, auth/account, wishlist, cart, admin, mobile Sheet და ContactSheet callbacks დარჩა |
| `client/src/components/mobile/MobileBottomNav.tsx` | აღდგა existing quick-navigation behavior, მაგრამ visual class/body contract გადავიდა `am-mobile-quick-nav`-ზე |
| `client/src/pages/Home.tsx` | მთლიანად ჩანაცვლდა ძველი Home composition: hero → occasion chips → სამი commerce rail → builder proposition → services → journal → footer |
| `client/src/components/product/ProductCard.tsx` | მედია-led Amelie-style card DOM: portrait media, favourite overlay, localized title/price და compact action affordance; logic უცვლელია |
| `client/src/components/Footer.tsx` | footer markup შეიცვალა dark brand/column/mobile-accordion structure-ით და არსებული links/contact/account conditions დარჩა |
| `client/src/styles/amelie-rebuild.css` | დაემატა პირველი corrective wave-ის clean-room canvas, shell, header, Home, ProductCard, footer, mobile quick-nav და reduced-motion rules |
| `client/src/main.tsx` | ახალი corrective stylesheet-ის final import |
| `server/ui.header-contract.test.ts` | მოძველებული pre-correction visual assertions ჩანაცვლდა ახალი public presentation contract-ით |
| `server/home.media-contract.test.tsx` | Home media contract გადაბმულია ახალ Flower’s Boutique-owned hero/service assets-სა და composition-ზე |
| `server/ui.corrective-am-home.contract.test.ts` | დაემატა reconstructed Home, routes, ProductCard, footer და mobile quick-nav regression coverage |
| `scripts/corrective_home_interaction_qa.py` | დაემატა read-only Playwright interaction QA script |
| `docs/corrective-home-interaction-qa.json` | live header/mobile interaction QA შედეგები |
| `docs/amelie-home-structure-2026-08-16-ge.md` | fresh Amelie homepage structure evidence |
| `docs/amelie-corrective-wave-boundaries-ge.md` | presentation-to-business boundary map |

## ძველი visual structures, რომლებიც ჩანაცვლდა

| ძველი Flower’s Boutique presentation | ახალი Amelie-first structure |
|---|---|
| პალეტზე დაფუძნებული, მრავალსექციიანი experience-first Home | Full-width hero და compact metric row, შემდეგ question/chips, product rails, proposition, service cards და journal sequence |
| დიდი rounded builder panel, delivery steps და საბოლოო contact banner | ერთი split-image proposition panel და Amelie-style service/editorial progression |
| category artwork gallery | occasion prompt და filter-chip surface |
| old `p1-*` ProductCard media/title/full-width CTA geometry | portrait media, upper-right favourite, short title/price stack და compact action control |
| old header layout/mobile bottom-nav styling | black announcement rail, compact ivory public header და Amelie-compatible mobile quick navigation |
| previous footer presentation | dark multi-column footer plus mobile disclosure groups |

## დაცული business behavior

| სფერო | სტატუსი |
|---|---|
| Products/categories queries | უცვლელია (`products.list`, `categories.list`) |
| Product names, prices, availability, variants | უცვლელია; მხოლოდ DOM/CSS შეიცვალა |
| Wishlist persistence | უცვლელია (`flowers-boutique-wishlist`) |
| Quick add და CartDrawer | უცვლელია; Home და header/mobile quick-nav კვლავ ხსნიან CartDrawer-ს |
| Auth/account/admin | უცვლელია; account menu, login/register/profile/admin paths დარჩა |
| Language state | უცვლელია; ქარ/ENG actions კვლავ არსებული provider-ისკენ მიდის |
| Search | უცვლელია; public search კვლავ `/catalog?search=` route-ს იყენებს |
| SEO/JSON-LD | უცვლელია; Home კვლავ იძახებს `useSEO`, organization და local-business schema generators-ს |
| Checkout, payment, orders, API, database | **არ შეცვლილა** |

## ამელი-style structures, რომლებიც reconstructed იქნა

The rebuilt public Home now follows the observed macro rhythm of the Amelie reference: the delivery rail precedes a compact commerce header; the homepage begins with image-backed editorial hero copy, CTA and metrics; a question-and-chip discovery surface leads into repeated four-card product rails; a broad proposition panel precedes paired services and a smaller journal area; the dark footer closes the page. This is an independent React/CSS implementation that uses Flower’s Boutique-owned content and assets. [1]

## Screenshot comparison and corrective iteration

| Viewport | Reference-aligned result | Corrective finding / final state |
|---:|---|---|
| 375px | Compact dark rail + ivory header, image-led hero, two-column product rails, stacked service/footer order | First hero title trial created character-level Georgian breaks; the final pass switched to natural word wrapping with a smaller mobile scale. Fixed bottom quick-nav is visible in first-viewport QA. |
| 430px | Same mobile hierarchy with wider two-column rails and chip scroll | Final screenshot captured after the Georgian type correction; no horizontal overflow observed. |
| 768px | Constrained shell, compact header, image-led hero and two-column rails | Final structure holds intermediate tablet geometry; service cards remain paired. |
| 1024px | Desktop header/nav resumes; 1280px-class shell and four-card rails | Product rails, proposition split panel, services, journal and footer follow expected desktop order. |
| 1440px | Constrained content width with wide hero, four card columns and large editorial spacing | Final screenshot confirms macro hierarchy is no longer driven by the old Home layout. |
| 1920px | Extra viewport width becomes whitespace outside the constrained commerce shell | Cards remain dense rather than stretching; hero remains edge-to-edge, as in the reference. |

The most material visible correction was made from the 375px screenshot: Georgian title wrapping initially split individual characters, so the mobile type scale and wrapping policy were corrected and the narrow mobile screenshots were captured again.

## Runtime interaction verification

The local Playwright QA script passed all checked states after waiting for the live app to settle. It confirmed desktop routes for `/catalog`, `/bouquet-builder`, `/about` and `/contact`; search dialog; account menu; header cart drawer; sticky header state; mobile quick-nav; mobile menu routes; cart opening from quick-nav; and the mobile contact sheet.

| Live behavior | Result |
|---|---|
| Desktop primary nav | Passed |
| Search dialog | Passed |
| Account menu | Passed |
| Header cart drawer | Passed |
| Sticky/scroll header state | Passed |
| Mobile menu + Contact/Wishlist/Delivery routes | Passed |
| Mobile quick-nav for Home/Catalog/Wishlist/Cart | Passed |
| Cart drawer from mobile quick-nav | Passed |
| Contact sheet from mobile menu | Passed |

## Validation results

| Check | Result |
|---|---|
| TypeScript: `pnpm check` | Passed |
| Focused corrective contract suites | 17 passed across 3 files |
| Full Vitest: `pnpm test` | Passed after contract migration; existing intentional skips remain |
| Production build: `pnpm build` | Passed |
| Bundle advisory | An existing Vite advisory remains for a minified shared chunk above 500kB. This corrective wave reduces Home’s own emitted chunk substantially and does not add a new warning class. |

## Remaining visual differences

Typography is intentionally a close lawful fallback rather than a copied Amelie font asset. Flower’s Boutique’s wordmark, product images, text, delivery facts and service routes necessarily differ. The bottom mobile quick navigation is retained to preserve an existing user behavior, though it is styled as a minimal neutral surface rather than the old visual component. Catalog and ProductDetail still have their pre-wave content compositions, which is expected because the user explicitly directed the work to stop before their rebuild.

## Stop boundary

No Catalog, ProductDetail, CartDrawer or secondary-page composition rebuild has been started. A next visual wave requires explicit user approval.

## References

[1]: https://amelie.ge/ "Amelie.ge homepage — public visual reference"
