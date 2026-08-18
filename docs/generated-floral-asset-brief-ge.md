# Generated Floral Asset Brief

## მიზანი

ახალი Next.js storefront-ის inspection-მა გამოავლინა არა პროდუქტის, არამედ **editorial/lifestyle** მედიის slots, რომლებშიც არსებულმა legacy storage imagery-მ Next image optimizer-ის გზაზე ცარიელი blocks წარმოქმნა. Product Detail, Catalog და Builder-ის რეალური პროდუქტის ფოტოები ამ სამუშაოს ფარგლებს გარეთ რჩება.

## Visual audit

| Surface | Slot | Ratio | Issue | Planned asset |
|---|---|---:|---|---|
| About | Primary studio hero | 4:3 | Visible blank hero surface | `about-studio` |
| About / Home editorial | Floristry-school card | 16:10 / wide editorial crop | Existing inherited editorial media is weak/broken | `floristry-school` |
| About / Home editorial | Event and wedding card | 16:10 / wide editorial crop | Existing inherited editorial media is weak/broken | `event-florals` |
| Journal | Cut-flower care article | 7:5 / 3:2 compatible | Visible blank card | `journal-care` |
| Journal | Peony and colour stories | 7:5 / 3:2 compatible | Visible blank cards | `journal-peony` and `journal-colour` |

The existing `about-studio` asset may also provide the third About service-card crop without changing product data. The two generated service visuals will be reused in Home editorial and About services, avoiding superficial duplicate image generation while maintaining a coherent story.

## Shared art direction

All visuals use a refined **contemporary florist-studio editorial photography** language: warm ivory, parchment, sand, muted blush, quiet sage, small coral accents; natural side-window light; tactile paper, glass, linen and stone; gentle grain; soft shadows; unhurried artisan mood. No text, no logos, no readable labels, no watermarks, no collage, no stock-photo artificiality, no isolated white-background product cutouts. Photographs must preserve a calm area for UI overlays or card crops.

## Generation prompts

| Asset | Prompt goal | Required composition |
|---|---|---|
| `about-studio` | An artisanal florist studio in Tbilisi mood, with fresh flowers being arranged at a pale stone worktable and faintly visible hands only | Landscape 4:3, flowers and hands in right third, clean warm negative space at left, 50mm f/2.8, soft window light |
| `floristry-school` | Hands-on floristry workshop: hands teaching a small seasonal arrangement with stems, shears and craft paper | Landscape 16:10, close overhead three-quarter view, lower-left image area kept calm for copy, soft daylight |
| `event-florals` | Elegant intimate event table dressed with peach, cream and pale green seasonal florals, candles and linen | Landscape 16:10, no guests/faces, table detail in right/middle, serene blank edge for copy, warm editorial side light |
| `journal-care` | Still life of a clean glass vase, freshly cut flower stems, pruning shears and a folded linen cloth on a sunlit kitchen counter | Landscape 3:2, balanced deep focus, cool fresh water notes, no writing/labels |
| `journal-peony` | A generous bowl-like cluster of blush and coral peonies at different opening stages on a matte warm-neutral studio surface | Landscape 3:2, gentle morning side-light, premium natural floral editorial |
| `journal-colour` | Artful colour-study of separated coral, soft blue, lavender and classic red flower stems on a warm ivory table | Landscape 3:2, quiet graphic composition, true botanical texture, no swatches/text |

## Integration rules

Generated assets are uploaded to managed web storage before source integration. All corresponding Next `<Image>` uses will render with direct/unoptimized delivery where the asset source is `/manus-storage/*`, avoiding the known redirect/optimizer empty-response failure. No product row, price, inventory, category, checkout, account, cart, session, admin or payment implementation will be changed.

## Final selected asset manifest

The first reference image completed successfully and was retained for the About hero and one existing loyalty-service crop. The initial five-image reference-dependent batch failed; it was replaced with an independently prompted second generation batch. Visual QA confirmed the selected images render as real floral photos at desktop and 375px mobile widths, with no failure or generating-state placeholders.

| Asset role | Managed storage URL | Active surfaces |
|---|---|---|
| Studio worktable hero | `/manus-storage/fb-about-studio-reference_85c9ad71.jpg` | About hero; About loyalty service card |
| Floristry workshop | `/manus-storage/fb-floristry-school-v2_4cc3b90e.jpg` | About school service; Home floristry-school editorial card |
| Event table florals | `/manus-storage/fb-event-florals-v2_506c3067.jpg` | About events service; Home events editorial card |
| Cut-flower care still life | `/manus-storage/fb-journal-care-v2_236c8f7f.jpg` | Home Journal card; Journal list; care article hero |
| Seasonal peonies | `/manus-storage/fb-journal-peony-v2_3af4ce7f.jpg` | Home Journal card; Journal list; peony article hero |
| Floral colour study | `/manus-storage/fb-journal-colour-v2_bbae4f4e.jpg` | Home Journal card; Journal list; colour article hero |

## Implementation outcome

The `AboutView`, `EditorialSection`, `JournalSection`, public Journal list and Journal detail route now use direct, unoptimized image rendering for the selected managed-storage assets. `CashbackBanner` was also placed on the same direct-delivery path because its inherited editorial image was the remaining non-product surface emitting the redirect/optimizer empty-response log. Actual product card imagery and all commerce, account, payment, admin and AI bouquet behavior were preserved.

## Validation record

| Check | Result |
|---|---|
| Local desktop visual QA | Passed: Home, About and Journal showed the selected studio, service and journal images without failed-generation placeholders. |
| Local mobile visual QA | Passed at 375px: About service cards and Journal’s three editorial images stacked/cropped cleanly. |
| Vitest | Passed: 2 files and 20 tests, including the new managed Journal media mapping contract. |
| TypeScript | Passed: `pnpm exec tsc --noEmit`. |
| Production build | Passed: `NODE_ENV=production pnpm build`. |
| Published production verification | Passed: after normal rollout propagation, cache-busted live About and Journal routes displayed the studio/service set and all three Journal images in My Browser. |
