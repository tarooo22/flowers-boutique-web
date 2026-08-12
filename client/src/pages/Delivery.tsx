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
      subtitle: "Fast and reliable flower delivery across Tbilisi",
      
      section1Title: "Delivery Areas",
      section1Text: "We deliver flowers throughout Tbilisi and surrounding areas. Same-day delivery is available for orders placed before 2 PM.",
      
      section2Title: "Delivery Times",
      section2Text: "Standard delivery: 2-4 hours\nExpress delivery: 1-2 hours\nScheduled delivery: Choose your preferred date and time",
      
      section3Title: "Delivery Cost",
      section3Text: `Free delivery for orders at or above ${FREE_DELIVERY_THRESHOLD_GEL} GEL\nDelivery fee: ${DELIVERY_FEE_GEL} GEL for orders under ${FREE_DELIVERY_THRESHOLD_GEL} GEL`,
      
      section4Title: "How to Order",
      step1: "1. Browse our catalog and select flowers",
      step2: "2. Add items to cart and proceed to checkout",
      step3: "3. Enter delivery address and preferred time",
      step4: "4. Choose payment method and confirm",
      step5: "5. Our team will prepare and deliver your flowers",
      
      section5Title: "Contact Us",
      contactText: "For delivery inquiries, call us at +995 32 2 123 456 or message us on WhatsApp",
      
      contactInfo: "Contact Information",
      phone: "Phone",
      email: "Email",
      hours: "Working Hours",
      hoursText: "Monday - Sunday: 9:00 AM - 8:00 PM",
    },
    ka: {
      title: "მიტანის ინფორმაცია",
      subtitle: "სწრაფი და საიმედო ყვავილების მიტანა თბილისის მასშტაბით",
      
      section1Title: "მიტანის ტერიტორია",
      section1Text: "ჩვენ ვიტანთ ყვავილებს თბილისის მთელ ტერიტორიაზე და მის გარშემო. იმავე დღის მიტანა ხელმისაწვდომია 14:00-მდე შეკვეთილი შეკვეთებისთვის.",
      
      section2Title: "მიტანის დრო",
      section2Text: "სტანდარტული მიტანა: 2-4 საათი\nექსპრეს მიტანა: 1-2 საათი\nგეგმიური მიტანა: აირჩიეთ სასურველი თარიღი და დრო",
      
      section3Title: "მიტანის ღირებულება",
      section3Text: `უფასო მიტანა ${FREE_DELIVERY_THRESHOLD_GEL} ლარის ან მეტი შეკვეთებისთვის\nმიტანის ტარიფი: ${DELIVERY_FEE_GEL} ლარი ${FREE_DELIVERY_THRESHOLD_GEL} ლარზე ნაკლები შეკვეთებისთვის`,
      
      section4Title: "როგორ შეკვეთოთ",
      step1: "1. დათვალიერეთ ჩვენი კატალოგი და აირჩიეთ ყვავილები",
      step2: "2. დაამატეთ ნივხი კალათაში და გადაიდით გადახდაზე",
      step3: "3. შეიყვანეთ მიტანის მისამართი და სასურველი დრო",
      step4: "4. აირჩიეთ გადახდის მეთოდი და დაადასტურეთ",
      step5: "5. ჩვენი გუნდი მოამზადებს და მიტანს თქვენი ყვავილებს",
      
      section5Title: "დაკონტაქტეთ ჩვენ",
      contactText: "მიტანის შესახებ ინფორმაციისთვის, დაგვირეკეთ +995 32 2 123 456 ან მოწერეთ WhatsApp-ზე",
      
      contactInfo: "საკონტაქტო ინფორმაცია",
      phone: "ტელეფონი",
      email: "ელ-ფოსტა",
      hours: "სამუშაო საათები",
      hoursText: "ორშაბათი - კვირა: 09:00 - 20:00",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="fb-delivery-page min-h-screen flex flex-col bg-[#f7f2e9]">
      <Navbar />
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-16">
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
              <p className="text-lg text-amber-900 font-bold">{t.hoursText}</p>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
