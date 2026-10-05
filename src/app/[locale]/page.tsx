import { Hero } from "@/components/home/Hero";
import { ExploreCollection } from "@/components/home/ExploreCollection";
import { CustomizeBand } from "@/components/home/CustomizeBand";
import { TrustBadges } from "@/components/home/TrustBadges";
import { SilentLuxury } from "@/components/home/SilentLuxury";
import { Engineering } from "@/components/home/Engineering";
import { featuredProducts, listProducts } from "@/lib/queries";
import { siteUrl } from "@/lib/site";
import { getDictionary, toLocale } from "@/i18n";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  // The hero rail runs single units; the grid below runs the vanity + tower sets.
  const [vanities, products] = await Promise.all([
    listProducts({ type: "vanity" }),
    featuredProducts(6),
  ]);

  const base = siteUrl();

  /*
   * Two graph nodes rather than one: the Organization is the business, the
   * WebSite is this site. The search action is what lets Google offer a search
   * box under the result instead of only the homepage link.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "GLARA",
        description: t.meta.description,
        url: base,
        logo: `${base}/${locale}/opengraph-image`,
        address: { "@type": "PostalAddress", addressLocality: "Cairo", addressCountry: "EG" },
        telephone: "+201011911502",
        email: "info@glara-eg.com",
        areaServed: "EG",
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: t.meta.siteName,
        description: t.meta.description,
        inLanguage: locale === "ar" ? "ar-EG" : "en",
        publisher: { "@id": `${base}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${base}/${locale}/units?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero products={vanities.slice(0, 6)} locale={locale} />

      <div className="shell py-4 md:py-8">
        <hr className="mx-auto w-[225px] border-0 border-t border-line" />
      </div>

      <ExploreCollection products={products} locale={locale} />
      <CustomizeBand locale={locale} />
      <TrustBadges locale={locale} />
      <SilentLuxury locale={locale} />
      <Engineering locale={locale} />
    </>
  );
}
