import { useEffect } from 'react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronRight, Flower2, Zap, Heart } from 'lucide-react';

export default function SprayRoses() {
  const { language } = useLanguage();

  useSEO({
    titleKa: 'სპრეი ვარდების თაიგულები თბილისში | Flower’s Boutique',
    titleEn: 'Spray Roses Bouquets Tbilisi | Flower’s Boutique',
    descriptionKa: 'სპრეი ვარდების თაიგულები თბილისში. Flower’s Boutique გთავაზობთ ხარისხიან სპრეი ვარდებს, ინდივიდუალურ დიზაინსა და მიტანას თბილისის მასშტაბით.',
    descriptionEn: 'Spray roses bouquets in Tbilisi. Flower’s Boutique offers quality spray roses, custom design and delivery across Tbilisi.',
    canonical: '/spray-roses',
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
          name: language === 'ka' ? 'რა არის სპრეი ვარდები?' : 'What are spray roses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'სპრეი ვარდები არის მცირე ვარდების ტიპი, რომელიც ერთი ღეროზე რამდენიმე ფერი აქვს. ძალიან ელეგანტური და ხელოვნური.' : 'Spray roses are small roses with multiple blooms on one stem. Very elegant and artistic.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რამდენი დღე ძლებს სპრეი ვარდები?' : 'How long do spray roses last?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'სპრეი ვარდები ძლებს 10-14 დღე სწორი ზრუნვის შემთხვევაში.' : 'Spray roses last 10-14 days with proper care.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რა ღირს სპრეი ვარდების თაიგული?' : 'How much does a spray rose bouquet cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'სპრეი ვარდების თაიგულის ფასი დამოკიდებულია რაოდენობაზე. დაწყებული 45 ლარიდან.' : 'Spray rose bouquet price depends on quantity. Starting from 45 GEL.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რა ფერის სპრეი ვარდები გაქვთ?' : 'What colors of spray roses do you have?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'გაქვთ წითელი, თეთრი, ვარდისფერი, ღია, ღია სპრეი ვარდები და კომბინირებული ფერები.' : 'We have red, white, pink, peach, cream spray roses and mixed colors.',
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
            <span className="text-gray-900 font-medium">{language === 'ka' ? 'სპრეი ვარდები' : 'Spray Roses'}</span>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-[#A16207]/10 to-[#EC4899]/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'ka' ? 'სპრეი ვარდების თაიგულები თბილისში' : 'Spray Roses in Tbilisi'}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {language === 'ka'
              ? 'სპრეი ვარდები - მცირე, ელეგანტური ვარდები. Flower’s Boutique გთავაზობთ ხარისხიან სპრეი ვარდებს, ხელით შედგენილი დიზაინერის მიერ.'
              : 'Spray roses - small, elegant roses. Flower’s Boutique offers quality spray roses, hand-crafted by our designer.'}
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
                  {language === 'ka' ? 'მცირე ელეგანტური ვარდები' : 'Small Elegant Roses'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'სპრეი ვარდები არის მცირე ვარდების ტიპი. ერთი ღეროზე რამდენიმე ფერი.'
                    : 'Spray roses are small rose types. Multiple blooms on one stem.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Zap className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ხელოვნური დიზაინი' : 'Artistic Design'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'სპრეი ვარდები ძალიან ხელოვნური და ელეგანტური. თითოეული თაიგული უნიკალური.'
                    : 'Spray roses are very artistic and elegant. Every bouquet is unique.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Heart className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ხელმისაწვდომი ფასი' : 'Affordable Price'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'სპრეი ვარდები უფრო ხელმისაწვდომი, ვიდრე ჩვეულებრივი ვარდები. დაწყებული 45 ლარიდან.'
                    : 'Spray roses are more affordable than regular roses. Starting from 45 GEL.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              {language === 'ka' ? 'პოპულარული სპრეი ვარდების თაიგულები' : 'Popular Spray Rose Bouquets'}
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
              {language === 'ka' ? 'შეუკვეთეთ სპრეი ვარდების თაიგული' : 'Order Your Spray Rose Bouquet'}
            </h2>
            <p className="mb-6 text-lg">
              {language === 'ka'
                ? 'ელეგანტური სპრეი ვარდების თაიგული ხელმისაწვდომი ფასით. მიტანა ხელმისაწვდომია თბილისის მასშტაბით.'
                : 'Elegant spray rose bouquet at an accessible price. Delivery is available across Tbilisi.'}
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
                  {language === 'ka' ? 'რა არის სპრეი ვარდები?' : 'What are spray roses?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'სპრეი ვარდები არის მცირე ვარდების ტიპი, რომელიც ერთი ღეროზე რამდენიმე ფერი აქვს. ძალიან ელეგანტური და ხელოვნური. ჩვეულებრივი ვარდებზე უფრო ხელმისაწვდომი.'
                    : 'Spray roses are small roses with multiple blooms on one stem. Very elegant and artistic. More affordable than regular roses.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რამდენი დღე ძლებს სპრეი ვარდები?' : 'How long do spray roses last?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'სპრეი ვარდები ძლებს 10-14 დღე სწორი ზრუნვის შემთხვევაში. რეგულარულად წყლის შეცვლა აუცილებელია.'
                    : 'Spray roses last 10-14 days with proper care. Regular water changes are essential.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რა ღირს სპრეი ვარდების თაიგული?' : 'How much does a spray rose bouquet cost?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'სპრეი ვარდების თაიგულის ფასი დამოკიდებულია რაოდენობაზე. დაწყებული 45 ლარიდან 300 ლარამდე. უფრო ხელმისაწვდომი, ვიდრე ჩვეულებრივი ვარდები.'
                    : 'Spray rose bouquet price depends on quantity. Starting from 45 GEL to 300 GEL. More affordable than regular roses.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რა ფერის სპრეი ვარდები გაქვთ?' : 'What colors of spray roses do you have?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'გაქვთ წითელი, თეთრი, ვარდისფერი, ღია, ღია სპრეი ვარდები და კომბინირებული ფერები. ყოველი ფერი ხარისხიანი და ელეგანტური.'
                    : 'We have red, white, pink, peach, cream spray roses and mixed colors. Every color is quality and elegant.'}
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
