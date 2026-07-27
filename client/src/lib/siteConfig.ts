const readPublicValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const publicContactDefaults = {
  address: "თბილისი, ვაზისუბანი, შანდორ პეტეფის ქ. №1",
  phone: "+995 511 55 56 50",
  email: "info.flowersboutique@gmail.com",
  whatsapp: "https://wa.me/995511555650",
  instagram: "https://www.instagram.com/myflowersboutique/",
  facebook: "https://www.facebook.com/flowersboutiques/",
};

export const siteContact = {
  address:
    readPublicValue(import.meta.env.VITE_CONTACT_ADDRESS) ||
    publicContactDefaults.address,
  phone:
    readPublicValue(import.meta.env.VITE_CONTACT_PHONE) ||
    publicContactDefaults.phone,
  email:
    readPublicValue(import.meta.env.VITE_CONTACT_EMAIL) ||
    publicContactDefaults.email,
  whatsapp:
    readPublicValue(import.meta.env.VITE_WHATSAPP_URL) ||
    publicContactDefaults.whatsapp,
  instagram:
    readPublicValue(import.meta.env.VITE_INSTAGRAM_URL) ||
    publicContactDefaults.instagram,
  facebook: publicContactDefaults.facebook,
  instagramHandle: "@myflowersboutique",
  hoursKa: "ყოველდღე · 10:00–20:00",
  hoursEn: "Every day · 10:00–20:00",
};

export const contactFallback = {
  ka: "დაგვიკავშირდით საკონტაქტო გვერდიდან",
  en: "Contact us through the contact page",
};

export const phoneHref = `tel:${siteContact.phone.replace(/\s+/g, "")}`;
