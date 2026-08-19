export interface NavItem {
  label: string;
  href: string;
  key?: string;
  /** False only when the live catalog has no matching published collection. */
  available?: boolean;
}

export const mainNav: NavItem[] = [
  { label: "All Bouquets", href: "/catalog", key: "nav.allBouquets" },
  { label: "Build a bouquet", href: "/builder", key: "nav.builder" },
  { label: "About", href: "/about", key: "nav.about" },
  { label: "Rewards", href: "/rewards", key: "nav.rewards" },
];

export const footerNav: { title: string; titleKey: string; links: NavItem[] }[] = [
  {
    title: "Shop",
    titleKey: "footer.shop",
    links: [
      { label: "Catalog", href: "/catalog", key: "footer.catalog" },
      { label: "Build a bouquet", href: "/builder", key: "nav.builder" },
      { label: "Bestsellers", href: "/catalog?occasion=featured", key: "footer.bestsellers" },
      { label: "Flower Boxes", href: "/catalog", key: "footer.flowerBoxes", available: false },
      { label: "Peonies", href: "/catalog", key: "footer.peonies", available: false },
    ],
  },
  {
    title: "Company",
    titleKey: "footer.company",
    links: [
      { label: "About us", href: "/about", key: "common.aboutUs" },
      { label: "Journal", href: "/journal", key: "footer.journal" },
      { label: "Rewards", href: "/rewards", key: "nav.rewards" },
      { label: "Wedding & Events", href: "/catalog", key: "footer.weddingEvents", available: false },
    ],
  },
  {
    title: "Info",
    titleKey: "footer.info",
    links: [
      { label: "Delivery & payment", href: "/about#delivery", key: "footer.deliveryPayment" },
      { label: "Contact", href: "/about#contact", key: "footer.contact" },
      { label: "Wishlist", href: "/favorites", key: "header.wishlist" },
      { label: "My account", href: "/account/login", key: "footer.myAccount" },
    ],
  },
];
