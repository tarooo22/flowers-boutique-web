"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { usePersistedLanguage } from "@/lib/i18n";
import { translations } from "@/lib/translations";
import type { JournalPost } from "@/types";

export function JournalArticleView({ post }: { post: JournalPost }) {
  const lang = usePersistedLanguage();
  const content = post.content[lang];
  const t = (key: string, value?: number) => (translations[lang][key] ?? translations.en[key] ?? key).replace("{n}", String(value ?? ""));

  useEffect(() => {
    document.title = `${content.title} · Flower's Boutique`;
  }, [content.title]);

  return (
    <article className="pb-20 sm:pb-28">
      <div className="container-fb pt-6">
        <Breadcrumbs items={[{ label: t("journal.home"), href: "/" }, { label: t("journal.title"), href: "/journal" }, { label: content.title }]} />
      </div>

      <div className="container-fb mx-auto mt-6 max-w-3xl">
        <p className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">{content.category} · {t("journal.minRead", post.readMinutes)} · {formatDate(post.date, lang)}</p>
        <h1 className="font-display mt-3 text-[30px] leading-tight sm:text-[40px]">{content.title}</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--muted)]">{content.excerpt}</p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-warm)]">
          <Image src={post.image} alt={content.title} fill priority unoptimized sizes="(max-width:768px) 100vw, 768px" className="object-cover" />
        </div>

        <div className="mt-8 grid gap-5">
          {content.body.map((paragraph) => <p key={paragraph} className="text-[15px] leading-[1.75] text-[var(--ink)]/85">{paragraph}</p>)}
        </div>

        <div className="mt-10 border-t pt-8">
          <Button href="/catalog" variant="dark">{t("journal.shopFreshBouquets")}</Button>
        </div>
      </div>
    </article>
  );
}
