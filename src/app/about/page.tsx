import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About us",
  description: `${brand.name} — a florist's studio in the heart of Tbilisi.`,
};

export default function AboutPage() {
  return <AboutView />;
}
