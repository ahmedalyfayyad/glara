import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageTitle } from "@/components/site/PageTitle";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary, locales, type Locale, toLocale } from "@/i18n";

const TOPICS = ["installation", "warranty", "care", "faqs"] as const;
type Topic = (typeof TOPICS)[number];

export function generateStaticParams() {
  return locales.flatMap((locale) => TOPICS.map((topic) => ({ locale, topic })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; topic: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, topic } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);
  if (!TOPICS.includes(topic as Topic)) return {};
  const entry = t.support[topic as Topic];
  return {
    title: entry.title,
    description: entry.intro,
    alternates: { canonical: `/${locale}/support/${topic}` },
  };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string; topic: string }>;
}) {
  const { locale: localeParam, topic } = await params;
  const locale = toLocale(localeParam);
  if (!TOPICS.includes(topic as Topic)) notFound();

  const t = getDictionary(locale);
  const entry = t.support[topic as Topic];

  return (
    <>
      <PageTitle size="md" eyebrow={t.support.title} subtitle={entry.intro}>
        {entry.title}
      </PageTitle>

      <div className="shell pb-24 pt-12 md:pt-16">
        <div className="mx-auto max-w-[760px]">
          {topic === "faqs" ? (
            <Accordion
              items={t.support.faqs.items.map((item) => ({
                title: item.q,
                content: <p>{item.a}</p>,
              }))}
            />
          ) : (
            <div className="space-y-10">
              {"sections" in entry &&
                entry.sections.map((section, index) => (
                  <Reveal key={section.title} delay={index * 70}>
                    <h2 className="text-xl font-light md:text-2xl">{section.title}</h2>
                    <p className="mt-3 text-base leading-[1.9] text-ink-70">{section.body}</p>
                  </Reveal>
                ))}
            </div>
          )}

          <nav
            aria-label={t.support.title}
            className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8"
          >
            {TOPICS.filter((other) => other !== topic).map((other) => (
              <Link
                key={other}
                href={`/${locale}/support/${other}`}
                className="link-underline text-base text-ink-60 hover:text-ink"
              >
                {t.support[other].title}
              </Link>
            ))}
          </nav>

          <div className="mt-12 border border-line p-8 text-center md:p-10">
            <h2 className="font-display text-2xl md:text-3xl">{t.contact.title}</h2>
            <p className="mx-auto mt-3 max-w-[44ch] text-base text-ink-60">{t.contact.subtitle}</p>
            <div className="mt-7">
              <ButtonLink href={`/${locale}/contact`} variant="solid">
                {t.contact.send}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
