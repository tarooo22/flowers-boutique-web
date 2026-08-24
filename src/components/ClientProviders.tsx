"use client";

import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { SiteChrome } from "@/components/layout/SiteChrome";
import type { Product } from "@/types";

export function ClientProviders({ children, products }: { children: ReactNode; products: Product[] }) {
  return (
    <I18nProvider>
      <StoreProvider products={products}>
        <SiteChrome>{children}</SiteChrome>
      </StoreProvider>
    </I18nProvider>
  );
}
