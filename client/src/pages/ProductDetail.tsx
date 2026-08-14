import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { AlertCircle, Check, ChevronRight, Heart, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { addToCart } from "@/lib/cartUtils";
import { useSEO } from "@/hooks/useSEO";
import { generateProductSchema } from "@/lib/jsonLd";
import { trackAddToCart, trackAddToWishlist, trackLead, trackViewContent } from "@/lib/facebookPixel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FlowerImage from "@/components/FlowerImage";
import { cleanProductText, getProductName } from "@/lib/productPresentation";
import { ProductDetailLoadingState, ProductDetailNotFoundState, RelatedProductsErrorState, RelatedProductsLoadingState } from "@/components/ProductDetailStates";

const priceText = (min: unknown, max: unknown, onRequest: boolean, ka: boolean) => {
  if (onRequest) return ka ? "ფასი მოთხოვნით" : "Price on request";
  const low = Number(min);
  const high = Number(max ?? min);
  if (!Number.isFinite(low)) return ka ? "ფასი მოთხოვნით" : "Price on request";
  const format = (value: number) => `₾${value.toLocaleString("ka-GE", { maximumFractionDigits: 0 })}`;
  return low === high ? format(low) : `${format(low)}–${format(high)}`;
};

export default function ProductDetail() {
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { openDrawer } = useCartDrawer();
  const ka = language === "ka";
  const productId = Number(id || 0);
  const productQuery = trpc.products.byId.useQuery({ id: productId });
  const product = productQuery.data;
  const relatedInput = useMemo(
    () => ({
      page: 1,
      pageSize: 5,
      categoryId: product?.categoryId ?? 1,
      availability: "all" as const,
      sort: "featured" as const,
    }),
    [product?.categoryId]
  );
  const relatedQuery = trpc.products.catalog.useQuery(relatedInput, {
    enabled: Boolean(product?.categoryId),
    staleTime: 60_000,
  });
  const variants: any[] = product?.variants ?? [];
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) || variants.find((variant) => variant.isDefault) || null;
  const gallery = useMemo(() => Array.from(new Set([product?.imageUrl, ...variants.map((variant) => variant.imageUrl)].filter(Boolean))) as string[], [product?.imageUrl, variants]);
  const displayImage = selectedImage || selectedVariant?.imageUrl || gallery[0] || null;
  const displayMin = selectedVariant?.priceMin ?? product?.priceMin;
  const displayMax = selectedVariant?.priceMax ?? product?.priceMax;
  const name = product ? getProductName(product, language) : "";
  const price = product ? priceText(displayMin, displayMax, Boolean(product.priceOnRequest), ka) : "";

  useEffect(() => {
    if (product) {
      setSelectedImage(null);
      setSelectedVariantId(null);
      trackViewContent(product.id, getProductName(product, language), Number(product.priceMin) || 0);
    }
  }, [product, ka]);

  useSEO({
    titleKa: product ? `${getProductName(product, "ka")} | Flower's Boutique` : "Flower's Boutique",
    titleEn: product ? `${getProductName(product, "en")} | Flower's Boutique` : "Flower's Boutique",
    descriptionKa: cleanProductText(product?.descriptionKa, "დახვეწილი თაიგულები Flower's Boutique-ისგან."),
    descriptionEn: cleanProductText(product?.descriptionEn, "Considered bouquets from Flower's Boutique."),
    canonical: `/product/${productId}`,
    ogImage: product?.imageUrl || undefined,
    structuredData: product ? generateProductSchema({ id: product.id, name, description: cleanProductText(ka ? product.descriptionKa : product.descriptionEn), priceMin: Number(displayMin) || 0, priceMax: Number(displayMax) || Number(displayMin) || 0, image: product.imageUrl || undefined, isAvailable: product.isAvailable ?? true }, variants.map((variant) => ({ name: ka ? variant.colorNameKa : variant.colorNameEn, price: Number(variant.priceMin ?? product.priceMin) || 0, color: variant.colorHex, isAvailable: variant.available }))) : undefined,
    lang: language as "ka" | "en",
  });

  if (productQuery.isLoading) return <div className="min-h-screen bg-[#f7f2e9]"><Navbar /><ProductDetailLoadingState ka={ka} /></div>;

  if (productQuery.isError || !product) return <div className="min-h-screen bg-[#f7f2e9]"><Navbar /><ProductDetailNotFoundState ka={ka} /><Footer /></div>;

  const addProduct = () => {
    if (!product.isAvailable || selectedVariant?.available === false) {
      toast.error(ka ? "ეს ვარიანტი ამჟამად ხელმისაწვდომი არ არის" : "This option is currently unavailable");
      return;
    }
    const amount = Number(displayMin) || 0;
    addToCart({ productId: product.id, name, price: amount, quantity, unitType: product.unitType || "", selectedVariantId: selectedVariant?.id, selectedColorNameKa: selectedVariant?.colorNameKa, selectedColorNameEn: selectedVariant?.colorNameEn, selectedColorHex: selectedVariant?.colorHex, selectedVariantImage: selectedVariant?.imageUrl, imageUrl: displayImage || product.imageUrl });
    trackAddToCart(product.id, name, quantity, amount, product.isAvailable ?? true);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
    toast.success(ka ? "კალათაში დაემატა" : "Added to cart");
    openDrawer();
  };

  const addWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("flowers-boutique-wishlist") || "[]");
    if (!wishlist.some((item: any) => item.id === product.id)) {
      localStorage.setItem("flowers-boutique-wishlist", JSON.stringify([...wishlist, product]));
      setWishlisted(true);
      trackAddToWishlist(product.id, name, Number(product.priceMin) || 0);
      toast.success(ka ? "რჩეულებში დაემატა" : "Added to wishlist");
    } else {
      setWishlisted(true);
      toast.info(ka ? "უკვე რჩეულებშია" : "Already in wishlist");
    }
  };

  const inquire = () => {
    trackLead([{ productId: product.id, quantity, price: Number(displayMin) || 0 }], (Number(displayMin) || 0) * quantity);
  };

  const related = relatedQuery.data?.items.filter((item: any) => item.id !== product.id).slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-[#f7f2e9] text-[#181614]">
      <Navbar />
      <main>
        <div className="fb-page-shell fb-breadcrumbs fb-product-breadcrumbs"><Link href="/">{ka ? "მთავარი" : "Home"}</Link><ChevronRight size={14} /><Link href="/catalog">{ka ? "კატალოგი" : "Catalog"}</Link><ChevronRight size={14} /><span>{name}</span></div>
        <section className="fb-page-shell fb-product-layout">
          <div className="fb-product-gallery">
            <div className="fb-product-gallery__main"><FlowerImage src={displayImage} alt={`${name} — Flower's Boutique`} className="h-full w-full object-cover" loading="eager" fetchPriority="high" width={900} height={900} /><button type="button" className={`fb-product-gallery__wish ${wishlisted ? "is-active" : ""}`} onClick={addWishlist} aria-label={ka ? "რჩეულებში დამატება" : "Add to wishlist"} aria-pressed={wishlisted}><Heart size={20} fill={wishlisted ? "currentColor" : "none"} /></button></div>
            {gallery.length > 1 && <div className="fb-product-gallery__thumbs">{gallery.map((image) => <button type="button" key={image} className={displayImage === image ? "is-active" : ""} onClick={() => setSelectedImage(image)} aria-label={ka ? "სურათის არჩევა" : "Select product image"} aria-pressed={displayImage === image}><FlowerImage src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}
          </div>
          <div className="fb-product-copy">
            <p className="fb-eyebrow">FLOWER'S BOUTIQUE · SIGNATURE</p>
            <h1 className="fb-display">{name}</h1>
            <div className="fb-product-price-row"><strong>{price}</strong>{quantity > 1 && !product.priceOnRequest && <span>{ka ? `ჯამი: ₾${((Number(displayMin) || 0) * quantity).toFixed(0)}` : `Total: ₾${((Number(displayMin) || 0) * quantity).toFixed(0)}`}</span>}</div>
            <div className={`fb-product-availability ${product.isAvailable ? "is-available" : "is-unavailable"}`}>{product.isAvailable ? <><Check size={16} /> {ka ? "მარაგშია" : "In stock"}</> : <><AlertCircle size={16} /> {ka ? "ამოიწურა" : "Out of stock"}</>}</div>
            {(product.descriptionKa || product.descriptionEn) && <p className="fb-product-description">{cleanProductText(ka ? product.descriptionKa : product.descriptionEn)}</p>}
            {variants.length > 0 && <fieldset className="fb-variant-fieldset"><legend>{ka ? "ფერი" : "Colour"}</legend><div>{variants.map((variant) => { const unavailable = variant.available === false; const selected = selectedVariant?.id === variant.id; return <button type="button" key={variant.id} disabled={unavailable} onClick={() => !unavailable && setSelectedVariantId(variant.id)} className={`fb-variant ${selected ? "is-selected" : ""} ${unavailable ? "is-unavailable" : ""}`} aria-pressed={selected}><span style={{ backgroundColor: variant.colorHex || "#d6cec1" }} />{ka ? variant.colorNameKa : variant.colorNameEn}</button>; })}</div></fieldset>}
            {product.isAvailable && <div className="fb-quantity-row"><label htmlFor="product-quantity">{ka ? "რაოდენობა" : "Quantity"}</label><div className="fb-quantity"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label={ka ? "რაოდენობის შემცირება" : "Decrease quantity"}><Minus size={16} /></button><output id="product-quantity" aria-live="polite">{quantity}</output><button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label={ka ? "რაოდენობის გაზრდა" : "Increase quantity"}><Plus size={16} /></button></div></div>}
            <button type="button" className="fb-product-add" disabled={!product.isAvailable || selectedVariant?.available === false} onClick={addProduct}>{added ? <><Check size={19} /> {ka ? "დაემატა" : "Added"}</> : <><ShoppingBag size={19} /> {ka ? "კალათაში დამატება" : "Add to cart"}</>}</button>
            <Link href={`/contact?product=${product.id}`} onClick={inquire} className="fb-product-inquiry">{ka ? "ინდივიდუალური შეკვეთა ან კითხვა" : "Custom order or a question"}<ChevronRight size={15} /></Link>
            <div className="fb-product-perks"><div><Truck size={18} /><span>{ka ? "ფრთხილი მიწოდება თბილისში" : "Careful Tbilisi delivery"}</span></div><div><Check size={18} /><span>{ka ? "სასაჩუქრე შეფუთვა" : "Gift-ready wrapping"}</span></div></div>
          </div>
        </section>
        <section className="fb-page-shell fb-product-information"><div><p className="fb-eyebrow">DETAILS</p><h2 className="fb-display">{ka ? "მეტი, ვიდრე თაიგული" : "More than a bouquet"}</h2></div><div className="fb-product-information__grid"><article><h3>{ka ? "შემადგენლობა" : "Composition"}</h3><p>{cleanProductText(product.stemDisplayRule, ka ? "სეზონური ყვავილები, შერჩეული ფლორისტის მიერ." : "Seasonal stems, selected by our florist.")}</p></article><article><h3>{ka ? "მიწოდება" : "Delivery"}</h3><p>{ka ? "შეკვეთა მზადდება იმავე დღეს ხელმისაწვდომობის მიხედვით. ზუსტი დრო შეკვეთისას შეთანხმდება." : "Orders are prepared the same day when available. We confirm the delivery window at checkout."}</p></article><article><h3>{ka ? "მოვლა" : "Care"}</h3><p>{ka ? "მოათავსეთ სუფთა წყალში, შეცვალეთ წყალი ყოველ მეორე დღეს და შეინახეთ მზის პირდაპირი სხივებისგან მოშორებით." : "Place in clean water, refresh it every other day, and keep the arrangement away from direct sun."}</p></article></div></section>
        {relatedQuery.isLoading && <RelatedProductsLoadingState ka={ka} />}
        {relatedQuery.isError && !relatedQuery.isLoading && <RelatedProductsErrorState ka={ka} />}
        {related.length > 0 && <section className="fb-page-shell fb-related"><div className="fb-section-heading"><div><p className="fb-eyebrow">YOU MAY ALSO LIKE</p><h2 className="fb-display">{ka ? "სხვა რჩეული თაიგულები" : "More from the collection"}</h2></div><Link href="/catalog">{ka ? "ყველას ნახვა" : "View all"}<ChevronRight size={15} /></Link></div><div className="fb-related-grid">{related.map((item: any) => { const relatedName = getProductName(item, language); return <Link key={item.id} href={`/product/${item.id}`} className="fb-related-card"><FlowerImage src={item.imageUrl} alt={relatedName} className="h-full w-full object-cover" /><div><h3>{relatedName}</h3><span>{priceText(item.priceMin, item.priceMax, Boolean(item.priceOnRequest), ka)}</span></div></Link>; })}</div></section>}
      </main>
      <div className="fb-product-sticky"><span>{price}</span><button type="button" onClick={addProduct} disabled={!product.isAvailable}><ShoppingBag size={17} /> {ka ? "დამატება" : "Add"}</button></div>
      <Footer /><CartDrawer />
    </div>
  );
}
