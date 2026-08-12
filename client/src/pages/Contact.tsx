import { FormEvent, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { contactFallback, phoneHref, siteContact } from "@/lib/siteConfig";
import { trpc } from "@/lib/trpc";

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const { language } = useLanguage();
  const ka = language === "ka";
  const fallback = ka ? contactFallback.ka : contactFallback.en;
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: ({ delivered }) => {
      if (delivered) {
        toast.success(
          ka
            ? "თქვენი შეტყობინება მიღებულია. მალე დაგიკავშირდებით."
            : "Your message has been received. We’ll be in touch soon."
        );
        setForm({ name: "", email: "", message: "" });
        return;
      }

      toast.info(
        ka
          ? "შეტყობინების სერვისი დროებით მიუწვდომელია. გამოიყენეთ სწრაფი კავშირის არხები."
          : "Messaging is temporarily unavailable. Please use a quick contact option."
      );
    },
    onError: () => {
      toast.error(
        ka
          ? "შეტყობინება ვერ გაიგზავნა. სცადეთ სწრაფი კავშირის არხი."
          : "We could not send the message. Please use a quick contact option."
      );
    },
  });

  useSEO({
    titleKa: "კონტაქტი | Flower’s Boutique — ყვავილების მაღაზია თბილისში",
    titleEn: "Contact Flower’s Boutique | Flower Shop in Tbilisi",
    descriptionKa:
      "დაუკავშირდით Flower’s Boutique-ს თბილისში — შეკვეთები და მიწოდება ყოველდღე 10:00–20:00.",
    descriptionEn:
      "Contact Flower’s Boutique in Tbilisi for considered bouquets and daily delivery from 10:00–20:00.",
    canonical: "/contact",
    lang: language as "ka" | "en",
  });

  const details = [
    {
      icon: MapPin,
      label: ka ? "მისამართი" : "Address",
      value:
        siteContact.address ||
        (ka
          ? "თბილისი · მისამართი შეკვეთისას"
          : "Tbilisi · address on request"),
      href: siteContact.address
        ? `https://maps.google.com/?q=${encodeURIComponent(siteContact.address)}`
        : "",
    },
    {
      icon: Phone,
      label: ka ? "ტელეფონი" : "Phone",
      value: siteContact.phone || fallback,
      href: phoneHref,
    },
    {
      icon: Mail,
      label: ka ? "ელ-ფოსტა" : "Email",
      value: siteContact.email || fallback,
      href: "",
    },
    {
      icon: Clock3,
      label: ka ? "სამუშაო საათები" : "Opening hours",
      value: ka ? siteContact.hoursKa : siteContact.hoursEn,
      href: "",
    },
  ];

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    contactMutation.mutate(form);
  };

  return (
    <div className="fb-secondary-page fb-contact-page p2-contact-page min-h-screen">
      <Navbar />

      <main id="main-content">
        <header className="fb-contact-hero">
          <div className="fb-page-shell">
            <nav
              className="fb-breadcrumbs"
              aria-label={ka ? "ნავიგაციის ბილიკი" : "Breadcrumb"}
            >
              <Link href="/">{ka ? "მთავარი" : "Home"}</Link>
              <ChevronRight size={13} />
              <span>{ka ? "კონტაქტი" : "Contact"}</span>
            </nav>
            <p className="fb-eyebrow">FLOWER’S BOUTIQUE · TBILISI</p>
            <h1 className="fb-display">
              {ka
                ? "მოდი, ერთად შევქმნათ განსაკუთრებული მომენტი."
                : "Let’s create a remarkable moment together."}
            </h1>
            <p>
              {ka
                ? "შეკვეთის, მიწოდების ან ინდივიდუალური კომპოზიციის შესახებ მოგვწერეთ — დაგეხმარებით სწორი არჩევანის გაკეთებაში."
                : "Contact us about an order, delivery, or a bespoke arrangement and we’ll help you choose well."}
            </p>
          </div>
        </header>

        <section className="fb-page-shell fb-contact-layout">
          <div className="fb-contact-column">
            <section
              className="fb-contact-panel"
              aria-labelledby="contact-details-title"
            >
              <div className="fb-contact-panel__head">
                <p className="fb-eyebrow">
                  01 · {ka ? "ინფორმაცია" : "Details"}
                </p>
                <h2 id="contact-details-title" className="fb-display">
                  {ka ? "საკონტაქტო ინფორმაცია" : "Contact details"}
                </h2>
              </div>
              <div className="fb-contact-details">
                {details.map(({ icon: Icon, label, value, href }) => {
                  const content = (
                    <>
                      <span className="fb-contact-details__icon">
                        <Icon size={19} />
                      </span>
                      <span>
                        <small>{label}</small>
                        <strong>{value}</strong>
                      </span>
                      {href && (
                        <ArrowUpRight
                          size={16}
                          className="fb-contact-details__arrow"
                        />
                      )}
                    </>
                  );
                  return href ? (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={label}>{content}</div>
                  );
                })}
              </div>
            </section>

            <section
              className="fb-contact-panel"
              aria-labelledby="quick-contact-title"
            >
              <div className="fb-contact-panel__head">
                <p className="fb-eyebrow">
                  02 · {ka ? "სწრაფი კავშირი" : "Quick contact"}
                </p>
                <h2 id="quick-contact-title" className="fb-display">
                  {ka
                    ? "დაგვიკავშირდით თქვენთვის მოსახერხებლად"
                    : "Choose the easiest way to reach us"}
                </h2>
              </div>
              <div className="fb-contact-actions">
                {phoneHref && (
                  <a href={phoneHref}>
                    <Phone size={18} />
                    {ka ? "დარეკვა" : "Call"}
                  </a>
                )}
                {siteContact.whatsapp && (
                  <a
                    href={siteContact.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                )}
                <a href={siteContact.facebook} target="_blank" rel="noreferrer">
                  <Facebook size={18} />
                  Facebook
                </a>
                {siteContact.instagram && (
                  <a
                    href={siteContact.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Instagram size={18} />
                    {siteContact.instagramHandle}
                  </a>
                )}
              </div>
            </section>
          </div>

          <div className="fb-contact-column">
            <section
              className="fb-contact-location"
              aria-labelledby="location-title"
            >
              <img
                src="/flower-assets/editorial/new-collection.webp"
                alt={
                  ka
                    ? "Flower’s Boutique-ის ყვავილების სივრცე"
                    : "Flower’s Boutique floral studio"
                }
                loading="lazy"
              />
              <div className="fb-contact-location__shade" />
              <div className="fb-contact-location__content">
                <MapPin size={22} />
                <p className="fb-eyebrow">
                  03 · {ka ? "ჩვენი სივრცე" : "Our studio"}
                </p>
                <h2 id="location-title" className="fb-display">
                  {siteContact.address || (ka ? "თბილისი" : "Tbilisi")}
                </h2>
                <span>
                  {siteContact.address
                    ? ka
                      ? "მდებარეობის ნახვა Google Maps-ზე"
                      : "View the location on Google Maps"
                    : ka
                      ? "ზუსტი მისამართი დადასტურდება შეკვეთისას."
                      : "The exact address is confirmed when ordering."}
                </span>
                {siteContact.address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(siteContact.address)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {ka ? "რუკაზე ნახვა" : "Open map"}
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </section>

            <section
              className="fb-contact-panel fb-contact-form-panel"
              aria-labelledby="contact-form-title"
            >
              <div className="fb-contact-panel__head">
                <p className="fb-eyebrow">
                  04 · {ka ? "მოგვწერეთ" : "Write to us"}
                </p>
                <h2 id="contact-form-title" className="fb-display">
                  {ka ? "თქვენი შეკითხვის შესახებ" : "Tell us what you need"}
                </h2>
              </div>
              <form onSubmit={submitContact} className="fb-contact-form">
                <label htmlFor="contact-name">
                  {ka ? "სახელი" : "Name"}
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={80}
                    value={form.name}
                    onChange={event =>
                      setForm({ ...form, name: event.target.value })
                    }
                  />
                </label>
                <label htmlFor="contact-email">
                  {ka ? "ელ-ფოსტა" : "Email"}
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={form.email}
                    onChange={event =>
                      setForm({ ...form, email: event.target.value })
                    }
                  />
                </label>
                <label
                  htmlFor="contact-message"
                  className="fb-contact-form__message"
                >
                  {ka ? "შეტყობინება" : "Message"}
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    minLength={10}
                    maxLength={1800}
                    value={form.message}
                    onChange={event =>
                      setForm({ ...form, message: event.target.value })
                    }
                  />
                </label>
                <button type="submit" disabled={contactMutation.isPending}>
                  <Send size={17} />
                  {contactMutation.isPending
                    ? ka
                      ? "იგზავნება..."
                      : "Sending..."
                    : ka
                      ? "შეტყობინების გაგზავნა"
                      : "Send message"}
                </button>
                <p aria-live="polite">
                  {ka
                    ? "შეტყობინება გადაეგზავნება ჩვენს გუნდს და ამ ფორმიდან არ შეინახება. თუ სერვისი მიუწვდომელია, გამოიყენეთ ზემოთ მოცემული სწრაფი კავშირის არხები."
                    : "Your message is forwarded to our team and is not stored from this form. If the service is unavailable, use one of the quick contact options above."}
                </p>
              </form>
            </section>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
