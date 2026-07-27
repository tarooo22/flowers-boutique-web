import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trash2, ShoppingBag, Minus, Plus, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  getTotalPrice,
} from "@/lib/cartUtils";
import type { CartItem } from "@/lib/cartUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { BouquetCartPreview } from "@/components/BouquetCartPreview";
import { useLocation } from "wouter";
import { useCartDrawer } from "@/contexts/CartDrawerContext";

function getVisualBouquetData(item: CartItem) {
  return item.customData?.type === "visual-bouquet"
    ? item.customData
    : null;
}

function VisualBouquetCartDetails({
  item,
  language,
}: {
  item: CartItem;
  language: "ka" | "en";
}) {
  const bouquet = getVisualBouquetData(item);
  if (!bouquet) return null;

  return (
    <div className="mt-2 rounded-lg bg-[#f5eee4] px-2.5 py-2 text-[11px] leading-4 text-[#756657]">
      <p>
        {bouquet.flowers
          .map(
            flower =>
              `${language === "ka" ? flower.nameKa : flower.nameEn} × ${flower.quantity}`
          )
          .join(" · ")}
      </p>
      <p className="mt-1 text-[#938170]">
        {bouquet.wrapMode === "paper" && bouquet.wrapper
          ? language === "ka"
            ? `შეფუთვა: ${bouquet.wrapper.nameKa}`
            : `Wrapper: ${bouquet.wrapper.nameEn}`
          : language === "ka"
            ? "შეფუთვის გარეშე"
            : "No wrapping"}
        {" · "}
        {language === "ka"
          ? `ლენტი: ${bouquet.ribbon.nameKa}`
          : `Ribbon: ${bouquet.ribbon.nameEn}`}
      </p>
    </div>
  );
}

export default function CartDrawer() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isOpen, closeDrawer, openDrawer } = useCartDrawer();

  useEffect(() => {
    if (isOpen) {
      const cart = getCart();
      setCartItems(cart);
      // Lock background scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock background scroll
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleRemoveItem = (
    productId: number,
    selectedVariantId?: string
  ) => {
    const updated = removeFromCart(productId, selectedVariantId);
    setCartItems(updated);
    toast.success(language === 'ka' ? 'პროდუქტი კალათიდან წაიშალა' : 'Item removed');
  };

  const handleUpdateQuantity = (
    productId: number,
    newQuantity: number,
    selectedVariantId?: string
  ) => {
    const updated = updateCartItemQuantity(
      productId,
      newQuantity,
      selectedVariantId
    );
    setCartItems(updated);
  };

  const getTotal = () => {
    return getTotalPrice(cartItems);
  };

  const handleContinueToCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (confirm(language === 'ka' ? 'დაიშლება თქვენი კალათა?' : 'Clear your cart?')) {
      clearCart();
      setCartItems([]);
      toast.success(language === 'ka' ? 'კალათა დაიშალა' : 'Cart cleared');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(newOpen) => {
      if (newOpen) {
        openDrawer();
      } else {
        closeDrawer();
      }
    }}>
      <SheetContent side="right" className="w-full sm:w-[450px] flex flex-col p-0 bg-[#FAF8F5] overflow-hidden">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 bg-white/50 backdrop-blur-sm border-b border-[#E8DCC8]">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-[#2C2C2C]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem' }}>
              <ShoppingBag className="w-5 h-5 text-[#8B6F47]" />
              {language === 'ka' ? 'კალათა' : 'Cart'}
            </SheetTitle>
            <span className="text-xs font-medium text-[#999] bg-[#F0E8E0] px-2.5 py-1 rounded-full">
              {cartItems.length} {language === 'ka' ? 'ნივ.' : 'items'}
            </span>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E8DCC8] to-[#D4C4B0] flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-[#999]" />
            </div>
            <div className="text-center">
              <p className="font-medium text-[#2C2C2C] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                {language === 'ka' ? 'თქვენი კალათა ცარიელია' : 'Your cart is empty'}
              </p>
              <p className="text-sm text-[#999]">
                {language === 'ka' ? 'შეარჩიეთ ყვავილები კატალოგიდან' : 'Browse our collection'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cartItems.map((item, idx) => (
                <div key={`${item.productId}-${item.selectedVariantId || 'default'}-${idx}`} className="bg-white rounded-lg border border-[#E8DCC8] p-3.5 hover:border-[#D4C4B0] transition-colors">
                  {/* Product Image & Info */}
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-lg bg-[#F5F2EE] flex-shrink-0 overflow-hidden">
                      {item.customData?.type === "visual-bouquet" ? (
                        <BouquetCartPreview bouquetData={item.customData} />
                      ) : (
                        <div className="w-full h-full bg-[#F5F2EE] flex items-center justify-center text-[#999] text-xs">
                          {language === 'ka' ? 'სურათი' : 'Image'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#2C2C2C] text-sm leading-tight truncate">
                        {item.name}
                      </p>
                      {item.selectedColorNameKa && (
                        <p className="text-xs text-[#999] mt-0.5">
                          {language === 'ka' ? item.selectedColorNameKa : item.selectedColorNameEn}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-[#8B6F47] mt-1">
                        ₾{item.price}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.productId, item.selectedVariantId)}
                      className="text-[#999] hover:text-[#E74C3C] transition-colors flex-shrink-0 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bouquet Details */}
                  <VisualBouquetCartDetails item={item} language={language} />

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-3 bg-[#F5F2EE] rounded-lg p-1.5 w-fit">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1), item.selectedVariantId)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 text-[#8B6F47]" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-[#2C2C2C]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.selectedVariantId)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#8B6F47]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="px-6 py-3 border-t border-[#E8DCC8]">
              {/* Subtotal */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-[#999]">
                  {language === 'ka' ? 'ჯამი:' : 'Subtotal:'}
                </span>
                <span className="text-sm font-semibold text-[#2C2C2C]">
                  ₾{getTotal()}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2.5">
                <Button
                  onClick={handleContinueToCheckout}
                  className="w-full bg-gradient-to-r from-[#8B6F47] to-[#A0845C] hover:from-[#A0845C] hover:to-[#B89968] text-white h-11 font-semibold rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  {language === 'ka' ? 'შეძენის გაგრძელება' : 'Continue to Checkout'}
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  onClick={handleClearCart}
                  variant="outline"
                  className="w-full border-[#E8DCC8] text-[#8B6F47] hover:bg-[#F5F2EE] h-10 font-medium rounded-lg transition-colors"
                >
                  {language === 'ka' ? 'კალათის გასუფთავება' : 'Clear Cart'}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
