"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { SearchIcon } from "@/components/icons";
import { formatPrice } from "@/lib/money";
import { cx } from "@/lib/utils";
import type { MaterialOption } from "@/lib/materials";

/**
 * The full Greenlam shade card, filtered down to something a shopper can
 * actually move through: one category at a time, with a search that matches the
 * decor name or its catalogue number.
 */
export function MaterialPicker({
  materials,
  selected,
  onSelect,
}: {
  materials: MaterialOption[];
  selected: string | null;
  onSelect: (material: MaterialOption) => void;
}) {
  const { locale, t } = useI18n();
  const [category, setCategory] = useState<string>("wood");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of materials) map.set(m.category, (map.get(m.category) ?? 0) + 1);
    return map;
  }, [materials]);

  const categories = useMemo(
    () => [...counts.keys()].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0)),
    [counts],
  );

  const visible = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();
    // A search spans the whole card; without one, stay inside the open category.
    const pool = term ? materials : materials.filter((m) => m.category === category);
    if (!term) return pool;
    return pool.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.decorNo.includes(term) ||
        m.decorCode.toLowerCase().includes(term),
    );
  }, [materials, category, deferredQuery]);

  const current = materials.find((m) => m.code === selected) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {categories.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setCategory(key);
                setQuery("");
              }}
              aria-pressed={!deferredQuery && key === category}
              className={cx(
                "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors duration-300",
                !deferredQuery && key === category
                  ? "border-gold bg-gold text-white"
                  : "border-gold/40 text-ink-60 hover:border-gold hover:text-ink",
              )}
            >
              {t.lab.materialCategories[key as keyof typeof t.lab.materialCategories] ?? key}
              <span className="ms-1.5 text-[11px] opacity-70">{counts.get(key)}</span>
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 border-b border-line pb-1">
          <SearchIcon size={15} className="shrink-0 text-ink-40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.lab.searchMaterials}
            aria-label={t.lab.searchMaterials}
            className="w-32 bg-transparent text-sm outline-none sm:w-44"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-ink-40">{t.common.noResults}</p>
      ) : (
        <ul className="mt-6 grid max-h-[420px] grid-cols-3 gap-3 overflow-y-auto pe-1 sm:grid-cols-4 lg:grid-cols-5">
          {visible.map((material) => {
            const active = material.code === selected;
            return (
              <li key={material.code}>
                <button
                  type="button"
                  onClick={() => onSelect(material)}
                  aria-pressed={active}
                  title={`${material.name} · ${material.decorNo} ${material.decorCode}`}
                  className={cx(
                    "group block w-full text-start transition-transform duration-300 ease-[var(--ease-luxe)] hover:-translate-y-0.5",
                  )}
                >
                  <span
                    className={cx(
                      "relative block aspect-square overflow-hidden rounded-[3px] border transition-[border-color,box-shadow] duration-300",
                      active
                        ? "border-gold ring-2 ring-gold ring-offset-2"
                        : "border-line group-hover:border-ink-40",
                    )}
                    style={{ backgroundColor: material.hex }}
                  >
                    <Image
                      src={material.texture}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 110px, 30vw"
                      className="object-cover"
                    />
                  </span>
                  <span className="mt-2 block truncate text-xs leading-snug text-ink-70">
                    {material.name}
                  </span>
                  <span className="block truncate text-[11px] text-ink-40">
                    {material.decorNo} {material.decorCode}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {current && (
        <div className="mt-6 flex items-center gap-4 border-t border-line pt-5">
          <span
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[3px] border border-line"
            style={{ backgroundColor: current.hex }}
          >
            <Image src={current.texture} alt="" fill sizes="48px" className="object-cover" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base">{current.name}</p>
            <p className="mt-0.5 text-sm text-ink-40">
              {current.decorNo} {current.decorCode} ·{" "}
              {t.lab.materialFamilies[current.family as keyof typeof t.lab.materialFamilies] ??
                current.family}
            </p>
          </div>
          <p className="shrink-0 text-sm text-gold">
            {current.priceDelta > 0 ? `+${formatPrice(current.priceDelta, locale)}` : t.common.free}
          </p>
        </div>
      )}
    </div>
  );
}
