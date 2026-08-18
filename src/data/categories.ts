import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "signature", name: "Signature", slug: "signature", blurb: "Our florists' seasonal favourites", count: 24 },
  { id: "roses", name: "Roses", slug: "roses", blurb: "Timeless single-variety bouquets", count: 18 },
  { id: "peonies", name: "Peonies", slug: "peonies", blurb: "Lush, romantic and in season", count: 12 },
  { id: "seasonal", name: "Seasonal", slug: "seasonal", blurb: "What's blooming right now", count: 20 },
  { id: "boxes", name: "Flower Boxes", slug: "boxes", blurb: "Arranged in signature hat boxes", count: 9 },
  { id: "plants", name: "Plants", slug: "plants", blurb: "Potted greenery that lasts", count: 7 },
  { id: "wedding", name: "Wedding", slug: "wedding", blurb: "Bridal & event florals", count: 11 },
  { id: "sympathy", name: "Sympathy", slug: "sympathy", blurb: "Considered arrangements with care", count: 6 },
];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<Category["id"], Category>;
