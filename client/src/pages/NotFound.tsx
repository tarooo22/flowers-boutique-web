import { ArrowRight, Flower2, Home } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();
  const ka = language === "ka";

  return (
    <div className="fb-secondary-page min-h-screen">
      <Navbar />
      <main className="fb-not-found" id="main-content">
        <div className="fb-not-found__number" aria-hidden="true">404</div>
        <div className="fb-not-found__content">
          <Flower2 size={28} />
          <p className="fb-eyebrow">FLOWER’S BOUTIQUE</p>
          <h1 className="fb-display">{ka ? "ეს გვერდი ჯერ არ აყვავებულა." : "This page hasn’t bloomed yet."}</h1>
          <p>{ka ? "ბმული შესაძლოა შეიცვალა. დაბრუნდით მთავარ გვერდზე ან განაგრძეთ კოლექციის დათვალიერება." : "The link may have changed. Return home or continue browsing the collection."}</p>
          <div>
            <Link href="/" className="fb-button fb-button--gold"><Home size={17} />{ka ? "მთავარი გვერდი" : "Home"}</Link>
            <Link href="/catalog" className="fb-not-found__secondary">{ka ? "კოლექციის ნახვა" : "View collection"}<ArrowRight size={17} /></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
