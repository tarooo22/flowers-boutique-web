type LocalizedProduct = {
  nameKa?: unknown;
  nameEn?: unknown;
};

export function cleanProductName(value: unknown, fallback: string) {
  const name = typeof value === "string"
    ? value.replace(/^\s*\[(?:DEMO|დემო)\]\s*/i, "").trim()
    : "";
  return name || fallback;
}

export function cleanProductText(value: unknown, fallback = "") {
  return cleanProductName(value, fallback);
}

export function getProductName(product: LocalizedProduct, language: string) {
  return cleanProductName(
    language === "ka" ? product.nameKa : product.nameEn,
    language === "ka" ? "ყვავილების კომპოზიცია" : "Floral arrangement",
  );
}
