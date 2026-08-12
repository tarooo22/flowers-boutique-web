export const DELIVERY_FEE_GEL = 5;
export const FREE_DELIVERY_THRESHOLD_GEL = 150;

export type FulfillmentType = "delivery" | "pickup";

export function getDeliveryFeeGEL(
  fulfillmentType: FulfillmentType,
  subtotalGEL = 0,
): number {
  if (fulfillmentType !== "delivery" || subtotalGEL >= FREE_DELIVERY_THRESHOLD_GEL) {
    return 0;
  }
  return DELIVERY_FEE_GEL;
}

export function formatDeliveryFeeGEL(
  fulfillmentType: FulfillmentType,
  subtotalGEL = 0,
): string {
  const fee = getDeliveryFeeGEL(fulfillmentType, subtotalGEL);
  return fee === 0 ? "უფასო / Free" : `${fee} ₾`;
}
