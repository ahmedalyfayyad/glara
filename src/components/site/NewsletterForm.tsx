"use client";

import { useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { ArrowRightIcon, SpinnerIcon } from "@/components/icons";

export function NewsletterForm() {
  const { locale, t } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale }),
      });
      if (!response.ok) throw new Error();
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="text-sm text-gold">{t.footer.newsletterSuccess}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3 border-b border-line pb-2">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={t.footer.newsletterPlaceholder}
        aria-label={t.footer.newsletterPlaceholder}
        className="w-full bg-transparent text-sm outline-none"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        aria-label={t.footer.newsletterCta}
        className="shrink-0 text-gold transition-transform hover:translate-x-0.5 disabled:opacity-50"
      >
        {state === "sending" ? <SpinnerIcon size={18} /> : <ArrowRightIcon size={18} className="flip-rtl" />}
      </button>
    </form>
  );
}
