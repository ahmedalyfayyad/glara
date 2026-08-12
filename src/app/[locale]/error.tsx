"use client";

import { useEffect } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-3xl md:text-4xl">{t.errors.generic}</h1>
      <p className="mt-4 max-w-[44ch] text-base text-ink-60">{t.common.error}</p>
      <Button type="button" variant="solid" onClick={reset} className="mt-9">
        {t.common.retry}
      </Button>
    </div>
  );
}
