import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/account/SignOutButton";
import { ButtonLink } from "@/components/ui/Button";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/money";
import { fill, getDictionary, type Locale, toLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  return { title: getDictionary(locale).meta.accountTitle, robots: { index: false } };
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const session = await getSessionUser();
  if (!session) redirect(`/${locale}/account/login`);

  const [orders, favorites, configs] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.favorite.findMany({
      where: { userId: session.id },
      include: {
        product: {
          select: {
            slug: true,
            name: true,
            nameAr: true,
            basePrice: true,
            images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.configuration.findMany({
      where: { userId: session.id },
      include: { product: { select: { name: true, nameAr: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="shell py-14 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="eyebrow text-gold">{t.account.title}</p>
          <h1 className="mt-3 font-display text-[clamp(32px,5vw,52px)] leading-tight">
            {session.name}
          </h1>
          <p className="mt-2 text-base text-ink-60">{session.email}</p>
        </div>
        <div className="flex gap-3">
          {session.role === "ADMIN" && (
            <ButtonLink href={`/${locale}/admin`} variant="outline" size="sm">
              {t.admin.title}
            </ButtonLink>
          )}
          <SignOutButton />
        </div>
      </div>

      <section className="mt-14" aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="label-caps">
          {t.account.orders}
        </h2>

        {orders.length === 0 ? (
          <p className="mt-5 text-base text-ink-60">{t.account.ordersEmpty}</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="border border-line p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <Link
                      href={`/${locale}/orders/${order.number}`}
                      className="link-underline text-lg tracking-[0.06em] hover:text-gold"
                    >
                      {order.number}
                    </Link>
                    <p className="mt-1 text-sm text-ink-40">
                      {fill(t.account.placedOn, { date: formatDate(order.createdAt, locale) })}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-base">{formatPrice(order.total, locale)}</p>
                    <p className="mt-1 text-sm text-gold">
                      {t.account.orderStatus[order.status as keyof typeof t.account.orderStatus] ??
                        order.status}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16" aria-labelledby="favorites-heading">
        <h2 id="favorites-heading" className="label-caps">
          {t.account.favorites}
        </h2>

        {favorites.length === 0 ? (
          <p className="mt-5 text-base text-ink-60">{t.account.favoritesEmpty}</p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {favorites.map((favorite) => (
              <li key={favorite.id}>
                <Link href={`/${locale}/units/${favorite.product.slug}`} className="group block">
                  <div className="relative aspect-4/3">
                    <Image
                      src={favorite.product.images[0]?.url ?? "/products/linea-oak-01.png"}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 22vw, 45vw"
                      className="object-contain p-3 transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-snug transition-colors group-hover:text-gold">
                    {locale === "ar" ? favorite.product.nameAr : favorite.product.name}
                  </p>
                  <p className="mt-1 text-sm text-ink-40">
                    {formatPrice(favorite.product.basePrice, locale)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16" aria-labelledby="configs-heading">
        <h2 id="configs-heading" className="label-caps">
          {t.account.configurations}
        </h2>

        {configs.length === 0 ? (
          <p className="mt-5 text-base text-ink-60">{t.account.configurationsEmpty}</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {configs.map((config) => (
              <li
                key={config.id}
                className="flex flex-wrap items-center justify-between gap-4 border border-line p-5"
              >
                <div>
                  <p className="text-base tracking-[0.06em] text-gold">{config.code}</p>
                  <p className="mt-1 text-base">
                    {locale === "ar" ? config.product.nameAr : config.product.name}
                  </p>
                  <p className="mt-1 text-sm text-ink-40">
                    {config.finishKey} · {config.sizeLabel} · {config.hardware} · {config.basin}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-base">{formatPrice(config.price, locale)}</p>
                  <Link
                    href={`/${locale}/customize?product=${config.product.slug}`}
                    className="link-underline mt-1 inline-block text-sm text-ink-60 hover:text-ink"
                  >
                    {t.common.edit}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
