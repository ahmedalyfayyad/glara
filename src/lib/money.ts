import type { Locale } from "@/i18n/config";

export const CURRENCY = "USD";

/**
 * Prices are stored as whole units (the catalog has no cents), so the
 * formatter drops the fraction digits — "$4,200", not "$4,200.00".
 * Arabic keeps Latin digits: mixing Arabic-Indic numerals into a price grid
 * makes the columns impossible to scan.
 */
export function formatPrice(amount: number, locale: Locale = "en"): string {
  const tag = locale === "ar" ? "ar-EG-u-nu-latn" : "en-US";
  return new Intl.NumberFormat(tag, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string, locale: Locale = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const tag = locale === "ar" ? "ar-EG-u-nu-latn" : "en-US";
  return new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export const SHIPPING_FLAT = 0;

export function orderTotals(subtotal: number) {
  const shipping = SHIPPING_FLAT;
  return { subtotal, shipping, total: subtotal + shipping };
}
