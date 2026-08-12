import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/lib/queries";
import { getDictionary, type Locale } from "@/i18n";
import { formatPrice } from "@/lib/money";
import { cx } from "@/lib/utils";

/**
 * `card` is the catalogue tile from the Units artboard — bare render on white,
 * name and price on one line, type underneath. `bare` is the home grid, where
 * the render carries the whole cell and the caption only appears on hover.
 */
export function ProductCard({
  product,
  locale,
  variant = "card",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  product: ProductListItem;
  locale: Locale;
  variant?: "card" | "bare";
  priority?: boolean;
  sizes?: string;
}) {
  const t = getDictionary(locale);
  const name = locale === "ar" ? product.nameAr : product.name;
  const typeLabel = t.units.types[product.type as keyof typeof t.units.types] ?? product.type;

  const media = (
    <div className={cx("relative w-full overflow-hidden", variant === "bare" ? "aspect-5/4" : "aspect-4/3")}>
      <Image
        src={product.image}
        alt={product.imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={cx(
          "object-contain transition-[opacity,transform] duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]",
          product.hoverImage && "group-hover:opacity-0",
        )}
      />
      {product.hoverImage && (
        <Image
          src={product.hoverImage}
          alt=""
          fill
          sizes={sizes}
          aria-hidden="true"
          className="object-contain opacity-0 transition-opacity duration-[900ms] ease-[var(--ease-luxe)] group-hover:opacity-100"
        />
      )}
      {product.isNew && (
        <span className="eyebrow absolute start-0 top-0 text-[10px] text-gold">New</span>
      )}
    </div>
  );

  if (variant === "bare") {
    return (
      <Link
        href={`/${locale}/units/${product.slug}`}
        className="group block focus-visible:outline-none"
      >
        {media}
        <div className="mt-4 flex items-baseline justify-center gap-3 opacity-0 transition-opacity duration-500 ease-[var(--ease-luxe)] group-focus-visible:opacity-100 group-hover:opacity-100 md:mt-5">
          <p className="text-sm font-light tracking-[0.02em] md:text-base">{name}</p>
          <p className="text-sm text-ink-40">
            <span className="me-1">{t.common.from}</span>
            {formatPrice(product.basePrice, locale)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/units/${product.slug}`}
      className="group block focus-visible:outline-none"
    >
      {media}

      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="text-base font-light leading-snug tracking-[0.02em] transition-colors group-hover:text-gold">
          {name}
        </h3>
        <p className="shrink-0 whitespace-nowrap text-sm text-ink-60">
          <span className="me-1 text-ink-40">{t.common.from}</span>
          <span className="text-ink">{formatPrice(product.basePrice, locale)}</span>
        </p>
      </div>

      <p className="mt-1 text-sm text-ink-40">{typeLabel}</p>
    </Link>
  );
}
