import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { journalPosts } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

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
  return { title: post.title, description: post.excerpt };
}

export default async function JournalArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="pb-20 sm:pb-28">
      <div className="container-fb pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Journal", href: "/journal" },
            { label: post.title },
          ]}
        />
      </div>

      <div className="container-fb mx-auto mt-6 max-w-3xl">
        <p className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
          {post.category} · {post.readMinutes} min read · {formatDate(post.date)}
        </p>
        <h1 className="font-display mt-3 text-[30px] leading-tight sm:text-[40px]">{post.title}</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--muted)]">{post.excerpt}</p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-warm)]">
          <Image src={post.image} alt="" fill priority sizes="(max-width:768px) 100vw, 768px" className="object-cover" />
        </div>

        <div className="mt-8 grid gap-5">
          {post.body.map((para, i) => (
            <p key={i} className="text-[15px] leading-[1.75] text-[var(--ink)]/85">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-10 border-t pt-8">
          <Button href="/catalog" variant="dark">Shop fresh bouquets</Button>
        </div>
      </div>
    </article>
  );
}
