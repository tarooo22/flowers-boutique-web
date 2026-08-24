"use client";

import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { SiteChrome } from "@/components/layout/SiteChrome";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <StoreProvider>
        <SiteChrome>{children}</SiteChrome>
      </StoreProvider>
    </I18nProvider>
  );
}
