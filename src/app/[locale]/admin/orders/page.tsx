import Link from "next/link";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/money";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { select: { id: true, quantity: true } } },
  });

  if (orders.length === 0) {
    return <p className="text-base text-ink-60">{t.account.ordersEmpty}</p>;
  }

  return (
    <div className="no-scrollbar overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-base">
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
              {t.cart.items}
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
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-line align-middle">
              <td className="px-4 py-4">
                <Link
                  href={`/${locale}/orders/${order.number}`}
                  className="link-underline hover:text-gold"
                >
                  {order.number}
                </Link>
              </td>
              <td className="px-4 py-4">
                <span className="block text-ink-70">{order.customerName}</span>
                <span className="block text-sm text-ink-40" dir="ltr">
                  {order.customerPhone}
                </span>
              </td>
              <td className="px-4 py-4 text-ink-40">{formatDate(order.createdAt, locale)}</td>
              <td className="px-4 py-4 text-ink-70">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </td>
              <td className="px-4 py-4">
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </td>
              <td className="px-4 py-4 text-end">{formatPrice(order.total, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
