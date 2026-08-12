import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductDetail, type DetailProduct } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { getProductBySlug, relatedProducts, localised } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, type Locale, toLocale } from "@/i18n";
import { CURRENCY } from "@/lib/money";
import { parseSpecs } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  const product = await getProductBySlug(slug);
  if (!product) return { title: getDictionary(locale).errors.notFound };

  const name = localised(product, "name", locale as Locale);
  const tagline = localised(product, "tagline", locale as Locale);

  return {
    title: name,
    description: tagline,
    alternates: { canonical: `/${locale}/units/${slug}` },
    openGraph: {
      title: name,
      description: tagline,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, user] = await Promise.all([
    relatedProducts(product.id, product.type, 3),
    getSessionUser(),
  ]);

  const saved = user
    ? Boolean(
        await prisma.favorite.findUnique({
          where: { userId_productId: { userId: user.id, productId: product.id } },
          select: { id: true },
        }),
      )
    : false;

  const detail: DetailProduct = {
    id: product.id,
    slug: product.slug,
    name: localised(product, "name", locale),
    collection: localised(product, "collection", locale),
    tagline: localised(product, "tagline", locale),
    description: localised(product, "description", locale),
    basePrice: product.basePrice,
    materials: localised(product, "materials", locale),
    installation: localised(product, "installation", locale),
    warranty: localised(product, "warranty", locale),
    specs: parseSpecs(product.specs).map((spec) => ({
      label: locale === "ar" ? spec.labelAr : spec.label,
      value: locale === "ar" ? spec.valueAr : spec.value,
    })),
    images: product.images.map((image) => ({
      url: image.url,
      alt: image.alt,
      finishKey: image.finishKey,
    })),
    finishes: product.finishes.map((finish) => ({
      key: finish.key,
      label: locale === "ar" ? finish.labelAr : finish.label,
      swatch: finish.swatch,
      imageUrl: finish.imageUrl,
      priceDelta: finish.priceDelta,
    })),
    sizes: product.sizes.map((size) => ({ label: size.label, priceDelta: size.priceDelta })),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: detail.name,
    description: detail.tagline,
    image: detail.images.map((image) => image.url),
    brand: { "@type": "Brand", name: "GLARA" },
    offers: {
      "@type": "Offer",
      price: product.basePrice,
      priceCurrency: CURRENCY,
      availability: "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell pb-20 pt-8 md:pb-28 md:pt-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-40 md:mb-12">
          <Link href={`/${locale}/units`} className="link-underline hover:text-ink">
            {t.units.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-60">{detail.name}</span>
        </nav>

        <ProductDetail product={detail} initiallySaved={saved} signedIn={Boolean(user)} />

        {related.length > 0 && (
          <section className="mt-24 md:mt-32">
            <h2 className="text-center text-2xl font-light tracking-[0.02em] md:text-3xl">
              {t.product.relatedTitle}
            </h2>
            <div className="rail -mx-5 mt-10 gap-5 px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 sm:overflow-visible sm:px-0 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal
                  key={item.id}
                  delay={index * 80}
                  className="w-[72vw] max-w-[360px] sm:w-auto sm:max-w-none"
                >
                  <ProductCard product={item} locale={locale} sizes="(min-width: 640px) 30vw, 72vw" />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
