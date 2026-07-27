export const CUSTOM_VISUAL_BOUQUET_PRODUCT_ID = 999997;

export interface VisualBouquetCartFlower {
  productId: number;
  nameKa: string;
  nameEn: string;
  quantity: number;
  unitPrice: number;
}

export interface VisualBouquetCartStyleOption {
  id: string;
  nameKa: string;
  nameEn: string;
  color: string;
}

export interface VisualBouquetCartData {
  type: "visual-bouquet";
  flowers: VisualBouquetCartFlower[];
  wrapMode: "paper" | "ribbonOnly";
  wrapper: VisualBouquetCartStyleOption | null;
  ribbon: VisualBouquetCartStyleOption;
  stemCount: number;
  totalPrice: number;
}

export interface AIBouquetCartFlower {
  productId: number;
  nameKa: string;
  nameEn: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

export interface AIBouquetCartData {
  type: "custom-ai-bouquet";
  flowers: AIBouquetCartFlower[];
  generatedImageUrl?: string;
  totalPrice: number;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  selectedVariantId?: string;
  selectedColorNameKa?: string;
  selectedColorNameEn?: string;
  selectedColorHex?: string;
  selectedVariantImage?: string;
  previewImage?: string; // For visual bouquets
  generatedImageUrl?: string; // For AI bouquets
  imageUrl?: string; // For regular products
  bouquetType?: "visual" | "ai"; // Indicates if item is a custom bouquet
  customData?: VisualBouquetCartData | AIBouquetCartData;
}

const CART_STORAGE_KEY = "flowers-boutique-cart";

function getCartItemKey(productId: number, selectedVariantId?: string): string {
  return JSON.stringify([productId, selectedVariantId ?? null]);
}

export function normalizeCart(items: CartItem[]): CartItem[] {
  const normalized = new Map<string, CartItem>();

  items.forEach(item => {
    const key = getCartItemKey(item.productId, item.selectedVariantId);
    const existing = normalized.get(key);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      normalized.set(key, { ...item });
    }
  });

  return Array.from(normalized.values());
}

export function getCart(): CartItem[] {
  const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  return normalizeCart(cart);
}

export function saveCart(items: CartItem[]): void {
  const normalized = normalizeCart(items);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("fb-cart-updated"));
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();
  const itemKey = getCartItemKey(item.productId, item.selectedVariantId);
  const existing = cart.find(
    cartItem =>
      getCartItemKey(cartItem.productId, cartItem.selectedVariantId) === itemKey
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({ ...item });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(
  productId: number,
  selectedVariantId?: string
): CartItem[] {
  const cart = getCart().filter(item => {
    if (selectedVariantId === undefined) {
      return item.productId !== productId;
    }

    return (
      getCartItemKey(item.productId, item.selectedVariantId) !==
      getCartItemKey(productId, selectedVariantId)
    );
  });

  saveCart(cart);
  return cart;
}

export function updateCartItemQuantity(
  productId: number,
  quantity: number,
  selectedVariantId?: string
): CartItem[] {
  const cart = getCart();
  const item = cart.find(cartItem => {
    if (selectedVariantId === undefined) {
      return cartItem.productId === productId;
    }

    return (
      getCartItemKey(cartItem.productId, cartItem.selectedVariantId) ===
      getCartItemKey(productId, selectedVariantId)
    );
  });

  if (item) {
    if (quantity < 1) {
      return removeFromCart(productId, selectedVariantId);
    }

    item.quantity = quantity;
  }

  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  localStorage.removeItem(CART_STORAGE_KEY);
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("fb-cart-updated"));
}

export function getTotalPrice(items: CartItem[]): string {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return total.toFixed(2);
}
