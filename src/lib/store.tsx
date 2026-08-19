"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, CustomBouquetLine, Product } from "@/types";

/** Admin-editable fields mirrored from the server. */
interface Override {
  price?: number;
  available?: boolean;
  bestseller?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Persistence helper                                                 */
/* ------------------------------------------------------------------ */
function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/*  Store context                                                      */
/* ------------------------------------------------------------------ */
interface StoreValue {
  hydrated: boolean;
  catalogProducts: Product[];
  // cart
  lines: CartLine[];
  customLines: CustomBouquetLine[];
  cartCount: number;
  subtotal: number;
  addToCart: (productId: string, variantId: string, qty?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  addCustomBouquet: (bouquet: Omit<CustomBouquetLine, "id" | "quantity">) => void;
  setCustomQty: (id: string, qty: number) => void;
  removeCustom: (id: string) => void;
  clearCart: () => void;
  // favorites
  favorites: string[];
  favCount: number;
  isFavorite: (productId: string) => boolean;
  getProduct: (productId: string) => Product | undefined;
  getUnitPrice: (product: Product, variantId: string) => number;
  toggleFavorite: (productId: string) => void;
  /** applies any admin price/stock edits on top of the static catalog */
  withOverrides: (product: Product) => Product;
  // ui
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const CART_KEY = "fb_cart_v1";
const CUSTOM_KEY = "fb_custom_v1";
const FAV_KEY = "fb_favorites_v1";

function priceFor(product: Product, variantId: string) {
  return product.price + (product.variants.find((variant) => variant.id === variantId)?.priceDelta ?? 0);
}

export function StoreProvider({ children, products }: { children: ReactNode; products: Product[] }) {
  const [hydrated, setHydrated] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [customLines, setCustomLines] = useState<CustomBouquetLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Override>>({});

  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Hydrate from localStorage after mount. This intentionally sets state in an
  // effect: rendering empty on the server and first client paint, then filling
  // in persisted values, is what avoids an SSR/client hydration mismatch.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setLines(readLS<CartLine[]>(CART_KEY, []));
    setCustomLines(readLS<CustomBouquetLine[]>(CUSTOM_KEY, []));
    setFavorites(readLS<string[]>(FAV_KEY, []));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // pull any admin price / stock edits so the storefront reflects them
  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog/overrides")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { overrides?: Record<string, Override> } | null) => {
        if (!cancelled && data?.overrides) setOverrides(data.overrides);
      })
      .catch(() => {
        /* storefront still works on the static catalog */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // persist
  useLayoutEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);
  useLayoutEffect(() => {
    if (hydrated) window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(customLines));
  }, [customLines, hydrated]);
  useLayoutEffect(() => {
    if (hydrated) window.localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  // lock body scroll when a drawer/menu is open
  useEffect(() => {
    const open = cartOpen || mobileNavOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, mobileNavOpen]);

  const addToCart = useCallback(
    (productId: string, variantId: string, qty = 1) => {
      setLines((prev) => {
        const idx = prev.findIndex(
          (l) => l.productId === productId && l.variantId === variantId,
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
          return next;
        }
        return [...prev, { productId, variantId, quantity: qty }];
      });
      setCartOpen(true);
    },
    [],
  );

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setLines((prev) =>
      prev.filter(
        (l) => !(l.productId === productId && l.variantId === variantId),
      ),
    );
  }, []);

  const setQty = useCallback(
    (productId: string, variantId: string, qty: number) => {
      setLines((prev) =>
        prev
          .map((l) =>
            l.productId === productId && l.variantId === variantId
              ? { ...l, quantity: qty }
              : l,
          )
          .filter((l) => l.quantity > 0),
      );
    },
    [],
  );

  const addCustomBouquet = useCallback(
    (bouquet: Omit<CustomBouquetLine, "id" | "quantity">) => {
      setCustomLines((prev) => [
        ...prev,
        {
          ...bouquet,
          id: `cb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          quantity: 1,
        },
      ]);
      setCartOpen(true);
    },
    [],
  );

  const setCustomQty = useCallback((id: string, qty: number) => {
    setCustomLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, quantity: qty } : l)).filter((l) => l.quantity > 0),
    );
  }, []);

  const removeCustom = useCallback((id: string) => {
    setCustomLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setCustomLines([]);
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites],
  );

  const withOverrides = useCallback(
    (product: Product): Product => {
      const o = overrides[product.id];
      if (!o) return product;
      return {
        ...product,
        price: o.price ?? product.price,
        available: o.available ?? product.available,
        bestseller: o.bestseller ?? product.bestseller,
        // a manual price drop shouldn't leave a stale "was" price above it
        compareAt:
          o.price !== undefined && product.compareAt && o.price >= product.compareAt
            ? undefined
            : product.compareAt,
      };
    },
    [overrides],
  );

  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const getProduct = useCallback((productId: string) => productsById.get(productId), [productsById]);

  const { cartCount, subtotal } = useMemo(() => {
    let count = 0;
    let sum = 0;
    for (const l of lines) {
      const p = productsById.get(l.productId);
      if (!p) continue;
      count += l.quantity;
      sum += priceFor(p, l.variantId) * l.quantity;
    }
    for (const c of customLines) {
      count += c.quantity;
      sum += c.price * c.quantity;
    }
    return { cartCount: count, subtotal: sum };
  }, [lines, customLines, productsById]);

  const value: StoreValue = {
    hydrated,
    catalogProducts: products,
    lines,
    customLines,
    addCustomBouquet,
    setCustomQty,
    removeCustom,
    cartCount,
    subtotal,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    favorites,
    favCount: favorites.length,
    isFavorite,
    toggleFavorite,
    getProduct,
    getUnitPrice: priceFor,
    withOverrides,
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    mobileNavOpen,
    setMobileNavOpen,
    searchOpen,
    setSearchOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
