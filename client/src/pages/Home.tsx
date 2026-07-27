import { ArrowRight, Check, Gift, Heart, MessageCircle, ShoppingBag, Sparkles, Star, Truck } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { addToCart } from "@/lib/cartUtils";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { generateLocalBusinessSchema, generateOrganizationSchema } from "@/lib/jsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FlowerImage from "@/components/FlowerImage";
import HeroBannerSlider from "@/components/HeroBannerSlider";

const reviews = [
  { ka: "დახვეწილი შეფუთვა და ულამაზესი თაიგული. განსაკუთრებული საჩუქარი გამოვიდა.", en: "Thoughtful wrapping and a beautiful bouquet. It made a truly special gift.", name: "ანა მ." },
  { ka: "ყოველი დეტალი ზუსტად იყო გათვალისწინებული. შესანიშნავი გამოცდილება.", en: "Every detail was considered. A wonderful experience.", name: "ნინო გ." },
  { ka: "თაიგული ფოტოზე უკეთესი იყო და დროულად მივიღეთ.", en: "The bouquet was even lovelier than the photo and arrived on time.", name: "თამარ კ." },
];

export default function Home() {
  const { language } = useLanguage();
  const { openDrawer } = useCartDrawer();
  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const { data: categories = [] } = trpc.categories.list.useQuery();
  const ka = language === "ka";
  const featured = products.filter((p: any) => p.published && (p.featured || p.isAvailable)).slice(0, 4);

  useSEO({
    titleKa: "Flower’s Boutique | ყვავილები განსაკუთრებული ემოციებისთვის",
    titleEn: "Flower’s Boutique | Flowers for unforgettable moments",
    descriptionKa: "დახვეწილი თაიგულები და კომპოზიციები განსაკუთრებული მომენტებისთვის.",
    descriptionEn: "Considered bouquets and floral compositions for life’s meaningful moments.",
    canonical: "/",
    structuredData: [generateOrganizationSchema(), generateLocalBusinessSchema()],
    lang: language as "ka" | "en",
  });

  const price = (product: any) => product.priceOnRequest ? (ka ? "ფასი მოთხოვნით" : "Price on request") : `₾${product.priceMin}${product.priceMax && product.priceMax !== product.priceMin ? `–${product.priceMax}` : ""}`;
  const add = (event: React.MouseEvent, product: any) => {
    event.preventDefault(); event.stopPropagation();
    addToCart({ productId: product.id, name: ka ? product.nameKa : product.nameEn, price: Number(product.priceMin || 0), quantity: 1, unitType: product.unitType || "", imageUrl: product.imageUrl });
    toast.success(ka ? "პროდუქტი კალათაში დაემატა" : "Added to cart"); openDrawer();
  };

  return <div className="min-h-screen overflow-x-clip bg-[#F7F2E9] text-[#171717]">
    <Navbar />
    <main id="main-content">
      <HeroBannerSlider language={language} />

      <section className="border-y border-[#C9A86A]/35 bg-[#171717] px-5 py-5 text-[#F7F2E9]" aria-label="Flower’s Boutique promises">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[[Truck, ka ? "ფრთხილი მიწოდება" : "Considered delivery"], [Sparkles, ka ? "ხელით შექმნილი" : "Hand arranged"], [Gift, ka ? "საჩუქრად მზად" : "Gift ready"]].map(([Icon, label]: any) => <div className="flex items-center justify-center gap-3 text-sm" key={label}><Icon className="h-4 w-4 text-[#E2C58B]" />{label}</div>)}
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24" aria-labelledby="categories-title">
        <div className="mx-auto max-w-7xl"><div className="mb-9 flex items-end justify-between gap-5"><div><p className="fb-eyebrow">01 · COLLECTIONS</p><h2 id="categories-title" className="fb-display text-4xl sm:text-5xl">{ka ? "აირჩიეთ მომენტი" : "Choose the moment"}</h2></div><Link className="hidden items-center gap-2 text-sm font-semibold text-[#735A30] sm:flex" href="/catalog">{ka ? "ყველა ყვავილი" : "All flowers"}<ArrowRight size={16}/></Link></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.slice(0, 4).map((category: any, index: number) => <Link href={`/catalog?category=${category.id}`} className="fb-category-card group" key={category.id}><span className="fb-category-card__number">0{index + 1}</span><div><h3>{ka ? category.nameKa : category.nameEn}</h3><p>{ka ? "დახვეწილი არჩევანი" : "A considered selection"}</p></div><ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" size={18}/></Link>)}</div>
        </div>
      </section>

      <section className="bg-[#0B0B0B] px-5 py-16 text-[#F7F2E9] sm:py-24" aria-labelledby="featured-title">
        <div className="mx-auto max-w-7xl"><div className="mb-9 flex flex-wrap items-end justify-between gap-5"><div><p className="fb-eyebrow">02 · SIGNATURES</p><h2 id="featured-title" className="fb-display text-4xl sm:text-5xl">{ka ? "რჩეული თაიგულები" : "Signature bouquets"}</h2></div><Link href="/catalog" className="fb-button fb-button--gold">{ka ? "კოლექციის ნახვა" : "View collection"}<ArrowRight size={16}/></Link></div>
          {isLoading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({length:4}).map((_, i) => <div key={i} className="h-80 animate-pulse bg-white/10" />)}</div> : featured.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((product: any) => <Link href={`/product/${product.id}`} key={product.id} className="fb-product-card"><div className="relative aspect-[4/5] overflow-hidden bg-[#222]"><FlowerImage src={product.imageUrl} alt={ka ? product.nameKa : product.nameEn} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"/><span className="absolute bottom-3 left-3 border border-[#E2C58B]/60 bg-[#0B0B0B]/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-[#E2C58B]">{product.isAvailable ? (ka ? "ხელმისაწვდომია" : "Available") : (ka ? "არ არის" : "Unavailable")}</span></div><div className="space-y-3 p-4"><div><p className="text-xs text-white/55">{ka ? "ყვავილების კოლექცია" : "Flower collection"}</p><h3 className="mt-1 text-base font-semibold">{ka ? product.nameKa : product.nameEn}</h3></div><div className="flex items-center justify-between gap-3"><span className="font-semibold tabular-nums text-[#E2C58B]">{price(product)}</span><button className="fb-cart-add" onClick={e => add(e, product)} aria-label={ka ? "კალათაში დამატება" : "Add to cart"}><ShoppingBag size={17}/></button></div></div></Link>)}</div> : <div className="border border-[#C9A86A]/35 p-10 text-center text-white/75"><p>{ka ? "კოლექცია მალე დაემატება." : "The collection will be available soon."}</p></div>}
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch"><div className="flex min-h-[360px] flex-col justify-between bg-[#221E19] p-8 text-[#F7F2E9] sm:p-12"><div><p className="fb-eyebrow">03 · BESPOKE</p><h2 className="fb-display max-w-xl text-4xl leading-tight sm:text-5xl">{ka ? "შექმენით განსაკუთრებული მომენტი" : "Create a moment made for them"}</h2><p className="mt-5 max-w-md leading-7 text-white/70">{ka ? "მოგვიყევით თქვენი იდეის, ფერებისა და შემთხვევის შესახებ — დანარჩენს ჩვენ ვიზრუნებთ." : "Tell us about the occasion, palette and feeling. We will take care of the floral story."}</p></div><Link className="mt-8 inline-flex items-center gap-2 self-start border-b border-[#E2C58B] pb-2 text-sm font-semibold text-[#E2C58B]" href="/contact">{ka ? "ინდივიდუალური შეკვეთა" : "Request a custom bouquet"}<ArrowRight size={16}/></Link></div><div className="relative min-h-[360px] overflow-hidden bg-[#DCCEB7]"><img src="/flower-assets/editorial/pink-roses.webp" alt={ka ? "ყვავილების არანჟირება" : "Pink rose arrangement"} width="1600" height="1600" loading="lazy" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute bottom-6 left-6 right-6 border border-white/50 bg-[#F7F2E9]/90 p-4 text-sm text-[#312C25]"><Check className="mb-2 h-4 w-4 text-[#735A30]" />{ka ? "თქვენი სურვილის მიხედვით შექმნილი კომპოზიცია" : "A composition created around your request"}</div></div></div></section>

      <section className="bg-[#EEE6D9] px-5 py-16 sm:py-20"><div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[.8fr_1.2fr]"><div><p className="fb-eyebrow">04 · DELIVERY</p><h2 className="fb-display text-4xl sm:text-5xl">{ka ? "მარტივად, ყურადღებით, დროულად" : "Simple, attentive, on time"}</h2></div><div className="grid gap-4 sm:grid-cols-3">{[["01",ka?"აირჩიეთ":"Choose",ka?"დაათვალიერეთ კოლექცია ან შეგვიკვეთეთ ინდივიდუალური თაიგული.":"Browse the collection or request a custom bouquet."],["02",ka?"მიუთითეთ":"Share details",ka?"დაგვიტოვეთ მიმღები, მისამართი და თქვენთვის სასურველი დრო.":"Leave recipient, address and preferred time."],["03",ka?"მივიტანთ":"We deliver",ka?"მზად შეკვეთას ფრთხილად მივიტანთ თქვენს განსაკუთრებულ ადამიანთან.":"We carefully deliver the finished order to someone special."]].map(([n,title,copy]) => <article className="border-t border-[#C9A86A]/60 pt-4" key={n}><span className="text-xs font-semibold text-[#735A30]">{n}</span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#665E55]">{copy}</p></article>)}</div></div></section>

      <section className="px-5 py-16 sm:py-24"><div className="mx-auto max-w-7xl"><div className="mb-9 max-w-xl"><p className="fb-eyebrow">05 · KIND WORDS</p><h2 className="fb-display text-4xl sm:text-5xl">{ka ? "სიყვარულით ნათქვამი" : "Words, with love"}</h2></div><div className="grid gap-4 md:grid-cols-3">{reviews.map((review) => <figure className="border border-[#C9A86A]/35 bg-white p-6" key={review.name}><div className="mb-7 flex gap-1 text-[#A3844C]">{Array.from({length:5}).map((_, i) => <Star className="h-4 w-4 fill-current" key={i}/>)}</div><blockquote className="text-lg leading-8">“{ka ? review.ka : review.en}”</blockquote><figcaption className="mt-6 text-sm font-semibold text-[#735A30]">{review.name}</figcaption></figure>)}</div></div></section>

      <section className="bg-[#171717] px-5 py-16 text-white sm:py-24"><div className="mx-auto max-w-7xl"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="fb-eyebrow">06 · SOCIAL MOMENTS</p><h2 className="fb-display text-4xl sm:text-5xl">{ka ? "ჩვენი ყოველდღიური ყვავილები" : "Flowers, every day"}</h2></div><a className="inline-flex items-center gap-2 text-sm font-semibold text-[#E2C58B]" href="https://www.facebook.com/flowersboutiques/" target="_blank" rel="noreferrer">Facebook <ArrowRight size={16}/></a></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{['/flower-assets/editorial/mixed-bouquet.webp','/flower-assets/products/7692.webp','/flower-assets/products/8319.webp','/flower-assets/products/8346.webp'].map((src, i) => <div key={src} className={`aspect-square overflow-hidden ${i % 2 ? "bg-[#2B261F]" : "bg-[#3A3023]"}`}><img src={src} alt={ka ? "Flower’s Boutique ყვავილების კომპოზიცია" : "Flower’s Boutique floral composition"} loading="lazy" width="1200" height="1200" className="h-full w-full object-cover opacity-90" /></div>)}</div></div></section>

      <section className="bg-[#F7F2E9] px-5 py-16 sm:py-24"><div className="mx-auto max-w-4xl border-y border-[#C9A86A] py-12 text-center"><p className="fb-eyebrow">FLOWER’S BOUTIQUE</p><h2 className="fb-display text-4xl leading-tight sm:text-6xl">{ka ? "გააგზავნეთ ემოცია ყვავილებით." : "Send the feeling, in flowers."}</h2><p className="mx-auto mt-5 max-w-xl leading-7 text-[#665E55]">{ka ? "აირჩიეთ თაიგული, რომელიც თქვენს სათქმელს ყველაზე ლამაზად გადმოსცემს." : "Choose the bouquet that says exactly what you mean."}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link className="fb-button fb-button--gold" href="/catalog">{ka ? "კოლექციის ნახვა" : "Explore collection"}<ArrowRight size={16}/></Link><Link className="fb-button border border-[#735A30] text-[#312C25]" href="/contact"><MessageCircle size={16}/>{ka ? "დაგვიკავშირდით" : "Contact us"}</Link></div></div></section>
    </main>
    <Footer /><CartDrawer />
  </div>;
}
