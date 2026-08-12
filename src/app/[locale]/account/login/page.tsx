import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/account/AuthForm";
import { getSessionUser } from "@/lib/auth";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  return { title: getDictionary(locale).account.signInTitle, robots: { index: false } };
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  if (await getSessionUser()) redirect(`/${locale}/account`);

  return (
    <div className="shell py-16 md:py-24">
      <div className="mx-auto max-w-[520px] text-center">
        <h1 className="font-display text-[clamp(34px,6vw,56px)] leading-tight">
          {t.account.signInTitle}
        </h1>
        <p className="mt-4 text-base text-ink-60">{t.account.signInSubtitle}</p>
      </div>
      <AuthForm mode="login" />
    </div>
  );
}
