"use client";

import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/brand";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import {
  PinIcon,
  TruckIcon,
  LeafIcon,
  ArrowRight,
  PhoneIcon,
  WhatsappIcon,
} from "@/components/ui/Icons";

export function AboutView() {
  const { t } = useI18n();

  const stats = [
    { value: "7", label: t("about.statYears") },
    { value: "12k+", label: t("about.statBouquets") },
    { value: "9", label: t("about.statFlorists") },
    { value: "4.9", label: t("about.statRating") },
  ];

  const services = [
    {
      id: "shop",
      eyebrow: t("ed.school.eyebrow"),
      title: t("ed.school.title"),
      text: t("ed.school.text"),
      href: "/builder",
      cta: t("common.learnMore"),
      image: "/manus-storage/fb-floristry-school-v2_4cc3b90e.jpg",
    },
    {
      id: "school",
      eyebrow: t("ed.events.eyebrow"),
      title: t("ed.events.title"),
      text: t("ed.events.text"),
      href: "/catalog?category=wedding",
      cta: t("common.learnMore"),
      image: "/manus-storage/fb-event-florals-v2_506c3067.jpg",
    },
    {
      id: "events",
      eyebrow: t("cb.eyebrow"),
      title: t("cb.title"),
      text: t("cb.text"),
      href: "/rewards",
      cta: t("cb.cta"),
      image: "/manus-storage/fb-about-studio-reference_85c9ad71.jpg",
    },
  ];

  const values = [
    { icon: LeafIcon, title: t("about.value1Title"), text: t("about.value1Text") },
    { icon: TruckIcon, title: t("about.value2Title"), text: t("about.value2Text") },
    { icon: PinIcon, title: t("about.value3Title"), text: t("about.value3Text") },
  ];

  return (
    <div className="pb-20 sm:pb-28">
      {/* ---------- hero ---------- */}
      <div className="border-b border-[var(--line)] bg-[var(--surface-warm)]">
        <div className="container-fb py-8 sm:py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: t("common.aboutUs") }]} />

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                {t("about.eyebrow")}
              </p>
              <h1 className="font-display mt-3 max-w-[17ch] text-[34px] leading-[1.05] tracking-[-0.015em] sm:text-[46px]">
                {t("about.title")}
              </h1>
              <p className="mt-5 max-w-[52ch] text-[14.5px] leading-relaxed text-[var(--ink)]/75">
                {t("about.lead")}
              </p>
              <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-[var(--muted)]">
                {t("about.lead2")}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/catalog" variant="primary" size="lg">
                  {t("common.shopCatalog")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/builder" variant="outline" size="lg">
                  {t("nav.builder")}
                </Button>
              </div>
            </div>

            {/* tilted studio photo */}
            <div className="tilt-scene">
              <Tilt max={7}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-pop)]">
                  <Image
                    src="/manus-storage/fb-about-studio-reference_85c9ad71.jpg"
                    alt={brand.name}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width:1024px) 92vw, 520px"
                    className="object-cover"
                  />
                </div>
              </Tilt>
            </div>
          </div>

          {/* stats */}
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--line-strong)] pt-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="mono text-[24px] font-bold leading-none sm:text-[30px]">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-[12px] leading-tight text-[var(--muted)]">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ---------- values ---------- */}
      <section className="container-fb pt-14">
        <Reveal>
          <p className="eyebrow mb-2">{t("about.valuesTitle")}</p>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="h-full rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6 transition-shadow hover:shadow-[var(--shadow-card)]">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--surface-warm)]">
                  <v.icon className="h-5 w-5 text-[var(--action)]" />
                </span>
                <h3 className="font-display mt-4 text-[18px] leading-snug">{v.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- services ---------- */}
      <section className="container-fb pt-14">
        <Reveal>
          <p className="eyebrow mb-2">{t("about.whatWeDo")}</p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <Link
                href={s.href}
                id={s.id}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border bg-[var(--surface)] transition-shadow hover:shadow-[var(--shadow-float)]"
              >
                <div className="card-media relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {s.eyebrow}
                  </p>
                  <h2 className="font-display mt-1.5 text-[19px] leading-tight">{s.title}</h2>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[var(--muted)]">
                    {s.text}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--action-deep)]">
                    {s.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- visit / contact ---------- */}
      <section id="contact" className="container-fb pt-14">
        <Reveal direction="zoom">
          <div className="grid overflow-hidden rounded-[var(--radius-lg)] border md:grid-cols-2">
            <div className="relative min-h-[280px] overflow-hidden bg-[var(--surface-warm)] sm:min-h-[360px]">
              <iframe
                title={`${brand.name} map`}
                src={brand.mapEmbedUrl}
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                aria-label={`${brand.name} · ${brand.addressFull}`}
                aria-describedby="studio-map-summary"
                className="absolute inset-0 h-full w-full border-0"
              />
              <p id="studio-map-summary" className="sr-only">{t("about.mapSummary", { address: brand.addressFull })}</p>
              <noscript><p className="absolute inset-x-4 bottom-16 z-10 rounded-[var(--radius-sm)] bg-white/95 px-3 py-2 text-[12px] text-[var(--ink)] shadow-[var(--shadow-card)]">{t("about.mapFallback")}</p></noscript>
              <div className="pointer-events-none absolute top-4 left-4 z-10 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[12px] font-semibold text-[var(--ink)] shadow-[var(--shadow-card)] backdrop-blur">
                <PinIcon className="h-4 w-4 shrink-0 text-[var(--action)]" />
                <span className="truncate">{brand.address}</span>
              </div>
              <a
                href={brand.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 z-10 inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--ink)] px-4 text-[13px] font-semibold text-white shadow-[var(--shadow-float)] transition hover:bg-[var(--ink-2)]"
              >
                <PinIcon className="h-4 w-4" />
                {t("about.getDirections")}
              </a>
            </div>

            <div className="bg-[var(--surface)] px-6 py-8 sm:px-9 sm:py-10">
              <h2 className="font-display text-[24px] leading-tight">{t("about.visitTitle")}</h2>
              <p className="mt-2 max-w-[42ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
                {t("about.visitText")}
              </p>

              <dl className="mt-6 grid gap-3 text-[13.5px]" id="delivery">
                <Row label={t("about.address")}>{brand.addressFull}</Row>
                <Row label={t("about.hours")}>{brand.hours}</Row>
                <Row label={t("about.phone")}>
                  <a href={brand.phoneHref} className="font-semibold text-[var(--action-deep)]">
                    {brand.phone}
                  </a>
                </Row>
                <Row label={t("about.email")}>
                  <a href={brand.emailHref} className="text-[var(--action-deep)]">
                    {brand.email}
                  </a>
                </Row>
                <Row label={t("about.social")}>
                  <span className="flex flex-wrap gap-3">
                    <a href={brand.social.instagram} className="text-[var(--action-deep)]">
                      Instagram
                    </a>
                    <a href={brand.social.facebook} className="text-[var(--action-deep)]">
                      Facebook
                    </a>
                    <a href={brand.social.messenger} target="_blank" rel="noopener noreferrer" className="text-[var(--action-deep)]">
                      Messenger
                    </a>
                  </span>
                </Row>
              </dl>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <Button href={brand.phoneHref} variant="dark">
                  <PhoneIcon className="h-4 w-4" />
                  {t("cs.call")}
                </Button>
                <a
                  href={brand.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[#25D366] px-6 text-[13.5px] font-semibold text-white transition hover:bg-[#1eb85a]"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>

              <p className="mt-6 border-t pt-4 text-[12px] text-[var(--muted-2)]">
                {brand.legalName} · {brand.taxId}
              </p>
            </div>

          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-3">
      <dt className="text-[var(--muted-2)]">{label}</dt>
      <dd className="text-[var(--ink)]/85">{children}</dd>
    </div>
  );
}
