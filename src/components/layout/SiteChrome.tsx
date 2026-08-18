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

/**
 * Wraps pages in the storefront chrome. The admin panel is a separate surface,
 * so it renders bare — no announcement bar, nav, cart drawer or footer.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <MobileNav />
      <main id="main">{children}</main>
      <ContactStrip />
      <Footer />
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
