import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Flower2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Calendar,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { addToCart } from "@/lib/cartUtils";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import {
  generateLocalBusinessSchema,
  generateOrganizationSchema,
} from "@/lib/jsonLd";
import EditorialImage from "@/components/EditorialImage";
import { phoneHref, siteContact } from "@/lib/siteConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/product/ProductCard";
import {
  DELIVERY_FEE_GEL,
  FREE_DELIVERY_THRESHOLD_GEL,
} from "@shared/checkoutPolicy";

const heroSlides = [
  {
    image: "/manus-storage/flowers-boutique-hero-rose-peony_f8130032.jpg",
    kickerKa: "პრემიუმ კოლექცია · თბილისი",
    kickerEn: "PREMIUM COLLECTION · TBILISI",
    titleKa: "ყვავილები განსაკუთრებული მომენტებისთვის",
    titleEn: "Flowers for meaningful moments",
    copyKa: "ხელნაკეთი თაიგულები, მდიდრული კომპოზიციები და ექსპრეს მიწოდება.",
    copyEn: "Handcrafted bouquets, luxurious arrangements and express delivery.",
  },
  {
    image: "/manus-storage/flowers-boutique-hero-white-orchid_dfc5d006.jpg",
    kickerKa: "მინიმალისტური ელეგანტურობა",
    kickerEn: "MINIMALIST ELEGANCE",
    titleKa: "სუფთა ფორმები და იშვიათი ჯიშები",
    titleEn: "Pure forms and rare botanical varieties",
    copyKa: "აღმოაჩინეთ თეთრი ორქიდეები და ნაზი მცენარეები ინტერიერისთვის.",
    copyEn: "Discover pristine white orchids and delicate botanical accents.",
  },
  {
    image: "/manus-storage/flowers-boutique-hero-wildflower_8b160e36.jpg",
    kickerKa: "სეზონური ემოცია",
    kickerEn: "SEASONAL EMOTION",
    titleKa: "ბუნებრივი ჰარმონია თაიგულში",
    titleEn: "Natural harmony in every stem",
    copyKa: "ახალი, ცოცხალი და ტრენდული სეზონური ყვავილების შერჩევა.",
    copyEn: "Fresh, vibrant and carefully curated seasonal flower assortments.",
  },
];

const categoryArtwork = [
  "/manus-storage/flowers-boutique-category-wedding-bouquet_ca816d70.png",
  "/manus-storage/flowers-boutique-category-ready-bouquet_f412e09a.png",
  "/manus-storage/flowers-boutique-category-individual-flower_a954c6fe.png",
];

export default function Home() {
  const { language, t } = useLanguage();
  const { openDrawer } = useCartDrawer();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedHeroSlides, setLoadedHeroSlides] = useState<Set<number>>(() => new Set());
  const persistentEditorialImages = useMemo(() => ({ builder: "", brand: "" }), []);
  const revealRootRef = useRef<HTMLElement>(null);

  const productsQuery = trpc.products.list.useQuery();
  const categoriesQuery = trpc.categories.list.useQuery();
  const ka = language === "ka";

  const products = productsQuery.data ?? [];
  const categories = (categoriesQuery.data ?? []).slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = revealRootRef.current;
    if (!root) return;

    const revealTargets = Array.from(
      root.querySelectorAll<HTMLElement>(".fb-archive-reveal"),
    );

    if (!window.IntersectionObserver) {
      revealTargets.forEach((target) => target.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const featured = products
    .filter((p: any) => p.published && (p.featured || p.isAvailable))
    .slice(0, 8);

  useSEO({
    titleKa: "Flower’s Boutique | ყვავილები განსაკუთრებული მომენტებისთვის",
    titleEn: "Flower’s Boutique | Flowers for meaningful moments",
    descriptionKa:
      "მზა თაიგულები, ინდივიდუალური კომპოზიციები და შეკვეთის მარტივი პროცესი თბილისში.",
    descriptionEn:
      "Ready-made bouquets, custom floral compositions and a simple ordering experience in Tbilisi.",
    canonical: "/",
    structuredData: [
      generateOrganizationSchema(),
      generateLocalBusinessSchema(),
    ],
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
    toast.success(t("home.cartAdded"));
    openDrawer();
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <div className="p1-site bg-[#FAF7F2] text-[#2C2825] min-h-screen font-sans selection:bg-[#D4A373]/20">
      <Navbar />
      <main id="main-content" className="p1-home" ref={revealRootRef}>
        {/* Immersive Hero Carousel */}
        <section
          className="p1-hero p1-hero--editorial"
          aria-labelledby="p1-hero-title"
        >
          <div className="p1-hero__backdrop absolute inset-0 z-0">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.image}
                className={`p1-hero__media ${idx === currentSlide ? "is-active" : ""} ${loadedHeroSlides.has(idx) ? "is-loaded" : ""}`}
                aria-hidden={idx !== currentSlide}
              >
                <img
                  src={slide.image}
                  alt=""
                  decoding="async"
                  onLoad={() => {
                    setLoadedHeroSlides((loaded) => {
                      if (loaded.has(idx)) return loaded;
                      return new Set([...loaded, idx]);
                    });
                  }}
                  className="p1-hero__image"
                />
                <div className="p1-hero__veil p1-hero__veil--lateral absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                <div className="p1-hero__veil p1-hero__veil--vertical absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              </div>
            ))}
          </div>

          <div className="p1-hero__layout relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="p1-hero__copy lg:col-span-8 text-left space-y-6">
              <div className="p1-hero__kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-widest uppercase font-medium text-amber-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {ka ? activeSlide.kickerKa : activeSlide.kickerEn}
              </div>
              <h1
                id="p1-hero-title"
                className="p1-hero__title text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight text-white leading-[1.15]"
              >
                {ka ? activeSlide.titleKa : activeSlide.titleEn}
              </h1>
              <p className="p1-hero__lede text-lg md:text-xl text-stone-200 font-light max-w-2xl leading-relaxed">
                {ka ? activeSlide.copyKa : activeSlide.copyEn}
              </p>
              <div className="p1-hero__actions flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/catalog"
                  className="p1-hero__cta p1-hero__cta--primary inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E07A5F] hover:bg-[#d56b4e] text-white font-medium text-sm tracking-wider uppercase transition-all duration-300 shadow-xl shadow-black/20 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {ka ? "კატალოგის ნახვა" : "Explore Catalog"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/bouquet-builder"
                  className="p1-hero__cta p1-hero__cta--secondary inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm tracking-wider uppercase transition-all duration-300"
                >
                  {ka ? "შექმენი შენი თაიგული" : "Build Bouquet"}
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </Link>
              </div>
            </div>

            {/* Slide Navigation Indicators */}
            <div
              className="p1-hero__indicators lg:col-span-4 flex lg:flex-col justify-center lg:items-end gap-3 mt-8 lg:mt-0"
              role="group"
              aria-label={ka ? "Hero სლაიდების ნავიგაცია" : "Hero slide navigation"}
            >
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`p1-hero__indicator group flex items-center gap-3 text-left transition-all duration-300 ${
                    idx === currentSlide ? "opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                  aria-label={ka ? `გადასვლა სლაიდზე ${idx + 1}` : `Go to slide ${idx + 1}`}
                  aria-current={idx === currentSlide ? "true" : undefined}
                  aria-pressed={idx === currentSlide}
                >
                  <span className={`p1-hero__indicator-index text-xs font-mono tracking-widest ${idx === currentSlide ? "text-amber-300 font-bold" : "text-stone-300"}`}>
                    0{idx + 1}
                  </span>
                  <div className={`p1-hero__indicator-line h-0.5 transition-all duration-500 ${idx === currentSlide ? "w-16 bg-amber-300" : "w-8 bg-white/40 group-hover:w-12"}`} />
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside
          className="p1-home-trust fb-archive-reveal"
          aria-label={ka ? "შეკვეთის პირობები" : "Order benefits"}
        >
          <div className="p1-home-trust__item">
            <span aria-hidden="true">₾</span>
            <p>
              <strong>{ka ? `მიწოდება ₾${DELIVERY_FEE_GEL}` : `Delivery ₾${DELIVERY_FEE_GEL}`}</strong>
              <small>{ka ? "თბილისის მასშტაბით" : "Across Tbilisi"}</small>
            </p>
          </div>
          <div className="p1-home-trust__item">
            <Heart aria-hidden="true" />
            <p>
              <strong>{ka ? `უფასო ₾${FREE_DELIVERY_THRESHOLD_GEL}-დან` : `Free from ₾${FREE_DELIVERY_THRESHOLD_GEL}`}</strong>
              <small>{ka ? "მიწოდებაზე" : "on delivery"}</small>
            </p>
          </div>
          <div className="p1-home-trust__item">
            <MapPin aria-hidden="true" />
            <p>
              <strong>{ka ? "გატანა — უფასო" : "Pickup — free"}</strong>
              <small>10:00–20:00</small>
            </p>
          </div>
        </aside>

        {/* Distinct Background-Free Category Gallery */}
        <section
          className="p1-home-section p1-home-section--categories fb-archive-reveal py-20 px-4 md:px-12 max-w-7xl mx-auto"
          aria-labelledby="p1-categories-title"
        >
          <div className="p1-home-section__heading flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="p1-home-section__eyebrow text-xs font-mono tracking-widest uppercase text-[#A56A5B] block mb-2">
                {t("home.categories.intro")}
              </span>
              <h2
                id="p1-categories-title"
                className="p1-home-section__title text-3xl md:text-5xl font-serif font-light text-[#2C2825]"
              >
                {ka ? "იპოვე სასურველი თაიგული" : "Find Your Arrangement"}
              </h2>
              <p className="p1-home-section__lede text-stone-600 font-light mt-2 max-w-xl">
                {ka
                  ? "ყველა კომპოზიცია იწყება განწყობით — შეარჩიე შენი მომენტისათვის."
                  : "Every composition begins with a mood — choose for your moment."}
              </p>
            </div>
            <Link
              href="/catalog"
              className="p1-home-section__link inline-flex items-center gap-2 text-sm font-medium tracking-wider uppercase text-[#2C2825] hover:text-[#E07A5F] transition-colors"
            >
              {t("home.categories.explore")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p1-category-gallery" role="list">
            {categories.map((category: any, index: number) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.id}`}
                className={`p1-category-tile p1-category-tile--${index + 1}`}
                role="listitem"
              >
                <div className="absolute top-6 left-6 text-xs font-mono text-[#A56A5B]/70 tracking-widest">
                  0{index + 1}
                </div>
                <div className="p1-category-tile__visual my-8 flex justify-center items-center h-56 transition-transform duration-700 ease-out group-hover:scale-105">
                  <img
                    src={categoryArtwork[index % categoryArtwork.length]}
                    alt={ka ? category.nameKa : category.nameEn}
                    className="max-h-52 w-auto object-contain drop-shadow-2xl filter contrast-[1.05]"
                  />
                </div>
                <div className="p1-category-tile__meta space-y-2 z-10 pt-4 border-t border-[#E5DEC9]">
                  <h3 className="p1-category-tile__title text-xl font-serif font-normal text-[#2C2825] group-hover:text-[#E07A5F] transition-colors">
                    {ka ? category.nameKa : category.nameEn}
                  </h3>
                  <p className="p1-category-tile__description text-sm text-stone-600 font-light">
                    {ka ? category.descriptionKa : category.descriptionEn}
                  </p>
                  <div className="p1-category-tile__action pt-2 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#2C2825] group-hover:translate-x-1 transition-transform">
                    {ka ? "კოლექციის ნახვა" : "Explore Collection"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New-Arrivals Signature Grid */}
        <section
          className="p1-home-section p1-home-section--signatures p1-signatures fb-archive-reveal py-20 px-4 md:px-12 max-w-7xl mx-auto border-t border-[#EAE2D0]"
          aria-labelledby="p1-collections-title"
        >
          <div className="p1-home-section__heading flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="p1-home-section__eyebrow text-xs font-mono tracking-widest uppercase text-[#A56A5B] block mb-2">
                {ka ? "ახალი კოლექცია" : "SIGNATURE DROP"}
              </span>
              <h2
                id="p1-collections-title"
                className="p1-home-section__title text-3xl md:text-5xl font-serif font-light text-[#2C2825]"
              >
                {ka ? "ახალი თაიგულები" : "New Arrivals & Collections"}
              </h2>
            </div>
            <Link
              href="/catalog"
              className="p1-home-section__link inline-flex items-center gap-2 text-sm font-medium tracking-wider uppercase text-[#2C2825] hover:text-[#E07A5F] transition-colors"
            >
              {ka ? "ყველა პროდუქტი — ნახვა" : "View All Products"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {productsQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-[#EFE9DF] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="p1-product-grid p1-product-grid--signature">
              {featured.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onAdd={quickAdd}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500">
              {ka ? "პროდუქტები ვერ მოიძებნა" : "No products found"}
            </div>
          )}
        </section>

        {/* Bouquet Builder Promo */}
        <section
          className="p1-home-section p1-home-section--builder fb-archive-reveal py-16 px-4 md:px-12 max-w-7xl mx-auto"
          aria-labelledby="p1-builder-title"
          slot="builder"
        >
          <div className="p1-home-builder bg-[#2C2825] text-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="p1-home-builder__copy lg:col-span-6 p-8 md:p-16 space-y-6">
              <span className="p1-home-section__eyebrow text-xs font-mono tracking-widest uppercase text-amber-300 block">
                {ka ? "შენი კომპოზიცია" : "BESPOKE FLORISTRY"}
              </span>
              <h2
                id="p1-builder-title"
                className="p1-home-section__title text-3xl md:text-5xl font-serif font-light leading-tight text-white"
              >
                {ka ? "შეიქმენი შენი თაიგული" : "Build Your Own Bouquet"}
              </h2>
              <p className="text-stone-300 font-light leading-relaxed">
                {ka
                  ? "აირჩიე ყვავილები, შეფუთვა და დეტალები შენს გემოზე — თანამედროვე კონსტრუქტორი ეტაპობრივად გაგიძღვება."
                  : "Select stems, wrapping and styling details to match your exact aesthetic."}
              </p>
              <div>
                <Link
                  href="/bouquet-builder"
                  className="p1-home-primary-cta inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E07A5F] hover:bg-[#d56b4e] text-white font-medium text-sm tracking-wider uppercase transition-all duration-300 shadow-lg"
                >
                  {ka ? "დაიწყე შექმნა" : "Start Creating"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="p1-home-builder__media lg:col-span-6 h-96 lg:h-full relative overflow-hidden">
              <img
                src="/manus-storage/flowers-boutique-experience-event-styling_07114441.jpg"
                alt=""
                className="p1-home-builder__image w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </section>

        {/* Original Editorial Experience Cards */}
        <section
          className="p1-home-section p1-home-section--experiences fb-archive-reveal py-20 px-4 md:px-12 max-w-7xl mx-auto border-t border-[#EAE2D0]"
          aria-labelledby="p1-editorial-title"
          slot="brand"
        >
          <div className="p1-home-section__heading flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="p1-home-section__eyebrow text-xs font-mono tracking-widest uppercase text-[#A56A5B] block mb-2">
                {ka ? "ჟურნალი & სწავლება" : "JOURNAL & EXPERIENCES"}
              </span>
              <h2
                id="p1-editorial-title"
                className="p1-home-section__title text-3xl md:text-5xl font-serif font-light text-[#2C2825]"
              >
                {ka ? "ჩვენ ასევე ვასწავლით და ვაფორმებთ" : "Floristry School & Events"}
              </h2>
            </div>
            <Link
              href="/about"
              className="p1-home-section__link inline-flex items-center gap-2 text-sm font-medium tracking-wider uppercase text-[#2C2825] hover:text-[#E07A5F] transition-colors"
            >
              {ka ? "ჩვენ შესახებ" : "About Us"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                titleKa: "ფლორისტიკის სკოლა",
                titleEn: "Floristry School",
                copyKa: "კურსები, მასტერკლასები, სერტიფიკატი დამწყებთათვის და პროფესიონალებისთვის.",
                copyEn: "Professional masterclasses and hands-on floral design courses.",
                image: "/manus-storage/flowers-boutique-experience-floristry-class_0d9c281c.jpg",
                tag: ka ? "კურსები" : "COURSES",
              },
              {
                titleKa: "ღონისძიებების გაფორმება",
                titleEn: "Event Styling",
                copyKa: "ქორწილები, კორპორატიული საღამოები და ექსკლუზიური დეკორი.",
                copyEn: "Bespoke floral design for weddings and corporate events.",
                image: "/manus-storage/flowers-boutique-experience-event-styling_07114441.jpg",
                tag: ka ? "ივენთები" : "EVENTS",
              },
              {
                titleKa: "სეზონური ისტორიები",
                titleEn: "Seasonal Stories",
                copyKa: "როგორ მოვუაროთ ჰორტენზიებსა და ვარდებს — 10 დღიანი სიცოცხლე.",
                copyEn: "Expert flower care tips and seasonal botanical guides.",
                image: "/manus-storage/flowers-boutique-experience-seasonal-story_fddeea36.jpg",
                tag: ka ? "ჟურნალი" : "JOURNAL",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p1-home-experience-card group bg-white rounded-3xl overflow-hidden border border-[#EBE3D5] hover:border-[#D4A373]/60 transition-all duration-500 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div className="p1-home-experience-card__media h-64 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={ka ? item.titleKa : item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <span className="p1-home-experience-card__tag absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono tracking-widest text-[#2C2825] uppercase">
                    {item.tag}
                  </span>
                </div>
                <div className="p1-home-experience-card__copy p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-serif font-normal text-[#2C2825] mb-2 group-hover:text-[#E07A5F] transition-colors">
                      {ka ? item.titleKa : item.titleEn}
                    </h3>
                    <p className="text-stone-600 font-light text-sm leading-relaxed">
                      {ka ? item.copyKa : item.copyEn}
                    </p>
                  </div>
                  <Link
                    href="/about"
                    className="p1-home-experience-card__link inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#2C2825] pt-4 border-t border-[#F0EBE1]"
                  >
                    {ka ? "გაიგე მეტი" : "Read More"}
                    <ChevronRight className="w-4 h-4 text-[#E07A5F]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Three Delivery Steps */}
        <section
          className="p1-home-section p1-home-section--delivery fb-archive-reveal py-16 px-4 md:px-12 max-w-7xl mx-auto border-t border-[#EAE2D0]"
          aria-labelledby="p1-delivery-title"
        >
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-widest uppercase text-[#A56A5B] block mb-2">
              {ka ? "მარტივი პროცესი" : "EXPRESS DELIVERY"}
            </span>
            <h2
              id="p1-delivery-title"
              className="text-3xl md:text-5xl font-serif font-light text-[#2C2825]"
            >
              {ka ? "სამი მარტივი ნაბიჯი" : "Three Simple Steps"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Flower2,
                titleKa: "შეარჩიე თაიგული",
                titleEn: "Choose Bouquet",
                copyKa: "აირჩიე კატალოგიდან ან შექმენი საკუთარი კომპოზიცია.",
                copyEn: "Select from catalog or build your own bespoke composition.",
              },
              {
                icon: MapPin,
                titleKa: "მიუთითე დეტალები",
                titleEn: "Provide Details",
                copyKa: "შეავსე მიღების, მისამართისა და მიწოდების ინფორმაცია.",
                copyEn: "Enter recipient, address and preferred delivery time.",
              },
              {
                icon: CheckCircle2,
                titleKa: "დაადასტურე შეკვეთა",
                titleEn: "Confirm Order",
                copyKa: "გადასწამე შეკვეთის დეტალები და დაადასტურე მონაცემები.",
                copyEn: "Review your order summary and confirm securely.",
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p1-home-delivery-step bg-[#F5F0E6] rounded-3xl p-8 border border-[#EBE3D5] text-center space-y-4 relative"
                >
                  <div className="absolute top-6 right-6 font-mono text-xs text-[#A56A5B]/60">
                    0{idx + 1}
                  </div>
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E07A5F]/10 flex items-center justify-center text-[#E07A5F]">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-serif text-[#2C2825]">
                    {ka ? step.titleKa : step.titleEn}
                  </h3>
                  <p className="text-sm text-stone-600 font-light">
                    {ka ? step.copyKa : step.copyEn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Refined Contact CTA */}
        <section
          className="p1-home-section p1-home-section--contact fb-archive-reveal py-16 px-4 md:px-12 max-w-7xl mx-auto"
          aria-labelledby="p1-contact-title"
        >
          <div className="p1-home-contact bg-[#2C2825] text-white rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="p1-home-contact__copy space-y-3 text-center lg:text-left">
              <span className="text-xs font-mono tracking-widest uppercase text-amber-300 block">
                {ka ? "სწრაფი კონტაქტი" : "QUICK CONTACT"}
              </span>
              <h2
                id="p1-contact-title"
                className="text-3xl md:text-4xl font-serif font-light text-white"
              >
                {ka ? "დაგვიკავშირდი" : "Get in Touch"}
              </h2>
              <p className="text-stone-300 font-light max-w-md">
                {ka
                  ? "თუ არჩევანში დახმარება გჭირდება, მოგვწერე ან დაგვირეკე."
                  : "If you need assistance with your choice, message or call us anytime."}
              </p>
            </div>
            <div className="p1-home-contact__actions flex flex-wrap items-center justify-center gap-4">
              {siteContact.whatsapp && (
                <a
                  href={siteContact.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="p1-home-contact__action p1-home-contact__action--whatsapp inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm tracking-wider uppercase transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              {siteContact.messenger && (
                <a
                  href={siteContact.messenger}
                  target="_blank"
                  rel="noreferrer"
                  className="p1-home-contact__action p1-home-contact__action--messenger inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm tracking-wider uppercase transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messenger
                </a>
              )}
              {siteContact.phone && (
                <a
                  href={phoneHref}
                  className="p1-home-contact__action p1-home-contact__action--phone inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium text-sm tracking-wider uppercase transition-all"
                >
                  <Phone className="w-4 h-4" />
                  {siteContact.phone}
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
