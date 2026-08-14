import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { contactFallback, siteContact } from "@/lib/siteConfig";
import { useSEO } from "@/hooks/useSEO";

export default function Returns() {
  const { language } = useLanguage();

  useSEO({
    titleKa: "დაბრუნება და თანხის ანაზღაურება | ყვავილების ბუტიკი & ივენთები",
    titleEn: "Returns & Refunds | Flower’s Boutique & Events",
    descriptionKa: "გაეცანით Flower’s Boutique & Events-ის დაბრუნებისა და თანხის ანაზღაურების პირობებს.",
    descriptionEn: "Review the Flower’s Boutique & Events returns and refunds information.",
    canonical: "/returns",
    lang: language as "ka" | "en",
  });

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
      hours: "Working Hours",
      hoursText: "Every day · 10:00–20:00",
      
      important: "Important",
      importantText: "Please keep the flowers in their original condition and take photos immediately if you notice any issues. This will help us process your request faster.",
    },
    ka: {
      title: "დაბრუნება და თანხის ანაზღაურება",
      subtitle: "ჩვენი დაბრუნებისა და თანხის ანაზღაურების პირობები",
      
      section1Title: "დაბრუნების პოლიტიკა",
      section1Text: "ჩვენ გვსურს, რომ შენაძენით კმაყოფილი იყოთ. თუ მიღებული ყვავილებით კმაყოფილი არ ხართ, მიტანის მომენტიდან 24 საათის განმავლობაში შეგიძლიათ დაბრუნების ან თანხის ანაზღაურების მოთხოვნა გამოგვიგზავნოთ.",
      
      section2Title: "დაბრუნების პირობები",
      condition1: "• ყვავილები უნდა იყოს თავდაპირველ მდგომარეობაში",
      condition2: "• მიტანიდან არ უნდა იყოს გასული 24 საათზე მეტი",
      condition3: "• ყვავილებს უნდა ეტყობოდეს უხარისხობის ან დაზიანების თვალსაჩინო ნიშნები",
      condition4: "• ინდივიდუალური შეკვეთით დამზადებული თაიგულის დაბრუნება შესაძლებელია მხოლოდ დაზიანების შემთხვევაში",
      
      section3Title: "თანხის ანაზღაურების პროცესი",
      step1: "1. დაგვიკავშირდით და გამოგვიგზავნეთ ყვავილების ფოტოები",
      step2: "2. ჩვენი გუნდი განიხილავს თქვენს მოთხოვნას",
      step3: "3. დამტკიცების შემთხვევაში, სრულ თანხას აგინაზღაურებთ",
      step4: "4. თანხის ანაზღაურება დამუშავდება 3–5 სამუშაო დღის განმავლობაში",
      
      section4Title: "დასაბრუნებლად მიუღებელი შემთხვევები",
      nonReturn1: "• მიტანიდან 24 საათზე მეტხანს შენახული ყვავილები",
      nonReturn2: "• არასწორი მოვლის შედეგად დაზიანებული ყვავილები",
      nonReturn3: "• ექსტრემალური ამინდის პირობებით დაზიანებული ყვავილები",
      nonReturn4: "• აქციური ან ფასდაკლებული ნივთები (თუ დეფექტური არ არის)",
      
      section5Title: "თანხის ანაზღაურების მეთოდები",
      refundMethod1: "• თავდაპირველი გადახდის მეთოდი (საკრედიტო/სადებეტო ბარათი)",
      refundMethod2: "• ბანკის გადარიცხვა თქვენს ანგარიშზე",
      refundMethod3: "• მაღაზიის კრედიტი მომდევნო შენაძენებისთვის",
      
      section6Title: "დაგვიკავშირდით",
      contactText: "დაბრუნების ან თანხის ანაზღაურების მოთხოვნისთვის დაგვიკავშირდით:",
      phone: "ტელეფონი",
      email: "ელ-ფოსტა",
      hours: "სამუშაო საათები",
      hoursText: "ყოველდღე · 10:00–20:00",
      
      important: "მნიშვნელოვანი",
      importantText: "გთხოვთ, ყვავილები თავდაპირველ მდგომარეობაში შეინახოთ და ნებისმიერი პრობლემის აღმოჩენისთანავე ფოტოები გადაიღოთ. ეს დაგვეხმარება მოთხოვნის უფრო სწრაფად დამუშავებაში.",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="fb-info-page fb-returns-page min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <Navbar />
      <main id="main-content" className="fb-info-page__main flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="fb-info-page__header mb-12">
          <h1 className="fb-info-page__title text-4xl font-bold text-amber-900 mb-2">{t.title}</h1>
          <p className="fb-info-page__lead text-lg text-amber-700">{t.subtitle}</p>
        </div>

        <nav className="fb-info-page__nav" aria-label={language === "ka" ? "ამ გვერდზე" : "On this page"}>
          <span className="fb-info-page__nav-label">{language === "ka" ? "ამ გვერდზე" : "On this page"}</span>
          <div className="fb-info-page__nav-links">
            <a href="#returns-policy">{t.section1Title}</a>
            <a href="#returns-conditions">{t.section2Title}</a>
            <a href="#returns-process">{t.section3Title}</a>
            <a href="#returns-exceptions">{t.section4Title}</a>
            <a href="#returns-methods">{t.section5Title}</a>
            <a href="#returns-contact">{t.section6Title}</a>
          </div>
        </nav>

        {/* Main Policy */}
        <section id="returns-policy">
        <Card className="fb-info-page__card p-8 border-gold/20 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            {t.section1Title}
          </h2>
          <p className="text-gray-700 leading-relaxed">{t.section1Text}</p>
        </Card>
        </section>

        {/* Conditions */}
        <section id="returns-conditions">
        <Card className="fb-info-page__card p-8 border-gold/20 mb-8">
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
        </section>

        {/* Refund Process */}
        <section id="returns-process">
        <Card className="fb-info-page__card p-8 border-gold/20 mb-8">
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
        </section>

        {/* Non-Returnable */}
        <section id="returns-exceptions">
        <Card className="fb-info-page__card fb-info-page__card--caution p-8 border-gold/20 mb-8 bg-red-50">
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
        </section>

        {/* Refund Methods */}
        <section id="returns-methods">
        <Card className="fb-info-page__card p-8 border-gold/20 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            {t.section5Title}
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>{t.refundMethod1}</p>
            <p>{t.refundMethod2}</p>
            <p>{t.refundMethod3}</p>
          </div>
        </Card>
        </section>

        {/* Contact */}
        <section id="returns-contact">
        <Card className="fb-info-page__card fb-info-page__card--contact p-8 border-gold/20 mb-8 bg-gradient-to-r from-amber-50 to-amber-100">
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
              <p className="text-lg text-amber-900 font-bold">{language === "ka" ? siteContact.hoursKa : siteContact.hoursEn}</p>
            </div>
          </div>
        </Card>
        </section>

        {/* Important Notice */}
        <Card className="fb-info-page__card fb-info-page__card--notice p-8 border-2 border-amber-300 bg-amber-50">
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
      </main>
      <Footer />
    </div>
  );
}
