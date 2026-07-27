import {
  ArrowUpRight,
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { phoneHref, siteContact } from "@/lib/siteConfig";
import { useAuth } from '@/_core/hooks/useAuth';

export default function Footer() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const ka = language === "ka";

  return (
    <footer className="fb-footer">
      <div className="fb-footer__shell">
        <div className="fb-footer__top">
          <div>
            <p className="fb-eyebrow">FLOWER’S BOUTIQUE</p>
            <h2 className="fb-display">
              {ka
                ? "მომენტი, რომელიც ყვავილად რჩება."
                : "A moment that stays in bloom."}
            </h2>
            <p>
              {ka
                ? "სიყვარულით შერჩეული ყვავილები და ზუსტად დაგეგმილი მიწოდება."
                : "Thoughtfully selected flowers, finished with considered delivery."}
            </p>
          </div>
          <Link href="/catalog" className="fb-button fb-button--gold">
            {ka ? "კოლექციის ნახვა" : "View collection"}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <div className="fb-footer__grid">
          <div className="fb-footer__brand-column">
            <Link
              href="/"
              className="fb-footer__brand"
              aria-label="Flower’s Boutique home"
            >
              <span className="fb-footer__brand-logo" aria-hidden="true">
                <img
                  src="/brand/flowers-boutique-logo.png"
                  alt=""
                  width="960"
                  height="960"
                  loading="lazy"
                />
              </span>
              <strong>
                Flower’s <em>Boutique</em>
              </strong>
            </Link>
            <p>
              {ka
                ? "თანამედროვე ფლორისტიკა განსაკუთრებული ადამიანებისა და მოვლენებისთვის — დახვეწილი, ბუნებრივი და პერსონალური."
                : "Modern floristry for special people and occasions — refined, natural and personal."}
            </p>
            <div className="fb-footer__socials">
              {siteContact.instagram && (
                <a
                  href={siteContact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Instagram ${siteContact.instagramHandle}`}
                >
                  <Instagram />
                </a>
              )}
              <a
                href={siteContact.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <Facebook />
              </a>
            </div>
          </div>

          <div className="fb-footer__links">
            <h3>{ka ? "მაღაზია" : "Shop"}</h3>
            <Link href="/catalog">{ka ? "ყველა თაიგული" : "All bouquets"}</Link>
            <Link href="/bouquet-builder">
              {ka ? "შექმენი თაიგული" : "Create a bouquet"}
            </Link>
            <Link href="/rose-bouquets">
              {ka ? "ვარდების თაიგულები" : "Rose bouquets"}
            </Link>
            <Link href="/lily-bouquets">
              {ka ? "შროშანის თაიგულები" : "Lily bouquets"}
            </Link>
            <Link href="/birthday-flowers">
              {ka ? "დაბადების დღის ყვავილები" : "Birthday flowers"}
            </Link>
            <Link href="/wishlist">{ka ? "რჩეულები" : "Wishlist"}</Link>
          </div>

          <div className="fb-footer__links">
            <h3>{ka ? "ინფორმაცია" : "Information"}</h3>
            <Link href="/delivery">{ka ? "მიწოდება" : "Delivery"}</Link>
            <Link href="/returns">
              {ka ? "დაბრუნება და პირობები" : "Returns and policies"}
            </Link>
            <Link href="/about">{ka ? "ჩვენ შესახებ" : "Our story"}</Link>
            <Link href="/contact">{ka ? "კონტაქტი" : "Contact"}</Link>
            <Link href={user ? "/profile" : "/login"}>
              <UserRound />
              {user
                ? ka
                  ? "ჩემი პროფილი"
                  : "My profile"
                : ka
                  ? "შესვლა"
                  : "Log in"}
            </Link>
            {!user && (
              <Link href="/register">{ka ? "რეგისტრაცია" : "Register"}</Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin">
                <ShieldCheck />
                {ka ? "ადმინისტრატორის პანელი" : "Admin panel"}
              </Link>
            )}
          </div>

          <div className="fb-footer__contact">
            <h3>{ka ? "კონტაქტი" : "Contact"}</h3>
            {siteContact.phone ? (
              <a href={phoneHref}>
                <Phone />
                {siteContact.phone}
              </a>
            ) : (
              <Link href="/contact">
                <Phone />
                {ka
                  ? "სწრაფი კავშირი საკონტაქტო გვერდიდან"
                  : "Quick support from the contact page"}
              </Link>
            )}
            {siteContact.email ? (
              <a href={`mailto:${siteContact.email}`}>
                <Mail />
                {siteContact.email}
              </a>
            ) : (
              <Link href="/contact">
                <Mail />
                {ka
                  ? "მოგვწერეთ უსაფრთხო ფორმით"
                  : "Send us a message securely"}
              </Link>
            )}
            {siteContact.address ? (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(siteContact.address)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin />
                {siteContact.address}
              </a>
            ) : (
              <p>
                <MapPin />
                {ka
                  ? "თბილისი · მისამართი დაზუსტდება შეკვეთისას"
                  : "Tbilisi · address confirmed with your order"}
              </p>
            )}
            <p>
              <Clock3 />
              {ka ? siteContact.hoursKa : siteContact.hoursEn}
            </p>
          </div>
        </div>

        <div className="fb-footer__bottom">
          <span>
            © {new Date().getFullYear()} Flower’s Boutique ·{" "}
            {ka ? "ყველა უფლება დაცულია" : "All rights reserved"}
          </span>
          <div className="fb-footer__legal">
            <Link href="/terms">{ka ? "წესები და პირობები" : "Terms"}</Link>
            <Link href="/privacy">{ka ? "კონფიდენციალურობა" : "Privacy"}</Link>
          </div>
          <div className="fb-footer__trust">
            <span>
              <ShieldCheck />
              {ka ? "დაცული შეკვეთა" : "Secure ordering"}
            </span>
            <span>
              <Sparkles />
              {ka ? "ხელით აწყობილი" : "Hand-finished"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
