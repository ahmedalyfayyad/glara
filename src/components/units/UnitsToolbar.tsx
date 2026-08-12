"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/providers/I18nProvider";
import { fill } from "@/i18n";
import { SearchIcon } from "@/components/icons";

export function UnitsToolbar({ count }: { count: number }) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [term, setTerm] = useState(searchParams.get("q") ?? "");

  // Keep the box in step with back/forward navigation and cleared filters.
  useEffect(() => {
    setTerm(searchParams.get("q") ?? "");
  }, [searchParams]);

  function push(next: URLSearchParams) {
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (term.trim()) params.set("q", term.trim());
    else params.delete("q");
    push(params);
  }

  function changeSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") params.delete("sort");
    else params.set("sort", value);
    push(params);
  }

  const label = count === 1 ? t.units.resultCount : t.units.resultsCount;

  return (
    <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-base text-ink-70">{fill(label, { count })}</p>

      <div className="flex items-center gap-6">
        <label className="sr-only" htmlFor="units-sort">
          {t.common.sortBy}
        </label>
        <select
          id="units-sort"
          value={searchParams.get("sort") ?? "featured"}
          onChange={(event) => changeSort(event.target.value)}
          className="cursor-pointer border-0 bg-transparent text-sm text-ink-70 outline-none transition-colors hover:text-ink"
        >
          <option value="featured">{t.units.sort.featured}</option>
          <option value="priceAsc">{t.units.sort.priceAsc}</option>
          <option value="priceDesc">{t.units.sort.priceDesc}</option>
          <option value="newest">{t.units.sort.newest}</option>
        </select>

        <form onSubmit={submit} className="flex items-center gap-2 border-b border-line pb-1">
          <SearchIcon size={16} className="shrink-0 text-ink-40" />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={t.units.searchPlaceholder}
            aria-label={t.common.search}
            className="w-28 bg-transparent text-sm outline-none sm:w-36"
          />
        </form>
      </div>
    </div>
  );
}
