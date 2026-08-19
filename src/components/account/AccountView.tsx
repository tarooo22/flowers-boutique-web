"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AccountView({
  name,
  email,
  isAdmin = false,
}: {
  name: string | null;
  email: string | null;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const displayName = name?.trim() || "there";

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => null);
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="container-fb pt-14 pb-28">
      <section className="mx-auto w-full max-w-md rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6 sm:p-7">
        <p className="mono text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--action-deep)]">My account</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight sm:text-[34px]">Welcome, {displayName}</h1>
        <p className="mt-2 text-[14px] text-[var(--muted)]">
          You are signed in{email ? ` as ${email}` : ""}.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/catalog">
            <Button type="button" variant="primary">Continue shopping</Button>
          </Link>
          {isAdmin ? (
            <Link href="/admin">
              <Button type="button" variant="outline">Open admin panel</Button>
            </Link>
          ) : null}
          <Button type="button" variant="outline" onClick={signOut} disabled={signingOut}>
            {signingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </section>
    </div>
  );
}
