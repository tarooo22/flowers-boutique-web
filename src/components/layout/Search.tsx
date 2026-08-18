"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { filterProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { SearchIcon, CloseIcon } from "@/components/ui/Icons";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) {
      // Reset the query each time the overlay opens, then focus the field.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    if (searchOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(
    () => (q.trim() ? filterProducts({ query: q }).slice(0, 6) : []),
    [q],
  );

  if (!searchOpen) return null;

  const submit = () => {
    setSearchOpen(false);
    router.push(`/catalog?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        aria-label="Close search"
        className="fb-overlay absolute inset-0 bg-[var(--overlay)]"
        onClick={() => setSearchOpen(false)}
      />
      <div className="fb-overlay relative mx-auto mt-0 w-full bg-[var(--page)] shadow-[var(--shadow-float)]">
        <div className="container-fb py-5">
          <div className="flex items-center gap-3 border-b border-[var(--line-strong)] pb-3">
            <SearchIcon className="h-5 w-5 text-[var(--muted)]" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Search bouquets, colours, occasions…"
              className="w-full bg-transparent text-[16px] text-[var(--ink)] outline-none placeholder:text-[var(--muted-2)]"
            />
            <button
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {q.trim() ? (
            results.length ? (
              <ul className="mt-4 grid gap-1 pb-2">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-black/5"
                    >
                      <div className="relative h-14 w-11 overflow-hidden rounded-md bg-[var(--surface-warm)]">
                        <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold">{p.name}</p>
                        <p className="truncate text-[12px] text-[var(--muted)]">{p.subtitle}</p>
                      </div>
                      <span className="mono text-[12px] text-[var(--muted)]">
                        {formatPrice(p.price)}
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <button
                    onClick={submit}
                    className="text-[13px] font-semibold text-[var(--action-deep)] hover:underline"
                  >
                    See all results for “{q.trim()}” →
                  </button>
                </li>
              </ul>
            ) : (
              <p className="mt-5 pb-2 text-[13px] text-[var(--muted)]">
                No matches for “{q.trim()}”. Try a colour or occasion.
              </p>
            )
          ) : (
            <p className="mono mt-4 pb-1 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-2)]">
              Press Enter to search the full catalog
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
