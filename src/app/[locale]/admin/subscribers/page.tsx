import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/money";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  if (subscribers.length === 0) {
    return <p className="text-base text-ink-60">{t.common.noResults}</p>;
  }

  return (
    <table className="w-full border-collapse text-base">
      <thead>
        <tr className="border-y border-line bg-bone text-sm">
          <th scope="col" className="px-4 py-3 text-start font-normal">
            {t.common.email}
          </th>
          <th scope="col" className="px-4 py-3 text-start font-normal">
            {t.common.language}
          </th>
          <th scope="col" className="px-4 py-3 text-end font-normal">
            {t.admin.date}
          </th>
        </tr>
      </thead>
      <tbody>
        {subscribers.map((subscriber) => (
          <tr key={subscriber.id} className="border-b border-line">
            <td className="px-4 py-4">
              <a href={`mailto:${subscriber.email}`} className="link-underline hover:text-gold">
                {subscriber.email}
              </a>
            </td>
            <td className="px-4 py-4 uppercase text-ink-60">{subscriber.locale}</td>
            <td className="px-4 py-4 text-end text-ink-40">
              {formatDate(subscriber.createdAt, locale)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
