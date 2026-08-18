import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the bouquets in your cart.",
};

export default function CartPage() {
  return <CartView />;
}
