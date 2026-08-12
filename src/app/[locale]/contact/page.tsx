import type { Metadata } from "next";
import { PageTitle } from "@/components/site/PageTitle";
import { ContactForm } from "@/components/site/ContactForm";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);
  return {
    title: t.contact.title,
    description: t.contact.subtitle,
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  return (
    <>
      <PageTitle size="md" subtitle={t.contact.subtitle}>
        {t.contact.title}
      </PageTitle>

      <div className="shell pb-24 pt-12 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          <div className="order-2 lg:order-1">
            <ContactForm />
          </div>

          <aside className="order-1 lg:order-2">
            <h2 className="label-caps">{t.contact.studio}</h2>
            <ul className="mt-6 space-y-5 text-base text-ink-70">
              <li className="flex items-start gap-3">
                <MapPinIcon size={18} className="mt-1 shrink-0 text-gold" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon size={18} className="shrink-0 text-gold" />
                <a href="tel:+201011911502" dir="ltr" className="link-underline hover:text-ink">
                  {t.footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon size={18} className="shrink-0 text-gold" />
                <a href="mailto:info@glara-eg.com" className="link-underline hover:text-ink">
                  {t.footer.email}
                </a>
              </li>
            </ul>
            <p className="mt-8 border-t border-line pt-6 text-base text-ink-60">{t.contact.hours}</p>
          </aside>
        </div>
      </div>
    </>
  );
}
