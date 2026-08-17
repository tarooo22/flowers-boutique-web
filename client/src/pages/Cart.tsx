import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { AlertCircle, Check, ChevronRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from "@/contexts/LanguageContext";
import { getCart, getTotalPrice, removeFromCart, updateCartItemQuantity } from "@/lib/cartUtils";
import { trackLead } from "@/lib/facebookPixel";
import { useSEO } from "@/hooks/useSEO";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlowerImage from "@/components/FlowerImage";

const imageForItem = (item: any) => item.selectedVariantImage || item.imageUrl || item.previewImage || item.generatedImageUrl || "";

export default function Cart() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const ka = language === "ka";
  const [items, setItems] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formError, setFormError] = useState("");
  const createOrder = trpc.orders.create.useMutation();

  useSEO({ titleKa: "კალათა | Flower's Boutique", titleEn: "Cart | Flower's Boutique", descriptionKa: "შეამოწმეთ თქვენი Flower's Boutique შეკვეთა.", descriptionEn: "Review your Flower's Boutique order.", canonical: "/cart", lang: language as "ka" | "en" });

  useEffect(() => {
    setItems(getCart());
    if (user) {
      setCustomerName(user.name || "");
      setCustomerPhone(user.phone || "");
      setCustomerEmail(user.email || "");
    }
    const refresh = () => setItems(getCart());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [user]);

  const total = Number(getTotalPrice(items));
  const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const updateQuantity = (item: any, nextQuantity: number) => {
    setItems(updateCartItemQuantity(item.productId, nextQuantity, item.selectedVariantId));
  };
  const removeItem = (item: any) => {
    setItems(removeFromCart(item.productId, item.selectedVariantId));
    toast.success(ka ? "კალათიდან წაიშალა" : "Removed from cart");
  };

  const orderPayload = useMemo(() => items.map((item) => ({ productId: item.productId, quantity: item.quantity, price: item.price, selectedVariantId: item.selectedVariantId, selectedColorNameKa: item.selectedColorNameKa, selectedColorNameEn: item.selectedColorNameEn, selectedColorHex: item.selectedColorHex, customData: item.customData })), [items]);

  const beginOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError(ka ? "მიუთითეთ სახელი და ტელეფონის ნომერი." : "Please add your name and phone number.");
      return;
    }
    setFormError("");
    setShowConfirmation(true);
  };

  const submitOrder = async (channel: "whatsapp" | "messenger") => {
    trackLead(items.map((item) => ({ productId: item.productId, quantity: item.quantity, price: item.price })), total);
    try {
      await createOrder.mutateAsync({ customerName, customerPhone, customerEmail, items: orderPayload, totalPrice: total, notes, orderChannel: channel });
      localStorage.removeItem("flowers-boutique-cart");
      setItems([]);
      setShowConfirmation(false);
      toast.success(ka ? "შეკვეთა მიღებულია" : "Order received");
      navigate("/contact");
    } catch {
      toast.error(ka ? "შეკვეთის გაგზავნა ვერ მოხერხდა. სცადეთ თავიდან." : "We couldn't save your order. Please try again.");
    }
  };

  if (items.length === 0) return <div className="zip-cart-page min-h-screen bg-[#f7f2e9] text-[#181614]"><Navbar /><main className="fb-cart-empty"><ShoppingBag size={32} /><p className="fb-eyebrow">FLOWER'S BOUTIQUE · CART</p><h1 className="fb-display">{ka ? "თქვენი კალათა ცარიელია" : "Your cart is waiting"}</h1><p>{ka ? "დაამატეთ თაიგული, რომ განსაკუთრებული მომენტი შექმნათ." : "Add a bouquet to begin creating a special moment."}</p><Link href="/catalog" className="fb-cart-primary">{ka ? "კოლექციის ნახვა" : "View collection"}<ChevronRight size={16} /></Link></main><Footer /></div>;

  return (
    <div className="p2-cart-page zip-cart-page min-h-screen bg-[#f7f2e9] text-[#181614]">
      <Navbar />
      <main className="fb-page-shell fb-cart-page">
        <div className="fb-breadcrumbs"><Link href="/">{ka ? "მთავარი" : "Home"}</Link><ChevronRight size={14} /><span>{ka ? "კალათა" : "Cart"}</span></div>
        <div className="fb-cart-heading"><div><p className="fb-eyebrow">FLOWER'S BOUTIQUE · CART</p><h1 className="fb-display">{ka ? "თქვენი არჩევანი" : "Your selection"}</h1></div><span>{quantity} {ka ? "ნივთი" : quantity === 1 ? "item" : "items"}</span></div>
        <div className="fb-cart-layout">
          <section className="fb-cart-items" aria-label={ka ? "კალათის ნივთები" : "Cart items"}>
            {items.map((item) => <article className="fb-cart-item" key={`${item.productId}-${item.selectedVariantId || "default"}`}>
              <div className="fb-cart-item__image"><FlowerImage src={imageForItem(item)} alt={item.name} className="h-full w-full object-cover" /></div>
              <div className="fb-cart-item__content"><div className="flex items-start justify-between gap-3"><div><Link href={`/product/${item.productId}`} className="fb-cart-item__name">{item.name}</Link>{item.unitType && <p className="fb-cart-item__meta">{item.unitType}</p>}{item.selectedColorNameKa && <p className="fb-cart-item__meta flex items-center gap-2"><i style={{ backgroundColor: item.selectedColorHex || "#d6cec1" }} />{ka ? item.selectedColorNameKa : item.selectedColorNameEn}</p>}</div><button type="button" className="fb-cart-item__remove" onClick={() => removeItem(item)} aria-label={ka ? `${item.name} წაშლა` : `Remove ${item.name}`}><Trash2 size={17} /></button></div>{item.customData?.type === "visual-bouquet" && <p className="fb-cart-item__custom">{ka ? "ინდივიდუალური კომპოზიცია" : "Custom composition"}</p>}<div className="fb-cart-item__bottom"><div className="fb-cart-quantity"><button type="button" onClick={() => updateQuantity(item, item.quantity - 1)} aria-label={ka ? "რაოდენობის შემცირება" : "Decrease quantity"}><Minus size={15} /></button><output>{item.quantity}</output><button type="button" onClick={() => updateQuantity(item, item.quantity + 1)} aria-label={ka ? "რაოდენობის გაზრდა" : "Increase quantity"}><Plus size={15} /></button></div><strong>₾{(Number(item.price) * Number(item.quantity)).toFixed(0)}</strong></div></div>
            </article>)}
            <Link href="/catalog" className="fb-cart-continue"><ChevronRight size={15} className="rotate-180" />{ka ? "შოპინგის გაგრძელება" : "Continue shopping"}</Link>
          </section>
          <aside className="fb-cart-summary">
            <div className="fb-cart-summary__box"><h2>{ka ? "შეკვეთის შეჯამება" : "Order summary"}</h2><div className="fb-cart-summary__line"><span>{ka ? "პროდუქტები" : "Products"}</span><span>{quantity}</span></div><div className="fb-cart-summary__line"><span>{ka ? "მიწოდება" : "Delivery"}</span><span>{ka ? "შეთანხმებით" : "Arranged at checkout"}</span></div><div className="fb-cart-summary__total"><span>{ka ? "ჯამი" : "Total"}</span><strong>₾{total.toFixed(0)}</strong></div></div>
            <div className="fb-cart-form"><h2>{ka ? "მიწოდების დეტალები" : "Delivery details"}</h2><label htmlFor="cart-name">{ka ? "სახელი" : "Name"}<input id="cart-name" required value={customerName} onChange={(event) => setCustomerName(event.target.value)} /></label><label htmlFor="cart-phone">{ka ? "ტელეფონი" : "Phone"}<input id="cart-phone" required type="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} /></label><label htmlFor="cart-email">{ka ? "ელფოსტა (არასავალდებულო)" : "Email (optional)"}<input id="cart-email" type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} /></label><label htmlFor="cart-notes">{ka ? "შენიშვნა (არასავალდებულო)" : "Note (optional)"}<textarea id="cart-notes" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} /></label>{formError && <p className="fb-cart-error" role="alert"><AlertCircle size={15} />{formError}</p>}<button type="button" className="fb-cart-primary fb-cart-submit" onClick={beginOrder}>{ka ? "შეკვეთის გაგრძელება" : "Continue to order"}<ChevronRight size={16} /></button><p className="fb-cart-helper">{ka ? "შემდეგ ეტაპზე აირჩევთ კომუნიკაციის მეთოდს." : "You will choose a communication method next."}</p></div>
          </aside>
        </div>
      </main>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}><DialogContent className="fb-order-dialog"><DialogHeader><DialogTitle>{ka ? "შეკვეთის დადასტურება" : "Confirm your order"}</DialogTitle><DialogDescription>{ka ? "შეამოწმეთ დეტალები და აირჩიეთ კომუნიკაციის მეთოდი." : "Review the details and choose how we should contact you."}</DialogDescription></DialogHeader><div className="fb-order-review">{items.map((item) => <div key={`${item.productId}-${item.selectedVariantId || "default"}`}><span>{item.quantity} × {item.name}</span><strong>₾{(Number(item.price) * Number(item.quantity)).toFixed(0)}</strong></div>)}<div className="fb-order-review__total"><span>{ka ? "ჯამი" : "Total"}</span><strong>₾{total.toFixed(0)}</strong></div></div><div className="fb-order-dialog__actions"><button type="button" disabled={createOrder.isPending} onClick={() => submitOrder("whatsapp")}><Check size={17} />WhatsApp</button><button type="button" disabled={createOrder.isPending} onClick={() => submitOrder("messenger")}><Check size={17} />Messenger</button><button type="button" onClick={() => setShowConfirmation(false)}><X size={17} />{ka ? "გაუქმება" : "Cancel"}</button></div></DialogContent></Dialog>
    </div>
  );
}
