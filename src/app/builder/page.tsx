import type { Metadata } from "next";
import { BuilderTabs } from "@/components/builder/BuilderTabs";

export const metadata: Metadata = {
  title: "Build a bouquet",
  description:
    "Compose your own bouquet stem by stem, or describe the bouquet you imagine and let AI sketch it.",
};

export default function BuilderPage() {
  return <BuilderTabs />;
}
