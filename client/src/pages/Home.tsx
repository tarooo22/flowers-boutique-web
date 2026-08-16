import { ArrowRight, MessageCircle, Phone, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import ProductCard from "@/components/product/ProductCard";
import { DELIVERY_FEE_GEL, FREE_DELIVERY_THRESHOLD_GEL } from "@shared/checkoutPolicy";
import { phoneHref, siteContact } from "@/lib/siteConfig";

const heroSlides = [
  {
    image: "/manus-storage/flowers-boutique-hero-rose-peony_f8130032.jpg",
    titleKa: "ყვავილები განსაკუთრებული მომენტებისთვის",
    titleEn: "Flowers for meaningful moments",
    copyKa: "ხელნაკეთი თაიგულები, მდიდრული კომპოზიციები და ექსპრეს მიწოდება.",
    copyEn: "Handcrafted bouquets, luxurious arrangements and express delivery.",
  },
  {
    image: "/manus-storage/flowers-boutique-hero-white-orchid_dfc5d006.jpg",
    titleKa: "სუფთა ფორმები და იშვიათი ჯიშები",
    titleEn: "Pure forms and rare botanical varieties",
    copyKa: "თეთრი ორქიდეები და ნაზი მცენარეები თანამედროვე ინტერიერისთვის.",
    copyEn: "Pristine orchids and delicate botanicals for contemporary interiors.",
  },
  {
    image: "/manus-storage/flowers-boutique-hero-wildflower_8b160e36.jpg",
    titleKa: "ბუნებრივი ჰარმონია თაიგულში",
    titleEn: "Natural harmony in every bouquet",
    copyKa: "ახალი, ცოცხალი და ყურადღებით შერჩეული სეზონური ყვავილები.",
    copyEn: "Fresh, vibrant and carefully selected seasonal flowers.",
  },
];

const occasionLinks = [
  { key: "love", ka: "სიყვარული", en: "Love", href: "/catalog?search=ვარდი" },
  { key: "joy", ka: "სიხარული", en: "Joy", href: "/catalog?search=დაბადების დღე" },
  { key: "thanks", ka: "მადლიერება", en: "Gratitude", href: "/catalog?search=თაიგული" },
  { key: "apology", ka: "ბოდიში", en: "Apology", href: "/catalog?search=ყვავილი" },
  { key: "just-because", ka: "უბრალოდ ასე", en: "Just because", href: "/catalog" },
] as const;

const serviceCards = [
  {
    image: "/manus-storage/flowers-boutique-experience-floristry-class_0d9c281c.jpg",
    titleKa: "ფლორისტიკის ატელიე",
    titleEn: "Floristry atelier",
    copyKa: "კურსი, მასტერკლასი და პერსონალური გამოცდილება ყვავილებთან.",
    copyEn: "Courses, masterclasses and personal floral experiences.",
    href: "/about",
  },
  {
    image: "/manus-storage/flowers-boutique-experience-event-styling_07114441.jpg",
    titleKa: "ღონისძიებების გაფორმება",
    titleEn: "Event styling",
    copyKa: "ქორწილი, კორპორატივი და განსაკუთრებული დღის ყვავილოვანი დეკორი.",
    copyEn: "Floral décor for weddings, corporate events and special days.",
    href: "/contact",
  },
] as const;

const journalCards = [
  {
    image: "/manus-storage/flowers-boutique-experience-seasonal-story_fddeea36.jpg",
    titleKa: "სეზონური ყვავილების მოვლა",
    titleEn: "Seasonal flower care",
    href: "/about",
  },
  {
    image: "/manus-storage/flowers-boutique-experience-event-styling_07114441.jpg",
    titleKa: "ყვავილები განსაკუთრებული დღისთვის",
    titleEn: "Flowers for a special day",
    href: "/contact",
  },
  {
    image: "/manus-storage/flowers-boutique-experience-floristry-class_0d9c281c.jpg",
    titleKa: "კომპოზიციის შერჩევის გზამკვლევი",
    titleEn: "A guide to choosing an arrangement",
    href: "/catalog",
  },
] as const;

export default function Home() {
  const { language } = useLanguage();
  const { openDrawer } = useCartDrawer();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set());
  const homeRef = useRef<HTMLElement>(null);
  const productsQuery = trpc.products.list.useQuery();
  const categoriesQuery = trpc.categories.list.useQuery();
  const ka = language === "ka";
  const products = productsQuery.data ?? [];
  const categories = (categoriesQuery.data ?? []).slice(0, 5);
  const featured = useMemo(
    () => products.filter((product: any) => product.published && product.isAvailable !== false),
    [products],
  );
  const firstRail = featured.slice(0, 4);
  const secondRail = featured.slice(4, 8).length ? featured.slice(4, 8) : featured.slice(0, 4);
  const thirdRail = featured.slice(8, 14).length ? featured.slice(8, 14) : featured.slice(0, 6);
  const slide = heroSlides[currentSlide];

  useEffect(() => {
    const timer = window.setInterval(
      () => setCurrentSlide(current => (current + 1) % heroSlides.length),
      6200,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const home = homeRef.current;
    if (!home) return;

    const revealTargets = Array.from(home.querySelectorAll<HTMLElement>(".am-reveal"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(target => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    revealTargets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useSEO({
    titleKa: "Flower’s Boutique | ყვავილები განსაკუთრებული მომენტებისთვის",
    titleEn: "Flower’s Boutique | Flowers for meaningful moments",
    descriptionKa: "მზა თაიგულები, ინდივიდუალური კომპოზიციები და შეკვეთის მარტივი პროცესი თბილისში.",
    descriptionEn: "Ready-made bouquets, custom floral compositions and a simple ordering experience in Tbilisi.",
    canonical: "/",
    structuredData: [generateOrganizationSchema(), generateLocalBusinessSchema()],
    lang: language as "ka" | "en",
  });

  const quickAdd = (product: any) => {
    addToCart({
      productId: product.id,
      name: ka ? product.nameKa : product.nameEn,
      price: Number(product.salePrice ?? product.priceMin ?? 0),
      quantity: 1,
      unitType: product.unitType || "",
      imageUrl: product.imageUrl,
    });
    toast.success(ka ? "კალათაში დაემატა" : "Added to cart");
    openDrawer();
  };

  const productRail = (items: any[], label: string, title: string, priority = false, layout: "grid" | "shelf" = "grid") => (
    <section className="am-home-rail am-reveal am-reveal--rail" aria-labelledby={label}>
      <div className="am-home-rail__head">
        <h2 id={label}>{title}</h2>
        <Link href="/catalog" className="am-text-link">{ka ? "ყველას ნახვა" : "View all"}<ArrowRight /></Link>
      </div>
      {productsQuery.isLoading ? (
        <div className={`am-product-rail am-product-rail--${layout} am-product-rail--skeleton`} aria-busy="true">
          {Array.from({ length: 4 }).map((_, index) => <span key={index} />)}
        </div>
      ) : items.length ? (
        <div className={`am-product-rail am-product-rail--${layout}`}>
          {items.map((product: any, index: number) => (
            <ProductCard key={product.id} product={product} language={language} onAdd={quickAdd} priority={priority && index < 2} />
          ))}
        </div>
      ) : (
        <p className="am-empty-copy">{ka ? "პროდუქტები მალე დაემატება." : "Products will be available soon."}</p>
      )}
    </section>
  );

  return (
    <div className="am-site">
      <Navbar />
      <main id="main-content" className="am-home" ref={homeRef}>
        <section className="am-home-hero" aria-labelledby="am-home-hero-title">
          <div className="am-home-hero__slides" aria-hidden="true">
            {heroSlides.map((hero, index) => (
              <figure key={hero.image} className={`am-home-hero__slide ${index === currentSlide ? "is-active" : ""}`}>
                <img src={hero.image} alt="" decoding="async" onLoad={() => setLoadedSlides(current => new Set([...current, index]))} className={loadedSlides.has(index) ? "is-loaded" : ""} />
              </figure>
            ))}
          </div>
          <div className="am-home-hero__shade" />
          <div className="am-home-hero__content">
            <div className="am-home-hero__copy">
              <p className="am-hero-kicker"><Sparkles aria-hidden="true" />{ka ? "დღეს კარგი დღეა ყვავილების გასაგზავნად" : "Today is a good day to send flowers"}</p>
              <h1 id="am-home-hero-title">{ka ? slide.titleKa : slide.titleEn}</h1>
              <p className="am-home-hero__lede">{ka ? slide.copyKa : slide.copyEn}</p>
              <Link href="/catalog" className="am-coral-button">{ka ? "კატალოგის ნახვა" : "Explore catalog"}<ArrowRight /></Link>
            </div>
            <div className="am-hero-dots" role="group" aria-label={ka ? "Hero სლაიდების ნავიგაცია" : "Hero slide navigation"}>
              {heroSlides.map((_, index) => (
                <button key={index} type="button" onClick={() => setCurrentSlide(index)} className={index === currentSlide ? "is-active" : ""} aria-label={ka ? `სლაიდი ${index + 1}` : `Slide ${index + 1}`} aria-current={index === currentSlide ? "true" : undefined} />
              ))}
            </div>
            <dl className="am-hero-metrics">
              <div><dd>₾{DELIVERY_FEE_GEL}</dd><dt>{ka ? "მიწოდება თბილისში" : "Tbilisi delivery"}</dt></div>
              <div><dd>₾{FREE_DELIVERY_THRESHOLD_GEL}+</dd><dt>{ka ? "უფასო მიწოდება" : "Free delivery"}</dt></div>
              <div><dd>{products.length || "—"}</dd><dt>{ka ? "თაიგულები კატალოგში" : "Bouquets in catalog"}</dt></div>
            </dl>
          </div>
        </section>

        <section className="am-occasion am-reveal" aria-labelledby="am-occasion-title">
          <div className="am-shell">
            <h2 id="am-occasion-title">{ka ? "რისთვის ეძებ ყვავილებს?" : "What are you looking for flowers for?"}</h2>
            <div className="am-occasion__chips">
              {categories.length ? categories.map((category: any) => (
                <Link key={category.id} href={`/catalog?category=${category.slug}`}>{ka ? category.nameKa : category.nameEn}</Link>
              )) : occasionLinks.map(item => <Link key={item.key} href={item.href}>{ka ? item.ka : item.en}</Link>)}
            </div>
          </div>
        </section>

        <div className="am-shell am-home__body">
          {productRail(firstRail, "am-love-title", ka ? "სიყვარულისთვის" : "For love", true)}
          {productRail(secondRail, "am-joy-title", ka ? "სიხარულისთვის" : "For joy")}
          {productRail(thirdRail, "am-selection-title", ka ? "არჩეული თაიგულები" : "Selected bouquets", false, "shelf")}

          <section className="am-promo-banner am-reveal" aria-labelledby="am-builder-title">
            <div className="am-promo-banner__copy">
              <p className="am-section-label">{ka ? "პერსონალური არჩევანი" : "A personal choice"}</p>
              <h2 id="am-builder-title">{ka ? "შექმენი შენი თაიგული" : "Create your own bouquet"}</h2>
              <p>{ka ? "აირჩიე ყვავილები, შეფუთვა და დეტალები შენი იდეისთვის." : "Choose stems, wrapping and details for your own idea."}</p>
              <Link href="/bouquet-builder" className="am-coral-button">{ka ? "დაიწყე შექმნა" : "Start creating"}<ArrowRight /></Link>
            </div>
            <img className="am-promo-banner__image" src="/manus-storage/flowers-boutique-experience-event-styling_07114441.jpg" alt="" />
          </section>

          <section className="am-services am-reveal" aria-labelledby="am-services-title">
            <div className="am-home-rail__head">
              <h2 id="am-services-title">{ka ? "ჩვენ ასევე ვასწავლით და ვაფორმებთ" : "We also teach and style"}</h2>
              <Link href="/about" className="am-text-link">{ka ? "ჩვენ შესახებ" : "About us"}<ArrowRight /></Link>
            </div>
            <div className="am-services__grid">
              {serviceCards.map(card => (
                <Link key={card.titleEn} href={card.href} className="am-service-card">
                  <img src={card.image} alt={ka ? card.titleKa : card.titleEn} />
                  <span><strong>{ka ? card.titleKa : card.titleEn}</strong><small>{ka ? card.copyKa : card.copyEn}</small><em>{ka ? "გაიგე მეტი" : "Learn more"}<ArrowRight /></em></span>
                </Link>
              ))}
            </div>
          </section>

          <section className="am-journal am-reveal" aria-labelledby="am-journal-title">
            <div className="am-home-rail__head">
              <h2 id="am-journal-title">{ka ? "ჟურნალი" : "Journal"}</h2>
              <Link href="/about" className="am-text-link">{ka ? "ყველა" : "All"}<ArrowRight /></Link>
            </div>
            <div className="am-journal__grid">
              {journalCards.map(card => (
                <Link key={card.titleEn} href={card.href} className="am-journal-card">
                  <img src={card.image} alt={ka ? card.titleKa : card.titleEn} />
                  <span>{ka ? card.titleKa : card.titleEn}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <section className="am-contact-band am-reveal" aria-label={ka ? "სწრაფი კონტაქტი" : "Quick contact"}>
        <div className="am-contact-band__inner am-shell">
          <div className="am-contact-band__copy">
            <strong>{ka ? "დაგვირეკე — ვიპოვით შენს თაიგულს" : "Call us — we will find your bouquet"}</strong>
            <span className="am-contact-band__availability"><i aria-hidden="true" />{ka ? siteContact.hoursKa : siteContact.hoursEn}</span>
          </div>
          <div className="am-contact-band__actions">
            {siteContact.phone && <a className="am-contact-band__action am-contact-band__action--call" href={phoneHref}><Phone aria-hidden="true" /><span>{ka ? "დარეკვა" : "Call"}</span></a>}
            {siteContact.whatsapp && <a className="am-contact-band__action am-contact-band__action--whatsapp" href={siteContact.whatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /><span>WhatsApp</span></a>}
          </div>
        </div>
      </section>
      <Footer />
      <CartDrawer />
    </div>
  );
}
