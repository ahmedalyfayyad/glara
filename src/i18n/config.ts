export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const localeNames: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Route params arrive as plain strings. The locale layout 404s on anything
 * unsupported, so by the time a page runs this narrowing is already guaranteed.
 */
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** The other locale — the header toggle only ever switches between two. */
export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}
