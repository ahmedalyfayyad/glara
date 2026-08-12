import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/money";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  if (inquiries.length === 0) {
    return <p className="text-base text-ink-60">{t.common.noResults}</p>;
  }

  return (
    <ul className="space-y-4">
      {inquiries.map((inquiry) => (
        <li key={inquiry.id} className="border border-line p-5 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-base">{inquiry.subject}</h2>
            <p className="text-sm text-ink-40">{formatDate(inquiry.createdAt, locale)}</p>
          </div>
          <p className="mt-2 text-sm text-ink-60">
            {inquiry.name} ·{" "}
            <a href={`mailto:${inquiry.email}`} className="link-underline hover:text-ink">
              {inquiry.email}
            </a>
            {inquiry.phone && (
              <>
                {" · "}
                <span dir="ltr">{inquiry.phone}</span>
              </>
            )}
          </p>
          <p className="mt-4 whitespace-pre-line text-base leading-[1.8] text-ink-70">
            {inquiry.message}
          </p>
        </li>
      ))}
    </ul>
  );
}
