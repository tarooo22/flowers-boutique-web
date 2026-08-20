import type { Metadata } from "next";
import { RewardsView } from "@/components/rewards/RewardsView";

export const metadata: Metadata = {
  title: "Rewards",
  description: "Earn 1–8% back in petals on every order with Flower's Rewards.",
};

const tiers = [
  { n: 1, label: "Start", note: "You are here", pct: "1%", active: true },
  { n: 2, label: "From 1 000 ₾", note: "", pct: "3%" },
  { n: 3, label: "From 5 000 ₾", note: "", pct: "5%" },
  { n: 4, label: "From 10 000 ₾", note: "Top tier", pct: "8%" },
];

export default function RewardsPage() {
  return <RewardsView />;
}
