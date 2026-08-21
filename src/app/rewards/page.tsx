import type { Metadata } from "next";
import { RewardsView } from "@/components/rewards/RewardsView";

export const metadata: Metadata = {
  title: "Flower Circle",
  description: "Flower’s Boutique loyalty circle with benefits of up to 5% on future bouquets.",
};

export default function RewardsPage() {
  return <RewardsView />;
}
