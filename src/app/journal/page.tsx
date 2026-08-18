import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { journalPosts } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from the studio — flower care, seasonal guides and ideas.",
};

export default function JournalPage() {
  return (
    <div className="container-fb pt-6 pb-20 sm:pb-28">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />
      <h1 className="font-display mt-4 text-[30px] leading-none sm:text-[40px]">Journal</h1>
      <p className="mt-3 text-[14px] text-[var(--muted)]">Notes from the studio.</p>

      <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {journalPosts.map((post, i) => (
          <Link key={post.id} href={`/journal/${post.slug}`} className="group flex flex-col">
            <div className="card-media relative aspect-[7/5] overflow-hidden rounded-[10px] bg-[var(--surface-warm)]">
              <Image
                src={post.image}
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width:640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="pt-3">
              <p className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                {post.category} · {post.readMinutes} min
              </p>
              <h2 className="font-display mt-1.5 text-[19px] leading-snug transition-colors group-hover:text-[var(--action-deep)]">
                {post.title}
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)] line-clamp-2">
                {post.excerpt}
              </p>
              <p className="mono mt-2 text-[11px] text-[var(--muted-2)]">{formatDate(post.date)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
