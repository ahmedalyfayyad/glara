import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const user = await getSessionUser();
  if (!user) redirect(`/${locale}/account/login`);
  if (user.role !== "ADMIN") {
    return (
      <div className="shell py-28 text-center">
        <p className="font-display text-3xl">{t.admin.noAccess}</p>
      </div>
    );
  }

  const tabs = [
    { path: "/admin", label: t.admin.dashboard },
    { path: "/admin/orders", label: t.admin.orders },
    { path: "/admin/products", label: t.admin.products },
    { path: "/admin/inquiries", label: t.admin.inquiries },
    { path: "/admin/subscribers", label: t.admin.subscribers },
  ];

  return (
    <div className="shell py-12 md:py-16">
      <header className="border-b border-line pb-6">
        <p className="eyebrow text-gold">{t.admin.title}</p>
        <h1 className="mt-3 font-wordmark text-[clamp(30px,5vw,48px)] leading-tight">GLARA</h1>
      </header>

      <nav aria-label={t.admin.title} className="no-scrollbar -mx-5 mt-6 overflow-x-auto px-5">
        <ul className="flex min-w-max gap-8">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <Link
                href={`/${locale}${tab.path}`}
                className="link-underline label-caps whitespace-nowrap text-[13px] text-ink-60 transition-colors hover:text-ink"
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10">{children}</div>
    </div>
  );
}
