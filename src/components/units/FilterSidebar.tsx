"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/providers/I18nProvider";
import { ChevronDownIcon, SlidersIcon } from "@/components/icons";
import { cx } from "@/lib/utils";

type Group = { param: "type" | "finish"; label: string; options: Array<{ value: string; label: string }> };

export function FilterSidebar() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ type: true, finish: true });
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups: Group[] = [
    {
      param: "type",
      label: t.units.type,
      options: [
        { value: "all", label: t.units.all },
        { value: "vanity", label: t.units.types.vanity },
        { value: "mirror", label: t.units.types.mirror },
        { value: "storage", label: t.units.types.storage },
      ],
    },
    {
      param: "finish",
      label: t.units.finish,
      options: [
        { value: "all", label: t.units.all },
        { value: "matte", label: t.units.finishes.matte },
        { value: "gloss", label: t.units.finishes.gloss },
        { value: "wood", label: t.units.finishes.wood },
      ],
    },
  ];

  function select(param: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete(param);
    else params.set(param, value);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const hasFilters = Boolean(searchParams.get("type") || searchParams.get("finish") || searchParams.get("q"));

  const panel = (
    <div className="space-y-8">
      {groups.map((group) => {
        const active = searchParams.get(group.param) ?? "all";
        const open = openGroups[group.param] !== false;
        return (
          <div key={group.param} className="border-b border-line pb-7 last:border-b-0">
            <button
              type="button"
              onClick={() =>
                setOpenGroups((current) => ({ ...current, [group.param]: !open }))
              }
              aria-expanded={open}
              className="label-caps flex w-full items-center justify-between text-ink-70 transition-colors hover:text-ink"
            >
              {group.label}
              <ChevronDownIcon
                size={16}
                className={cx("transition-transform duration-300", open && "rotate-180")}
              />
            </button>

            {open && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {group.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => select(group.param, option.value)}
                    aria-pressed={active === option.value}
                    className={cx(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors duration-300",
                      active === option.value
                        ? "border-gold bg-gold text-white"
                        : "border-gold/45 text-ink-70 hover:border-gold hover:text-ink",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="link-underline text-sm text-ink-60 hover:text-ink"
        >
          {t.common.clearFilters}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: collapsed behind a toggle so the grid stays above the fold */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          className="label-caps flex w-full items-center justify-between border-y border-line py-4"
        >
          <span className="flex items-center gap-2">
            <SlidersIcon size={16} />
            {t.units.filters}
          </span>
          <ChevronDownIcon
            size={16}
            className={cx("transition-transform duration-300", mobileOpen && "rotate-180")}
          />
        </button>
        {mobileOpen && <div className="py-7">{panel}</div>}
      </div>

      <aside className="hidden lg:block" aria-label={t.units.filters}>
        <h2 className="label-caps mb-8 text-ink">{t.units.filters}</h2>
        {panel}
      </aside>
    </>
  );
}
