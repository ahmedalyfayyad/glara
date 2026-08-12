import type { Metadata } from "next";
import { PageTitle } from "@/components/site/PageTitle";
import { CustomizeLab, type LabProduct } from "@/components/lab/CustomizeLab";
import { labProducts, localised } from "@/lib/queries";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);
  return {
    title: t.meta.customizeTitle,
    description: t.lab.subtitle,
    alternates: { canonical: `/${locale}/customize` },
  };
}

export default async function CustomizePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const [{ locale: localeParam }, search] = await Promise.all([params, searchParams]);
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);
  const rows = await labProducts();

  const products: LabProduct[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: localised(row, "name", locale),
    image: row.images[0]?.url ?? "/products/linea-oak-01.png",
    basePrice: row.basePrice,
    finishes: row.finishes.map((finish) => ({
      key: finish.key,
      label: locale === "ar" ? finish.labelAr : finish.label,
      swatch: finish.swatch,
      imageUrl: finish.imageUrl,
      priceDelta: finish.priceDelta,
    })),
    sizes: row.sizes.map((size) => ({ label: size.label, priceDelta: size.priceDelta })),
  }));

  return (
    <>
      <PageTitle size="md" eyebrow={t.lab.title} subtitle={t.lab.subtitle}>
        {t.nav.customize}
      </PageTitle>

      <div className="shell pb-24 pt-12 md:pt-16">
        <CustomizeLab products={products} initialSlug={search.product} />
      </div>
    </>
  );
}
