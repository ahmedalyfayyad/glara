"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}`);
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" size="sm" loading={pending} onClick={signOut}>
      {t.common.signOut}
    </Button>
  );
}
