"use client";

import { useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { cx } from "@/lib/utils";

type Flags = { active: boolean; featured: boolean };

export function ProductToggles({ productId, initial }: { productId: string; initial: Flags }) {
  const { t } = useI18n();
  const [flags, setFlags] = useState(initial);
  const [pending, setPending] = useState(false);

  async function toggle(key: keyof Flags) {
    const next = { ...flags, [key]: !flags[key] };
    setFlags(next);
    setPending(true);

    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: next[key] }),
    });
    setPending(false);
    if (!response.ok) setFlags(flags);
  }

  return (
    <div className="flex gap-2">
      {(["active", "featured"] as const).map((key) => (
        <button
          key={key}
          type="button"
          disabled={pending}
          onClick={() => toggle(key)}
          aria-pressed={flags[key]}
          className={cx(
            "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.1em] transition-colors duration-300 disabled:opacity-50",
            flags[key]
              ? "border-gold bg-gold text-white"
              : "border-line text-ink-40 hover:border-ink-40",
          )}
        >
          {key === "active" ? t.admin.activeToggle : t.admin.featuredToggle}
        </button>
      ))}
    </div>
  );
}
