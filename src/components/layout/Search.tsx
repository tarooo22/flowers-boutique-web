"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";
import { SearchIcon, CloseIcon } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
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

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) { setResults([]); setSearching(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      fetch(`/api/catalog/search?q=${encodeURIComponent(query)}`, { signal: controller.signal, cache: "no-store" })
        .then((response) => (response.ok ? response.json() : { products: [] }))
        .then((payload: { products?: Product[] }) => { if (!controller.signal.aborted) setResults(payload.products ?? []); })
        .catch(() => { if (!controller.signal.aborted) setResults([]); })
        .finally(() => { if (!controller.signal.aborted) setSearching(false); });
    }, 180);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [q]);

  if (!searchOpen) return null;

  const submit = () => {
    setSearchOpen(false);
    router.push(`/catalog?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        aria-label={t("search.close")}
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
              placeholder={t("search.placeholder")}
              className="w-full bg-transparent text-[16px] text-[var(--ink)] outline-none placeholder:text-[var(--muted-2)]"
            />
            <button
              aria-label={t("search.close")}
              onClick={() => setSearchOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {q.trim() ? (
            searching ? <p className="mt-5 pb-2 text-[13px] text-[var(--muted)]">{t("search.hint")}</p> : results.length ? (
              <ul className="mt-4 grid gap-1 pb-2">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-black/5"
                    >
                      <div className="relative h-14 w-11 overflow-hidden rounded-md bg-[var(--surface-warm)]">
                        <Image src={p.images[0]} alt="" fill sizes="44px" unoptimized className="object-cover" />
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
                    {t("search.seeAll", { query: q.trim() })}
                  </button>
                </li>
              </ul>
            ) : (
              <p className="mt-5 pb-2 text-[13px] text-[var(--muted)]">
                {t("search.empty", { query: q.trim() })}
              </p>
            )
          ) : (
            <p className="mono mt-4 pb-1 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-2)]">
              {t("search.hint")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
