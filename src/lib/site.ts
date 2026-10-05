import { defaultLocale, locales } from "@/i18n/config";

/**
 * Canonical origin for metadata, sitemap, robots and JSON-LD.
 *
 * NEXT_PUBLIC_SITE_URL wins when set (a custom domain). On Vercel we fall back
 * to the project's production hostname so preview and first deploys still emit
 * absolute URLs that resolve, rather than pointing search engines at localhost.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

/**
 * Canonical plus hreflang alternates for one page.
 *
 * Next replaces `alternates` wholesale rather than merging it: a page that set
 * only a canonical dropped the languages map the layout had declared, which is
 * how every route below the home page lost its hreflang. Building both here
 * keeps them together, so a page cannot set one and silently discard the other.
 *
 * `path` is whatever follows the locale segment — "/units", or "" for the
 * locale root. Every route exists under each locale at the same path, which is
 * what makes the pairing a straight substitution.
 */
export function localeAlternates(locale: string, path: string = "") {
  const languages = Object.fromEntries(locales.map((code) => [code, `/${code}${path}`]));

  return {
    canonical: `/${locale}${path}`,
    // x-default names the version to serve a reader whose language we do not publish.
    languages: { ...languages, "x-default": `/${defaultLocale}${path}` },
  };
}
