import { HeroCarousel, type HeroItem } from "@/components/home/HeroCarousel";
import { getDictionary, type Locale } from "@/i18n";
import type { ProductListItem } from "@/lib/queries";

/**
 * The wordmark is the page. Figma sets it at 405px on a 1290px canvas with a
 * 0.6 line-height, so it scales as 31.4vw and stops growing at the artboard size.
 */
export function Hero({ products, locale }: { products: ProductListItem[]; locale: Locale }) {
  const t = getDictionary(locale);

  const items: HeroItem[] = products.map((product) => ({
    slug: product.slug,
    name: locale === "ar" ? product.nameAr : product.name,
    tagline: locale === "ar" ? product.taglineAr : product.tagline,
    image: product.image,
    price: product.basePrice,
  }));

  return (
    <section className="pt-8 pb-4 md:pt-12 lg:pt-[88px]">
      <div className="shell">
        <h1 className="sr-only">
          {t.meta.siteName} — {t.meta.tagline}
        </h1>

        <p
          aria-hidden="true"
          className="font-wordmark text-center leading-[0.6] tracking-[-0.014em] text-ink"
          style={{
            fontSize: "min(31.4vw, 405px)",
            animation: "glara-rise 1.1s var(--ease-luxe) both",
          }}
        >
          GLARA
        </p>

        <p
          className="mt-7 text-center text-[11px] uppercase tracking-[0.22em] text-gold md:mt-[50px] md:text-base md:tracking-[0.13em]"
          style={{ animation: "glara-fade-up 0.9s var(--ease-luxe) 0.35s both" }}
        >
          {t.meta.tagline}
        </p>
      </div>

      {/* Full-bleed so the carousel can run past the shell on both sides */}
      <div className="mt-8 md:mt-12">
        <HeroCarousel items={items} />
      </div>
    </section>
  );
}
