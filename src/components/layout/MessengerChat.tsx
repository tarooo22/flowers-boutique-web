"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "@/config/brand";
import { useI18n } from "@/lib/i18n";
import { CloseIcon, MessengerIcon, WhatsappIcon } from "@/components/ui/Icons";

/**
 * A browser-only contact handoff. The form never persists customer details:
 * WhatsApp receives an explicit prefilled message and Messenger gets a copied
 * message because m.me does not support text-prefill without Meta App setup.
 */
export function MessengerChat() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [feedback, setFeedback] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const message = () => [
    `${t("chat.inquiryGreeting")}`,
    `${t("chat.name")}: ${name.trim()}`,
    `${t("chat.phone")}: ${phone.trim()}`,
    `${t("chat.question")}: ${question.trim()}`,
  ].join("\n");

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  };

  const handoff = (channel: "whatsapp" | "messenger") => {
    if (!formRef.current?.reportValidity()) return;
    const inquiry = message();
    if (channel === "whatsapp") {
      window.open(`${brand.whatsappHref}?text=${encodeURIComponent(inquiry)}`, "_blank", "noopener,noreferrer");
      return;
    }
    window.open(brand.social.messenger, "_blank", "noopener,noreferrer");
    void copyToClipboard(inquiry).finally(() => setFeedback(t("chat.messengerCopied")));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setFeedback(""); setOpen(true); }}
        aria-label={t("chat.messengerAria")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed bottom-5 right-4 z-[70] inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-[#0084FF] px-3 text-white shadow-[var(--shadow-float)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0074e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0084FF] active:scale-[0.97] sm:bottom-6 sm:right-6 sm:px-4"
      >
        <MessengerIcon className="h-5 w-5" aria-hidden="true" />
        <span className="hidden text-[13px] font-semibold sm:inline">{t("chat.messageUs")}</span>
        <span className="sr-only sm:hidden">{t("chat.messageUs")}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-end bg-black/35 p-3 sm:items-center sm:justify-center sm:p-6" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-form-title"
            className="w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--surface)] p-5 shadow-[var(--shadow-pop)] sm:p-6"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-1">{t("chat.eyebrow")}</p>
                <h2 id="inquiry-form-title" className="font-display text-[24px] leading-tight">{t("chat.formTitle")}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{t("chat.formLead")}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("chat.close")} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--surface-warm)] text-[var(--ink)] transition hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--action)]">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <form ref={formRef} className="mt-5 grid gap-3" onSubmit={(event) => event.preventDefault()}>
              <label className="grid gap-1.5 text-[13px] font-semibold text-[var(--ink)]">
                {t("chat.name")}
                <input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="h-11 rounded-[var(--radius-sm)] border bg-white px-3 text-[16px] font-normal outline-none transition focus:border-[var(--action)] focus:ring-2 focus:ring-[var(--action)]/15" />
              </label>
              <label className="grid gap-1.5 text-[13px] font-semibold text-[var(--ink)]">
                {t("chat.phone")}
                <input required value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" autoComplete="tel" inputMode="tel" className="h-11 rounded-[var(--radius-sm)] border bg-white px-3 text-[16px] font-normal outline-none transition focus:border-[var(--action)] focus:ring-2 focus:ring-[var(--action)]/15" />
              </label>
              <label className="grid gap-1.5 text-[13px] font-semibold text-[var(--ink)]">
                {t("chat.question")}
                <textarea required value={question} onChange={(event) => setQuestion(event.target.value)} rows={4} className="resize-y rounded-[var(--radius-sm)] border bg-white px-3 py-2.5 text-[16px] font-normal outline-none transition focus:border-[var(--action)] focus:ring-2 focus:ring-[var(--action)]/15" />
              </label>
              <p className="text-[12px] leading-relaxed text-[var(--muted-2)]">{t("chat.privacy")}</p>
              {feedback ? <p aria-live="polite" className="rounded-[var(--radius-sm)] bg-[var(--surface-warm)] px-3 py-2 text-[12.5px] text-[var(--ink)]">{feedback}</p> : null}
              <div className="grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => handoff("whatsapp")} className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[#25D366] px-4 text-[13px] font-semibold text-white transition hover:bg-[#1eb85a] active:scale-[0.97]">
                  <WhatsappIcon className="h-4 w-4" />
                  {t("chat.whatsapp")}
                </button>
                <button type="button" onClick={() => handoff("messenger")} className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[#0084FF] px-4 text-[13px] font-semibold text-white transition hover:bg-[#0074e8] active:scale-[0.97]">
                  <MessengerIcon className="h-4 w-4" />
                  {t("chat.messenger")}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
