'use client';

import { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { ChevronRight, Leaf, Star, Heart, Award } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { siteContact } from "@/lib/siteConfig";

export default function About() {
  const { language } = useLanguage();
  useSEO({
    titleKa: "Flower’s Boutique-ის შესახებ | ყვავილების ბუტიკი თბილისში",
    titleEn: "About Flower’s Boutique | Premium Flower Boutique in Tbilisi",
    descriptionKa: "Flower’s Boutique — პრემიუმ ყვავილების ბუტიკი თბილისში. გაიცანით ჩვენი ისტორია, გუნდი, ღირებულებები და მიდგომა თითოეული თაიგულის შექმნისადმი.",
    descriptionEn: "Flower’s Boutique is Tbilisi's premium flower boutique. Learn our story, values, and why we are the city's most trusted flower shop.",
    canonical: "/about",
    lang: language as "ka" | "en",
  });

  const values = [
    {
      icon: <Leaf className="w-6 h-6" />,
      titleKa: 'ახალი ყვავილები',
      titleEn: 'Fresh Flowers',
      descKa: 'თითოეულ ყვავილს საუკეთესო მდგომარეობაში ვარჩევთ და მხოლოდ სანდო მომწოდებლებთან ვთანამშრომლობთ.',
      descEn: 'Every flower is sourced in the freshest condition. We work with the best suppliers.',
    },
    {
      icon: <Star className="w-6 h-6" />,
      titleKa: 'პრემიუმ ხარისხი',
      titleEn: 'Premium Quality',
      descKa: 'ჩვენ ვიყენებთ მხოლოდ ყველაზე ლამაზ და ხარისხიან ყვავილებს. ყოველი თაიგული სრულყოფილია.',
      descEn: 'We use only the most beautiful and quality flowers. Every bouquet is perfect.',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      titleKa: 'სიყვარულით შექმნილი',
      titleEn: 'Made with Love',
      descKa: 'ჩვენი ფლორისტები თითოეულ თაიგულს სიყვარულითა და ზრუნვით ქმნიან. ეს ჩვენი საქმის მთავარი ღირებულებაა.',
      descEn: 'Our florists create every bouquet with love and care. This is our passion.',
    },
    {
      icon: <Award className="w-6 h-6" />,
      titleKa: 'გამოცდილება',
      titleEn: 'Experience',
      descKa: 'წლების გამოცდილება ყვავილების ბიზნესში. ჩვენ ვიცით, როგორ გავახაროთ ადამიანები.',
      descEn: 'Years of experience in the flower business. We know how to make people happy.',
    },
  ];

  const stats = [
    { value: '5+', labelKa: 'წელი ბაზარზე', labelEn: 'Years in business' },
    { value: '1000+', labelKa: 'ბედნიერი მომხმარებელი', labelEn: 'Happy customers' },
    { value: '50+', labelKa: 'ყვავილის სახეობა', labelEn: 'Flower varieties' },
    { value: '5.0', labelKa: 'Google შეფასება', labelEn: 'Google rating' },
  ];

  return (
    <div className="fb-secondary-page fb-about-page min-h-screen" style={{ background: '#f7f2e9' }}>
      <Navbar />

      {/* Hero */}
      <div className="fb-about-hero relative overflow-hidden">
        <img
          src="/flower-assets/editorial/pink-roses.webp"
          alt="Pink roses arrangement — Flower’s Boutique flower boutique Tbilisi"
          className="fb-about-hero__image absolute inset-0 w-full h-full object-cover"
        />
        <div className="fb-about-hero__shade absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              {language === 'ka' ? 'მთავარი' : 'Home'}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{language === 'ka' ? 'ჩვენ შესახებ' : 'About'}</span>
          </nav>
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-[#D4AF37]/40 bg-white/5 backdrop-blur-sm">
            <p className="text-sm font-medium text-[#D4AF37]">FLOWERS BOUTIQUE · TBILISI</p>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {language === 'ka' ? 'ჩვენ შესახებ' : 'About Us'}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
            {language === 'ka'
              ? 'პრემიუმ ყვავილების მაღაზია თბილისში — სიყვარულით შექმნილი და ზრუნვით მიწოდებული.'
              : 'Tbilisi\'s premium flower shop — created with love, delivered with care.'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'linear-gradient(135deg, #1C1917 0%, #2D2520 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="group">
                <p className="text-4xl sm:text-5xl font-light text-[#D4AF37] mb-2 group-hover:text-[#E8C547] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-white/60 uppercase tracking-wider group-hover:text-white/80 transition-colors">
                  {language === 'ka' ? stat.labelKa : stat.labelEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <p className="text-xs font-medium text-[#A16207] uppercase tracking-wider">{language === 'ka' ? 'ჩვენი ისტორია' : 'Our Story'}</p>
              </div>
              <h2 className="text-4xl sm:text-5xl font-light text-[#1C1917] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {language === 'ka' ? 'Flower’s Boutique ყვავილების სიყვარულით შეიქმნა' : 'Flower’s Boutique was born from a love of flowers'}
              </h2>
              <div className="space-y-6 text-[#5A5A5A] text-base leading-relaxed">
                <p>
                  {language === 'ka'
                    ? `Flower’s Boutique არის ყვავილების ბუტიკი თბილისში, სადაც ხელით ვქმნით დახვეწილ თაიგულებს და გთავაზობთ ახალი ყვავილების მრავალფეროვან არჩევანს.${siteContact.address ? ` ჩვენი ბუტიკი მდებარეობს მისამართზე: ${siteContact.address}.` : ''}`
                    : `Flower’s Boutique is a Tbilisi flower boutique specializing in hand-arranged bouquets and a considered selection of fresh flowers.${siteContact.address ? ` Our boutique is located at ${siteContact.address}.` : ''}`}
                </p>
                <p>
                  {language === 'ka'
                    ? 'ყოველდღე ვცდილობთ, ყვავილების სილამაზე და სიხარული ჩვენი მომხმარებლების ცხოვრებაში შევიტანოთ. თითოეულ თაიგულს დიდი ყურადღებითა და ყვავილების ცოდნით ვქმნით.'
                    : 'We strive to bring beauty and joy through flowers into our customers\' lives every day. Each bouquet is carefully arranged with deep knowledge and passion for flowers.'}
                </p>
                <p>
                  {language === 'ka'
                    ? 'ჩვენი გუნდი ყოველთვის მზადაა, დაგეხმაროთ იდეალური თაიგულის შერჩევაში — განსაკუთრებული შემთხვევისთვის, საჩუქრად ან უბრალოდ საყვარელი ადამიანის გასახარებლად.'
                    : 'Our team is always ready to help you find the perfect bouquet — for a special occasion, as a gift, or simply for joy.'}
                </p>
              </div>
              <div className="mt-10">
                <Link href="/catalog">
                  <Button className="rounded-full px-8 py-2 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/20 transition-all">
                    {language === 'ka' ? 'კოლექციის ნახვა' : 'View Collection'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#D4AF37]/10 to-[#A16207]/5 rounded-3xl blur-2xl" />
              <img
                src="/flower-assets/editorial/mixed-bouquet.webp"
                alt={language === 'ka' ? 'Flower’s Boutique-ის ყვავილების სივრცე თბილისში' : 'Flower’s Boutique floral studio in Tbilisi'}
                className="fb-about-story-image relative rounded-3xl w-full aspect-[4/5] object-cover shadow-2xl border border-[#D4AF37]/20"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl border border-[#D4AF37]/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#1C1917]">5.0</span>
                </div>
                <p className="text-xs text-[#888]">18 Google reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, rgba(161, 98, 7, 0.02) 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <p className="text-xs font-medium text-[#A16207] uppercase tracking-wider">{language === 'ka' ? 'ჩვენი ღირებულებები' : 'Our Values'}</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-light text-[#1C1917]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {language === 'ka' ? 'რატომ გვირჩევენ' : 'Why Customers Choose Us'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="group p-8 rounded-2xl border border-[#D4AF37]/20 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:border-[#D4AF37]/40 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#A16207]/10 flex items-center justify-center text-[#A16207] mb-5 group-hover:from-[#D4AF37]/40 group-hover:to-[#A16207]/20 transition-colors">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-[#1C1917] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem' }}>
                  {language === 'ka' ? v.titleKa : v.titleEn}
                </h3>
                <p className="text-sm text-[#666] leading-relaxed">
                  {language === 'ka' ? v.descKa : v.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-light text-[#1C1917] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {language === 'ka' ? 'დაგვიკავშირდით დღესვე' : 'Get in Touch Today'}
          </h2>
          <p className="text-[#666] mb-10 text-lg">
            {language === 'ka'
              ? 'გაქვთ კითხვები? ჩვენ ყოველთვის მზად ვართ დაგეხმაროთ.'
              : 'Have questions? We\'re always ready to help you.'}
          </p>
          <Link href="/contact">
            <Button size="lg" className="rounded-full px-10 py-3 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/30 transition-all">
              {language === 'ka' ? 'კონტაქტი' : 'Contact Us'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <CartDrawer />
    </div>
  );
}
