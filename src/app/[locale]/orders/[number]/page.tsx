import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/money";
import { fill, getDictionary, type Locale, toLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, number } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);
  return { title: `${t.checkout.orderNumber} ${number}`, robots: { index: false } };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}) {
  const { locale: localeParam, number } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const order = await prisma.order.findUnique({
    where: { number },
    include: { items: true },
  });
  if (!order) notFound();

  const status = t.account.orderStatus[order.status as keyof typeof t.account.orderStatus];

  return (
    <div className="shell py-16 md:py-24">
      <div className="mx-auto max-w-[760px]">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-white">
            <CheckIcon size={26} />
          </span>
          <h1 className="mt-7 font-display text-[clamp(34px,6vw,58px)] leading-tight">
            {t.checkout.orderPlaced}
          </h1>
          <p className="mt-4 text-lg text-ink-70">
            {fill(t.checkout.thankYou, { name: order.customerName })}
          </p>
          <p className="mx-auto mt-3 max-w-[52ch] text-base leading-[1.8] text-ink-60">
            {t.checkout.confirmationBody}
          </p>
        </div>

        <div className="mt-12 border border-line">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
            <div>
              <p className="eyebrow text-ink-40">{t.checkout.orderNumber}</p>
              <p className="mt-1 text-lg tracking-[0.08em]">{order.number}</p>
            </div>
            <div className="text-end">
              <p className="eyebrow text-ink-40">{t.admin.status}</p>
              <p className="mt-1 text-base text-gold">{status ?? order.status}</p>
            </div>
          </div>

          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-4 px-6 py-5">
                <div className="relative aspect-square w-16 shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base">{locale === "ar" ? item.nameAr : item.name}</p>
                  <p className="mt-1 text-sm text-ink-40">
                    {item.finishKey} · {item.sizeLabel} × {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-base">{formatPrice(item.lineTotal, locale)}</p>
              </li>
            ))}
          </ul>

          <dl className="space-y-3 border-t border-line px-6 py-5 text-base">
            <div className="flex justify-between">
              <dt className="text-ink-60">{t.common.subtotal}</dt>
              <dd>{formatPrice(order.subtotal, locale)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-60">{t.common.shipping}</dt>
              <dd>{order.shipping === 0 ? t.common.free : formatPrice(order.shipping, locale)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg">
              <dt>{t.common.total}</dt>
              <dd>{formatPrice(order.total, locale)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 grid gap-8 border border-line p-6 sm:grid-cols-2 md:p-8">
          <div>
            <h2 className="label-caps text-ink-70">{t.checkout.delivery}</h2>
            <address className="mt-3 text-base not-italic leading-[1.9] text-ink-70">
              {order.customerName}
              <br />
              {order.addressLine}
              <br />
              {order.city}, {order.governorate}
              {order.postalCode ? ` ${order.postalCode}` : ""}
              <br />
              <span dir="ltr">{order.customerPhone}</span>
            </address>
          </div>
          <div>
            <h2 className="label-caps text-ink-70">{t.checkout.payment}</h2>
            <p className="mt-3 text-base text-ink-70">
              {order.paymentMethod === "bank"
                ? t.checkout.paymentMethods.bank
                : t.checkout.paymentMethods.cod}
            </p>
            <p className="mt-4 text-sm text-ink-40">
              {fill(t.account.placedOn, { date: formatDate(order.createdAt, locale) })}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href={`/${locale}/units`} variant="outline">
            {t.cart.continueShopping}
          </ButtonLink>
          <ButtonLink href={`/${locale}/account`}>{t.account.orders}</ButtonLink>
        </div>
      </div>
    </div>
  );
}
