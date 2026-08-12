import type { Metadata } from "next";
import { PageTitle } from "@/components/site/PageTitle";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  return { title: getDictionary(locale).meta.checkoutTitle, robots: { index: false } };
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const session = await getSessionUser();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.id },
        select: { name: true, email: true, phone: true },
      })
    : null;

  return (
    <>
      <PageTitle size="md">{t.checkout.title}</PageTitle>
      <CheckoutForm
        defaults={{
          name: user?.name ?? "",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
        }}
      />
    </>
  );
}
