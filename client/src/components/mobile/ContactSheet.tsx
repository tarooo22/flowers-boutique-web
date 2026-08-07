import {
  Check,
  Copy,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { phoneHref, siteContact } from "@/lib/siteConfig";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ContactSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ContactSheet({
  open,
  onOpenChange,
}: ContactSheetProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const ka = language === "ka";
  const mapUrl = siteContact.address
    ? `https://maps.google.com/?q=${encodeURIComponent(siteContact.address)}`
    : "";

  const copyPhone = async () => {
    await navigator.clipboard.writeText(siteContact.phone);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="p1-contact-sheet">
        <SheetHeader className="p1-contact-sheet__header">
          <p className="p1-kicker">FLOWER’S BOUTIQUE · TBILISI</p>
          <SheetTitle>
            {ka ? "როგორ დაგეხმაროთ?" : "How can we help?"}
          </SheetTitle>
          <SheetDescription>
            {ka
              ? "აირჩიეთ თქვენთვის მოსახერხებელი საკონტაქტო არხი."
              : "Choose the most convenient way to reach the boutique."}
          </SheetDescription>
        </SheetHeader>
        <div className="p1-contact-sheet__actions">
          {siteContact.phone && (
            <a href={phoneHref}>
              <Phone />
              {ka ? "დარეკვა" : "Call"}
            </a>
          )}
          {siteContact.whatsapp && (
            <a href={siteContact.whatsapp} target="_blank" rel="noreferrer">
              <Send />
              WhatsApp
            </a>
          )}
          {siteContact.messenger && (
            <a href={siteContact.messenger} target="_blank" rel="noreferrer">
              <Facebook />
              Messenger
            </a>
          )}
          {siteContact.email && (
            <a href={`mailto:${siteContact.email}`}>
              <Mail />
              {ka ? "ელფოსტა" : "Email"}
            </a>
          )}
          {mapUrl && (
            <a href={mapUrl} target="_blank" rel="noreferrer">
              <MapPin />
              {ka ? "რუკა" : "Map"}
            </a>
          )}
          {siteContact.instagram && (
            <a href={siteContact.instagram} target="_blank" rel="noreferrer">
              <Instagram />
              Instagram
            </a>
          )}
          {siteContact.facebook && (
            <a href={siteContact.facebook} target="_blank" rel="noreferrer">
              <Facebook />
              Facebook
            </a>
          )}
        </div>
        {siteContact.phone && (
          <button
            type="button"
            className="p1-contact-sheet__copy"
            onClick={copyPhone}
          >
            {copied ? <Check /> : <Copy />}
            {copied
              ? ka
                ? "ნომერი დაკოპირდა"
                : "Number copied"
              : siteContact.phone}
          </button>
        )}
      </SheetContent>
    </Sheet>
  );
}
