import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { contactFallback, siteContact } from "@/lib/siteConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Privacy() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: July 26, 2026",
      sections: [
        {
          title: "1. Introduction",
          paragraphs: [
            "Flower’s Boutique (\"we\", \"our\", or \"us\") operates the flowers-boutique.example website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.",
          ],
        },
        {
          title: "2. Information Collection and Use",
          paragraphs: [
            "We collect several different types of information for various purposes to provide and improve our Service to you.",
            "Types of Data Collected:",
            "• Personal Data: Name, email address, phone number, delivery address",
            "• Payment Information: Credit card details (processed securely)",
            "• Usage Data: Browser type, IP address, pages visited, time spent",
            "• Cookies: To enhance user experience and track preferences",
          ],
        },
        {
          title: "3. Use of Data",
          paragraphs: [
            "Flower’s Boutique uses the collected data for various purposes:",
            "• To provide and maintain our Service",
            "• To notify you about changes to our Service",
            "• To allow you to participate in interactive features",
            "• To provide customer support",
            "• To gather analysis or valuable information for service improvement",
            "• To monitor the usage of our Service",
            "• To detect, prevent and address technical issues",
          ],
        },
        {
          title: "4. Security of Data",
          paragraphs: [
            "The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.",
          ],
        },
        {
          title: "5. Third-Party Services",
          paragraphs: [
            "Our Service may contain links to other sites that are not operated by us. This Privacy Policy applies only to our Service. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.",
          ],
        },
        {
          title: "6. Changes to This Privacy Policy",
          paragraphs: [
            "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last Updated\" date at the top of this Privacy Policy.",
          ],
        },
        {
          title: "7. Contact Us",
          paragraphs: [
            "If you have any questions about this Privacy Policy, please contact us at:",
            `Email: ${siteContact.email || contactFallback.en}`,
            `Phone: ${siteContact.phone || contactFallback.en}`,
          ],
        },
        {
          title: "Data Protection",
          paragraphs: [
            "We comply with Georgian data protection laws and international privacy standards. Your data is encrypted and stored securely on our servers.",
          ],
        },
      ],
    },
    ka: {
      title: "კონფიდენციალურობის პოლიტიკა",
      lastUpdated: "ბოლოს განახლდა: 26 ივლისი 2026",
      sections: [
        {
          title: "1. შესავალი",
          paragraphs: [
            "Flower’s Boutique (\"ჩვენ\", \"ჩვენი\", ან \"ჩვენ\") ოპერირებს flowers-boutique.example ვებსაიტს. ეს გვერდი გაცნობებთ ჩვენს პოლიტიკას პირადი მონაცემების შეგროვების, გამოყენების და გამჟღავნების შესახებ, როდესაც იყენებთ ჩვენს სერვისს.",
          ],
        },
        {
          title: "2. ინფორმაციის შეგროვება და გამოყენება",
          paragraphs: [
            "ჩვენ ვაგროვებთ სხვადსხვა ტიპის ინფორმაციას სხვადსხვა მიზნებისთვის, რათა მოგვაწოდოთ და გავუმჯობესოთ ჩვენი სერვისი.",
            "შეგროვილი მონაცემების ტიპები:",
            "• პირადი მონაცემები: სახელი, ელ-ფოსტა, ტელეფონის ნომერი, მიტანის მისამართი",
            "• გადახდის ინფორმაცია: საკრედიტო ბარათის დეტალები (უსაფრთხოდ დამუშავებული)",
            "• გამოყენების მონაცემები: ბრაუზერის ტიპი, IP მისამართი, ვიზიტირებული გვერდები",
            "• Cookies: მომხმარებლის გამოცდილების გასაუმჯობესებლად",
          ],
        },
        {
          title: "3. მონაცემების გამოყენება",
          paragraphs: [
            "Flower’s Boutique იყენებს შეგროვილ მონაცემებს სხვადსხვა მიზნებისთვის:",
            "• ჩვენი სერვისის მოწოდება და შენარჩუნება",
            "• თქვენი შეტყობინება ჩვენი სერვისის ცვლილებების შესახებ",
            "• ინტერაქტიული ფუნქციების გამოყენების საშუალება",
            "• მომხმარებლის მხარდამჭერი სერვისის მოწოდება",
            "• ანალიზის შეგროვება ან ღირებული ინფორმაცია სერვისის გასაუმჯობესებლად",
            "• ჩვენი სერვისის გამოყენების მონიტორინგი",
            "• ტექნიკური პრობლემების აღმოჩენა, თავიდან აცილება და გადაჭრა",
          ],
        },
        {
          title: "4. მონაცემების უსაფრთხოება",
          paragraphs: [
            "თქვენი მონაცემების უსაფრთხოება ჩვენთვის მნიშვნელოვანია, მაგრამ გახსოვდეთ, რომ ინტერნეტის მეშვეობით გადაცემის ან ელექტრონული შენახვის არცერთი მეთოდი არ არის 100% უსაფრთხო.",
          ],
        },
        {
          title: "5. მესამე მხარის სერვისები",
          paragraphs: [
            "ჩვენი სერვისი შეიძლება შეიცავდეს ბმულებს სხვა საიტებზე, რომლებიც არ ოპერირებთ ჩვენ. ეს კონფიდენციალურობის პოლიტიკა ვრცელდება მხოლოდ ჩვენს სერვისზე.",
          ],
        },
        {
          title: "6. ამ კონფიდენციალურობის პოლიტიკის ცვლილებები",
          paragraphs: [
            "ჩვენ შეიძლება განვაახლოთ ჩვენი კონფიდენციალურობის პოლიტიკა დროდ დროს. ჩვენ გაცნობებთ ნებისმიერ ცვლილებას ამ გვერდზე ახალი კონფიდენციალურობის პოლიტიკის გამოქვეყნებით.",
          ],
        },
        {
          title: "7. დაკონტაქტეთ ჩვენ",
          paragraphs: [
            "თუ გაქვთ რაიმე კითხვა ამ კონფიდენციალურობის პოლიტიკის შესახებ, გთხოვთ დაგვირეკოთ:",
            `ელ-ფოსტა: ${siteContact.email || contactFallback.ka}`,
            `ტელეფონი: ${siteContact.phone || contactFallback.ka}`,
          ],
        },
        {
          title: "მონაცემების დაცვა",
          paragraphs: [
            "ჩვენ ვიცავთ ქართული მონაცემების დაცვის კანონებს და საერთაშორისო კონფიდენციალურობის სტანდარტებს. თქვენი მონაცემები დაშიფრულია და უსაფრთხოდ ინახება ჩვენს სერვერებზე.",
          ],
        },
      ],
    },
  };

  const currentContent = language === "ka" ? content.ka : content.en;

  return (
    <div className="fb-secondary-page p2-legal-page min-h-screen">
      <Navbar />
      <main className="fb-legal-page px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={handleBack}
            className="rounded-full px-6 py-2 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/20 transition-all w-full sm:w-auto"
          >
            ← {language === "ka" ? "უკან" : "Back"}
          </Button>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-light text-[#1C1917] mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {currentContent.title}
        </h1>
        <p className="text-[#666] mb-8">{currentContent.lastUpdated}</p>

        {currentContent.sections.map((section, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2
              className="text-2xl font-semibold text-[#1C1917] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-[#333] mb-3 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
      </main>
      <Footer />
    </div>
  );
}
