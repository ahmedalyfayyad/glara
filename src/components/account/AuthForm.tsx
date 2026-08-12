"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { locale, t } = useI18n();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body =
      mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, phone: form.phone, password: form.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        const key = data?.error as keyof typeof t.errors;
        setError(t.errors[key] ?? t.errors.generic);
        setSubmitting(false);
        return;
      }

      router.push(`/${locale}/account`);
      router.refresh();
    } catch {
      setError(t.errors.generic);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-12 w-full max-w-[420px] space-y-6">
      {mode === "register" && (
        <TextField
          label={t.common.name}
          required
          autoComplete="name"
          value={form.name}
          onChange={(event) => set("name", event.target.value)}
        />
      )}

      <TextField
        label={t.common.email}
        required
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={(event) => set("email", event.target.value)}
      />

      {mode === "register" && (
        <TextField
          label={`${t.common.phone} (${t.common.optional})`}
          type="tel"
          dir="ltr"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => set("phone", event.target.value)}
        />
      )}

      <TextField
        label={t.common.password}
        required
        type="password"
        minLength={mode === "register" ? 8 : undefined}
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        hint={mode === "register" ? t.errors.shortPassword : undefined}
        value={form.password}
        onChange={(event) => set("password", event.target.value)}
      />

      {error && <p className="text-sm text-[#8a2f2f]">{error}</p>}

      <Button type="submit" variant="solid" size="lg" loading={submitting} className="w-full">
        {mode === "login" ? t.common.signIn : t.common.createAccount}
      </Button>

      <p className="text-center text-sm text-ink-60">
        {mode === "login" ? t.account.noAccount : t.account.hasAccount}{" "}
        <Link
          href={`/${locale}/account/${mode === "login" ? "register" : "login"}`}
          className="link-underline text-gold"
        >
          {mode === "login" ? t.common.createAccount : t.common.signIn}
        </Link>
      </p>
    </form>
  );
}
