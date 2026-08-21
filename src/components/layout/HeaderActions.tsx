"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { IconButton } from "@/components/ui/IconButton";
import { LanguageSelector } from "./LanguageSelector";
import { SearchIcon, UserIcon, HeartIcon, BagIcon } from "@/components/ui/Icons";

function IconLink({
  href,
  label,
  badge,
  children,
  className = "",
}: {
  href: string;
  label: string;
  badge?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`relative grid h-9 w-9 place-items-center rounded-full text-[var(--ink)] transition-colors hover:bg-black/5 ${className}`}
    >
      {children}
      {badge && badge > 0 ? (
        <span className="mono absolute -right-0.5 -top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[var(--action)] px-1 text-[10px] font-bold leading-none text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

export function HeaderActions() {
  const { openCart, setSearchOpen, cartCount, favCount, hydrated } = useStore();
  const { t } = useI18n();
  const [customer, setCustomer] = useState<{ name: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = await response.json() as { user?: { name?: unknown } };
        if (typeof payload.user?.name !== "string") return null;
        return { name: payload.user.name.trim() };
      })
      .catch(() => null)
      .then((value) => {
        if (active) setCustomer(value?.name ? value : null);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <IconButton label={t("header.search")} onClick={() => setSearchOpen(true)}>
        <SearchIcon />
      </IconButton>

      <LanguageSelector />

      <IconLink
        href={customer ? "/account" : "/account/login"}
        label={customer ? `Account: ${customer.name}` : t("header.account")}
        className="hidden sm:grid"
      >
        <UserIcon />
      </IconLink>

      <IconLink href="/favorites" label={t("header.wishlist")} badge={hydrated ? favCount : 0}>
        <HeartIcon />
      </IconLink>

      <IconButton label={t("header.cart")} badge={hydrated ? cartCount : 0} onClick={openCart}>
        <BagIcon />
      </IconButton>
    </div>
  );
}
