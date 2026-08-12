import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/money";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const [revenue, ordersCount, productsCount, pending, recent] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "cancelled" } },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  const stats = [
    { label: t.admin.revenue, value: formatPrice(revenue._sum.total ?? 0, locale) },
    { label: t.admin.ordersCount, value: String(ordersCount) },
    { label: t.admin.productsCount, value: String(productsCount) },
    { label: t.admin.pendingOrders, value: String(pending) },
  ];

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label} className="border border-line p-5 md:p-6">
            <p className="eyebrow text-ink-40">{stat.label}</p>
            <p className="mt-3 text-2xl font-light md:text-3xl">{stat.value}</p>
          </li>
        ))}
      </ul>

      <section className="mt-12" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="label-caps">
          {t.admin.recentOrders}
        </h2>

        {recent.length === 0 ? (
          <p className="mt-5 text-base text-ink-60">{t.account.ordersEmpty}</p>
        ) : (
          <div className="no-scrollbar mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-start text-base">
              <thead>
                <tr className="border-y border-line bg-bone text-sm">
                  <th scope="col" className="px-4 py-3 text-start font-normal">
                    {t.checkout.orderNumber}
                  </th>
                  <th scope="col" className="px-4 py-3 text-start font-normal">
                    {t.admin.customer}
                  </th>
                  <th scope="col" className="px-4 py-3 text-start font-normal">
                    {t.admin.date}
                  </th>
                  <th scope="col" className="px-4 py-3 text-start font-normal">
                    {t.admin.status}
                  </th>
                  <th scope="col" className="px-4 py-3 text-end font-normal">
                    {t.admin.amount}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id} className="border-b border-line">
                    <td className="px-4 py-4">
                      <Link
                        href={`/${locale}/orders/${order.number}`}
                        className="link-underline hover:text-gold"
                      >
                        {order.number}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-ink-70">{order.customerName}</td>
                    <td className="px-4 py-4 text-ink-40">
                      {formatDate(order.createdAt, locale)}
                    </td>
                    <td className="px-4 py-4 text-gold">
                      {t.account.orderStatus[order.status as keyof typeof t.account.orderStatus] ??
                        order.status}
                    </td>
                    <td className="px-4 py-4 text-end">{formatPrice(order.total, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
