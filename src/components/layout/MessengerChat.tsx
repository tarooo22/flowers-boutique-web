"use client";

import { brand } from "@/config/brand";
import { useI18n } from "@/lib/i18n";
import { MessengerIcon } from "@/components/ui/Icons";

/**
 * A privacy-preserving Messenger entry point. It does not embed Meta scripts,
 * collect visitor data, or need Page credentials; it simply opens the verified
 * Flower's Boutique Page inbox in a separate context.
 */
export function MessengerChat() {
  const { t } = useI18n();

  return (
    <a
      href={brand.social.messenger}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("chat.messengerAria")}
      className="fixed bottom-5 right-4 z-[70] inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-[#0084FF] px-3 text-white shadow-[var(--shadow-float)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0074e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0084FF] active:scale-[0.97] sm:bottom-6 sm:right-6 sm:px-4"
    >
      <MessengerIcon className="h-5 w-5" aria-hidden="true" />
      <span className="hidden text-[13px] font-semibold sm:inline">{t("chat.messageUs")}</span>
      <span className="sr-only sm:hidden">{t("chat.messageUs")}</span>
    </a>
  );
}
