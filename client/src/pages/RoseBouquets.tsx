import { useEffect } from 'react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronRight, Flower2, Heart, Sparkles } from 'lucide-react';

export default function RoseBouquets() {
  const { language } = useLanguage();

  useSEO({
    titleKa: 'ვარდების თაიგულები თბილისში | Flower’s Boutique',
    titleEn: 'Rose Bouquets Tbilisi | Flower’s Boutique',
    descriptionKa: 'ელეგანტური ვარდების თაიგულები თბილისში. Flower’s Boutique გთავაზობთ ხარისხიან წითელ, თეთრ, ვარდისფერ ვარდებს. სწრაფი მიტანა, ინდივიდუალური დიზაინი.',
    descriptionEn: 'Elegant rose bouquets in Tbilisi. Flower’s Boutique offers quality red, white, pink roses. Fast delivery, custom design.',
    canonical: '/rose-bouquets',
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
          name: language === 'ka' ? 'რა ღირს ვარდების თაიგული?' : 'How much does a rose bouquet cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'ვარდების თაიგულის ფასი დამოკიდებულია ვარდების რაოდენობაზე და დიზაინზე. დაწყებული 50 ლარიდან.' : 'Rose bouquet price depends on quantity and design. Starting from 50 GEL.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რამდენი დღე ძლებს ვარდები?' : 'How long do roses last?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'ჩვენი ვარდები ძლებს 7-10 დღე სწორი ზრუნვის შემთხვევაში.' : 'Our roses last 7-10 days with proper care.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'შემიძლია თუ არა ვარდების რაოდენობა შევცვალო?' : 'Can I change the number of roses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'დიახ, ნებისმიერი რაოდენობის ვარდი შეგიძლიათ შეუკვეთოთ. WhatsApp ან Messenger-ით დაგვიკავშირდით.' : 'Yes, you can order any number of roses. Contact us via WhatsApp or Messenger.',
          },
        },
        {
          '@type': 'Question',
          name: language === 'ka' ? 'რა ფერის ვარდები გაქვთ?' : 'What colors of roses do you have?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: language === 'ka' ? 'გაქვთ წითელი, თეთრი, ვარდისფერი, ყვავილი, ღია ვარდები და კომბინირებული ფერები.' : 'We have red, white, pink, peach, cream roses and mixed colors.',
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
            <span className="text-gray-900 font-medium">{language === 'ka' ? 'ვარდების თაიგულები' : 'Rose Bouquets'}</span>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-[#A16207]/10 to-[#EC4899]/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'ka' ? 'ვარდების თაიგულები თბილისში' : 'Rose Bouquets in Tbilisi'}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {language === 'ka'
              ? 'ელეგანტური ვარდების თაიგულები ყოველი შემთხვევისთვის. წითელი, თეთრი, ვარდისფერი ვარდები, ხელით შედგენილი დიზაინერის მიერ.'
              : 'Elegant rose bouquets for every occasion. Red, white, pink roses, hand-crafted by our designer.'}
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
                  {language === 'ka' ? 'ხარისხიანი ვარდები' : 'Premium Roses'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'მხოლოდ ხარისხიანი, ახალი ვარდები. ყოველი ვარდი ფრთხილად შერჩეული.'
                    : 'Only premium, fresh roses. Every rose carefully selected.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Heart className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რომანტიული დიზაინი' : 'Romantic Design'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'თითოეული თაიგული დიზაინერის მიერ ხელით შედგენილი. უნიკალური და ელეგანტური.'
                    : 'Each bouquet hand-crafted by designer. Unique and elegant.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Sparkles className="w-8 h-8 text-[#A16207] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'ყოველი შემთხვევისთვის' : 'For Every Occasion'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დაბადების დღე, წгодовщина, სიყვარული - ვარდები სიტყვებთან ჯობია.'
                    : 'Birthday, anniversary, love - roses speak better than words.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              {language === 'ka' ? 'პოპულარული ვარდების თაიგულები' : 'Popular Rose Bouquets'}
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
              {language === 'ka' ? 'შეუკვეთეთ ვარდების თაიგული' : 'Order Your Rose Bouquet'}
            </h2>
            <p className="mb-6 text-lg">
              {language === 'ka'
                ? 'ჩვენი დიზაინერი შექმნის თქვენთვის იდეალურ თაიგულს. სწრაფი მიტანა თბილისში.'
                : 'Our designer will create the perfect bouquet for you. Fast delivery in Tbilisi.'}
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
                  {language === 'ka' ? 'რა ღირს ვარდების თაიგული?' : 'How much does a rose bouquet cost?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'ვარდების თაიგულის ფასი დამოკიდებულია ვარდების რაოდენობაზე და დიზაინზე. დაწყებული 50 ლარიდან 500 ლარამდე.'
                    : 'Rose bouquet price depends on quantity and design. Starting from 50 GEL to 500 GEL.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რამდენი დღე ძლებს ვარდები?' : 'How long do roses last?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'ჩვენი ვარდები ძლებს 7-10 დღე სწორი ზრუნვის შემთხვევაში. რეგულარულად წყლის შეცვლა და ღეროს ჭრა აუცილებელია.'
                    : 'Our roses last 7-10 days with proper care. Regular water changes and stem trimming are essential.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'შემიძლია თუ არა ვარდების რაოდენობა შევცვალო?' : 'Can I change the number of roses?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'დიახ, ნებისმიერი რაოდენობის ვარდი შეგიძლიათ შეუკვეთოთ. WhatsApp ან Messenger-ით დაგვიკავშირდით და ჩვენი დიზაინერი შექმნის თქვენთვის სპეციალურ თაიგულს.'
                    : 'Yes, you can order any number of roses. Contact us via WhatsApp or Messenger and our designer will create a special bouquet for you.'}
                </p>
              </div>
              <div className="border-l-4 border-[#A16207] pl-6">
                <h3 className="font-bold text-lg mb-2">
                  {language === 'ka' ? 'რა ფერის ვარდები გაქვთ?' : 'What colors of roses do you have?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ka'
                    ? 'გაქვთ წითელი, თეთრი, ვარდისფერი, ღია, ღია ვარდები და კომბინირებული ფერები. ყოველი ფერი აღმოჩნდება ელეგანტური და ხარისხიანი.'
                    : 'We have red, white, pink, peach, cream roses and mixed colors. Every color is elegant and high quality.'}
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
