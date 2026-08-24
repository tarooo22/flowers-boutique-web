# Admin Orders live QA notes

- Production deployment became available after edge propagation. The authenticated summary endpoint returned the new date-aware metrics/status-mix payload.
- The authenticated Orders tab rendered the new Fulfilment Command Center, real priority queue, URL-capable filters, date control, status mix and Flower Circle values.
- Opening existing cancelled order `FLR-600001` rendered the read-only detail drawer with totals, delivery context, call/map/copy surfaces, internal-note field and activity timeline.
- No status mutation or note submission was performed during QA, so production order state and customer data were not altered.
