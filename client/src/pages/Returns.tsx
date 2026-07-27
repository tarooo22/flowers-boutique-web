import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { contactFallback, siteContact } from "@/lib/siteConfig";

export default function Returns() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Returns & Refunds",
      subtitle: "Our return and refund policy",
      
      section1Title: "Return Policy",
      section1Text: "We want you to be completely satisfied with your purchase. If you are not satisfied with your flowers, you can request a return or refund within 24 hours of delivery.",
      
      section2Title: "Conditions for Returns",
      condition1: "• Flowers must be in their original condition",
      condition2: "• Delivery must have been completed within the last 24 hours",
      condition3: "• Flowers must show visible signs of poor quality or damage",
      condition4: "• Custom bouquets cannot be returned unless damaged",
      
      section3Title: "Refund Process",
      step1: "1. Contact us with photos of the flowers",
      step2: "2. Our team will review your request",
      step3: "3. If approved, we will issue a full refund",
      step4: "4. Refund will be processed within 3-5 business days",
      
      section4Title: "Non-Returnable Items",
      nonReturn1: "• Flowers kept beyond 24 hours after delivery",
      nonReturn2: "• Flowers damaged due to improper care",
      nonReturn3: "• Flowers damaged due to extreme weather conditions",
      nonReturn4: "• Promotional or discounted items (unless defective)",
      
      section5Title: "Refund Methods",
      refundMethod1: "• Original payment method (credit/debit card)",
      refundMethod2: "• Bank transfer to your account",
      refundMethod3: "• Store credit for future purchases",
      
      section6Title: "Contact Us",
      contactText: "For return requests or refund inquiries, please contact us at:",
      phone: "Phone",
      email: "Email",
      hours: "Response Time",
      hoursText: "We typically respond within 2 hours during business hours",
      
      important: "Important",
      importantText: "Please keep the flowers in their original condition and take photos immediately if you notice any issues. This will help us process your request faster.",
    },
    ka: {
      title: "დაბრუნება და დაბრუნებული თანხა",
      subtitle: "ჩვენი დაბრუნების და დაბრუნებული თანხის პოლიტიკა",
      
      section1Title: "დაბრუნების პოლიტიკა",
      section1Text: "ჩვენ გვინდა, რომ თქვენ სრულად იყოთ კმაყოფილი თქვენი ყიდვით. თუ თქვენ არ ხართ კმაყოფილი თქვენი ყვავილებით, შეგიძლიათ მოითხოვოთ დაბრუნება ან დაბრუნებული თანხა მიტანის შემდეგ 24 საათის განმავლობაში.",
      
      section2Title: "დაბრუნების პირობები",
      condition1: "• ყვავილები უნდა იყოს თავიანთ ორიგინალურ მდგომარეობაში",
      condition2: "• მიტანა უნდა დასრულდეს ბოლო 24 საათის განმავლობაში",
      condition3: "• ყვავილებმა უნდა აჩვენოს ხილული ნიშნები ცუდი ხარისხის ან ზიანის",
      condition4: "• მორგებული თაიგულები ვერ დაბრუნდება, თუ ზიანი არ აქვთ",
      
      section3Title: "დაბრუნებული თანხის პროცესი",
      step1: "1. დაგვირეკეთ ფოტოებით ყვავილებისა",
      step2: "2. ჩვენი გუნდი განიხილავს თქვენს მოთხოვნას",
      step3: "3. თუ დამტკიცდა, ჩვენ გამოვცემთ სრულ დაბრუნებულ თანხას",
      step4: "4. დაბრუნებული თანხა დამუშავდება 3-5 სამუშაო დღის განმავლობაში",
      
      section4Title: "დაბრუნებული ვერ მოხდება",
      nonReturn1: "• ყვავილები, რომელიც დაკავებულია 24 საათზე მეტი ხნის განმავლობაში",
      nonReturn2: "• ყვავილები, რომელიც ზიანი აქვთ არასწორი ზრუნვის გამო",
      nonReturn3: "• ყვავილები, რომელიც ზიანი აქვთ ექსტრემალური ამინდის პირობების გამო",
      nonReturn4: "• პრომოციული ან ფასდაკლებული ნივხი (თუ არ არის დეფექტი)",
      
      section5Title: "დაბრუნებული თანხის მეთოდები",
      refundMethod1: "• ორიგინალური გადახდის მეთოდი (საკრედიტო/დებეტ ბარათი)",
      refundMethod2: "• ბანკის გადარიცხვა თქვენს ანგარიშზე",
      refundMethod3: "• მაღაზიის კრედიტი მომავალი ყიდვებისთვის",
      
      section6Title: "დაკონტაქტეთ ჩვენ",
      contactText: "დაბრუნების მოთხოვნებისთვის ან დაბრუნებული თანხის ინფორმაციისთვის, გთხოვთ დაგვირეკოთ:",
      phone: "ტელეფონი",
      email: "ელ-ფოსტა",
      hours: "პასუხის დრო",
      hoursText: "ჩვენ ჩვეულებრივ ვპასუხობთ 2 საათის განმავლობაში სამუშაო საათებში",
      
      important: "მნიშვნელოვანი",
      importantText: "გთხოვთ, შეინახოთ ყვავილები მათ ორიგინალურ მდგომარეობაში და გადაიღოთ ფოტოები დაუყოვნებლივ, თუ შენიშნეთ რაიმე პრობლემა. ეს დაგვეხმარება თქვენი მოთხოვნის უფრო სწრაფად დამუშავებაში.",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <Navbar />
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">{t.title}</h1>
          <p className="text-lg text-amber-700">{t.subtitle}</p>
        </div>

        {/* Main Policy */}
        <Card className="p-8 border-gold/20 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            {t.section1Title}
          </h2>
          <p className="text-gray-700 leading-relaxed">{t.section1Text}</p>
        </Card>

        {/* Conditions */}
        <Card className="p-8 border-gold/20 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            {t.section2Title}
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>{t.condition1}</p>
            <p>{t.condition2}</p>
            <p>{t.condition3}</p>
            <p>{t.condition4}</p>
          </div>
        </Card>

        {/* Refund Process */}
        <Card className="p-8 border-gold/20 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            {t.section3Title}
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{t.step1}</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{t.step2}</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{t.step3}</span>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{t.step4}</span>
            </div>
          </div>
        </Card>

        {/* Non-Returnable */}
        <Card className="p-8 border-gold/20 mb-8 bg-red-50">
          <h2 className="text-2xl font-bold text-red-900 mb-4">
            {t.section4Title}
          </h2>
          <div className="space-y-2 text-red-900">
            <p>{t.nonReturn1}</p>
            <p>{t.nonReturn2}</p>
            <p>{t.nonReturn3}</p>
            <p>{t.nonReturn4}</p>
          </div>
        </Card>

        {/* Refund Methods */}
        <Card className="p-8 border-gold/20 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            {t.section5Title}
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>{t.refundMethod1}</p>
            <p>{t.refundMethod2}</p>
            <p>{t.refundMethod3}</p>
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-8 border-gold/20 mb-8 bg-gradient-to-r from-amber-50 to-amber-100">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            {t.section6Title}
          </h2>
          <p className="text-gray-700 mb-6">{t.contactText}</p>
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

        {/* Important Notice */}
        <Card className="p-8 border-2 border-amber-300 bg-amber-50">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                {t.important}
              </h3>
              <p className="text-amber-900">{t.importantText}</p>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
