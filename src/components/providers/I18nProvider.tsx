"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

type I18nValue = { locale: Locale; dir: "ltr" | "rtl"; t: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}

/** Prefixes an app-relative path with the active locale. */
export function useHref(): (path: string) => string {
  const { locale } = useI18n();
  return (path: string) => `/${locale}${path === "/" ? "" : path}`;
}

export function I18nProvider({
  locale,
  dir,
  dictionary,
  children,
}: {
  locale: Locale;
  dir: "ltr" | "rtl";
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, dir, t: dictionary }}>{children}</I18nContext.Provider>
  );
}
