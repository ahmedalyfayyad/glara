import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/i18n";
import type { ProductListItem } from "@/lib/queries";

/**
 * The artboard gives this section the whole page: six renders at full size on
 * white, nothing but the heading above them. On a phone the same six become a
 * horizontal rail so the row stays one screen tall instead of six.
 */
export function ExploreCollection({
  products,
  locale,
}: {
  products: ProductListItem[];
  locale: Locale;
}) {
  const t = getDictionary(locale);

  return (
    <section className="py-14 md:py-20 lg:py-24">
      {/* Figma: Inter Light 105px on a 1290 canvas, 2.4px tracking */}
      <Reveal as="h2" className="px-5 text-center">
        <span
          className="block font-light uppercase leading-[1.04] tracking-[0.023em]"
          style={{ fontSize: "min(8.14vw, 105px)" }}
        >
          {t.home.exploreTitle}
        </span>
      </Reveal>

      <div
        className="rail mt-10 gap-5 px-5 md:mt-16 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 sm:overflow-visible sm:px-10 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-20 lg:px-[60px]"
        style={{ scrollPaddingInline: "1.25rem" }}
      >
        {products.map((product, index) => (
          <Reveal
            key={product.id}
            delay={(index % 3) * 110}
            className="w-[76vw] max-w-[420px] sm:w-auto sm:max-w-none"
          >
            <ProductCard
              product={product}
              locale={locale}
              variant="bare"
              priority={index < 3}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 76vw"
            />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center md:mt-20">
        <Link
          href={`/${locale}/units`}
          className="link-underline label-caps text-[13px] tracking-[0.28em] text-ink transition-colors hover:text-gold"
        >
          {t.home.exploreViewAll}
        </Link>
      </div>
    </section>
  );
}
