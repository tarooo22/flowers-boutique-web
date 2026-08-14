import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import FlowerImage from "@/components/FlowerImage";
import { getProductName } from "@/lib/productPresentation";

const formatMoney = (value: unknown) => {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? `₾${amount.toLocaleString("ka-GE", { maximumFractionDigits: 0 })}`
    : "";
};

export type StorefrontProduct = Record<string, any> & {
  id: number;
  nameKa?: unknown;
  nameEn?: unknown;
  imageUrl?: string | null;
  isAvailable?: boolean | null;
  published?: boolean | null;
};

type ProductCardProps = {
  product: StorefrontProduct;
  language: string;
  onAdd?: (product: StorefrontProduct) => void;
  priority?: boolean;
};

export default function ProductCard({
  product,
  language,
  onAdd,
  priority = false,
}: ProductCardProps) {
  const ka = language === "ka";
  const name = getProductName(product, language);
  const salePrice = product.salePrice ?? product.discountPrice;
  const basePrice = product.priceMin ?? product.price;
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const needsSelection = variants.length > 0;
  const isAvailable =
    product.isAvailable !== false && product.published !== false;
  const canQuickAdd = Boolean(onAdd && isAvailable && !needsSelection);
  const price = product.priceOnRequest
    ? ka
      ? "ფასი მოთხოვნით"
      : "Price on request"
    : product.priceMin !== product.priceMax && product.priceMax
      ? `${formatMoney(product.priceMin)}–${formatMoney(product.priceMax)}`
      : formatMoney(salePrice ?? basePrice);

  const addToWishlist = () => {
    const key = "flowers-boutique-wishlist";
    const stored = localStorage.getItem(key);
    const wishlist = stored ? JSON.parse(stored) : [];
    if (!wishlist.some((item: StorefrontProduct) => item.id === product.id)) {
      localStorage.setItem(key, JSON.stringify([...wishlist, product]));
      window.dispatchEvent(new Event("storage"));
      toast.success(ka ? "რჩეულებში დაემატა" : "Added to wishlist");
      return;
    }
    toast.info(ka ? "უკვე რჩეულებშია" : "Already in your wishlist");
  };

  return (
    <article
      className={`p1-product-card ${isAvailable ? "" : "is-unavailable"}`}
      data-availability={isAvailable ? "available" : "unavailable"}
    >
      <div className="p1-product-card__visual">
        <Link
          href={`/product/${product.id}`}
          className="p1-product-card__image-link"
          aria-label={name}
        >
          <FlowerImage
            src={product.imageUrl}
            alt={`${name} — Flower’s Boutique`}
            className="p1-product-card__image"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            width={800}
            height={1200}
          />
        </Link>
        {!isAvailable && (
          <span className="p1-badge p1-badge--muted">
            {ka ? "ამოიწურა" : "Unavailable"}
          </span>
        )}
      </div>

      <div className="p1-product-card__content">
        <div className="p1-product-card__heading">
          <Link
            href={`/product/${product.id}`}
            className="p1-product-card__title"
          >
            {name}
          </Link>
          <button
            type="button"
            className="p1-product-card__wish"
            onClick={addToWishlist}
            aria-label={ka ? `${name} რჩეულებში` : `Add ${name} to wishlist`}
          >
            <Heart aria-hidden="true" />
          </button>
        </div>
        <div className="p1-product-card__price-row">
          <strong id={`product-price-${product.id}`}>{price}</strong>
          {salePrice && basePrice && <del>{formatMoney(basePrice)}</del>}
        </div>
        {canQuickAdd ? (
          <button
            type="button"
            className="p1-product-card__action"
            onClick={() => onAdd(product)}
            aria-label={
              ka ? `${name} კალათაში დამატება` : `Add ${name} to cart`
            }
            aria-describedby={`product-price-${product.id}`}
          >
            <ShoppingBag aria-hidden="true" />
            {ka ? "კალათაში დამატება" : "Quick add"}
          </button>
        ) : (
          <Link
            href={`/product/${product.id}`}
            className="p1-product-card__action"
            aria-label={
              isAvailable
                ? ka
                  ? `${name} ვარიანტების ნახვა`
                  : `View options for ${name}`
                : ka
                  ? `${name} პროდუქტის ნახვა`
                  : `View ${name}`
            }
            aria-describedby={`product-price-${product.id}`}
          >
            <ArrowUpRight aria-hidden="true" />
            {isAvailable
              ? ka
                ? "ვარიანტების ნახვა"
                : "Choose options"
              : ka
                ? "პროდუქტის ნახვა"
                : "View product"}
          </Link>
        )}
      </div>
    </article>
  );
}
