import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { contactFallback, siteContact } from "@/lib/siteConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Terms() {
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
      title: "Terms and Conditions",
      lastUpdated: "Last updated: July 26, 2026",
      sections: [
        {
          title: "1. General Terms",
          paragraphs: [
            "Flower’s Boutique is a flower delivery service that allows users to browse, select, and order flower arrangements and related products for delivery.",
            "By placing an order through Flower’s Boutique, via WhatsApp, Messenger, or other communication channels, the user agrees to these terms and conditions.",
            "All products displayed on the platform are subject to availability, and Flower’s Boutique reserves the right to substitute products of equal or greater value if necessary.",
            "Flower’s Boutique reserves the right to modify or discontinue any aspect of the service or these terms at any time without prior notice.",
          ],
        },
        {
          title: "2. Contact Information",
          paragraphs: [
            "Company: Flower’s Boutique / FLOWERS BOUTIQUE.GE",
            "Website: https://flowers-boutique.example",
            `Email: ${siteContact.email || contactFallback.en}`,
            `Phone / WhatsApp: ${siteContact.phone || contactFallback.en}`,
            `Address: ${siteContact.address || "Tbilisi, Georgia — exact address available when ordering"}`,
            "Working hours: Every day 10:00 – 20:00",
            "Bank details: Individual Entrepreneur / Flower’s Boutique",
            "Registration details: available on request",
          ],
        },
        {
          title: "3. Order Placement",
          paragraphs: [
            "3.1. The user can place an order by selecting the desired products and providing the necessary information:",
            "- Name and surname",
            "- Phone number",
            "- Email address",
            "- Recipient's name and surname",
            "- Recipient's phone number",
            "- Delivery address",
            "- Delivery date and time",
            "- Gift message (optional)",
            "3.2. After placing an order, the user will receive a confirmation message via the specified communication channel (WhatsApp, Messenger, or Email).",
            "3.3. The order is considered confirmed only after payment is successfully processed.",
          ],
        },
        {
          title: "4. Payment",
          paragraphs: [
            "4.1. Payment can be made through the following methods:",
            "- Online payment by card (Bank of Georgia)",
            "- Bank transfer",
            "- Cash on delivery (only for specific areas and by prior agreement)",
            "4.2. All prices are in Georgian Lari (GEL) and include VAT where applicable.",
            "4.3. Flower’s Boutique reserves the right to change product prices at any time without prior notice.",
          ],
        },
        {
          title: "5. Delivery Terms",
          paragraphs: [
            "5.1. Delivery is available within Tbilisi and its surrounding areas. Delivery to other regions of Georgia may be possible by prior arrangement and may incur additional charges.",
            "5.2. Delivery times are specified during the order placement process. Flower’s Boutique strives to deliver orders within the agreed timeframe but is not responsible for delays caused by unforeseen circumstances (e.g., traffic, weather conditions, force majeure).",
            "5.3. The recipient must be available at the specified address during the delivery window. If the recipient is unavailable, Flower’s Boutique will attempt to contact the customer to arrange an alternative delivery. Additional charges may apply for re-delivery.",
            "5.4. For deliveries to hospitals, hotels, or other public institutions, the customer must provide complete and accurate information to ensure successful delivery. Flower’s Boutique is not responsible for orders that cannot be delivered due to insufficient information or restrictions at the delivery location.",
            "5.5. Upon delivery, the recipient (or an authorized person) must inspect the order for any damage or discrepancies and sign the delivery confirmation. Any complaints regarding damaged or incorrect products must be reported immediately upon receipt.",
            "5.6. If delivery is delayed due to unforeseen circumstances, Flower’s Boutique will inform the customer as soon as possible and offer alternative solutions.",
            "5.7. If the recipient refuses to accept the order without a valid reason, Flower’s Boutique reserves the right to charge for the product and delivery costs.",
            "5.8. Flower’s Boutique is not responsible for orders that cannot be delivered due to incorrect or incomplete address information provided by the customer.",
            "5.9. During holidays and peak seasons, delivery times may be extended. Customers will be informed of any potential delays during the order placement process.",
          ],
        },
        {
          title: "6. Return and Refund Policy",
          paragraphs: [
            "6.1. Due to the perishable nature of flowers, returns are generally not accepted unless the product is damaged or incorrect upon delivery.",
            "6.2. If a product is damaged or incorrect, the customer must notify Flower’s Boutique within 24 hours of delivery, providing photographic evidence of the issue.",
            "6.3. Flower’s Boutique will review the complaint and, if validated, offer a replacement, store credit, or a full refund. Refunds will be processed within 5-7 business days to the original payment method.",
            "6.4. Cancellations are accepted up to 24 hours before the scheduled delivery time. Cancellations made less than 24 hours before delivery may incur a cancellation fee or may not be eligible for a full refund.",
            "6.5. Flower’s Boutique is not responsible for products that deteriorate due to improper care after delivery.",
          ],
        },
        {
          title: "7. Privacy Policy",
          paragraphs: [
            "7.1. Flower’s Boutique is committed to protecting the privacy of its customers. All personal information collected during the order process is used solely for order fulfillment, delivery, and customer service purposes.",
            "7.2. Flower’s Boutique does not share or sell customer information to third parties, except as required by law or to facilitate payment processing and delivery services.",
            "7.3. For more details, please refer to our full Privacy Policy.",
          ],
        },
        {
          title: "8. Dispute Resolution",
          paragraphs: [
            "8.1. Any disputes arising from the use of Flower’s Boutique's services will be resolved through negotiation. If an agreement cannot be reached, disputes will be settled in accordance with the laws of Georgia.",
          ],
        },
        {
          title: "9. Marketing Communications",
          paragraphs: [
            "9.1. Flower’s Boutique may send marketing communications to customers who have opted in to receive them. Customers can unsubscribe from marketing communications at any time.",
          ],
        },
        {
          title: "10. Intellectual Property",
          paragraphs: [
            "10.1. All content on the Flower’s Boutique website, including text, images, logos, and designs, is the property of Flower’s Boutique or its licensors and is protected by copyright and other intellectual property laws.",
            "10.2. Users may not reproduce, distribute, modify, or create derivative works of any content from the Flower’s Boutique website without prior written consent.",
          ],
        },
        {
          title: "11. Limitation of Liability",
          paragraphs: [
            "11.1. Flower’s Boutique is not liable for any direct, indirect, incidental, special, or consequential damages arising from the use or inability to use its services, including but not limited to damages for loss of profits, data, or other intangible losses.",
            "11.2. Flower’s Boutique's total liability for any claims arising from these terms and conditions shall not exceed the amount paid by the customer for the services in question.",
          ],
        },
        {
          title: "12. Governing Law",
          paragraphs: [
            "12.1. These terms and conditions are governed by and construed in accordance with the laws of Georgia.",
          ],
        },
      ],
    },
    ka: {
      title: "წესები და პირობები",
      lastUpdated: "ბოლოს განახლდა: 26 ივლისი 2026",
      sections: [
        {
          title: "1. ზოგადი დებულებები",
          paragraphs: [
            "1.1. Flower’s Boutique არის ყვავილების მიტანის სერვისი, რომელიც მომხმარებლებს საშუალებას აძლევს დაათვალიერონ, შეარჩიონ და შეუკვეთონ ყვავილების კომპოზიციები და მასთან დაკავშირებული პროდუქტები მიტანისთვის.",
            "1.2. Flower’s Boutique-ის მეშვეობით, WhatsApp-ის, Messenger-ის ან სხვა საკომუნიკაციო არხებით შეკვეთის განთავსებით, მომხმარებელი ეთანხმება წინამდებარე წესებსა და პირობებს.",
            "1.3. პლატფორმაზე ნაჩვენები ყველა პროდუქტი ხელმისაწვდომობის მიხედვით არის დაქვემდებარებული და Flower’s Boutique იტოვებს უფლებას, საჭიროების შემთხვევაში შეცვალოს პროდუქტები თანაბარი ან უფრო მაღალი ღირებულების პროდუქტებით.",
            "1.4. Flower’s Boutique იტოვებს უფლებას, ნებისმიერ დროს შეცვალოს ან შეწყვიტოს სერვისის ნებისმიერი ასპექტი ან წინამდებარე პირობები წინასწარი შეტყობინების გარეშე.",
          ],
        },
        {
          title: "2. საკონტაქტო ინფორმაცია",
          paragraphs: [
            "კომპანია: Flower’s Boutique / FLOWERS BOUTIQUE.GE",
            "ვებგვერდი: https://flowers-boutique.example",
            `ელ. ფოსტა: ${siteContact.email || contactFallback.ka}`,
            `ტელეფონი / WhatsApp: ${siteContact.phone || contactFallback.ka}`,
            `მისამართი: ${siteContact.address || "თბილისი — ზუსტი მისამართი ხელმისაწვდომია შეკვეთისას"}`,
            "სამუშაო საათები: ყოველდღე 10:00 – 20:00",
            "ბანკის დეტალები: ინდივიდუალური მეწარმე / Flower’s Boutique",
            "რეგისტრაციის დეტალები: ხელმისაწვდომია მოთხოვნისას",
          ],
        },
        {
          title: "3. შეკვეთის განთავსება",
          paragraphs: [
            "3.1. მომხმარებელს შეუძლია შეკვეთის განთავსება სასურველი პროდუქტების არჩევით და საჭირო ინფორმაციის მიწოდებით:",
            "- სახელი და გვარი",
            "- ტელეფონის ნომერი",
            "- ელ. ფოსტის მისამართი",
            "- მიმღების სახელი და გვარი",
            "- მიმღების ტელეფონის ნომერი",
            "- მიტანის მისამართი",
            "- მიტანის თარიღი და დრო",
            "- სასაჩუქრე შეტყობინება (სურვილისამებრ)",
            "3.2. შეკვეთის განთავსების შემდეგ, მომხმარებელი მიიღებს დადასტურების შეტყობინებას მითითებული საკომუნიკაციო არხით (WhatsApp, Messenger ან ელ. ფოსტა).",
            "3.3. შეკვეთა დადასტურებულად ითვლება მხოლოდ გადახდის წარმატებით დამუშავების შემდეგ.",
          ],
        },
        {
          title: "4. გადახდა",
          paragraphs: [
            "4.1. გადახდა შესაძლებელია შემდეგი მეთოდებით:",
            "- ონლაინ გადახდა ბარათით (საქართველოს ბანკი)",
            "- საბანკო გადარიცხვა",
            "- ნაღდი ანგარიშსწორება მიტანისას (მხოლოდ კონკრეტულ ზონებში და წინასწარი შეთანხმებით)",
            "4.2. ყველა ფასი მითითებულია საქართველოს ლარში (GEL) და მოიცავს დღგ-ს, სადაც ეს შესაძლებელია.",
            "4.3. Flower’s Boutique იტოვებს უფლებას, ნებისმიერ დროს შეცვალოს პროდუქციის ფასები წინასწარი შეტყობინების გარეშე.",
          ],
        },
        {
          title: "5. მიტანის პირობები",
          paragraphs: [
            "5.1. მიტანა ხელმისაწვდომია თბილისის და მიმდებარე ტერიტორიებზე. საქართველოს სხვა რეგიონებში მიტანა შესაძლებელია წინასწარი შეთანხმებით და შეიძლება მოიცავდეს დამატებით გადასახადებს.",
            "5.2. მიტანის დრო მითითებულია შეკვეთის განთავსების პროცესში. Flower’s Boutique ცდილობს შეკვეთების მიწოდებას შეთანხმებულ ვადებში, მაგრამ არ არის პასუხისმგებელი გაუთვალისწინებელი გარემოებებით (მაგ. საცობები, ამინდის პირობები, ფორსმაჟორი) გამოწვეულ შეფერხებებზე.",
            "5.3. მიმღები ხელმისაწვდომი უნდა იყოს მითითებულ მისამართზე მიტანის დროს. თუ მიმღები არ არის ხელმისაწვდომი, Flower’s Boutique შეეცდება დაუკავშირდეს მომხმარებელს ალტერნატიული მიტანის მოსაწყობად. ხელახალი მიტანისთვის შეიძლება დაწესდეს დამატებითი გადასახადი.",
            "5.4. საავადმყოფოებში, სასტუმროებში ან სხვა საჯარო დაწესებულებებში მიტანისთვის, მომხმარებელმა უნდა მიაწოდოს სრული და ზუსტი ინფორმაცია წარმატებული მიტანის უზრუნველსაყოფად. Flower’s Boutique არ არის პასუხისმგებელი შეკვეთებზე, რომელთა მიტანა შეუძლებელია არასაკმარისი ინფორმაციის ან მიტანის ადგილზე არსებული შეზღუდვების გამო.",
            "5.5. მიტანისას, მიმღებმა (ან უფლებამოსილმა პირმა) უნდა შეამოწმოს შეკვეთა რაიმე დაზიანების ან შეუსაბამობისთვის და ხელი მოაწეროს მიტანის დადასტურებას. დაზიანებულ ან არასწორ პროდუქტებთან დაკავშირებული პრეტენზიები დაუყოვნებლივ უნდა ეცნობოს Flower’s Boutique-ს მიღებიდან 24 საათის განმავლობაში.",
            "5.6. თუ მიტანა შეფერხდა გაუთვალისწინებელი გარემოებების გამო, Flower’s Boutique აცნობებს მომხმარებელს რაც შეიძლება მალე და შესთავაზებს ალტერნატიულ გადაწყვეტილებებს.",
            "5.7. თუ მიმღები უარს იტყვის შეკვეთის მიღებაზე საფუძვლიანი მიზეზის გარეშე, Flower’s Boutique იტოვებს უფლებას დააკისროს პროდუქტის და მიტანის ხარჯები.",
            "5.8. Flower’s Boutique არ არის პასუხისმგებელი შეკვეთებზე, რომელთა მიტანა შეუძლებელია მომხმარებლის მიერ მოწოდებული არასწორი ან არასრული მისამართის ინფორმაციის გამო.",
            "5.9. დღესასწაულების და პიკის სეზონების დროს, მიტანის დრო შეიძლება გაიზარდოს. მომხმარებლები ინფორმირებული იქნებიან ნებისმიერი პოტენციური შეფერხების შესახებ შეკვეთის განთავსების პროცესში.",
          ],
        },
        {
          title: "6. დაბრუნების და თანხის დაბრუნების პოლიტიკა",
          paragraphs: [
            "6.1. ყვავილების მალფუჭებადი ბუნების გამო, დაბრუნება, როგორც წესი, არ მიიღება, გარდა იმ შემთხვევისა, როდესაც პროდუქტი დაზიანებულია ან არასწორია მიტანისას.",
            "6.2. თუ პროდუქტი დაზიანებულია ან არასწორია, მომხმარებელმა უნდა აცნობოს Flower’s Boutique-ს მიღებიდან 24 საათის განმავლობაში, პრობლემის ფოტო მტკიცებულების მიწოდებით.",
            "6.3. Flower’s Boutique განიხილავს საჩივარს და, თუ დადასტურდება, შესთავაზებს ჩანაცვლებას, მაღაზიის კრედიტს ან სრულ თანხის დაბრუნებას. თანხის დაბრუნება დამუშავდება 5-7 სამუშაო დღის განმავლობაში გადახდის თავდაპირველ მეთოდზე.",
            "6.4. შეკვეთის გაუქმება მიიღება მიტანის დაგეგმილ დრომდე 24 საათით ადრე. მიტანამდე 24 საათზე ნაკლებ დროში გაუქმებამ შეიძლება გამოიწვიოს გაუქმების საფასური ან არ იყოს სრულად დასაბრუნებელი.",
            "6.5. Flower’s Boutique არ არის პასუხისმგებელი პროდუქტებზე, რომლებიც ფუჭდება მიტანის შემდეგ არასათანადო მოვლის გამო.",
          ],
        },
        {
          title: "7. კონფიდენციალურობის პოლიტიკა",
          paragraphs: [
            "7.1. Flower’s Boutique მოწოდებულია დაიცვას მომხმარებლების კონფიდენციალურობა. შეკვეთის პროცესში შეგროვებული ყველა პირადი ინფორმაცია გამოიყენება მხოლოდ შეკვეთის შესრულების, მიტანის და მომხმარებლის მომსახურების მიზნებისთვის.",
            "7.2. Flower’s Boutique არ უზიარებს და არ ყიდის მომხმარებლის ინფორმაციას მესამე პირებს, გარდა კანონით მოთხოვნილი შემთხვევებისა ან გადახდის დამუშავებისა და მიტანის სერვისების გასაადვილებლად.",
            "7.3. დამატებითი დეტალებისთვის, გთხოვთ, იხილოთ ჩვენი სრული კონფიდენციალურობის პოლიტიკა.",
          ],
        },
        {
          title: "8. დავების გადაწყვეტა",
          paragraphs: [
            "8.1. Flower’s Boutique-ის სერვისების გამოყენებიდან გამომდინარე ნებისმიერი დავა გადაწყდება მოლაპარაკების გზით. თუ შეთანხმება ვერ მოხერხდება, დავები გადაწყდება საქართველოს კანონმდებლობის შესაბამისად.",
          ],
        },
        {
          title: "9. მარკეტინგული კომუნიკაციები",
          paragraphs: [
            "9.1. Flower’s Boutique-ს შეუძლია გაუგზავნოს მარკეტინგული შეტყობინებები მომხმარებლებს, რომლებმაც თანხმობა განაცხადეს მათ მიღებაზე. მომხმარებლებს შეუძლიათ ნებისმიერ დროს გააუქმონ მარკეტინგული შეტყობინებების გამოწერა.",
          ],
        },
        {
          title: "10. ინტელექტუალური საკუთრება",
          paragraphs: [
            "10.1. Flower’s Boutique-ის ვებსაიტზე არსებული ყველა კონტენტი, მათ შორის ტექსტი, სურათები, ლოგოები და დიზაინი, არის Flower’s Boutique-ის ან მისი ლიცენზიანტების საკუთრება და დაცულია საავტორო უფლებებით და სხვა ინტელექტუალური საკუთრების კანონებით.",
            "10.2. მომხმარებლებს არ შეუძლიათ Flower’s Boutique-ის ვებსაიტიდან რაიმე კონტენტის რეპროდუცირება, გავრცელება, მოდიფიცირება ან წარმოებული ნამუშევრების შექმნა წინასწარი წერილობითი თანხმობის გარეშე.",
          ],
        },
        {
          title: "11. პასუხისმგებლობის შეზღუდვა",
          paragraphs: [
            "11.1. Flower’s Boutique არ არის პასუხისმგებელი რაიმე პირდაპირ, არაპირდაპირ, შემთხვევით, სპეციალურ ან თანმდევ ზიანზე, რომელიც გამოწვეულია მისი სერვისების გამოყენებით ან გამოყენების შეუძლებლობით, მათ შორის, მაგრამ არ შემოიფარგლება მოგების, მონაცემების ან სხვა არამატერიალური ზარალის გამო.",
            "11.2. Flower’s Boutique-ის საერთო პასუხისმგებლობა წინამდებარე წესებიდან და პირობებიდან გამომდინარე ნებისმიერი პრეტენზიისთვის არ უნდა აღემატებოდეს მომხმარებლის მიერ მოცემული სერვისებისთვის გადახდილ თანხას.",
          ],
        },
        {
          title: "12. მოქმედი სამართალი",
          paragraphs: [
            "12.1. წინამდებარე წესები და პირობები რეგულირდება და განიმარტება საქართველოს კანონმდებლობის შესაბამისად.",
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
