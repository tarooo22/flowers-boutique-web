"use client";

import Link from "next/link";
import { brand } from "@/config/brand";
import { footerNav } from "@/config/nav";
import { useI18n } from "@/lib/i18n";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-[var(--footer)] pt-20 text-[var(--footer-ink)]">
      <div className="container-fb pb-10 pt-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-1">
            <Logo tone="light" />
            <p className="mt-3 max-w-[280px] text-[13px] leading-relaxed text-[var(--footer-muted)]">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Link groups */}
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={t(group.titleKey)}>
              <h3 className="mono mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--footer-muted)]">
                {t(group.titleKey)}
              </h3>
              <ul className="grid gap-2">
                {group.links.map((l) => (
                  <li key={`${group.title}:${l.href}:${l.key ?? l.label}`}>
                    {l.available === false ? (
                      <span
                        aria-disabled="true"
                        title="This collection currently has no published products."
                        className="cursor-not-allowed text-[13px] text-[var(--footer-muted)]"
                      >
                        {l.key ? t(l.key) : l.label}
                      </span>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-[13px] text-[var(--footer-ink)] transition hover:text-white"
                      >
                        {l.key ? t(l.key) : l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mono mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--footer-muted)]">
              {t("footer.contact")}
            </h3>
            <ul className="grid gap-2 text-[13px]">
              <li>
                <a href={brand.phoneHref} className="font-semibold text-white hover:text-[var(--action)]">
                  {brand.phone}
                </a>
              </li>
              <li>
                <a href={brand.emailHref} className="text-[var(--footer-ink)] hover:text-white">
                  {brand.email}
                </a>
              </li>
              <li className="text-[var(--footer-muted)]">{brand.addressFull}</li>
              <li className="text-[var(--footer-muted)]">{brand.hours}</li>
            </ul>
            <div className="mt-4 flex gap-4 text-[13px]">
              <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--footer-ink)] hover:text-white">
                Instagram
              </a>
              <a href={brand.social.facebook} target="_blank" rel="noopener noreferrer" className="text-[var(--footer-ink)] hover:text-white">
                Facebook
              </a>
              <a href={brand.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[var(--footer-ink)] hover:text-white">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Legal row */}
      <div className="border-t border-[var(--line-invert)]">
        <div className="container-fb flex flex-col items-start justify-between gap-2 py-5 text-[12px] text-[var(--footer-muted)] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} flowersboutique.co · {brand.legalName} · {brand.taxId}
          </p>
          <p className="mono tracking-wide">{brand.payments.join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
