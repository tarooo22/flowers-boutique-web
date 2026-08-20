import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { journalPosts } from "@/data/journal";
import { JournalArticleView } from "@/components/journal/JournalArticleView";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Not found" };
  return { title: post.content.en.title, description: post.content.en.excerpt };
}

export default async function JournalArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return <JournalArticleView post={post} />;
}
