import {
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
            <Link href="/" aria-label="Flower’s Boutique home">
              <img
                src="/brand/flowers-boutique-logo-192.webp"
                alt=""
                width="52"
                height="52"
                loading="lazy"
              />
              <strong>
                Flower’s <em>Boutique</em>
              </strong>
            </Link>
            <p>
              {ka
                ? "ყვავილების ბუტიკი თბილისში — მზა თაიგულები და თქვენზე მორგებული კომპოზიციები."
                : "A Tbilisi flower boutique for ready-made bouquets and personal floral compositions."}
            </p>
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
            © {new Date().getFullYear()} Flower’s Boutique ·{" "}
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
