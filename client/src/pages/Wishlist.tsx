import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import FlowerImage from "@/components/FlowerImage";
import { addToCart } from "@/lib/cartUtils";

interface WishlistItem {
  id: number;
  nameEn: string;
  nameKa: string;
  priceMin: number;
  priceMax: number;
  priceOnRequest: boolean;
  unitType: string;
  imageUrl?: string | null;
  isAvailable?: boolean | null;
  published?: boolean | null;
  variants?: unknown[];
}

export default function Wishlist() {
  const { language } = useLanguage();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { openDrawer } = useCartDrawer();

  useEffect(() => {
    const wishlist = JSON.parse(
      localStorage.getItem("flowers-boutique-wishlist") || "[]"
    );
    setWishlistItems(wishlist);
  }, []);

  const handleRemoveFromWishlist = (productId: number) => {
    const updated = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updated);
    localStorage.setItem("flowers-boutique-wishlist", JSON.stringify(updated));
    toast.success(
      language === "ka" ? "რჩეულებიდან წაშლილია" : "Removed from wishlist"
    );
  };

  const formatPrice = (item: WishlistItem) => {
    if (item.priceOnRequest) {
      return language === "ka"
        ? "ფასი მოთხოვნის შემთხვევაში"
        : "Price on request";
    }
    if (item.priceMin === item.priceMax) {
      return `₾${item.priceMin}`;
    }
    return `₾${item.priceMin}-${item.priceMax}`;
  };

  const handleQuickAdd = (item: WishlistItem) => {
    const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;
    const isAvailable = item.isAvailable !== false && item.published !== false;

    if (!isAvailable || item.priceOnRequest || hasVariants) {
      toast.info(
        language === "ka"
          ? "გთხოვთ, ჯერ აირჩიეთ პროდუქტის დეტალები."
          : "Please choose product details first."
      );
      return;
    }

    addToCart({
      productId: item.id,
      name: language === "ka" ? item.nameKa : item.nameEn,
      price: Number(item.priceMin) || 0,
      quantity: 1,
      unitType: item.unitType,
      imageUrl: item.imageUrl || undefined,
    });
    toast.success(language === "ka" ? "კალათაში დაემატა" : "Added to cart");
    openDrawer();
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="p1-wishlist-page p2-wishlist-page min-h-screen flex flex-col">
        <Navbar />

        <div className="p2-wishlist-empty flex-1 flex flex-col items-center justify-center px-4 py-20">
          <Heart className="w-20 h-20 text-[#D4AF37]/30 mb-6" />
          <h1
            className="text-4xl sm:text-5xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {language === "ka" ? "რჩეულები" : "Wishlist"}
          </h1>
          <p className="text-[#666] text-lg mb-10 text-center max-w-md">
            {language === "ka"
              ? "თქვენი რჩეულების სია ცარიელია"
              : "Your wishlist is empty"}
          </p>
          <Link href="/catalog">
            <Button className="rounded-full px-8 py-3 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/20 transition-all">
              {language === "ka" ? "კატალოგში გადასვლა" : "Go to Catalog"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <Footer />
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="p1-wishlist-page p2-wishlist-page min-h-screen flex flex-col">
      <Navbar />

      <main className="p2-wishlist-shell flex-1 max-w-7xl mx-auto w-full px-4 py-16">
        <div className="p2-wishlist-heading mb-12">
          <h1
            className="text-5xl sm:text-6xl font-light text-[#1C1917] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {language === "ka" ? "რჩეულები" : "Wishlist"}
          </h1>
          <p className="text-[#666]">
            {wishlistItems.length}{" "}
            {language === "ka" ? "პროდუქტი" : "product(s)"}
          </p>
        </div>

        <div className="p2-wishlist-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {wishlistItems.map(item => (
            <div
              key={item.id}
              className="p2-wishlist-card group overflow-hidden"
            >
              {/* Image Area */}
              <div className="p2-wishlist-card__visual relative overflow-hidden">
                <FlowerImage
                  src={item.imageUrl}
                  alt={language === "ka" ? item.nameKa : item.nameEn}
                  className="p2-wishlist-card__image"
                  width={800}
                  height={1000}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
                  title={language === "ka" ? "წაშლა" : "Remove"}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-[#1C1917] mb-2 line-clamp-2 text-lg">
                  {language === "ka" ? item.nameKa : item.nameEn}
                </h3>

                <p className="text-xs font-semibold uppercase tracking-wider text-[#A16207] mb-4">
                  {item.unitType}
                </p>

                <p
                  className="text-2xl font-light text-[#D4AF37] mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {formatPrice(item)}
                </p>

                <Link href={`/product/${item.id}`} className="block w-full">
                  <Button className="w-full rounded-xl py-3 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/20 transition-all">
                    {language === "ka" ? "დეტალები" : "View Details"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <button
                  type="button"
                  className="p2-wishlist-card__quick-add"
                  onClick={() => handleQuickAdd(item)}
                  aria-label={language === "ka" ? `${item.nameKa} კალათაში დამატება` : `Add ${item.nameEn} to cart`}
                >
                  <ShoppingBag size={17} aria-hidden="true" />
                  {language === "ka" ? "კალათაში დამატება" : "Quick add"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping CTA */}
        <div className="text-center py-8">
          <Link href="/catalog">
            <Button className="rounded-full px-10 py-3 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/20 transition-all">
              {language === "ka" ? "კატალოგში გადასვლა" : "Continue Shopping"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
