"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { HeaderActions } from "./HeaderActions";
import { MenuIcon } from "@/components/ui/Icons";

export function Header() {
  const { setMobileNavOpen } = useStore();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-[var(--page)]/95 backdrop-blur transition-shadow ${
        scrolled ? "border-[var(--line)] shadow-[0_1px_12px_rgba(26,26,26,0.05)]" : "border-transparent"
      }`}
    >
      <div className="container-fb flex h-[64px] items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-6 xl:gap-9">
          <button
            type="button"
            aria-label={t("header.openMenu")}
            onClick={() => setMobileNavOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full text-[var(--ink)] transition hover:bg-black/5 lg:hidden"
          >
            <MenuIcon />
          </button>
          <Logo />
          <DesktopNav />
        </div>
        <HeaderActions />
      </div>
    </header>
  );
}
