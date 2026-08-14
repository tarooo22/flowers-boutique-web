import { useEffect } from 'react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronRight, Gift, Cake, Smile } from 'lucide-react';

export default function BirthdayFlowers() {
  const { language } = useLanguage();

  useSEO({
    titleKa: 'დაბადების დღის ყვავილები თბილისში | Flower’s Boutique',
    titleEn: 'Birthday Flowers Tbilisi | Flower’s Boutique',
    descriptionKa: 'დაბადების დღის ყვავილები თბილისში. Flower’s Boutique გთავაზობთ ხელოვნურ თაიგულებს დაბადების დღის აღსანიშნავად და მიტანას თბილისის მასშტაბით.',
    descriptionEn: 'Birthday flowers in Tbilisi. Flower’s Boutique offers artistic bouquets for birthday celebration and delivery across Tbilisi.',
    canonical: '/birthday-flowers',
    lang: language as 'ka' | 'en',
  });

  const { data: products } = trpc.products.list.useQuery();

  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რა ყვავილები კარგია დაბადების დღისთვის?' : 'What flowers are good for birthday?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'დაბადების დღისთვის კარგია წითელი ვარდები, სპრეი ვარდები, ლილიები, ღიორდი. ნებისმიერი ფერი შესაფერი.' : 'Good for birthday are red roses, spray roses, lilies, orchids. Any color is suitable.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რამდენი ხანი ჯდება დაბადების დღის თაიგული?' : 'How long does birthday bouquet last?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'დაბადების დღის თაიგული ძლებს 7-14 დღე, დამოკიდებულია ყვავილების ტიპზე.' : 'Birthday bouquet lasts 7-14 days, depending on flower type.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'შემიძლია თუ არა დაბადების დღის თაიგული შეკვეთა დღეს?' : 'Can I order birthday bouquet today?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'შეკვეთის შესაძლებლობა და მიწოდების ზუსტი დრო დასტურდება შეკვეთის დეტალების მიხედვით.' : 'Order availability and the exact delivery time are confirmed according to your order details.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რა ღირს დაბადების დღის თაიგული?' : 'How much does birthday bouquet cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'დაბადების დღის თაიგულის ფასი დამოკიდებულია დიზაინზე. დაწყებული 50 ლარიდან 500 ლარამდე.' : 'Birthday bouquet price depends on design. Starting from 50 GEL to 500 GEL.',
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
    <div className="fb-seo-page min-h-screen bg-white">
      <Navbar />

      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/"><a className="hover:text-gray-900">{language === 'ka' ? 'მთავარი' : 'Home'}</a></Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{language === 'ka' ? 'დაბადების დღის ყვავილები' : 'Birthday Flowers'}</span>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-[#A16207]/10 to-[#EC4899]/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'ka' ? 'დაბადების დღის ყვავილები თბილისში' : 'Birthday Flowers in Tbilisi'}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {language === 'ka'
              ? 'დაბადების დღის აღსანიშნავად შეუკვეთეთ ხელოვნური თაიგული. Flower’s Boutique გთავაზობთ სპეციალურ დიზაინებს დაბადების დღის აღსანიშნავად.'
              : 'Celebrate birthday with artistic bouquet. Flower’s Boutique offers special designs for birthday celebration.'}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex gap-4">
              <Gift className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'სპეციალური დიზაინი' : 'Special Design'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დაბადების დღის თაიგული დიზაინერის მიერ სპეციალურად შედგენილი. უნიკალური და ხელოვნური.'
                    : 'Birthday bouquet specially designed by our designer. Unique and artistic.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Cake className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'მიტანა თბილისში' : 'Delivery in Tbilisi'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'მიტანა ხელმისაწვდომია თბილისის მასშტაბით; დეტალები დასტურდება შეკვეთის მიხედვით.'
                    : 'Delivery is available across Tbilisi; details are confirmed with your order.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Smile className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ხელმისაწვდომი ფასი' : 'Affordable Price'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დაბადების დღის თაიგული ხელმისაწვდომი ფასით. დაწყებული 50 ლარიდან.'
                    : 'Birthday bouquet at affordable price. Starting from 50 GEL.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              {language === 'ka' ? 'დაბადების დღის თაიგულები' : 'Birthday Bouquets'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {products?.slice(0, 3).map((product: any) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <a className="group">
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-64">
                      {product.imageUrl && (
                        <img src={product.imageUrl} alt={language === 'ka' ? product.nameKa : product.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{language === 'ka' ? product.nameKa : product.nameEn}</h3>
                    <p className="text-[#A16207] font-bold">₾{product.priceMin}</p>
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#A16207] to-[#EC4899] rounded-lg p-8 text-white text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ka' ? 'შეუკვეთეთ დაბადების დღის თაიგული' : 'Order Birthday Bouquet'}
            </h2>
            <p className="mb-6 text-lg">
              {language === 'ka'
                ? 'დაბადების დღის აღსანიშნავად შეუკვეთეთ ხელოვნური თაიგული. მიტანა ხელმისაწვდომია თბილისის მასშტაბით.'
                : 'Celebrate birthday with an artistic bouquet. Delivery is available across Tbilisi.'}
            </p>
            <Link href="/catalog">
              <Button className="bg-white text-[#A16207] hover:bg-gray-100 px-8 py-3 font-bold">
                {language === 'ka' ? 'კატალოგი' : 'Catalog'}
              </Button>
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8">
              {language === 'ka' ? 'ხშირად დასმული კითხვები' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რა ყვავილები კარგია დაბადების დღისთვის?' : 'What flowers are good for birthday?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დაბადების დღისთვის კარგია წითელი ვარდები, სპრეი ვარდები, ლილიები, ღიორდი, ღერო ყვავილები. ნებისმიერი ფერი შესაფერი - წითელი, თეთრი, ვარდისფერი, ღია.'
                    : 'Good for birthday are red roses, spray roses, lilies, orchids, stem flowers. Any color is suitable - red, white, pink, peach.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რამდენი ხანი ჯდება დაბადების დღის თაიგული?' : 'How long does birthday bouquet last?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დაბადების დღის თაიგული ძლებს 7-14 დღე, დამოკიდებულია ყვავილების ტიპზე. რეგულარულად წყლის შეცვლა აუცილებელია.'
                    : 'Birthday bouquet lasts 7-14 days, depending on flower type. Regular water changes are essential.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'როდის დასტურდება დაბადების დღის თაიგულის მიწოდება?' : 'When is birthday bouquet delivery confirmed?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'შეკვეთის შესაძლებლობა და მიწოდების ზუსტი დრო დასტურდება შეკვეთის დეტალების მიხედვით. დასაზუსტებლად დაგვიკავშირდით სამუშაო საათებში.'
                    : 'Order availability and the exact delivery time are confirmed according to your order details. Contact us during working hours to confirm.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რა ღირს დაბადების დღის თაიგული?' : 'How much does birthday bouquet cost?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დაბადების დღის თაიგულის ფასი დამოკიდებულია დიზაინზე და ყვავილების ტიპზე. დაწყებული 50 ლარიდან 500 ლარამდე. ჩვენი დიზაინერი დაგეხმარებათ სწორი ფასის თაიგული აირჩიოთ.'
                    : 'Birthday bouquet price depends on design and flower type. Starting from 50 GEL to 500 GEL. Our designer will help you choose the right price bouquet.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
