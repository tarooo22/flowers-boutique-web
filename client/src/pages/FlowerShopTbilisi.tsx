import { useEffect } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, Phone, Clock, Award } from "lucide-react";
import { contactFallback, siteContact } from "@/lib/siteConfig";

export default function FlowerShopTbilisi() {
  const { language } = useLanguage();

  useSEO({
    titleKa: "ყვავილების მაღაზია თბილისში | Flower’s Boutique",
    titleEn: "Flower Shop Tbilisi | Flower’s Boutique",
    descriptionKa:
      "Flower’s Boutique არის ყვავილების მაღაზია თბილისში, სადაც დაგხვდებათ ახალი ყვავილები, ვარდები, ლილიები, სპრეი ვარდები და ინდივიდუალური თაიგულები.",
    descriptionEn:
      "Flower’s Boutique is a flower shop in Tbilisi with fresh flowers, roses, lilies, spray roses and custom bouquets.",
    canonical: "/flower-shop-tbilisi",
    lang: language as "ka" | "en",
  });

  const { data: products } = trpc.products.list.useQuery();

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Flower’s Boutique",
      image: new URL("/brand/flowers-boutique-logo.png", window.location.origin)
        .href,
      description:
        language === "ka"
          ? "ყვავილების მაღაზია თბილისში"
          : "Flower shop in Tbilisi",
      address: {
        "@type": "PostalAddress",
        streetAddress: siteContact.address || undefined,
        addressLocality: "თბილისი",
        addressCountry: "GE",
      },
      telephone: siteContact.phone || undefined,
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
      priceRange: "₾",
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [language]);

  return (
    <div className="fb-seo-page min-h-screen bg-white">
      <Navbar />

      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              {language === "ka" ? "მთავარი" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {language === "ka" ? "ყვავილების მაღაზია" : "Flower Shop"}
            </span>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-[#A16207]/10 to-[#EC4899]/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === "ka"
              ? "ყვავილების მაღაზია თბილისში"
              : "Flower Shop in Tbilisi"}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {language === "ka"
              ? "Flower’s Boutique - თბილისის ყვავილების მაღაზია, სადაც ყოველი ყვავილი არის ხელოვნების ნიმუში. ახალი მოსავლი, დახვეწილი დიზაინი, საიმედო მიტანა."
              : "Flower’s Boutique - Tbilisi flower shop where every flower is a masterpiece. Fresh harvest, elegant design, reliable delivery."}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {language === "ka" ? "ჩვენ შესახებ" : "About Us"}
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {language === "ka"
                  ? "Flower’s Boutique არის თბილისის წამყვანი ყვავილების მაღაზია, რომელიც 10 წელზე მეტი ხნის განმავლობაში ემსახურება ჩვენი კლიენტებს. ჩვენ გთავაზობთ მხოლოდ ყველაზე ახალ და ხარისხიან ყვავილებს."
                  : "Flower’s Boutique is Tbilisi's leading flower shop serving customers for over 10 years. We offer only the freshest and highest quality flowers."}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {language === "ka"
                  ? "ჩვენი ოსტატი ფლორისტები ყოველი თაიგული ხელით ქმნიან, დიზაინის თითოეული დეტალი ფრთხილად აირჩევენ. ჩვენ გვიჯერა, რომ ყვავილები არის ემოციის გამოხატვის ენა."
                  : "Our master florists hand-craft each bouquet, carefully selecting every design detail. We believe flowers are the language of emotion."}
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <Award className="w-8 h-8 text-[#A16207] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">
                    {language === "ka" ? "ხარისხი" : "Quality"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === "ka"
                      ? "მხოლოდ ახალი ყვავილები"
                      : "Only fresh flowers"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-[#A16207] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">
                    {language === "ka" ? "მიტანა თბილისში" : "Delivery in Tbilisi"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === "ka"
                      ? "დეტალები დასტურდება შეკვეთის მიხედვით"
                      : "Details confirmed with your order"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <MapPin className="w-8 h-8 text-[#A16207] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">
                    {language === "ka" ? "ადგილმდებარეობა" : "Location"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {siteContact.address ||
                      (language === "ka"
                        ? "თბილისი · მისამართი შეკვეთისას"
                        : "Tbilisi · address on request")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <Phone className="w-8 h-8 text-[#A16207] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">
                    {language === "ka" ? "დაკავშირება" : "Contact"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {siteContact.phone ||
                      (language === "ka"
                        ? contactFallback.ka
                        : contactFallback.en)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              {language === "ka" ? "ჩვენი კოლექცია" : "Our Collection"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {products?.slice(0, 3).map((product: any) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <a className="group">
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-64">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={
                            language === "ka" ? product.nameKa : product.nameEn
                          }
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      {language === "ka" ? product.nameKa : product.nameEn}
                    </h3>
                    <p className="text-[#A16207] font-bold">
                      ₾{product.priceMin}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#A16207] to-[#EC4899] rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === "ka" ? "ეწვიეთ ჩვენს მაღაზიას" : "Visit Our Shop"}
            </h2>
            <p className="mb-6 text-lg">
              {siteContact.address ||
                (language === "ka"
                  ? "თბილისი · ზუსტი მისამართი შეკვეთისას"
                  : "Tbilisi · exact address on request")}
            </p>
            <p className="mb-6">10:00 - 20:00 | ყოველდღე</p>
            <Link href="/catalog">
              <Button className="bg-white text-[#A16207] hover:bg-gray-100 px-8 py-3 font-bold">
                {language === "ka" ? "კატალოგი" : "Catalog"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
