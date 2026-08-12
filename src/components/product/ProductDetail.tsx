"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { Accordion } from "@/components/ui/Accordion";
import { ArrowRightIcon, HeartIcon, SpinnerIcon } from "@/components/icons";
import { formatPrice } from "@/lib/money";
import { cx } from "@/lib/utils";
import { fill } from "@/i18n";

export type DetailProduct = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  tagline: string;
  description: string;
  basePrice: number;
  materials: string;
  installation: string;
  warranty: string;
  specs: Array<{ label: string; value: string }>;
  images: Array<{ url: string; alt: string; finishKey: string | null }>;
  finishes: Array<{ key: string; label: string; swatch: string; imageUrl: string; priceDelta: number }>;
  sizes: Array<{ label: string; priceDelta: number }>;
};

export function ProductDetail({
  product,
  initiallySaved,
  signedIn,
}: {
  product: DetailProduct;
  initiallySaved: boolean;
  signedIn: boolean;
}) {
  const { locale, t } = useI18n();
  const { addItem, notify } = useCart();

  const [finishKey, setFinishKey] = useState(product.finishes[0]?.key ?? "");
  const [sizeLabel, setSizeLabel] = useState(product.sizes[0]?.label ?? "");
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(initiallySaved);

  const finish = product.finishes.find((row) => row.key === finishKey);
  const size = product.sizes.find((row) => row.label === sizeLabel);

  const gallery = useMemo(() => {
    // Lead with the shot that belongs to the chosen finish, keep the rest in order.
    const matching = product.images.filter((image) => image.finishKey === finishKey);
    const rest = product.images.filter((image) => image.finishKey !== finishKey);
    return [...matching, ...rest];
  }, [product.images, finishKey]);

  const price = product.basePrice + (finish?.priceDelta ?? 0) + (size?.priceDelta ?? 0);
  const main = gallery[activeImage] ?? gallery[0];

  function chooseFinish(key: string) {
    setFinishKey(key);
    setActiveImage(0);
  }

  async function add() {
    if (!finishKey || !sizeLabel) return;
    setAdding(true);
    const ok = await addItem({ productId: product.id, finishKey, sizeLabel });
    setAdding(false);
    notify(ok ? t.product.added : t.common.error, ok ? "ok" : "error");
  }

  async function toggleFavorite() {
    if (!signedIn) {
      notify(t.errors.unauthorized, "error");
      return;
    }
    const previous = saved;
    setSaved(!previous);
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });
    if (!response.ok) setSaved(previous);
  }

  const accordionItems = [
    {
      title: t.product.specifications,
      content: (
        <dl className="divide-y divide-line">
          {product.specs.map((spec) => (
            <div key={spec.label} className="flex justify-between gap-6 py-3">
              <dt className="text-ink-60">{spec.label}</dt>
              <dd className="text-end text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    { title: t.product.materials, content: <p>{product.materials}</p> },
    { title: t.product.installationGuide, content: <p>{product.installation}</p> },
    { title: t.product.warranty, content: <p>{product.warranty}</p> },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      {/* Gallery — the render carries the page, so it runs edge to edge */}
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <div className="relative aspect-4/3 w-full overflow-hidden">
          {main && (
            <Image
              key={main.url}
              src={main.url}
              alt={main.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
              style={{ animation: "glara-fade 0.5s var(--ease-luxe) both" }}
            />
          )}
        </div>

        {gallery.length > 1 && (
          <div className="mt-5 grid grid-cols-4 gap-3" role="group" aria-label={t.product.gallery}>
            {gallery.slice(0, 4).map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={fill(t.product.viewImage, { n: index + 1 })}
                aria-current={index === activeImage}
                className={cx(
                  "relative aspect-4/3 overflow-hidden border transition-[opacity,border-color] duration-500",
                  index === activeImage
                    ? "border-gold opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 12vw, 22vw"
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Buy panel */}
      <div className="lg:pt-4">
        <p className="eyebrow text-gold">{product.collection}</p>
        <h1 className="mt-4 text-[clamp(28px,4vw,40px)] font-light leading-tight tracking-[-0.01em]">
          {product.name}
        </h1>
        <p className="mt-4 text-base text-ink-60">{product.tagline}</p>

        <p className="mt-7 text-2xl font-light md:text-[28px]">
          <span className="me-1 text-base text-ink-40">{t.common.from}</span>
          {formatPrice(price, locale)}
        </p>
        <p className="mt-2 text-sm text-ink-40">{t.product.inStock}</p>

        {/* Finish */}
        <fieldset className="mt-9">
          <legend className="label-caps text-ink-70">{t.product.finish}</legend>
          <div className="mt-4 flex flex-wrap gap-5">
            {product.finishes.map((row) => (
              <button
                key={row.key}
                type="button"
                onClick={() => chooseFinish(row.key)}
                aria-pressed={row.key === finishKey}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className={cx(
                    "h-10 w-10 rounded-full border transition-[box-shadow,border-color] duration-300",
                    row.key === finishKey
                      ? "border-gold ring-2 ring-gold ring-offset-2"
                      : "border-line hover:border-ink-40",
                  )}
                  style={{ backgroundColor: row.swatch }}
                />
                <span className="text-[11px] uppercase tracking-[0.1em] text-ink-60">
                  {row.label}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Size */}
        <fieldset className="mt-8">
          <legend className="label-caps text-gold">{t.product.size}</legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.sizes.map((row) => (
              <button
                key={row.label}
                type="button"
                onClick={() => setSizeLabel(row.label)}
                aria-pressed={row.label === sizeLabel}
                className={cx(
                  "min-w-[86px] border px-5 py-2.5 text-sm transition-colors duration-300",
                  row.label === sizeLabel
                    ? "border-gold bg-gold text-white"
                    : "border-gold/40 text-ink-60 hover:border-gold hover:text-ink",
                )}
              >
                {row.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={add}
          disabled={adding}
          className="mt-9 flex h-14 w-full items-center justify-center gap-2 bg-gold text-base font-light lowercase tracking-[0.06em] text-white transition-colors duration-500 hover:bg-gold-dark disabled:opacity-60"
        >
          {adding && <SpinnerIcon size={18} />}
          {adding ? t.product.adding : t.product.addToCart}
        </button>

        <div className="mt-5 flex items-center justify-center gap-8">
          <Link
            href={`/${locale}/customize?product=${product.slug}`}
            className="link-underline label-caps inline-flex items-center gap-2 text-[13px] tracking-[0.16em] text-ink-70 hover:text-gold"
          >
            {t.product.customize}
            <ArrowRightIcon size={15} className="flip-rtl" />
          </Link>

          <button
            type="button"
            onClick={toggleFavorite}
            aria-pressed={saved}
            className={cx(
              "label-caps inline-flex items-center gap-2 text-[13px] tracking-[0.16em] transition-colors",
              saved ? "text-gold" : "text-ink-70 hover:text-gold",
            )}
          >
            <HeartIcon size={15} filled={saved} />
            {saved ? t.product.savedToFavorites : t.product.saveToFavorites}
          </button>
        </div>

        <p className="mt-10 text-base leading-[1.9] text-ink-70">{product.description}</p>

        <div className="mt-10">
          <Accordion items={accordionItems} />
        </div>
      </div>
    </div>
  );
}
