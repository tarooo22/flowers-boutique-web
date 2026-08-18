"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { mainNav } from "@/config/nav";
import { categories } from "@/data/categories";
import { brand } from "@/config/brand";
import { Logo } from "./Logo";
import { CloseIcon, ChevronRight, PhoneIcon, WhatsappIcon } from "@/components/ui/Icons";

export function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen } = useStore();
  const { t } = useI18n();
  const pathname = usePathname();

  // close on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileNavOpen(false);
    if (mobileNavOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen, setMobileNavOpen]);

  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        aria-label="Close menu"
        className="fb-overlay absolute inset-0 bg-[var(--overlay)]"
        onClick={() => setMobileNavOpen(false)}
      />
      <div className="fb-drawer absolute left-0 top-0 flex h-full w-[86%] max-w-[360px] flex-col bg-[var(--page)] shadow-[var(--shadow-pop)]">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Logo onClick={() => setMobileNavOpen(false)} />
          <button
            aria-label={t("header.closeMenu")}
            onClick={() => setMobileNavOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-5">
          <ul className="grid gap-0.5">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-lg py-2.5 text-[16px] font-semibold text-[var(--ink)]"
                >
                  {item.key ? t(item.key) : item.label}
                  <ChevronRight className="h-4 w-4 text-[var(--muted-2)]" />
                </Link>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-6 mb-2">{t("nav.categories")}</p>
          <ul className="grid gap-0.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/catalog?category=${c.id}`}
                  className="flex items-center justify-between rounded-lg py-2 text-[14px] text-[var(--ink)]/85"
                >
                  {t(`category.${c.id}`)}
                  <span className="mono text-[12px] text-[var(--muted-2)]">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t px-5 py-4">
          <a href={brand.phoneHref} className="flex items-center gap-2 py-1.5 text-[14px] font-semibold">
            <PhoneIcon className="h-4 w-4 text-[var(--action)]" />
            {brand.phone}
          </a>
          <a
            href={brand.whatsappHref}
            className="flex items-center gap-2 py-1.5 text-[14px] text-[var(--muted)]"
          >
            <WhatsappIcon className="h-4 w-4 text-[#25D366]" />
            WhatsApp · {brand.hoursShort}
          </a>
        </div>
      </div>
    </div>
  );
}
