"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { IconButton } from "@/components/ui/IconButton";
import { isAdminRole } from "@/lib/accountAccess";
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
  const router = useRouter();
  const [customer, setCustomer] = useState<{ name: string; role: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = await response.json() as { user?: { name?: unknown; role?: unknown } };
        if (typeof payload.user?.name !== "string") return null;
        return { name: payload.user.name.trim(), role: typeof payload.user.role === "string" ? payload.user.role : "user" };
      })
      .catch(() => null)
      .then((value) => {
        if (active) setCustomer(value?.name ? value : null);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => { if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setProfileOpen(false); };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeOnOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  const signOut = async () => {
    setProfileOpen(false);
    await Promise.all([fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }), fetch("/api/admin/login", { method: "DELETE", credentials: "same-origin" })]).catch(() => null);
    setCustomer(null);
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <IconButton label={t("header.search")} onClick={() => setSearchOpen(true)} className="h-11 w-11">
        <SearchIcon />
      </IconButton>

      <LanguageSelector />

      {customer ? <div ref={profileRef} className="relative"><button type="button" onClick={() => setProfileOpen((open) => !open)} aria-label={`Account: ${customer.name}`} aria-haspopup="menu" aria-expanded={profileOpen} className="grid h-11 w-11 place-items-center rounded-full text-[var(--ink)] transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"><UserIcon /></button>{profileOpen ? <div role="menu" aria-label="Profile menu" className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-1.5 shadow-[0_16px_38px_rgba(34,33,30,0.16)]"><Link role="menuitem" href="/account" onClick={() => setProfileOpen(false)} className="block rounded-[calc(var(--radius)-4px)] px-3 py-2 text-[13px] font-semibold hover:bg-[var(--surface-warm)]">ჩემი ანგარიში</Link>{isAdminRole(customer.role) ? <Link role="menuitem" href="/admin" onClick={() => setProfileOpen(false)} className="block rounded-[calc(var(--radius)-4px)] px-3 py-2 text-[13px] font-semibold hover:bg-[var(--surface-warm)]">ადმინი</Link> : null}<button type="button" role="menuitem" onClick={signOut} className="mt-1 w-full rounded-[calc(var(--radius)-4px)] border-t border-[var(--line)] px-3 py-2 text-left text-[13px] font-semibold text-[var(--action-deep)] hover:bg-[var(--action)]/8">გასვლა</button></div> : null}</div> : <IconLink href="/account/login" label={t("header.account")} className="h-11 w-11"><UserIcon /></IconLink>}

      <IconLink href="/favorites" label={t("header.wishlist")} badge={hydrated ? favCount : 0} className="hidden sm:grid h-11 w-11">
        <HeartIcon />
      </IconLink>

      <IconButton label={t("header.cart")} badge={hydrated ? cartCount : 0} onClick={openCart} className="h-11 w-11">
        <BagIcon />
      </IconButton>
    </div>
  );
}
