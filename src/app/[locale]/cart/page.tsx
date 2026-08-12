import type { Metadata } from "next";
import { PageTitle } from "@/components/site/PageTitle";
import { CartContents } from "@/components/cart/CartContents";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  return { title: getDictionary(locale).meta.cartTitle, robots: { index: false } };
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  return (
    <>
      <PageTitle size="md">{t.cart.title}</PageTitle>
      <CartContents />
    </>
  );
}
