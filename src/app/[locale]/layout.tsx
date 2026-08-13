import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Amiri, IBM_Plex_Sans_Arabic, Instrument_Serif, Inter } from "next/font/google";
import "../globals.css";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartProvider } from "@/components/providers/CartProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { getDictionary } from "@/i18n";
import { isLocale, locales, localeDirection, type Locale } from "@/i18n/config";
import { getSessionUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500"],
  variable: "--font-arabic",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-display",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const base = siteUrl();

  return {
    metadataBase: new URL(base),
    title: { default: t.meta.homeTitle, template: `%s — ${t.meta.siteName}` },
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar" },
    },
    openGraph: {
      title: t.meta.homeTitle,
      description: t.meta.description,
      siteName: t.meta.siteName,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const dictionary = getDictionary(locale);
  const dir = localeDirection[locale];
  const [user, cart] = await Promise.all([getSessionUser(), readCart()]);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${instrument.variable} ${plexArabic.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Reveal-on-scroll starts at opacity 0; without JS it must never stay hidden. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <I18nProvider locale={locale} dir={dir} dictionary={dictionary}>
          <CartProvider initialCart={cart}>
            <div className="flex min-h-screen flex-col">
              <Header user={user ? { id: user.id, name: user.name, role: user.role } : null} />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer locale={locale} />
            </div>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
