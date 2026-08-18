"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { ArrowRight } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n";

/** Editorial / services section with 3D-tilting image-overlay cards. */
export function EditorialSection() {
  const { t } = useI18n();

  const cards = [
    {
      eyebrow: t("ed.school.eyebrow"),
      title: t("ed.school.title"),
      text: t("ed.school.text"),
      href: "/about#school",
      image: "/manus-storage/fb-floristry-school-v2_4cc3b90e.jpg",
    },
    {
      eyebrow: t("ed.events.eyebrow"),
      title: t("ed.events.title"),
      text: t("ed.events.text"),
      href: "/about#events",
      image: "/manus-storage/fb-event-florals-v2_506c3067.jpg",
    },
  ];

  return (
    <section className="container-fb pt-12 sm:pt-16">
      <Reveal>
        <SectionHeader
          title={t("ed.title")}
          eyebrow={t("ed.eyebrow")}
          viewAllHref="/about"
          viewAllLabel={t("common.aboutUs")}
        />
      </Reveal>
      <div className="tilt-scene grid gap-4 sm:gap-5 md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.title} direction={i === 0 ? "left" : "right"}>
            <Tilt max={6}>
              <Link
                href={c.href}
                className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] p-6 sm:min-h-[300px] sm:p-8"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />
                <div className="tilt-layer relative" style={{ ["--tz" as string]: "40px" }}>
                  <p className="mono text-[11px] uppercase tracking-[0.18em] text-white/75">
                    {c.eyebrow}
                  </p>
                  <h3 className="font-display mt-1.5 max-w-[20ch] text-[22px] leading-tight text-white sm:text-[26px]">
                    {c.title}
                  </h3>
                  <p className="mt-2 max-w-[40ch] text-[13px] leading-relaxed text-white/80">
                    {c.text}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                    {t("common.learnMore")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
