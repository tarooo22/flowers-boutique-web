"use client";

import Image from "next/image";
import Link from "next/link";
import { journalPosts } from "@/data/journal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

/** "Journal" — three article cards. */
export function JournalSection() {
  const { lang, t } = useI18n();
  return (
    <section className="container-fb pt-12 sm:pt-16">
      <Reveal>
        <SectionHeader
          title={t("journal.title")}
          eyebrow={t("journal.eyebrow")}
          viewAllHref="/journal"
        />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-3">
        {journalPosts.map((post, i) => {
          const content = post.content[lang];
          return (
          <Reveal key={post.id} delay={i * 90}>
            <Link href={`/journal/${post.slug}`} className="group flex flex-col">
              <div className="card-media relative aspect-[7/5] overflow-hidden rounded-[10px] bg-[var(--surface-warm)]">
                <Image
                  src={post.image}
                  alt={content.title}
                  fill
                  unoptimized
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="pt-3">
                <p className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  {content.category} · {t("journal.min", { n: post.readMinutes })}
                </p>
                <h3 className="font-display mt-1.5 text-[17px] leading-snug transition-colors group-hover:text-[var(--action-deep)]">
                  {content.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--muted)] line-clamp-2">
                  {content.excerpt}
                </p>
                <p className="mono mt-2 text-[11px] text-[var(--muted-2)]">{content.date}</p>
              </div>
            </Link>
          </Reveal>
          );
        })}
      </div>
    </section>
  );
}
