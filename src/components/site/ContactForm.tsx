"use client";

import { useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { TextArea, TextField } from "@/components/ui/Field";
import { CheckIcon } from "@/components/icons";

export function ContactForm() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  function set(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="border border-line p-10 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold text-white">
          <CheckIcon size={22} />
        </span>
        <p className="mt-5 text-lg">{t.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label={t.common.name}
          required
          autoComplete="name"
          value={form.name}
          onChange={(event) => set("name", event.target.value)}
        />
        <TextField
          label={t.common.email}
          required
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => set("email", event.target.value)}
        />
        <TextField
          label={`${t.common.phone} (${t.common.optional})`}
          type="tel"
          dir="ltr"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => set("phone", event.target.value)}
        />
        <TextField
          label={t.contact.subject}
          required
          value={form.subject}
          onChange={(event) => set("subject", event.target.value)}
        />
      </div>

      <TextArea
        label={t.contact.message}
        required
        minLength={10}
        value={form.message}
        onChange={(event) => set("message", event.target.value)}
      />

      {state === "error" && <p className="text-sm text-[#8a2f2f]">{t.common.error}</p>}

      <Button type="submit" variant="solid" size="lg" loading={state === "sending"}>
        {state === "sending" ? t.contact.sending : t.contact.send}
      </Button>
    </form>
  );
}
