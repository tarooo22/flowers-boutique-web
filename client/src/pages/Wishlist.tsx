import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Heart, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCartDrawer } from "@/contexts/CartDrawerContext";

interface WishlistItem {
  id: number;
  nameEn: string;
  nameKa: string;
  priceMin: number;
  priceMax: number;
  priceOnRequest: boolean;
  unitType: string;
}

export default function Wishlist() {
  const { language, t } = useLanguage();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { openDrawer } = useCartDrawer();

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('flowers-boutique-wishlist') || '[]');
    setWishlistItems(wishlist);
  }, []);

  const handleRemoveFromWishlist = (productId: number) => {
    const updated = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updated);
    localStorage.setItem('flowers-boutique-wishlist', JSON.stringify(updated));
    toast.success(language === 'ka' ? 'რჩეულებიდან წაშლილია' : 'Removed from wishlist');
  };

  const formatPrice = (item: WishlistItem) => {
    if (item.priceOnRequest) {
      return language === 'ka' ? 'ფასი მოთხოვნის შემთხვევაში' : 'Price on request';
    }
    if (item.priceMin === item.priceMax) {
      return `₾${item.priceMin}`;
    }
    return `₾${item.priceMin}-${item.priceMax}`;
  };

  if (wishlistItems.length === 0) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #FAF8F5 0%, #F5F0E8 100%)' }} className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <Heart className="w-20 h-20 text-[#D4AF37]/30 mb-6" />
          <h1 className="text-4xl sm:text-5xl font-light text-[#1C1917] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {language === 'ka' ? 'რჩეულები' : 'Wishlist'}
          </h1>
          <p className="text-[#666] text-lg mb-10 text-center max-w-md">
            {language === 'ka' ? 'თქვენი რჩეულების სია ცარიელია' : 'Your wishlist is empty'}
          </p>
          <Link href="/catalog">
            <Button className="rounded-full px-8 py-3 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/20 transition-all">
              {language === 'ka' ? 'კატალოგში გადასვლა' : 'Go to Catalog'}
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
    <div style={{ background: 'linear-gradient(135deg, #FAF8F5 0%, #F5F0E8 100%)' }} className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-16">
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-light text-[#1C1917] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {language === 'ka' ? 'რჩეულები' : 'Wishlist'}
          </h1>
          <p className="text-[#666]">
            {wishlistItems.length} {language === 'ka' ? 'პროდუქტი' : 'product(s)'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {wishlistItems.map((item) => (
            <div 
              key={item.id} 
              className="group rounded-3xl border border-[#D4AF37]/20 bg-white/40 backdrop-blur-sm overflow-hidden hover:bg-white/60 hover:border-[#D4AF37]/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Image Area */}
              <div className="aspect-square bg-gradient-to-br from-[#D4AF37]/10 to-[#A16207]/5 flex items-center justify-center relative overflow-hidden">
                <Heart className="w-16 h-16 text-[#D4AF37]/30 group-hover:text-[#D4AF37]/50 transition-colors" />
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
                  title={language === 'ka' ? 'წაშლა' : 'Remove'}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-[#1C1917] mb-2 line-clamp-2 text-lg">
                  {language === 'ka' ? item.nameKa : item.nameEn}
                </h3>

                <p className="text-xs font-semibold uppercase tracking-wider text-[#A16207] mb-4">
                  {item.unitType}
                </p>

                <p className="text-2xl font-light text-[#D4AF37] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {formatPrice(item)}
                </p>

                <Link href={`/product/${item.id}`} className="block w-full">
                  <Button className="w-full rounded-xl py-3 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/20 transition-all">
                    {language === 'ka' ? 'დეტალები' : 'View Details'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping CTA */}
        <div className="text-center py-8">
          <Link href="/catalog">
            <Button className="rounded-full px-10 py-3 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/20 transition-all">
              {language === 'ka' ? 'კატალოგში გადასვლა' : 'Continue Shopping'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
