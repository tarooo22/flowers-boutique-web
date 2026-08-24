/**
 * Centralized Flower's Boutique brand & business configuration.
 * All contact details, social links and copy live here so they can be
 * changed in one place without touching components.
 */

export const brand = {
  name: "Flower's Boutique",
  shortName: "Flower's",
  tagline: "Fresh bouquets, delivered across the city in 90 minutes.",
  socialImage: "/opengraph-image",
  legalName: "Flower's Boutique LLC",
  taxId: "ID 404512067",

  phone: "+995 511 55 56 50",
  phoneHref: "tel:+995511555650",
  email: "info.flowersboutique@gmail.com",
  emailHref: "mailto:info.flowersboutique@gmail.com",
  whatsapp: "+995511555650",
  whatsappHref: "https://wa.me/995511555650",

  address: "შანდორ პეტეფის ქ. N1, ვაზისუბანი, თბილისი",
  addressFull: "შანდორ პეტეფის ქ. N1, ვაზისუბანი, თბილისი, საქართველო",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Shandor%20Petefi%20Street%201%2C%20Vazisubani%2C%20Tbilisi%2C%20Georgia&z=15&output=embed",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Shandor%20Petefi%20Street%201%2C%20Vazisubani%2C%20Tbilisi%2C%20Georgia",
  hours: "Every day 09:00–21:00",
  hoursShort: "09:00–21:00",

  social: {
    instagram: "https://instagram.com/myflowersboutique",
    instagramHandle: "@myflowersboutique",
    facebook: "https://www.facebook.com/flowersboutiques",
    messenger: "https://m.me/flowersboutiques",
    whatsapp: "https://wa.me/995511555650",
  },

  delivery: {
    windowMinutes: 90,
    freeFrom: 200,
    currency: "₾",
  },

  promo: {
    code: "BLOOM10",
    text: "Delivery across the city in 90 minutes · Free over 200 ₾ · BLOOM10 −10% on your first order",
  },

  payments: ["Visa", "Mastercard", "Apple Pay", "Google Pay"],
} as const;

export type Brand = typeof brand;
