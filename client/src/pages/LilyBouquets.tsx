import { useEffect } from 'react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronRight, Flower2, Sparkles, Gift } from 'lucide-react';

export default function LilyBouquets() {
  const { language } = useLanguage();

  useSEO({
    titleKa: 'ლილიების თაიგულები თბილისში | Flower’s Boutique',
    titleEn: 'Lily Bouquets Tbilisi | Flower’s Boutique',
    descriptionKa: 'ლილიების ელეგანტური თაიგულები თბილისში. Flower’s Boutique გთავაზობთ თეთრ, ვარდისფერ, წითალ ლილიებს. სწრაფი მიტანა, ინდივიდუალური დიზაინი.',
    descriptionEn: 'Elegant lily bouquets in Tbilisi. Flower’s Boutique offers white, pink, red lilies. Fast delivery, custom design.',
    canonical: '/lily-bouquets',
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
          name: language === 'ka' ? 'რა ღირს ლილიების თაიგული?' : 'How much does a lily bouquet cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'ლილიების თაიგულის ფასი დამოკიდებულია ლილიების რაოდენობაზე. დაწყებული 60 ლარიდან.' : 'Lily bouquet price depends on quantity. Starting from 60 GEL.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რამდენი დღე ძლებს ლილიები?' : 'How long do lilies last?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'ლილიები ძლებს 10-14 დღე სწორი ზრუნვის შემთხვევაში.' : 'Lilies last 10-14 days with proper care.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'ლილიები ძლიან სუნთქავენ?' : 'Do lilies have a strong fragrance?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'დიახ, ლილიებს აქვთ ძლიერი, ლამაზი სუნი. თუ ძალიან ძლიერია, შეგიძლიათ ღეროს ბოლოს ამოჭრათ.' : 'Yes, lilies have a strong, beautiful fragrance. If too strong, you can remove the stamens.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რა ფერის ლილიები გაქვთ?' : 'What colors of lilies do you have?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'გაქვთ თეთრი, ვარდისფერი, წითალი, ღია ლილიები და კომბინირებული ფერები.' : 'We have white, pink, red, peach lilies and mixed colors.',
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

      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/"><a className="hover:text-gray-900">{language === 'ka' ? 'მთავარი' : 'Home'}</a></Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{language === 'ka' ? 'ლილიების თაიგულები' : 'Lily Bouquets'}</span>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-[#A16207]/10 to-[#EC4899]/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'ka' ? 'ლილიების თაიგულები თბილისში' : 'Lily Bouquets in Tbilisi'}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {language === 'ka'
              ? 'ლილიები - სიმბოლი სიწმინდისა და ელეგანციის. Flower’s Boutique გთავაზობთ ხარისხიან ლილიებს, ხელით შედგენილი დიზაინერის მიერ.'
              : 'Lilies - symbol of purity and elegance. Flower’s Boutique offers quality lilies, hand-crafted by our designer.'}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex gap-4">
              <Flower2 className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ელეგანტური ლილიები' : 'Elegant Lilies'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'ხარისხიანი, ახალი ლილიები. თითოეული ფერი ელეგანტური და ხელოვნური.'
                    : 'Quality, fresh lilies. Every color is elegant and artistic.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Sparkles className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ძლიერი სუნი' : 'Strong Fragrance'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'ლილიებს აქვთ ლამაზი, ძლიერი სუნი. ოთახი სავსე იქნება ღილოთი.'
                    : 'Lilies have a beautiful, strong fragrance. Your room will be filled with aroma.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Gift className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'სპეციალური შემთხვევებისთვის' : 'For Special Occasions'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დაბადების დღე, წაკითხვა, სიმპათია - ლილიები ყოველი შემთხვევისთვის.'
                    : 'Birthday, congratulations, sympathy - lilies for every occasion.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              {language === 'ka' ? 'პოპულარული ლილიების თაიგულები' : 'Popular Lily Bouquets'}
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
              {language === 'ka' ? 'შეუკვეთეთ ლილიების თაიგული' : 'Order Your Lily Bouquet'}
            </h2>
            <p className="mb-6 text-lg">
              {language === 'ka'
                ? 'ელეგანტური ლილიების თაიგული თქვენი სპეციალური მომენტისთვის. სწრაფი მიტანა თბილისში.'
                : 'Elegant lily bouquet for your special moment. Fast delivery in Tbilisi.'}
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
                  {language === 'ka' ? 'რა ღირს ლილიების თაიგული?' : 'How much does a lily bouquet cost?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'ლილიების თაიგულის ფასი დამოკიდებულია ლილიების რაოდენობაზე და დიზაინზე. დაწყებული 60 ლარიდან 400 ლარამდე.'
                    : 'Lily bouquet price depends on quantity and design. Starting from 60 GEL to 400 GEL.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რამდენი დღე ძლებს ლილიები?' : 'How long do lilies last?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'ლილიები ძლებს 10-14 დღე სწორი ზრუნვის შემთხვევაში. წყლის რეგულარული შეცვლა აუცილებელია.'
                    : 'Lilies last 10-14 days with proper care. Regular water changes are essential.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ლილიები ძლიან სუნთქავენ?' : 'Do lilies have a strong fragrance?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დიახ, ლილიებს აქვთ ძლიერი, ლამაზი სუნი. თუ ძალიან ძლიერია, შეგიძლიათ ღეროს ბოლოს ამოჭრათ ან ოთახი კარგად გაიტანოთ.'
                    : 'Yes, lilies have a strong, beautiful fragrance. If too strong, you can remove the stamens or ventilate the room.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რა ფერის ლილიები გაქვთ?' : 'What colors of lilies do you have?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'გაქვთ თეთრი, ვარდისფერი, წითალი, ღია ლილიები და კომბინირებული ფერები. ყოველი ფერი ხარისხიანი და ელეგანტური.'
                    : 'We have white, pink, red, peach lilies and mixed colors. Every color is quality and elegant.'}
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
