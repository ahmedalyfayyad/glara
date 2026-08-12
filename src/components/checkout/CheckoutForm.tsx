"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField, TextArea, TextField } from "@/components/ui/Field";
import { formatPrice } from "@/lib/money";
import { cx } from "@/lib/utils";

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Port Said",
  "Suez",
  "Dakahlia",
  "Sharqia",
  "Gharbia",
  "Monufia",
  "Beheira",
  "Ismailia",
  "Faiyum",
  "Beni Suef",
  "Minya",
  "Asyut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Red Sea",
  "New Valley",
  "Matrouh",
  "North Sinai",
  "South Sinai",
  "Kafr El Sheikh",
  "Damietta",
];

export function CheckoutForm({
  defaults,
}: {
  defaults: { name: string; email: string; phone: string };
}) {
  const { locale, t } = useI18n();
  const { cart, refresh } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: defaults.name,
    customerEmail: defaults.email,
    customerPhone: defaults.phone,
    addressLine: "",
    city: "",
    governorate: "Cairo",
    postalCode: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "bank",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "generic");

      await refresh();
      router.push(`/${locale}/orders/${data.order.number}`);
    } catch {
      setError(t.errors.generic);
      setSubmitting(false);
    }
  }

  if (cart.lines.length === 0) {
    return (
      <div className="shell py-20 text-center md:py-28">
        <p className="font-display text-3xl">{t.checkout.emptyCart}</p>
        <div className="mt-8">
          <ButtonLink href={`/${locale}/units`}>{t.cart.browse}</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="shell pb-24 pt-10 md:pt-14">
      <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="space-y-12">
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="label-caps border-b border-line pb-4">
              {t.checkout.contact}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <TextField
                label={t.common.name}
                required
                autoComplete="name"
                value={form.customerName}
                onChange={(event) => set("customerName", event.target.value)}
              />
              <TextField
                label={t.common.phone}
                required
                type="tel"
                dir="ltr"
                autoComplete="tel"
                value={form.customerPhone}
                onChange={(event) => set("customerPhone", event.target.value)}
              />
              <div className="sm:col-span-2">
                <TextField
                  label={t.common.email}
                  required
                  type="email"
                  autoComplete="email"
                  value={form.customerEmail}
                  onChange={(event) => set("customerEmail", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="label-caps border-b border-line pb-4">
              {t.checkout.delivery}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  label={t.checkout.addressLine}
                  required
                  autoComplete="street-address"
                  value={form.addressLine}
                  onChange={(event) => set("addressLine", event.target.value)}
                />
              </div>
              <TextField
                label={t.checkout.city}
                required
                autoComplete="address-level2"
                value={form.city}
                onChange={(event) => set("city", event.target.value)}
              />
              <SelectField
                label={t.checkout.governorate}
                required
                value={form.governorate}
                onChange={(event) => set("governorate", event.target.value)}
              >
                {GOVERNORATES.map((governorate) => (
                  <option key={governorate} value={governorate}>
                    {governorate}
                  </option>
                ))}
              </SelectField>
              <TextField
                label={`${t.checkout.postalCode} (${t.common.optional})`}
                inputMode="numeric"
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={(event) => set("postalCode", event.target.value)}
              />
              <div className="sm:col-span-2">
                <TextArea
                  label={`${t.checkout.notes} (${t.common.optional})`}
                  placeholder={t.checkout.notesPlaceholder}
                  value={form.notes}
                  onChange={(event) => set("notes", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="label-caps border-b border-line pb-4">
              {t.checkout.payment}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(["cod", "bank"] as const).map((method) => (
                <label
                  key={method}
                  className={cx(
                    "cursor-pointer border p-5 transition-colors duration-300",
                    form.paymentMethod === method
                      ? "border-gold bg-gold-soft"
                      : "border-line hover:border-ink-40",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={form.paymentMethod === method}
                      onChange={() => set("paymentMethod", method)}
                      className="accent-[#c6a87a]"
                    />
                    <span className="text-base">{t.checkout.paymentMethods[method]}</span>
                  </span>
                  <span className="mt-2 block ps-7 text-sm text-ink-60">
                    {t.checkout.paymentMethods[method === "cod" ? "codCaption" : "bankCaption"]}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="border border-line p-6 md:p-8">
            <h2 className="label-caps">{t.cart.orderSummary}</h2>

            <ul className="mt-6 space-y-4">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-3">
                  <div className="relative aspect-square w-14 shrink-0">
                    <Image
                      src={line.imageUrl}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate">{locale === "ar" ? line.nameAr : line.name}</p>
                    <p className="text-ink-40">
                      {line.sizeLabel} × {line.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm">{formatPrice(line.lineTotal, locale)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-base">
              <div className="flex justify-between">
                <dt className="text-ink-60">{t.common.subtotal}</dt>
                <dd>{formatPrice(cart.subtotal, locale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-60">{t.common.shipping}</dt>
                <dd>{cart.shipping === 0 ? t.common.free : formatPrice(cart.shipping, locale)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-lg">
                <dt>{t.common.total}</dt>
                <dd>{formatPrice(cart.total, locale)}</dd>
              </div>
            </dl>

            {error && <p className="mt-4 text-sm text-[#8a2f2f]">{error}</p>}

            <Button type="submit" variant="gold" size="lg" loading={submitting} className="mt-6 w-full">
              {submitting ? t.checkout.placing : t.checkout.placeOrder}
            </Button>

            <p className="mt-4 text-sm leading-relaxed text-ink-40">{t.checkout.agree}</p>

            <Link
              href={`/${locale}/cart`}
              className="link-underline mt-5 block text-center text-sm text-ink-60 hover:text-ink"
            >
              {t.cart.title}
            </Link>
          </div>
        </aside>
      </div>
    </form>
  );
}
