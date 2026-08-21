/**
 * Centralized Flower's Boutique brand & business configuration.
 * All contact details, social links and copy live here so they can be
 * changed in one place without touching components.
 */

export const brand = {
  name: "Flower's Boutique",
  shortName: "Flower's",
  tagline: "Fresh bouquets, delivered across the city in 90 minutes.",
  legalName: "Flower's Boutique LLC",
  taxId: "ID 404512067",

  phone: "+995 555 123 456",
  phoneHref: "tel:+995555123456",
  email: "hello@flowersboutique.co",
  emailHref: "mailto:hello@flowersboutique.co",
  whatsapp: "+995555123456",
  whatsappHref: "https://wa.me/995555123456",

  address: "12 Chavchavadze Ave, Tbilisi",
  addressFull: "12 Chavchavadze Avenue, Tbilisi 0179, Georgia",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=12%20Chavchavadze%20Avenue%2C%20Tbilisi%2C%20Georgia&z=15&output=embed",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=12%20Chavchavadze%20Avenue%2C%20Tbilisi%2C%20Georgia",
  hours: "Every day 09:00–21:00",
  hoursShort: "09:00–21:00",

  social: {
    instagram: "https://instagram.com/flowersboutique",
    instagramHandle: "@flowersboutique",
    facebook: "https://facebook.com/flowersboutique",
    whatsapp: "https://wa.me/995555123456",
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
