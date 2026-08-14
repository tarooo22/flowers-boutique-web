import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { phoneHref, siteContact } from "@/lib/siteConfig";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandWordmark } from "@/components/BrandWordmark";

export default function Footer() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const ka = language === "ka";
  const mapUrl = siteContact.address
    ? `https://maps.google.com/?q=${encodeURIComponent(siteContact.address)}`
    : "";

  const shopLinks = (
    <>
      <Link href="/catalog">{ka ? "ყველა თაიგული" : "All bouquets"}</Link>
      <Link href="/bouquet-builder">
        {ka ? "შექმენი თაიგული" : "Create a bouquet"}
      </Link>
      <Link href="/wishlist">{ka ? "რჩეულები" : "Wishlist"}</Link>
    </>
  );
  const infoLinks = (
    <>
      <Link href="/about">{ka ? "ჩვენ შესახებ" : "About"}</Link>
      <Link href="/contact">{ka ? "კონტაქტი" : "Contact"}</Link>
      <Link href="/delivery">
        {ka ? "მიწოდების ინფორმაცია" : "Delivery information"}
      </Link>
      <Link href="/returns">{ka ? "დაბრუნება" : "Returns"}</Link>
      <Link href={user ? "/profile" : "/login"}>
        <UserRound />
        {user ? (ka ? "ჩემი პროფილი" : "My profile") : ka ? "შესვლა" : "Log in"}
      </Link>
      {user?.role === "admin" && (
        <Link href="/admin">
          <ShieldCheck />
          {ka ? "ადმინისტრატორის პანელი" : "Admin panel"}
        </Link>
      )}
    </>
  );
  const contactLinks = (
    <>
      {siteContact.phone && (
        <a href={phoneHref}>
          <Phone />
          {siteContact.phone}
        </a>
      )}
      {siteContact.email && (
        <a href={`mailto:${siteContact.email}`}>
          <Mail />
          {siteContact.email}
        </a>
      )}
      {mapUrl && (
        <a href={mapUrl} target="_blank" rel="noreferrer">
          <MapPin />
          {siteContact.address}
        </a>
      )}
      <p>
        <Clock3 />
        {ka ? siteContact.hoursKa : siteContact.hoursEn}
      </p>
    </>
  );

  return (
    <footer className="p1-footer">
      <div className="p1-footer__shell">
          <div className="p1-footer__grid">
            <div className="p1-footer__brand">
              <p className="p1-footer__eyebrow">
                {ka ? "თბილისის ყვავილების ატელიე" : "Tbilisi floral atelier"}
              </p>
              <Link href="/" aria-label={ka ? "ყვავილების ბუტიკი და ივენთები — მთავარი" : "Flower’s Boutique & Events home"}>
                <strong>
                  <BrandWordmark language={language} className="p1-footer__wordmark" />
              </strong>
            </Link>
            <p>
              {ka
                ? "ყვავილების ბუტიკი თბილისში — მზა თაიგულები და თქვენზე მორგებული კომპოზიციები."
                  : "A Tbilisi flower boutique for ready-made bouquets and personal floral compositions."}
              </p>
              <Link href="/delivery" className="p1-footer__delivery-cta">
                <span>
                  <small>{ka ? "მზად ხართ შეკვეთისთვის?" : "Ready to order?"}</small>
                  <strong>{ka ? "იხილეთ მიწოდების დეტალები" : "View delivery details"}</strong>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
              <div className="p1-footer__socials">
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
              {siteContact.facebook && (
                <a
                  href={siteContact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook />
                </a>
              )}
            </div>
          </div>
          <div className="p1-footer__desktop-group">
            <h3>{ka ? "მაღაზია" : "Shop"}</h3>
            {shopLinks}
          </div>
          <div className="p1-footer__desktop-group">
            <h3>{ka ? "ინფორმაცია" : "Information"}</h3>
            {infoLinks}
          </div>
          <div className="p1-footer__desktop-group">
            <h3>{ka ? "კონტაქტი" : "Contact"}</h3>
            {contactLinks}
          </div>
          <div className="p1-footer__mobile-groups">
            <details>
              <summary>
                {ka ? "მაღაზია" : "Shop"}
                <ChevronDown />
              </summary>
              <div>{shopLinks}</div>
            </details>
            <details>
              <summary>
                {ka ? "ინფორმაცია" : "Information"}
                <ChevronDown />
              </summary>
              <div>{infoLinks}</div>
            </details>
            <details>
              <summary>
                {ka ? "კონტაქტი" : "Contact"}
                <ChevronDown />
              </summary>
              <div>{contactLinks}</div>
            </details>
          </div>
        </div>
        <div className="p1-footer__bottom">
          <span>
            © {new Date().getFullYear()} {ka ? "ყვავილების ბუტიკი & ივენთები" : "Flower’s Boutique & Events"} ·{" "}
            {ka ? "ყველა უფლება დაცულია" : "All rights reserved"}
          </span>
          <div>
            <Link href="/terms">{ka ? "წესები და პირობები" : "Terms"}</Link>
            <Link href="/privacy">{ka ? "კონფიდენციალურობა" : "Privacy"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
