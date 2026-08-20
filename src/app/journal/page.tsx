import type { Metadata } from "next";
import { JournalListView } from "@/components/journal/JournalListView";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from the studio — flower care, seasonal guides and ideas.",
};

export default function JournalPage() {
  return <JournalListView />;
}
