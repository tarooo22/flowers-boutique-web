"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { ContactStrip } from "@/components/layout/ContactStrip";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/layout/Search";
import { MessengerChat } from "@/components/layout/MessengerChat";
import { useI18n } from "@/lib/i18n";

/**
 * Wraps pages in the storefront chrome. The admin panel is a separate surface,
 * so it renders bare — no announcement bar, nav, cart drawer or footer.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname.startsWith("/admin")) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <a href="#main" className="skip-link">{t("common.skipToContent")}</a>
      <AnnouncementBar />
      <Header />
      <MobileNav />
      <main id="main">{children}</main>
      <ContactStrip />
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <MessengerChat />
    </>
  );
}
