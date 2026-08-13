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
