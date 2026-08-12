import Link from "next/link";
import { getDictionary, fill, type Locale } from "@/i18n";
import { NewsletterForm } from "./NewsletterForm";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const href = (path: string) => `/${locale}${path === "/" ? "" : path}`;

  const collections = [
    { label: t.footer.collectionLinks.vanities, path: "/units?type=vanity" },
    { label: t.footer.collectionLinks.storage, path: "/units?type=storage" },
    { label: t.footer.collectionLinks.kitchen, path: "/units" },
    { label: t.footer.collectionLinks.custom, path: "/customize" },
  ];

  const support = [
    { label: t.footer.supportLinks.installation, path: "/support/installation" },
    { label: t.footer.supportLinks.warranty, path: "/support/warranty" },
    { label: t.footer.supportLinks.care, path: "/support/care" },
    { label: t.footer.supportLinks.faqs, path: "/support/faqs" },
  ];

  return (
    <footer className="border-t border-line bg-white">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2 lg:max-w-[260px]">
            <p className="text-base tracking-[0.2em]">GLARA</p>
            <p className="mt-6 text-base leading-[1.8] text-ink-60">{t.footer.blurb}</p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors hover:border-gold hover:text-gold"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors hover:border-gold hover:text-gold"
              >
                <FacebookIcon size={18} />
              </a>
            </div>
          </div>

          <nav aria-label={t.footer.collections}>
            <h2 className="text-base tracking-[0.05em]">{t.footer.collections}</h2>
            <ul className="mt-6 space-y-3">
              {collections.map((link) => (
                <li key={link.label}>
                  <Link
                    href={href(link.path)}
                    className="link-underline text-base text-ink-60 transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.support}>
            <h2 className="text-base tracking-[0.05em]">{t.footer.support}</h2>
            <ul className="mt-6 space-y-3">
              {support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={href(link.path)}
                    className="link-underline text-base text-ink-60 transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-base tracking-[0.05em]">{t.footer.contact}</h2>
            <ul className="mt-6 space-y-4 text-base text-ink-60">
              <li className="flex items-start gap-3">
                <MapPinIcon size={18} className="mt-1 shrink-0 text-gold" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon size={18} className="shrink-0 text-gold" />
                <a href="tel:+201011911502" dir="ltr" className="hover:text-ink">
                  {t.footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon size={18} className="shrink-0 text-gold" />
                <a href="mailto:info@glara-eg.com" className="hover:text-ink">
                  {t.footer.email}
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <h3 className="label-caps text-ink">{t.footer.newsletter}</h3>
              <p className="mt-2 text-sm text-ink-60">{t.footer.newsletterBody}</p>
              <div className="mt-4">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-base text-ink-60 md:flex-row md:items-center md:justify-between">
          <p>{fill(t.footer.rights, { year: new Date().getFullYear() })}</p>
          <p className="tracking-[0.05em]">{t.footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
