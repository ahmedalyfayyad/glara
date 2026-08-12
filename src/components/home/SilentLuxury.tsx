import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/i18n";
import { DropletIcon, ShieldIcon } from "@/components/icons";

export function SilentLuxury({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="py-16 md:py-24" aria-labelledby="silent-luxury">
      <div className="shell">
        <Reveal>
          <h2
            id="silent-luxury"
            className="font-display text-center text-2xl uppercase tracking-[0.35em] text-ink-70 md:text-[32px]"
          >
            {t.home.silentLuxury}
          </h2>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 md:mt-16 lg:grid-cols-[1fr_1.4fr_1fr] lg:gap-8">
          <Reveal className="order-2 lg:order-1">
            <h3 className="font-display text-xl uppercase tracking-[0.06em] text-gold-dark md:text-2xl">
              {t.home.premiumMaterials}
            </h3>
            <ul className="mt-5 space-y-3">
              {t.home.premiumMaterialsList.map((item) => (
                <li key={item} className="flex items-start gap-2 text-base text-ink-70">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-4/3 w-full max-w-[760px]">
              <Image
                src="/products/walnut-open-01.png"
                alt={t.home.silentLuxury}
                fill
                sizes="(min-width: 1024px) 46vw, 96vw"
                className="object-contain"
              />
            </div>
          </Reveal>

          <Reveal className="order-3">
            <h3 className="font-display text-xl uppercase leading-tight tracking-[0.04em] text-[#25344d] md:text-2xl">
              {t.home.waterproofCore}
            </h3>
            <ul className="mt-5 space-y-3">
              {t.home.waterproofList.map((item) => (
                <li key={item} className="flex items-start gap-2 text-base text-ink-70">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#25344d]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge icon={<DropletIcon size={16} />} label={t.home.waterproofBadges[0]} />
              <Badge icon={<ShieldIcon size={16} />} label={t.home.waterproofBadges[1]} />
            </div>
          </Reveal>
        </div>

        <p className="mt-14 text-center font-display text-2xl tracking-[0.32em] text-ink-70 md:mt-20 md:text-[28px]">
          GLARA
        </p>
      </div>
    </section>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#25344d]/25 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#25344d]">
      {icon}
      {label}
    </span>
  );
}
