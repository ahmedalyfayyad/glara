import { Suspense } from "react";
import type { Metadata } from "next";
import { PageTitle } from "@/components/site/PageTitle";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/units/FilterSidebar";
import { UnitsToolbar } from "@/components/units/UnitsToolbar";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { listProducts, type ProductFilters } from "@/lib/queries";
import { getDictionary, type Locale, toLocale } from "@/i18n";

type Search = { type?: string; finish?: string; q?: string; sort?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);
  return { title: t.meta.unitsTitle, alternates: { canonical: `/${locale}/units` } };
}

const SORTS = new Set(["featured", "priceAsc", "priceDesc", "newest"]);

export default async function UnitsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const [{ locale: localeParam }, search] = await Promise.all([params, searchParams]);
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const filters: ProductFilters = {
    type: search.type,
    finish: search.finish,
    q: search.q?.trim() || undefined,
    sort: SORTS.has(search.sort ?? "") ? (search.sort as ProductFilters["sort"]) : "featured",
  };

  const products = await listProducts(filters);
  const mirrorsRequested = search.type === "mirror";

  return (
    <>
      <PageTitle>{t.units.title}</PageTitle>

      <div className="shell pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
          <Suspense fallback={null}>
            <FilterSidebar />
          </Suspense>

          {/* min-w-0: without it the grid column stretches to the rail's full width */}
          <div className="min-w-0">
            <Suspense fallback={null}>
              <UnitsToolbar count={products.length} />
            </Suspense>

            {products.length > 0 ? (
              /* Phone: one horizontal rail instead of a column twelve screens tall */
              <div className="rail -mx-5 mt-10 gap-5 px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-y-16">
                {products.map((product, index) => (
                  <Reveal
                    key={product.id}
                    delay={(index % 3) * 80}
                    className="w-[72vw] max-w-[360px] sm:w-auto sm:max-w-none"
                  >
                    <ProductCard
                      product={product}
                      locale={locale}
                      priority={index < 3}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 72vw"
                    />
                  </Reveal>
                ))}
              </div>
            ) : mirrorsRequested ? (
              <div className="mt-14 border border-line p-8 text-center md:p-14">
                <h2 className="font-display text-2xl leading-snug md:text-3xl">
                  {t.units.mirrorsSoonTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-[46ch] text-base leading-[1.8] text-ink-60">
                  {t.units.mirrorsSoonBody}
                </p>
                <div className="mx-auto mt-8 max-w-sm">
                  <NewsletterForm />
                </div>
              </div>
            ) : (
              <div className="mt-14 border border-line p-8 text-center md:p-14">
                <h2 className="font-display text-2xl md:text-3xl">{t.units.emptyTitle}</h2>
                <p className="mt-4 text-base text-ink-60">{t.units.emptyBody}</p>
                <div className="mt-8">
                  <ButtonLink href={`/${locale}/units`} variant="outline">
                    {t.common.clearFilters}
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
