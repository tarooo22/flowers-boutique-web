import { useEffect } from 'react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronRight, Truck, Clock, Sparkles, Heart } from 'lucide-react';

export default function FlowerDeliveryTbilisi() {
  const { language, t } = useLanguage();

  useSEO({
    titleKa: 'ყვავილების მიტანა თბილისში | Flower’s Boutique',
    titleEn: 'Flower Delivery Tbilisi | Flower’s Boutique',
    descriptionKa: 'შეუკვეთეთ ახალი ყვავილები და თაიგულები თბილისში. Flower’s Boutique გთავაზობთ დახვეწილ კომპოზიციებს, მარტივ შეკვეთას და ყვავილების მიტანას თბილისში.',
    descriptionEn: 'Order fresh flowers and bouquets in Tbilisi. Flower’s Boutique offers elegant compositions, easy ordering and flower delivery in Tbilisi.',
    canonical: '/flower-delivery-tbilisi',
    lang: language as 'ka' | 'en',
  });

  const { data: products } = trpc.products.list.useQuery();

  useEffect(() => {
    // Add FAQPage JSON-LD
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რამდენი ხანი სჭირდება ყვავილების მიტანა?' : 'How long does flower delivery take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'Flower’s Boutique გთავაზობთ მიტანას თბილისში 2 საათში.' : 'Flower’s Boutique offers delivery in Tbilisi within 2 hours.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რა ღირს ყვავილების მიტანა?' : 'What is the cost of flower delivery?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'მიტანა თბილისში უფასოა 50 ლარი და მეტი შეკვეთის დროს.' : 'Delivery in Tbilisi is free for orders over 50 GEL.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'შემიძლია თუ არა ყვავილების შეკვეთა ღამით?' : 'Can I order flowers at night?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'დიახ, შეკვეთა შეგიძლიათ ნებისმიერ დროს WhatsApp ან Messenger-ით.' : 'Yes, you can order anytime via WhatsApp or Messenger.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რა ტიპის ყვავილები გაქვთ?' : 'What types of flowers do you have?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'გაქვთ ვარდები, ლილიები, სპრეი ვარდები, ღერო ყვავილები და ბევრი სხვა.' : 'We have roses, lilies, spray roses, stem flowers and many more.',
          },
        },
      ],
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [language]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/">
              <a className="hover:text-gray-900">{language === 'ka' ? 'მთავარი' : 'Home'}</a>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {language === 'ka' ? 'ყვავილების მიტანა' : 'Flower Delivery'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#A16207]/10 to-[#EC4899]/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'ka' ? 'ყვავილების მიტანა თბილისში' : 'Flower Delivery in Tbilisi'}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {language === 'ka'
              ? 'Flower’s Boutique გთავაზობთ სწრაფ, საიმედო ყვავილების მიტანას თბილისის ნებისმიერ კუთხეში. ახალი ყვავილები, დახვეწილი თაიგულები და პირადი მიდგომა.'
              : 'Flower’s Boutique offers fast, reliable flower delivery to any part of Tbilisi. Fresh flowers, elegant bouquets and personal approach.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex gap-4">
              <Truck className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'სწრაფი მიტანა' : 'Fast Delivery'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'მიტანა თბილისში 2 საათში. შეუკვეთეთ დღეს, მიიღეთ დღეს.'
                    : 'Delivery in Tbilisi within 2 hours. Order today, receive today.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Sparkles className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ახალი ყვავილები' : 'Fresh Flowers'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'ყოველი დღე ახალი მოსავლი. ხარისხი და ელეგანცია გარანტირებული.'
                    : 'Fresh harvest every day. Quality and elegance guaranteed.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Heart className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ინდივიდუალური დიზაინი' : 'Custom Design'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'თითოეული თაიგული დიზაინერის მიერ ხელით შედგენილი.'
                    : 'Each bouquet is hand-crafted by our designer.'}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              {language === 'ka' ? 'პოპულარული თაიგულები' : 'Popular Bouquets'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {products?.slice(0, 3).map((product: any) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <a className="group">
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-64">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={language === 'ka' ? product.nameKa : product.nameEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      {language === 'ka' ? product.nameKa : product.nameEn}
                    </h3>
                    <p className="text-[#A16207] font-bold">
                      ₾{product.priceMin}
                      {product.priceMax && product.priceMax !== product.priceMin && `–${product.priceMax}`}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#A16207] to-[#EC4899] rounded-lg p-8 text-white text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ka' ? 'მზად ხართ შეკვეთისთვის?' : 'Ready to order?'}
            </h2>
            <p className="mb-6 text-lg">
              {language === 'ka'
                ? 'შეხვიდით ჩვენი კატალოგში და აირჩიეთ თქვენი საყვარელი თაიგული.'
                : 'Browse our catalog and choose your favorite bouquet.'}
            </p>
            <Link href="/catalog">
              <Button className="bg-white text-[#A16207] hover:bg-gray-100 px-8 py-3 font-bold">
                {language === 'ka' ? 'კატალოგი' : 'Catalog'}
              </Button>
            </Link>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              {language === 'ka' ? 'ხშირად დასმული კითხვები' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რამდენი ხანი სჭირდება ყვავილების მიტანა?' : 'How long does flower delivery take?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'Flower’s Boutique გთავაზობთ მიტანას თბილისში 2 საათში. შეკვეთის შემდეგ, ჩვენი მიმტანი მოვა თქვენთან.'
                    : 'Flower’s Boutique offers delivery in Tbilisi within 2 hours. After ordering, our courier will come to you.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რა ღირს ყვავილების მიტანა?' : 'What is the cost of flower delivery?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'მიტანა თბილისში უფასოა 50 ლარი და მეტი შეკვეთის დროს. ნაკლები თანხის შეკვეთის დროს მიტანა 5 ლარი.'
                    : 'Delivery in Tbilisi is free for orders over 50 GEL. For smaller orders, delivery is 5 GEL.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'შემიძლია თუ არა ყვავილების შეკვეთა ღამით?' : 'Can I order flowers at night?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დიახ, შეკვეთა შეგიძლიათ ნებისმიერ დროს WhatsApp ან Messenger-ით. ჩვენი გუნდი ყოველდღე 10:00-დან 20:00 მდე მუშაობს.'
                    : 'Yes, you can order anytime via WhatsApp or Messenger. Our team works daily from 10:00 to 20:00.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რა ტიპის ყვავილები გაქვთ?' : 'What types of flowers do you have?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'გაქვთ ვარდები, ლილიები, სპრეი ვარდები, ღერო ყვავილები, ღიორდი, ფიქუსი და ბევრი სხვა. ყოველი თაიგული ინდივიდუალურად შედგენილი.'
                    : 'We have roses, lilies, spray roses, stem flowers, orchids, ficus and many more. Each bouquet is individually crafted.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">
            {language === 'ka' ? 'დაკავშირებული გვერდები' : 'Related Pages'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/flower-shop-tbilisi">
              <a className="p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ყვავილების მაღაზია' : 'Flower Shop'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'ka' ? 'ჩვენი მაღაზიის შესახებ' : 'About our shop'}
                </p>
                <span className="text-[#A16207] font-bold flex items-center gap-2">
                  {language === 'ka' ? 'წაიკითხეთ' : 'Read more'} <ChevronRight className="w-4 h-4" />
                </span>
              </a>
            </Link>
            <Link href="/rose-bouquets">
              <a className="p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ვარდების თაიგულები' : 'Rose Bouquets'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'ka' ? 'ელეგანტური ვარდების კოლექცია' : 'Elegant rose collection'}
                </p>
                <span className="text-[#A16207] font-bold flex items-center gap-2">
                  {language === 'ka' ? 'წაიკითხეთ' : 'Read more'} <ChevronRight className="w-4 h-4" />
                </span>
              </a>
            </Link>
            <Link href="/catalog">
              <a className="p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'სრული კატალოგი' : 'Full Catalog'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'ka' ? 'ყველა პროდუქტი' : 'All products'}
                </p>
                <span className="text-[#A16207] font-bold flex items-center gap-2">
                  {language === 'ka' ? 'წაიკითხეთ' : 'Read more'} <ChevronRight className="w-4 h-4" />
                </span>
              </a>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
