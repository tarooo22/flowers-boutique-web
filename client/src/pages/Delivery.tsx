import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Truck, MapPin, Clock, Phone } from "lucide-react";
import { contactFallback, siteContact } from "@/lib/siteConfig";
import { DELIVERY_FEE_GEL, FREE_DELIVERY_THRESHOLD_GEL } from "@shared/checkoutPolicy";

export default function Delivery() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Delivery Information",
      subtitle: "Provide your preferred delivery details and our team will confirm the request with you.",
      
      section1Title: "Delivery Areas",
      section1Text: "Add the recipient address to your order request. We will confirm the delivery details with you before fulfilment.",
      
      section2Title: "Delivery Times",
      section2Text: "Select your preferred delivery date and time window in the order request. The final time is confirmed directly with you.",
      
      section3Title: "Delivery Cost",
      section3Text: `Free delivery for orders at or above ${FREE_DELIVERY_THRESHOLD_GEL} GEL\nDelivery fee: ${DELIVERY_FEE_GEL} GEL for orders under ${FREE_DELIVERY_THRESHOLD_GEL} GEL`,
      
      section4Title: "How to Order",
      step1: "1. Browse our catalog and select flowers",
      step2: "2. Add items to cart and open the order request",
      step3: "3. Enter delivery address and preferred time",
      step4: "4. Send the request through WhatsApp or Messenger",
      step5: "5. Our team will confirm the order details with you",
      
      section5Title: "Contact Us",
      contactText: "For delivery questions, use the verified phone number or WhatsApp contact below.",
      
      contactInfo: "Contact Information",
      phone: "Phone",
      email: "Email",
      hours: "Working Hours",
    },
    ka: {
      title: "მიტანის ინფორმაცია",
      subtitle: "მიუთითეთ სასურველი მიტანის დეტალები და ჩვენი გუნდი მოთხოვნას თქვენთან დაადასტურებს.",
      
      section1Title: "მიტანის ტერიტორია",
      section1Text: "შეკვეთის მოთხოვნაში მიუთითეთ მიმღების მისამართი. შესრულებამდე მიტანის დეტალებს თქვენთან დავადასტურებთ.",
      
      section2Title: "მიტანის დრო",
      section2Text: "შეკვეთის მოთხოვნაში აირჩიეთ სასურველი თარიღი და დროის მონაკვეთი. საბოლოო დრო თქვენთან პირდაპირ დადასტურდება.",
      
      section3Title: "მიტანის ღირებულება",
      section3Text: `უფასო მიტანა ${FREE_DELIVERY_THRESHOLD_GEL} ლარის ან მეტი შეკვეთებისთვის\nმიტანის ტარიფი: ${DELIVERY_FEE_GEL} ლარი ${FREE_DELIVERY_THRESHOLD_GEL} ლარზე ნაკლები შეკვეთებისთვის`,
      
      section4Title: "როგორ შეკვეთოთ",
      step1: "1. დათვალიერეთ ჩვენი კატალოგი და აირჩიეთ ყვავილები",
      step2: "2. დაამატეთ ნივთები კალათაში და გახსენით შეკვეთის მოთხოვნა",
      step3: "3. შეიყვანეთ მიტანის მისამართი და სასურველი დრო",
      step4: "4. გააგზავნეთ მოთხოვნა WhatsApp-ით ან Messenger-ით",
      step5: "5. ჩვენი გუნდი შეკვეთის დეტალებს თქვენთან დაადასტურებს",
      
      section5Title: "დაკონტაქტეთ ჩვენ",
      contactText: "მიტანის შესახებ ინფორმაციისთვის გამოიყენეთ ქვემოთ მითითებული დადასტურებული ტელეფონი ან WhatsApp.",
      
      contactInfo: "საკონტაქტო ინფორმაცია",
      phone: "ტელეფონი",
      email: "ელ-ფოსტა",
      hours: "სამუშაო საათები",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="fb-delivery-page min-h-screen flex flex-col bg-[#f7f2e9]">
      <Navbar />
      <main id="main-content" className="flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">{t.title}</h1>
          <p className="text-lg text-amber-700">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Delivery Areas */}
          <Card className="p-6 border-gold/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <MapPin className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  {t.section1Title}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{t.section1Text}</p>
              </div>
            </div>
          </Card>

          {/* Delivery Times */}
          <Card className="p-6 border-gold/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  {t.section2Title}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{t.section2Text}</p>
              </div>
            </div>
          </Card>

          {/* Delivery Cost */}
          <Card className="p-6 border-gold/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <Truck className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  {t.section3Title}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{t.section3Text}</p>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 border-gold/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <Phone className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">
                  {t.section5Title}
                </h2>
                <p className="text-gray-700">{t.contactText}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* How to Order */}
        <Card className="p-8 border-gold/20 mb-12">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            {t.section4Title}
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>{t.step1}</p>
            <p>{t.step2}</p>
            <p>{t.step3}</p>
            <p>{t.step4}</p>
            <p>{t.step5}</p>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-8 border-gold/20 bg-gradient-to-r from-amber-50 to-amber-100">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            {t.contactInfo}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-amber-700 font-semibold mb-1">
                {t.phone}
              </p>
              <p className="text-lg text-amber-900 font-bold">{siteContact.phone || (language === "ka" ? contactFallback.ka : contactFallback.en)}</p>
            </div>
            <div>
              <p className="text-sm text-amber-700 font-semibold mb-1">
                {t.email}
              </p>
              <p className="text-lg text-amber-900 font-bold">{siteContact.email || (language === "ka" ? contactFallback.ka : contactFallback.en)}</p>
            </div>
            <div>
              <p className="text-sm text-amber-700 font-semibold mb-1">
                {t.hours}
              </p>
              <p className="text-lg text-amber-900 font-bold">
                {language === "ka" ? siteContact.hoursKa : siteContact.hoursEn}
              </p>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
