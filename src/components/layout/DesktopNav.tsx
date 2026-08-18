"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/nav";
import { useI18n } from "@/lib/i18n";

export function DesktopNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
    <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
      {mainNav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href.split("?")[0]);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative py-1 text-[13px] font-semibold transition-colors hover:text-[var(--action)] ${
              active ? "text-[var(--ink)]" : "text-[var(--ink)]/85"
            }`}
          >
            {item.key ? t(item.key) : item.label}
            <span
              className={`absolute -bottom-0.5 left-0 h-[2px] bg-[var(--action)] transition-all duration-300 ${
                active ? "w-full" : "w-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
