"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { ButtonLink } from "@/components/ui/Button";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { formatPrice } from "@/lib/money";

export function CartContents() {
  const { locale, t } = useI18n();
  const { cart, pending, updateItem, removeItem } = useCart();

  if (cart.lines.length === 0) {
    return (
      <div className="shell py-20 text-center md:py-28">
        <p className="font-display text-3xl md:text-4xl">{t.cart.empty}</p>
        <p className="mx-auto mt-4 max-w-[42ch] text-base text-ink-60">{t.cart.emptyBody}</p>
        <div className="mt-9">
          <ButtonLink href={`/${locale}/units`} variant="solid">
            {t.cart.browse}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="shell pb-24 pt-10 md:pt-14">
      <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <ul className="border-t border-line">
          {cart.lines.map((line) => (
            <li key={line.id} className="flex gap-4 border-b border-line py-6 md:gap-6 md:py-8">
              <Link
                href={`/${locale}/units/${line.slug}`}
                className="relative aspect-4/3 w-28 shrink-0 md:w-40"
              >
                <Image
                  src={line.imageUrl}
                  alt={locale === "ar" ? line.nameAr : line.name}
                  fill
                  sizes="160px"
                  className="object-contain p-2"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/${locale}/units/${line.slug}`}
                      className="link-underline text-base font-light leading-snug hover:text-gold"
                    >
                      {locale === "ar" ? line.nameAr : line.name}
                    </Link>
                    <p className="mt-1 text-sm text-ink-40">
                      {line.finishKey} · {line.sizeLabel}
                      {line.configId && <span className="ms-2 text-gold">{t.cart.custom}</span>}
                    </p>
                  </div>
                  <p className="shrink-0 text-base">{formatPrice(line.lineTotal, locale)}</p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                  <div className="inline-flex items-center border border-line">
                    <button
                      type="button"
                      onClick={() => updateItem(line.id, line.quantity - 1)}
                      disabled={pending}
                      aria-label={t.common.previous}
                      className="grid h-9 w-9 place-items-center transition-colors hover:text-gold disabled:opacity-40"
                    >
                      <MinusIcon size={15} />
                    </button>
                    <span
                      className="w-10 text-center text-sm tabular-nums"
                      aria-label={t.common.quantity}
                    >
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateItem(line.id, line.quantity + 1)}
                      disabled={pending || line.quantity >= 20}
                      aria-label={t.common.next}
                      className="grid h-9 w-9 place-items-center transition-colors hover:text-gold disabled:opacity-40"
                    >
                      <PlusIcon size={15} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(line.id)}
                    disabled={pending}
                    className="inline-flex items-center gap-2 text-sm text-ink-40 transition-colors hover:text-ink disabled:opacity-40"
                  >
                    <TrashIcon size={15} />
                    {t.common.remove}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="border border-line p-6 md:p-8">
            <h2 className="label-caps">{t.cart.orderSummary}</h2>

            <dl className="mt-6 space-y-3 text-base">
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

            <p className="mt-4 text-sm leading-relaxed text-ink-40">{t.cart.shippingNote}</p>

            <ButtonLink
              href={`/${locale}/checkout`}
              variant="gold"
              size="lg"
              className="mt-6 w-full"
            >
              {t.cart.checkout}
            </ButtonLink>

            <Link
              href={`/${locale}/units`}
              className="link-underline mt-5 block text-center text-sm text-ink-60 hover:text-ink"
            >
              {t.cart.continueShopping}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
