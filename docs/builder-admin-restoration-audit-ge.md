# Builder და Admin Restoration Audit

## აღდგენის პრინციპი

მოთხოვნა არის **ძველი Visual Builder და AI Bouquet-ის ფუნქციური გამოცდილების დაბრუნება**, მაგრამ არა ძველი ვიზუალური ფერების, ტექსტური სისტემისა და ფოტოგრაფიული მიმართულების დაბრუნება. შესაბამისად, ფუნქციური მონაცემები, quantities, wrap/ribbon composition, live preview, generation gating და cart handoff აღდგება, ხოლო მოქმედი Flower’s Boutique cream/coral/charcoal tokens, typography და bespoke floral image treatment ნარჩუნდება.

## Builder gap analysis

| Contract | Legacy source | Current Next implementation | Restoration decision |
|---|---|---|---|
| Individual flower inventory | 9 builder-specific cutout stems: rose, spray rose, peony, lily, hydrangea, eustoma, alstroemeria, sunflower, moluccella | Dynamic `catalogProducts` filter; its ids do not match the cutout composition taxonomy | Use `builderFlowers` as the shared Visual + AI source of truth; preserve translated flower names and prices. |
| Quantity protection | Maximum 36 stems and 24 of any one flower | Same numeric limits | Keep limits and add regression coverage. |
| Visual live composition | Wrapper-back → fanned stems → masks → wrapper-front → ribbon, keyed by builder-specific flower species | The same `BouquetCanvas` is retained, but current source keys can fall through its species layout presets | Feed the legacy keys/assets directly to the canvas. |
| Wrap and ribbon choices | 5 paper options, 4 ribbon options, paper/ribbon-only mode and reset flow | All assets/options exist; count clear does not reset styling | Preserve choices and add a true full reset to the original defaults. |
| AI selection and preview | Individual flower controls, selection fingerprint, generated image required before ordering, unavailable selection guard | Current selection/filter/fingerprint/generation gating is present but uses catalog single-stems | Keep the existing robust generation/loading/stale-result state; reconnect it to legacy flower inventory. |
| Cart handoff | Custom visual/AI bouquet keeps quantities, total and selected composition | `addCustomBouquet` persists visual/AI lines and opens cart | Preserve this handoff without touching checkout/payment logic. |

## Admin capability inventory

The live admin already has three manager capabilities: an overview with order/revenue metrics, searchable/expandable orders with order-status updates, and product override controls for price, availability and bestseller. These capabilities remain the functional core. The redesign will use one coordinated manager workspace with clear pending-order priority, compact operational controls and an adaptive mobile layout rather than a visually separate "admin panel" experience.

| Current control | Finding | Action |
|---|---|---|
| View site | Functional route navigation | Retain. |
| Sign out | Functional protected-session exit | Retain. |
| Overview order rows | Functional deep-link into the orders view | Retain and make more prominent. |
| Order status buttons | Functional PATCH update path | Retain with explicit saving/error feedback. |
| Delete order | Calls an API deliberately returning HTTP 405; it is a visible non-functional action | Remove the dead deletion affordance rather than expose an unsafe promise. Cancellation remains a status action. |
| Product price, stock and bestseller controls | Functional product override PATCH path | Retain with saving/error feedback and visible edited state. |
| Search/filter | Client-side operational filters | Retain and make tab-specific. |

## Preservation boundary

This scope must not change real product catalog records, database schema, authentication, payment behavior, checkout, cart storage format, order data, or admin authorization. The only Builder data source changing is the specialized **custom bouquet selector**, which correctly returns to its legacy nine-stem inventory and compositing assets.

## განხორციელებული შედეგი

Visual Builder და AI Bouquet ახლა ორივე იყენებს ერთიან, ძველ nine-stem source of truth-ს: rose, spray rose, peony, lily, hydrangea, eustoma, alstroemeria, sunflower და moluccella. Visual mode-ში wrapper/ribbon assets, paper/ribbon-only mode, live composition canvas, 36-stem/24-per-flower guard და სრული reset აღდგენილია. AI mode ინარჩუნებს live fan preview, selected-only filter, selection fingerprint, generated result-ის freshness check და მხოლოდ შედეგის შემდეგ cart handoff-ს.

Admin შეიცვალა ერთიან manager workspace-ად: სამუშაოს პრიორიტეტი არის ახალი/მიმდინარე შეკვეთები, ხოლო orders და products ერთი workflow shell-დან იკონტროლება. სტატუსისა და product override-ის ცვლილებებს დაემატა saving/error feedback; dead `Delete order` ღილაკი მოიხსნა, რადგან production backend deletion-ს მიზანმიმართულად არ უჭერს მხარს. მენეჯერი cancellation-ს კვლავ სტატუსის არჩევით მართავს.
