"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { cx } from "@/lib/utils";

const STATUSES = [
  "pending",
  "confirmed",
  "in_production",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function change(next: string) {
    const previous = value;
    setValue(next);
    setPending(true);
    setFailed(false);

    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setPending(false);

    if (!response.ok) {
      setValue(previous);
      setFailed(true);
      return;
    }
    router.refresh();
  }

  return (
    <>
      <label className="sr-only" htmlFor={`status-${orderId}`}>
        {t.admin.updateStatus}
      </label>
      <select
        id={`status-${orderId}`}
        value={value}
        disabled={pending}
        onChange={(event) => change(event.target.value)}
        className={cx(
          "cursor-pointer border border-line bg-transparent px-3 py-1.5 text-sm outline-none transition-colors focus:border-gold disabled:opacity-50",
          failed && "border-[#8a2f2f]",
        )}
      >
        {STATUSES.map((option) => (
          <option key={option} value={option}>
            {t.account.orderStatus[option]}
          </option>
        ))}
      </select>
    </>
  );
}
