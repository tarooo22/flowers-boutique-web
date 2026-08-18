import type { CategoryId, Product, ProductVariant } from "@/types";

const stdVariants: ProductVariant[] = [
  { id: "classic", label: "Classic", priceDelta: 0 },
  { id: "grand", label: "Grand", priceDelta: 60 },
  { id: "deluxe", label: "Deluxe", priceDelta: 130 },
];

const stdCare = [
  "Trim 2–3 cm off the stems at an angle before arranging.",
  "Change the water every two days and keep away from direct sun.",
  "Remove any leaves that would sit below the waterline.",
];

/**
 * Photography pool. Each product picks a primary and a secondary shot; this is
 * a demo catalogue, so shots are reused across products by colour family.
 */
const P = {
  studio1: "/manus-storage/studio-1_47c32a42.png",
  studio2: "/manus-storage/studio-2_0117c5d8.png",
  studio3: "/manus-storage/studio-3_71040.png",
  studio4: "/manus-storage/studio-4_b73dad7b.png",
  studio5: "/manus-storage/studio-5_c8839d18.png",
  blushSpray: "/manus-storage/shot-1_c1aaea3a.webp",
  chrysanth: "/manus-storage/shot-2_9a94dc79.webp",
  redOrange: "/manus-storage/shot-3_db9224d2.webp",
  giftSet: "/manus-storage/shot-4_5da681a6.webp",
  pinkSpray: "/manus-storage/shot-5_966554ed.webp",
  deepRoses: "/manus-storage/editorial-roses_39a060f9.webp",
  market: "/manus-storage/editorial-mixed_89b233bb.webp",
  collection: "/manus-storage/editorial-collection_fd67f2f1.webp",
} as const;

type Seed = {
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  compareAt?: number;
  photos: [string, string];
  category: CategoryId;
  colors: string[];
  tags: string[];
  description: string;
  available?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
};

const seeds: Seed[] = [
  { slug: "rosewood-romance", name: "Rosewood Romance", subtitle: "Garden roses & ranunculus", price: 240, compareAt: 280, photos: [P.studio5, P.studio3], category: "signature", colors: ["Blush", "Pink"], tags: ["romance", "bestseller"], description: "A soft, layered bouquet of garden roses and ranunculus wrapped in matte kraft — our most-gifted romantic arrangement.", bestseller: true },
  { slug: "coral-daydream", name: "Coral Daydream", subtitle: "Coral roses & spray", price: 210, photos: [P.studio2, P.pinkSpray], category: "roses", colors: ["Coral", "Peach"], tags: ["joy", "bestseller"], description: "Warm coral roses gathered with peach spray roses for a sun-lit, cheerful bouquet.", bestseller: true },
  { slug: "crimson-letter", name: "Crimson Letter", subtitle: "Classic red roses", price: 260, photos: [P.redOrange, P.deepRoses], category: "roses", colors: ["Red"], tags: ["romance"], description: "Twenty-five velvety red roses, hand-tied — the timeless way to say it.", isNew: true },
  { slug: "ivory-vows", name: "Ivory Vows", subtitle: "White roses & lisianthus", price: 230, photos: [P.blushSpray, P.collection], category: "wedding", colors: ["White", "Cream"], tags: ["wedding"], description: "An elegant ivory palette of roses and lisianthus, ideal for weddings and quiet celebrations." },
  { slug: "lavender-hour", name: "Lavender Hour", subtitle: "Lisianthus & lavender", price: 195, photos: [P.chrysanth, P.deepRoses], category: "seasonal", colors: ["Lavender", "Purple"], tags: ["joy"], description: "Cool lavender tones with a whisper of scent, cut fresh for the season." },
  { slug: "golden-sunset", name: "Golden Sunset", subtitle: "Amber roses & craspedia", price: 205, photos: [P.redOrange, P.market], category: "signature", colors: ["Orange", "Amber"], tags: ["joy", "bestseller"], description: "A glowing mix of amber roses and craspedia that brings the last light of the day indoors.", bestseller: true },
  { slug: "garden-party", name: "Garden Party", subtitle: "Mixed seasonal blooms", price: 220, photos: [P.market, P.blushSpray], category: "seasonal", colors: ["Multi"], tags: ["joy"], description: "A generous, just-picked mix of whatever is most beautiful in the market this week." },
  { slug: "blue-note", name: "Blue Note", subtitle: "Delphinium & hydrangea", price: 235, photos: [P.market, P.chrysanth], category: "seasonal", colors: ["Blue"], tags: ["joy"], description: "Uncommon blue delphinium and hydrangea for someone who loves a statement." },
  { slug: "peony-crush", name: "Peony Crush", subtitle: "Seasonal peonies", price: 285, compareAt: 320, photos: [P.pinkSpray, P.studio5], category: "peonies", colors: ["Pink", "Blush"], tags: ["romance", "bestseller"], description: "Full, ruffled peonies at the peak of their short season — while they last.", bestseller: true, isNew: true },
  { slug: "autumn-ember", name: "Autumn Ember", subtitle: "Dahlias & foliage", price: 215, photos: [P.redOrange, P.collection], category: "seasonal", colors: ["Rust", "Orange"], tags: ["joy"], description: "Rich dahlias and turning foliage — a warm bouquet for cooler months." },
  { slug: "soft-pastel", name: "Soft Pastel", subtitle: "Pastel garden mix", price: 190, photos: [P.blushSpray, P.studio3], category: "signature", colors: ["Pastel", "Multi"], tags: ["joy"], description: "A gentle pastel arrangement that suits almost any table or occasion." },
  { slug: "sunny-side", name: "Sunny Side", subtitle: "Yellow roses & tulips", price: 185, photos: [P.market, P.collection], category: "seasonal", colors: ["Yellow"], tags: ["joy"], description: "Bright yellow roses and tulips to send a little sunshine across town." },
  { slug: "burgundy-velvet", name: "Burgundy Velvet", subtitle: "Deep red & plum tones", price: 250, photos: [P.deepRoses, P.pinkSpray], category: "signature", colors: ["Burgundy", "Plum"], tags: ["romance"], description: "Moody burgundy and plum blooms wrapped for a dramatic, grown-up gift." },
  { slug: "fresh-mint", name: "Fresh Mint", subtitle: "White blooms & eucalyptus", price: 200, photos: [P.blushSpray, P.market], category: "signature", colors: ["White", "Green"], tags: ["joy"], description: "Crisp white flowers layered with eucalyptus for a clean, modern look." },
  { slug: "first-blush", name: "First Blush", subtitle: "Blush roses in a box", price: 245, photos: [P.studio3, P.studio4], category: "boxes", colors: ["Blush"], tags: ["romance", "bestseller"], description: "Blush roses arranged in our signature hat box — no vase required.", bestseller: true },
  { slug: "coral-box", name: "Coral Keepsake", subtitle: "Coral roses in a box", price: 255, photos: [P.collection, P.giftSet], category: "boxes", colors: ["Coral"], tags: ["joy"], description: "A rounded dome of coral roses set in a keepsake box that lasts for days." },
  { slug: "peony-bride", name: "Peony Bride", subtitle: "Bridal peony bouquet", price: 300, photos: [P.studio4, P.studio3], category: "wedding", colors: ["Blush", "White"], tags: ["wedding"], description: "A soft, romantic bridal bouquet built around seasonal peonies." },
  { slug: "violet-dream", name: "Violet Dream", subtitle: "Purple statement blooms", price: 225, photos: [P.chrysanth, P.market], category: "signature", colors: ["Purple"], tags: ["joy"], description: "A confident purple palette for birthdays and bold personalities." },
  { slug: "amber-glow", name: "Amber Glow", subtitle: "Orange & peach roses", price: 210, photos: [P.redOrange, P.studio2], category: "roses", colors: ["Orange", "Peach"], tags: ["joy"], description: "Peach and amber roses in a warm, welcoming hand-tie." },
  { slug: "white-serenity", name: "White Serenity", subtitle: "All-white sympathy", price: 230, photos: [P.blushSpray, P.collection], category: "sympathy", colors: ["White"], tags: ["sympathy"], description: "A calm, all-white arrangement offered with care and discretion." },
  { slug: "true-red", name: "True Red", subtitle: "Long-stem red roses", price: 270, photos: [P.deepRoses, P.redOrange], category: "roses", colors: ["Red"], tags: ["romance", "bestseller"], description: "Fifteen long-stem red roses, simply and beautifully tied.", bestseller: true },
  { slug: "market-mix", name: "Market Mix", subtitle: "Florist's choice", price: 175, photos: [P.market, P.collection], category: "seasonal", colors: ["Multi"], tags: ["joy"], description: "Let our florists surprise you with the best of today's market." },
  { slug: "buttercup", name: "Buttercup", subtitle: "Yellow & white spring", price: 180, photos: [P.collection, P.blushSpray], category: "seasonal", colors: ["Yellow", "White"], tags: ["joy"], description: "A fresh yellow-and-white spring bouquet full of movement." },
  { slug: "midnight-blue", name: "Midnight Blue", subtitle: "Blue & white contrast", price: 240, photos: [P.chrysanth, P.market], category: "signature", colors: ["Blue", "White"], tags: ["romance"], description: "Deep blues against crisp white for an unforgettable arrangement.", isNew: true },
];

export const products: Product[] = seeds.map((s, i) => ({
  id: `fb-${String(i + 1).padStart(3, "0")}`,
  slug: s.slug,
  name: s.name,
  subtitle: s.subtitle,
  price: s.price,
  compareAt: s.compareAt,
  images: [...s.photos],
  category: s.category,
  tags: s.tags,
  colors: s.colors,
  description: s.description,
  care: stdCare,
  variants: stdVariants,
  available: s.available ?? true,
  bestseller: s.bestseller,
  isNew: s.isNew,
}));
