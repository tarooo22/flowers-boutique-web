import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Truck, MapPin, Calendar as CalendarIcon, Clock, Gift, MessageSquare, Check, MessageCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getCart, getTotalPrice, clearCart } from "@/lib/cartUtils";
import type { CartItem } from "@/lib/cartUtils";
import { AddressAutocomplete, type AddressOption } from "@/components/AddressAutocomplete";
import { MapPinSelector } from "@/components/MapPinSelector";
import { CompactGeorgianCalendar } from "@/components/CompactGeorgianCalendar";
import { DeliveryTimeSlots } from "@/components/DeliveryTimeSlots";
import { SelectedDateSummary } from "@/components/SelectedDateSummary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { getDeliveryFeeGEL } from "@shared/checkoutPolicy";
import { siteContact } from "@/lib/siteConfig";

const translations = {
  en: {
    checkout: "Order Request",
    pickDeliveryDate: "Share the order details below. Our team will confirm the request with you.",
    customerDetails: "Your details",
    fullName: "Your name",
    phone: "Your phone",
    email: "Email (for receipt & updates)",
    howWouldYouLike: "How would you like it?",
    delivery: "Delivery",
    acrossTbilisi: "Across Tbilisi - 5 ₾ / free over 150 ₾",
    deliveryFee: "5 ₾",
    pickup: "Pickup",
    collectFromStore: "Collect from our store - Free",
    free: "Free",
    deliveryDates: "Delivery dates",
    sameDayDelivery: "Same-day delivery available. Tap a date to select it.",
    deliveryTime: "Time window",
    selectTime: "Select time window",
    anytime: "Any time",
    recipientName: "Recipient name",
    recipientPhone: "Recipient phone",
    address: "Address",
    building: "Building",
    entrance: "Entrance",
    apartment: "Apartment",
    selectOnMap: "Select exact location on map",
    cardMessage: "Card message",
    cardMessageOptional: "(optional, max 500)",
    courierNotes: "Notes for the courier",
    courierNotesOptional: "(optional)",
    extraOptions: "Extra options",
    sendAnonymously: "Send anonymously",
    noConfirmationCall: "No call on delivery",
    leaveAtDoor: "Leave at door",
    orderSummary: "Order summary",
    items: "Items",
    subtotal: "Subtotal",
    deliveryFeeLabel: "Delivery",
    total: "Total",
    whatsapp: "Send request via WhatsApp",
    messenger: "Send request via Messenger",
    placeOrder: "Send order request",
    backToCart: "Back to Cart",
    requiredField: "Required field",
    selectDeliveryDate: "Please select a delivery date",
    selectDeliveryTime: "Please select a delivery time",
    willCallIfNeeded: "We'll call if needed",
  },
  ka: {
    checkout: "შეკვეთის მოთხოვნა",
    pickDeliveryDate: "შეავსეთ შეკვეთის დეტალები. ჩვენი გუნდი მოთხოვნას თქვენთან დაადასტურებს.",
    customerDetails: "თქვენი დეტალები",
    fullName: "თქვენი სახელი",
    phone: "თქვენი ტელეფონი",
    email: "ელფოსტა (ქვითრისა და განახლებებისთვის)",
    howWouldYouLike: "როგორ გსურთ შეკვეთის მიღება?",
    delivery: "მიწოდება",
    acrossTbilisi: "თბილისის მასშტაბით — ₾5 / ₾150-დან უფასო",
    deliveryFee: "₾5",
    pickup: "თვითგატანა",
    collectFromStore: "მაღაზიიდან გატანა — უფასო",
    free: "უფასო",
    deliveryDates: "მიწოდების თარიღები",
    sameDayDelivery: "იმავე დღის მიწოდება ხელმისაწვდომია. აირჩიეთ თარიღი.",
    deliveryTime: "მიწოდების დროის მონაკვეთი",
    selectTime: "აირჩიეთ დროის მონაკვეთი",
    anytime: "ნებისმიერ დროს",
    recipientName: "მიმღების სახელი",
    recipientPhone: "მიმღების ტელეფონი",
    address: "მისამართი",
    building: "კორპუსი",
    entrance: "სადარბაზო",
    apartment: "ბინა",
    selectOnMap: "რუკაზე ზუსტი მდებარეობის მონიშვნა",
    cardMessage: "საჩუქრის ბარათის ტექსტი",
    cardMessageOptional: "(არასავალდებულო, მაქს 500)",
    courierNotes: "შენიშვნები კურიერისთვის",
    courierNotesOptional: "(არასავალდებულო)",
    extraOptions: "დამატებითი ვარიანტები",
    sendAnonymously: "ანონიმურად გაგზავნა",
    noConfirmationCall: "ზარის გარეშე მიწოდება",
    leaveAtDoor: "კარის წინ დატოვება",
    orderSummary: "შეკვეთის შეჯამება",
    items: "პროდუქტები",
    subtotal: "ჯამი",
    deliveryFeeLabel: "მიწოდება",
    total: "სულ",
    whatsapp: "მოთხოვნის გაგზავნა WhatsApp-ით",
    messenger: "მოთხოვნის გაგზავნა Messenger-ით",
    placeOrder: "შეკვეთის მოთხოვნის გაგზავნა",
    backToCart: "კალათაში დაბრუნება",
    requiredField: "აუცილებელი ველი",
    selectDeliveryDate: "აირჩიეთ მიწოდების თარიღი",
    selectDeliveryTime: "აირჩიეთ მიწოდების დრო",
    willCallIfNeeded: "საჭიროების შემთხვევაში დაგიკავშირდებით",
  },
};

const TIME_SLOTS = [
  { id: "anytime", label: "ნებისმიერ დროს / Any time", startHour: 0, endHour: 24 },
  { id: "11-14", label: "11:00–14:00", startHour: 11, endHour: 14 },
  { id: "14-17", label: "14:00–17:00", startHour: 14, endHour: 17 },
  { id: "17-21", label: "17:00–21:00", startHour: 17, endHour: 21 },
];

// Get available time slots for a given date
function getAvailableTimeSlots(date: string): typeof TIME_SLOTS {
  const today = new Date().toISOString().split('T')[0];
  const isToday = date === today;
  
  if (!isToday) {
    return TIME_SLOTS;
  }

  const now = new Date();
  const currentHour = now.getHours();

  return TIME_SLOTS.filter(slot => {
    if (slot.id === "anytime") return true;
    return slot.endHour > currentHour;
  });
}

// Section card wrapper
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E8E3DC] p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
}

// Delivery/Pickup selection card
function DeliveryOptionCard({
  selected,
  icon: Icon,
  title,
  subtitle,
  price,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  price: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? "border-[#C4603A] bg-[#FFF8F5]"
          : "border-[#E8E3DC] bg-white hover:border-[#D4C4B0]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-[#C4603A]">{Icon}</div>
          <div>
            <div className="font-semibold text-[#1C1C1C]">{title}</div>
            <div className="text-sm text-[#8B7B6F]">{subtitle}</div>
          </div>
        </div>
        {selected && <CheckCircle2 className="w-5 h-5 text-[#C4603A]" />}
      </div>
    </button>
  );
}

// Time slot button
function TimeSlotButton({
  selected,
  label,
  onClick,
  disabled = false,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
        disabled
          ? "border-[#E8E3DC] bg-[#F5F2EE] text-[#A89B8F] cursor-not-allowed"
          : selected
          ? "border-[#C4603A] bg-[#C4603A] text-white"
          : "border-[#E8E3DC] bg-white text-[#1C1C1C] hover:border-[#C4603A]"
      }`}
    >
      {label}
    </button>
  );
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Customer details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Recipient details
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [entrance, setEntrance] = useState("");
  const [apartment, setApartment] = useState("");

  // Optional fields
  const [cardMessage, setCardMessage] = useState("");
  const [courierNotes, setCourierNotes] = useState("");
  const [sendAnonymously, setSendAnonymously] = useState(false);
  const [noConfirmationCall, setNoConfirmationCall] = useState(false);
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const createOrderMutation = trpc.orders.create.useMutation();

  useSEO({
    titleKa: "შეკვეთის გაფორმება | Flower's Boutique",
    titleEn: "Checkout | Flower's Boutique",
    descriptionKa: "მიუთითეთ მიწოდებისა და შეკვეთის დეტალები.",
    descriptionEn: "Add delivery and order details for your bouquet.",
    canonical: "/checkout",
    lang: language as "ka" | "en",
  });

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) {
      navigate("/");
      return;
    }
    setCartItems(cart);
  }, [navigate]);

  const getSubtotal = () => getTotalPrice(cartItems);
  const getDeliveryFee = () =>
    getDeliveryFeeGEL(deliveryType, Number(getSubtotal()) || 0).toFixed(2);
  const getDeliveryFeeLabel = () => {
    const fee = getDeliveryFeeGEL(deliveryType, Number(getSubtotal()) || 0);
    return fee === 0 ? t.free : `₾${fee.toFixed(2)}`;
  };
  const getTotal = () => {
    const subtotal = parseFloat(getSubtotal());
    const fee = parseFloat(getDeliveryFee());
    return (subtotal + fee).toFixed(2);
  };

  const validateForm = () => {
    // Always required fields
    if (!customerName.trim()) {
      toast.error(language === 'ka' ? 'გთხოვთ, მიუთითოთ სახელი' : 'Please enter your name');
      return false;
    }
    if (!customerPhone.trim()) {
      toast.error(language === 'ka' ? 'გთხოვთ, მიუთითოთ ტელეფონის ნომერი' : 'Please enter your phone');
      return false;
    }
    if (!selectedDate) {
      const dateLabel = deliveryType === 'delivery' 
        ? (language === 'ka' ? 'მიტანის თარიღი' : 'Delivery date')
        : (language === 'ka' ? 'გატანის თარიღი' : 'Pickup date');
      toast.error(language === 'ka' ? `გთხოვთ, აირჩიოთ ${dateLabel}` : `Please select ${dateLabel}`);
      return false;
    }
    if (!selectedTime) {
      const timeLabel = deliveryType === 'delivery'
        ? (language === 'ka' ? 'მიტანის დრო' : 'Delivery time')
        : (language === 'ka' ? 'გატანის დრო' : 'Pickup time');
      toast.error(language === 'ka' ? `გთხოვთ, აირჩიოთ ${timeLabel}` : `Please select ${timeLabel}`);
      return false;
    }
    
    // Delivery-only required fields
    if (deliveryType === 'delivery') {
      if (!recipientName.trim()) {
        toast.error(language === 'ka' ? 'გთხოვთ, მიუთითოთ მიმღების სახელი' : 'Please enter recipient name');
        return false;
      }
      if (!recipientPhone.trim()) {
        toast.error(language === 'ka' ? 'გთხოვთ, მიუთითოთ მიმღების ტელეფონი' : 'Please enter recipient phone');
        return false;
      }
      if (!address.trim()) {
        toast.error(language === 'ka' ? 'გთხოვთ, მიუთითოთ მისამართი' : 'Please enter delivery address');
        return false;
      }
    }
    
    return true;
  };

  const handleWhatsApp = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const total = Number(getTotal());
      const message = `Hi! I'd like to order:\n${cartItems.map(item => `${item.quantity}x ${item.name}`).join('\n')}\n\nTotal: ₾${total}\n\nCustomer: ${customerName}\nPhone: ${customerPhone}\nRecipient: ${recipientName}\nAddress: ${address}${building ? `, ${building}` : ''}${entrance ? `, ${entrance}` : ''}${apartment ? `, ${apartment}` : ''}\nDelivery Date: ${selectedDate}\nDelivery Time: ${selectedTime}${cardMessage ? `\nCard Message: ${cardMessage}` : ''}${courierNotes ? `\nNotes: ${courierNotes}` : ''}`;

      await createOrderMutation.mutateAsync({
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedVariantId: item.selectedVariantId,
          selectedColorNameKa: item.selectedColorNameKa,
          selectedColorNameEn: item.selectedColorNameEn,
          selectedColorHex: item.selectedColorHex,
          customData: item.customData,
        })),
        totalPrice: total,
        notes: courierNotes,
        deliveryAddress: address,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        building,
        entrance,
        floor: undefined,
        apartment,
        deliveryDate: selectedDate,
        deliveryTime: selectedTime,
        giftMessage: cardMessage,
        orderChannel: 'whatsapp',
        fulfillmentType: deliveryType,
      });

      clearCart();
      const whatsappUrl = `${siteContact.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      navigate("/");
    } catch (error) {
      console.error('WhatsApp order failed:', error);
      toast.error(language === 'ka' ? 'შეკვეთა ვერ დამუშავდა' : 'Order failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMessenger = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const total = Number(getTotal());

      await createOrderMutation.mutateAsync({
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedVariantId: item.selectedVariantId,
          selectedColorNameKa: item.selectedColorNameKa,
          selectedColorNameEn: item.selectedColorNameEn,
          selectedColorHex: item.selectedColorHex,
          customData: item.customData,
        })),
        totalPrice: total,
        notes: courierNotes,
        deliveryAddress: address,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        building,
        entrance,
        floor: undefined,
        apartment,
        deliveryDate: selectedDate,
        deliveryTime: selectedTime,
        giftMessage: cardMessage,
        orderChannel: 'messenger',
        fulfillmentType: deliveryType,
      });

      clearCart();
      window.open(siteContact.messenger, '_blank');
      navigate("/");
    } catch (error) {
      console.error('Messenger order failed:', error);
      toast.error(language === 'ka' ? 'შეკვეთა ვერ დამუშავდა' : 'Order failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const availableTimeSlots = getAvailableTimeSlots(selectedDate);

  return (
    <div className="fb-checkout-page min-h-screen bg-[#f7f2e9]">
      <Navbar />
      {/* Map Pin Selector Modal */}
      <MapPinSelector
        isOpen={isMapOpen}
        initialLat={latitude || 41.7151}
        initialLon={longitude || 44.7671}
        onConfirm={(lat, lon, addr) => {
          setLatitude(lat);
          setLongitude(lon);
          setPlaceId(null);
          if (addr) setAddress(addr);
          setIsMapOpen(false);
        }}
        onCancel={() => setIsMapOpen(false)}
      />

      <main id="main-content" className="fb-checkout-shell max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-[#E8E3DC] rounded-lg transition text-[#1C1C1C]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1C1C1C]" style={{ fontFamily: 'var(--font-heading)' }}>
              {t.checkout}
            </h1>
            <p className="text-sm text-[#8B7B6F] mt-1">{t.pickDeliveryDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Form - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Details */}
            <SectionCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C4603A] text-white flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <h2 className="text-lg font-semibold text-[#1C1C1C]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t.customerDetails}
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t.fullName}</label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.fullName}
                    className="border-[#E8E3DC] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t.phone}</label>
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+995 5XX XXX XXX"
                    className="border-[#E8E3DC] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t.email}</label>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="border-[#E8E3DC] rounded-lg"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Step 2: Delivery Type */}
            <SectionCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C4603A] text-white flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <h2 className="text-lg font-semibold text-[#1C1C1C]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t.howWouldYouLike}
                </h2>
              </div>
              <div className="space-y-3">
                <DeliveryOptionCard
                  selected={deliveryType === "delivery"}
                  icon={<Truck className="w-5 h-5" />}
                  title={t.delivery}
                  subtitle={t.acrossTbilisi}
                  price={getDeliveryFeeLabel()}
                  onClick={() => setDeliveryType("delivery")}
                />
                <DeliveryOptionCard
                  selected={deliveryType === "pickup"}
                  icon={<MapPin className="w-5 h-5" />}
                  title={t.pickup}
                  subtitle={t.collectFromStore}
                  price={t.free}
                  onClick={() => setDeliveryType("pickup")}
                />
              </div>
            </SectionCard>

            {/* Step 3: Delivery Date & Time */}
            <SectionCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C4603A] text-white flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <h2 className="text-lg font-semibold text-[#1C1C1C]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t.deliveryDates}
                </h2>
              </div>
              <p className="text-sm text-[#8B7B6F] mb-6">{t.sameDayDelivery}</p>
              
              {/* Desktop: Two-column layout (calendar left, summary+slots right) */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
                {/* Calendar */}
                <div className="flex justify-start">
                  <CompactGeorgianCalendar
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(""); // Reset time when date changes
                    }}
                    minDate={today}
                  />
                </div>
                
                {/* Right column: Summary + Time slots */}
                <div className="space-y-4">
                  {selectedDate && (
                    <>
                      <SelectedDateSummary
                        selectedDate={selectedDate}
                        language={language}
                      />
                      <DeliveryTimeSlots
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onSelectTime={setSelectedTime}
                        language={language}
                      />
                    </>
                  )}
                </div>
              </div>
              
              {/* Mobile: Stacked layout */}
              <div className="lg:hidden space-y-4">
                <div className="flex justify-center">
                  <CompactGeorgianCalendar
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(""); // Reset time when date changes
                    }}
                    minDate={today}
                  />
                </div>
                
                {selectedDate && (
                  <>
                    <SelectedDateSummary
                      selectedDate={selectedDate}
                      language={language}
                    />
                    <DeliveryTimeSlots
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onSelectTime={setSelectedTime}
                      language={language}
                    />
                  </>
                )}
              </div>
            </SectionCard>

            {/* Step 4: Recipient Details (only for delivery) */}
            {deliveryType === "delivery" && (
              <SectionCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#C4603A] text-white flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <h2 className="text-lg font-semibold text-[#1C1C1C]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {t.recipientName}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t.recipientName}</label>
                    <Input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder={t.recipientName}
                      className="border-[#E8E3DC] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t.recipientPhone}</label>
                    <Input
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="+995 5XX XXX XXX"
                      className="border-[#E8E3DC] rounded-lg"
                    />
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Step 5: Address (only for delivery) */}
            {deliveryType === "delivery" && (
              <SectionCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#C4603A] text-white flex items-center justify-center font-semibold text-sm">
                    5
                  </div>
                  <h2 className="text-lg font-semibold text-[#1C1C1C]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {t.address}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t.address}</label>
                    <div className="flex gap-2">
                      <AddressAutocomplete
                        value={address}
                        onChange={setAddress}
                        onSelect={(option: AddressOption) => {
                          setAddress(option.formatted);
                          setLatitude(option.lat);
                          setLongitude(option.lon);
                          setPlaceId(option.placeId ?? null);
                        }}
                        placeholder={t.address}
                      />
                      <Button
                        onClick={() => setIsMapOpen(true)}
                        variant="outline"
                        className="whitespace-nowrap border-[#E8E3DC] text-[#C4603A] hover:bg-[#FFF8F5]"
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t.building}</label>
                      <Input
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        placeholder={t.building}
                        className="border-[#E8E3DC] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t.entrance}</label>
                      <Input
                        value={entrance}
                        onChange={(e) => setEntrance(e.target.value)}
                        placeholder={t.entrance}
                        className="border-[#E8E3DC] rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t.apartment}</label>
                    <Input
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder={t.apartment}
                      className="border-[#E8E3DC] rounded-lg"
                    />
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Step 6: Notes & Extra Options */}
            <SectionCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C4603A] text-white flex items-center justify-center font-semibold text-sm">
                  {deliveryType === "delivery" ? "6" : "5"}
                </div>
                <h2 className="text-lg font-semibold text-[#1C1C1C]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t.extraOptions}
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
                    {t.cardMessage}
                    <span className="text-xs text-[#8B7B6F] font-normal ml-1">{t.cardMessageOptional}</span>
                  </label>
                  <textarea
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value.slice(0, 500))}
                    placeholder={t.cardMessage}
                    className="w-full px-3 py-2 border border-[#E8E3DC] rounded-lg bg-white text-[#1C1C1C] placeholder-[#A89B8F]"
                    rows={3}
                  />
                  <p className="text-xs text-[#A89B8F] mt-1">{cardMessage.length}/500</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
                    {t.courierNotes}
                    <span className="text-xs text-[#8B7B6F] font-normal ml-1">{t.courierNotesOptional}</span>
                  </label>
                  <textarea
                    value={courierNotes}
                    onChange={(e) => setCourierNotes(e.target.value)}
                    placeholder={t.courierNotes}
                    className="w-full px-3 py-2 border border-[#E8E3DC] rounded-lg bg-white text-[#1C1C1C] placeholder-[#A89B8F]"
                    rows={3}
                  />
                </div>
                {deliveryType === "delivery" && (
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendAnonymously}
                        onChange={(e) => setSendAnonymously(e.target.checked)}
                        className="w-4 h-4 rounded border-[#E8E3DC]"
                      />
                      <span className="text-sm text-[#1C1C1C]">{t.sendAnonymously}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noConfirmationCall}
                        onChange={(e) => setNoConfirmationCall(e.target.checked)}
                        className="w-4 h-4 rounded border-[#E8E3DC]"
                      />
                      <span className="text-sm text-[#1C1C1C]">{t.noConfirmationCall}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leaveAtDoor}
                        onChange={(e) => setLeaveAtDoor(e.target.checked)}
                        className="w-4 h-4 rounded border-[#E8E3DC]"
                      />
                      <span className="text-sm text-[#1C1C1C]">{t.leaveAtDoor}</span>
                    </label>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Order Summary - Right Column (Sticky on Desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E8E3DC] p-6 shadow-sm lg:sticky lg:top-8">
              <h2 className="text-xl font-semibold text-[#1C1C1C] mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="text-[#C4603A]">📋</span>
                {t.orderSummary}
              </h2>

              {/* Summary Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-[#E8E3DC]">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-[#8B7B6F]">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-[#1C1C1C]">₾{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6 pb-6 border-b border-[#E8E3DC]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B7B6F]">{t.subtotal}</span>
                  <span className="font-medium text-[#1C1C1C]">₾{getSubtotal()}</span>
                </div>
                {deliveryType === "delivery" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B7B6F]">{t.deliveryFeeLabel}</span>
                    <span className="font-medium text-[#1C1C1C]">{getDeliveryFeeLabel()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <span className="font-semibold text-[#1C1C1C]">{t.total}</span>
                  <span className="text-2xl font-bold text-[#C4603A]">₾{getTotal()}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-2 mb-6 text-xs text-[#8B7B6F]">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#C4603A] flex-shrink-0 mt-0.5" />
                  <span>{t.willCallIfNeeded}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <Button
                  onClick={handleWhatsApp}
                  disabled={isProcessing}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.whatsapp}
                </Button>
                <Button
                  onClick={handleMessenger}
                  disabled={isProcessing}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t.messenger}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
