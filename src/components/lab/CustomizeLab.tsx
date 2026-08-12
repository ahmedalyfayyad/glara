"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Field";
import { CheckIcon } from "@/components/icons";
import { configurationPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/money";
import { cx } from "@/lib/utils";
import { fill } from "@/i18n";

export type LabProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  basePrice: number;
  finishes: Array<{ key: string; label: string; swatch: string; imageUrl: string; priceDelta: number }>;
  sizes: Array<{ label: string; priceDelta: number }>;
};

type Hardware = "brushed" | "black" | "gold";
type Basin = "integrated" | "vessel" | "double";

const STEPS = ["unit", "finish", "size", "details"] as const;

export function CustomizeLab({
  products,
  initialSlug,
}: {
  products: LabProduct[];
  initialSlug?: string;
}) {
  const { locale, t } = useI18n();
  const { addItem, notify } = useCart();

  const startIndex = Math.max(
    0,
    products.findIndex((product) => product.slug === initialSlug),
  );

  const [step, setStep] = useState(0);
  const [productId, setProductId] = useState(products[startIndex]?.id ?? products[0]?.id ?? "");
  const [finishKey, setFinishKey] = useState("");
  const [sizeLabel, setSizeLabel] = useState("");
  const [hardware, setHardware] = useState<Hardware>("brushed");
  const [basin, setBasin] = useState<Basin>("integrated");
  const [notes, setNotes] = useState("");
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "cart" | null>(null);

  const product = useMemo(
    () => products.find((row) => row.id === productId) ?? products[0],
    [products, productId],
  );

  // Every unit carries its own finish and size lists — reset when the unit changes.
  useEffect(() => {
    if (!product) return;
    setFinishKey(product.finishes[0]?.key ?? "");
    setSizeLabel(product.sizes[0]?.label ?? "");
    setSavedCode(null);
  }, [product]);

  if (!product) return null;

  const finish = product.finishes.find((row) => row.key === finishKey) ?? product.finishes[0];
  const size = product.sizes.find((row) => row.label === sizeLabel) ?? product.sizes[0];

  const price = configurationPrice(
    product.basePrice,
    finish?.priceDelta ?? 0,
    size?.priceDelta ?? 0,
    hardware,
    basin,
  );

  const preview = finish?.imageUrl || product.image;

  function reset() {
    setStep(0);
    setProductId(products[0].id);
    setHardware("brushed");
    setBasin("integrated");
    setNotes("");
    setSavedCode(null);
  }

  /** Persists the build and returns its id + human-readable code. */
  async function saveConfiguration(): Promise<{ id: string; code: string } | null> {
    const response = await fetch("/api/configurations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        finishKey: finish?.key,
        sizeLabel: size?.label,
        hardware,
        basin,
        notes,
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return { id: data.configuration.id as string, code: data.configuration.code as string };
  }

  async function onSave() {
    setBusy("save");
    const config = await saveConfiguration();
    setBusy(null);

    if (!config) {
      notify(t.common.error, "error");
      return;
    }
    setSavedCode(config.code);
    notify(fill(t.lab.savedAs, { code: config.code }));
  }

  async function onAddToCart() {
    if (!finish || !size) return;
    setBusy("cart");
    const config = await saveConfiguration();
    const ok = await addItem({
      productId: product.id,
      finishKey: finish.key,
      sizeLabel: size.label,
      configId: config?.id ?? null,
    });
    setBusy(null);
    if (config) setSavedCode(config.code);
    notify(ok ? t.product.added : t.common.error, ok ? "ok" : "error");
  }

  const summary = [
    { label: t.lab.steps.unit, value: product.name },
    { label: t.product.finish, value: finish?.label ?? "—" },
    { label: t.product.size, value: size?.label ?? "—" },
    { label: t.lab.hardware, value: t.lab.hardwareOptions[hardware] },
    { label: t.lab.basin, value: t.lab.basinOptions[basin] },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div>
        {/* Stepper */}
        <ol className="flex items-center gap-2 border-b border-line pb-6 sm:gap-4">
          {STEPS.map((key, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <li key={key} className="flex flex-1 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  className={cx(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm transition-colors duration-300",
                    active
                      ? "border-gold bg-gold text-white"
                      : done
                        ? "border-gold text-gold"
                        : "border-line text-ink-40",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? <CheckIcon size={15} /> : index + 1}
                </button>
                <span
                  className={cx(
                    "hidden text-sm sm:block",
                    active ? "text-ink" : "text-ink-40",
                  )}
                >
                  {t.lab.steps[key]}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 text-sm text-ink-40">
          {fill(t.lab.stepOf, { current: step + 1, total: STEPS.length })}
        </p>

        {/* Step panels */}
        <div className="mt-6">
          {step === 0 && (
            <section aria-labelledby="lab-unit">
              <h2 id="lab-unit" className="text-xl font-light md:text-2xl">
                {t.lab.selectUnit}
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3">
                {products.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setProductId(row.id)}
                    aria-pressed={row.id === product.id}
                    className={cx(
                      "border p-3 text-start transition-colors duration-300",
                      row.id === product.id
                        ? "border-gold"
                        : "border-line hover:border-ink-40",
                    )}
                  >
                    <div className="relative aspect-4/3">
                      <Image
                        src={row.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 22vw, 45vw"
                        className="object-contain p-2"
                      />
                    </div>
                    <p className="mt-3 text-sm leading-snug">{row.name}</p>
                    <p className="mt-1 text-sm text-ink-40">
                      {formatPrice(row.basePrice, locale)}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="lab-finish">
              <h2 id="lab-finish" className="text-xl font-light md:text-2xl">
                {t.lab.selectFinish}
              </h2>
              <div className="mt-6 flex flex-wrap gap-6">
                {product.finishes.map((row) => (
                  <button
                    key={row.key}
                    type="button"
                    onClick={() => setFinishKey(row.key)}
                    aria-pressed={row.key === finish?.key}
                    className="flex flex-col items-center gap-3"
                  >
                    <span
                      className={cx(
                        "h-16 w-16 rounded-full border transition-[box-shadow,border-color] duration-300",
                        row.key === finish?.key
                          ? "border-gold ring-2 ring-gold ring-offset-2"
                          : "border-line hover:border-ink-40",
                      )}
                      style={{ backgroundColor: row.swatch }}
                    />
                    <span className="text-sm text-ink-60">{row.label}</span>
                    {row.priceDelta > 0 && (
                      <span className="text-xs text-gold">+{formatPrice(row.priceDelta, locale)}</span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="lab-size">
              <h2 id="lab-size" className="text-xl font-light md:text-2xl">
                {t.lab.selectSize}
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {product.sizes.map((row) => (
                  <button
                    key={row.label}
                    type="button"
                    onClick={() => setSizeLabel(row.label)}
                    aria-pressed={row.label === size?.label}
                    className={cx(
                      "min-w-[110px] border px-5 py-3 text-sm transition-colors duration-300",
                      row.label === size?.label
                        ? "border-gold bg-gold text-white"
                        : "border-gold/40 text-ink-60 hover:border-gold hover:text-ink",
                    )}
                  >
                    <span className="block">{row.label}</span>
                    {row.priceDelta > 0 && (
                      <span
                        className={cx(
                          "mt-1 block text-xs",
                          row.label === size?.label ? "text-white/80" : "text-ink-40",
                        )}
                      >
                        +{formatPrice(row.priceDelta, locale)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="lab-details" className="space-y-9">
              <h2 id="lab-details" className="text-xl font-light md:text-2xl">
                {t.lab.steps.details}
              </h2>

              <OptionRow
                legend={t.lab.hardware}
                options={(["brushed", "black", "gold"] as const).map((key) => ({
                  key,
                  label: t.lab.hardwareOptions[key],
                }))}
                value={hardware}
                onChange={(value) => setHardware(value as Hardware)}
              />

              <OptionRow
                legend={t.lab.basin}
                options={(["integrated", "vessel", "double"] as const).map((key) => ({
                  key,
                  label: t.lab.basinOptions[key],
                }))}
                value={basin}
                onChange={(value) => setBasin(value as Basin)}
              />

              <TextArea
                label={t.lab.notes}
                placeholder={t.lab.notesPlaceholder}
                value={notes}
                maxLength={2000}
                onChange={(event) => setNotes(event.target.value)}
              />
            </section>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
          <Button
            type="button"
            variant="quiet"
            size="sm"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
          >
            {t.common.back}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              variant="solid"
              onClick={() => setStep((current) => Math.min(STEPS.length - 1, current + 1))}
            >
              {t.common.next}
            </Button>
          ) : (
            <Button type="button" variant="quiet" size="sm" onClick={reset}>
              {t.lab.reset}
            </Button>
          )}
        </div>
      </div>

      {/* Live preview */}
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="border border-line">
          <div className="relative aspect-4/3">
            <Image
              key={preview}
              src={preview}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-contain"
              style={{ animation: "glara-fade 0.5s var(--ease-luxe) both" }}
            />
          </div>

          <div className="p-6">
            <h2 className="label-caps">{t.lab.yourConfiguration}</h2>

            <dl className="mt-5 space-y-3 text-sm">
              {summary.map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <dt className="text-ink-40">{row.label}</dt>
                  <dd className="text-end">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
              <span className="text-sm text-ink-60">{t.lab.estimatedTotal}</span>
              <span className="text-2xl font-light">{formatPrice(price, locale)}</span>
            </div>
            <p className="mt-2 text-sm text-ink-40">{t.lab.priceNote}</p>

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="gold"
                size="lg"
                className="w-full"
                loading={busy === "cart"}
                onClick={onAddToCart}
              >
                {t.lab.addConfigToCart}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                loading={busy === "save"}
                onClick={onSave}
              >
                {t.lab.saveConfig}
              </Button>
            </div>

            {savedCode && (
              <p className="mt-4 text-center text-sm text-gold">
                {fill(t.lab.savedAs, { code: savedCode })}
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function OptionRow({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: Array<{ key: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="label-caps text-ink-70">{legend}</legend>
      <div className="mt-4 flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            aria-pressed={value === option.key}
            className={cx(
              "border px-5 py-2.5 text-sm transition-colors duration-300",
              value === option.key
                ? "border-gold bg-gold text-white"
                : "border-gold/40 text-ink-60 hover:border-gold hover:text-ink",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
