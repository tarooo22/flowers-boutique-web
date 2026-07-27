import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";

interface Props {
  language: "ka" | "en";
}

/** A single editorial hero keeps the storefront calm and makes the catalogue CTA clear. */
export default function HeroBannerSlider({ language }: Props) {
  const ka = language === "ka";

  return (
    <section className="fb-hero" aria-labelledby="hero-title">
      <div className="fb-hero__texture" aria-hidden="true" />
      <div className="fb-hero__content">
        <p className="fb-eyebrow">FLOWER’S BOUTIQUE · Tbilisi</p>
        <h1 id="hero-title" className="fb-display">
          {ka ? "ყვავილები განსაკუთრებული ემოციებისთვის" : "Flowers for unforgettable moments"}
        </h1>
        <p className="fb-hero__copy">
          {ka
            ? "აღმოაჩინეთ დახვეწილი თაიგულები და კომპოზიციები თქვენი ყველაზე მნიშვნელოვანი მომენტებისთვის."
            : "Discover considered bouquets and floral compositions for life’s most meaningful occasions."}
        </p>
        <div className="fb-hero__actions">
          <Link href="/catalog" className="fb-button fb-button--gold">
            {ka ? "თაიგულების ნახვა" : "Explore bouquets"} <ArrowRight size={17} />
          </Link>
          <Link href="/contact" className="fb-button fb-button--quiet">
            <MessageCircle size={17} /> {ka ? "ინდივიდუალური შეკვეთა" : "Custom order"}
          </Link>
        </div>
      </div>
      <div className="fb-hero__art" role="img" aria-label={ka ? "ყვავილების ბუკეტის ილუსტრაცია" : "Illustration of a luxury bouquet"}>
        <img src="/flower-assets/hero/dark-botanical.webp" alt="" width="1920" height="1280" fetchPriority="high" />
      </div>
      <div className="fb-hero__note">
        <span>01</span>
        <span>{ka ? "დახვეწილი ფლორისტიკა" : "Considered floristry"}</span>
      </div>
    </section>
  );
}
