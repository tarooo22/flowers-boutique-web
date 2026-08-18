"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { languages } from "@/lib/translations";
import { ChevronDown } from "@/components/ui/Icons";

/** Language switch — changes the interface language (EN / ქარ / РУ). */
export function LanguageSelector() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === lang) ?? languages[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
        className="mono flex items-center gap-1 rounded-full px-2 py-1.5 text-[12px] font-semibold text-[var(--ink)] transition hover:bg-black/5"
      >
        {current.short}
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 min-w-[132px] overflow-hidden rounded-lg border border-[var(--line)] bg-white py-1 shadow-[var(--shadow-pop)]"
        >
          {languages.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition hover:bg-black/5 ${
                  l.code === lang ? "text-[var(--action-deep)]" : "text-[var(--ink)]"
                }`}
              >
                <span>{l.label}</span>
                <span className="mono text-[11px] text-[var(--muted-2)]">{l.short}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
