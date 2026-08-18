import type { Metadata } from "next";
import { FavoritesView } from "@/components/catalog/FavoritesView";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved bouquets.",
};

export default function FavoritesPage() {
  return <FavoritesView />;
}
