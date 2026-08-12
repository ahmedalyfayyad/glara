import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/i18n";
import { AwardIcon, BoxIcon, DropletIcon, RulerIcon, ShieldIcon } from "@/components/icons";

const icons = [AwardIcon, ShieldIcon, DropletIcon, BoxIcon, RulerIcon];

export function TrustBadges({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell py-14 md:py-16">
      <ul className="rail -mx-5 gap-6 px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-0 lg:grid-cols-5 lg:gap-x-4">
        {t.home.badges.map((badge, index) => {
          const Icon = icons[index] ?? AwardIcon;
          return (
            <Reveal
              key={badge.title}
              as="li"
              delay={index * 80}
              className="flex w-[42vw] shrink-0 flex-col items-center text-center sm:w-auto"
            >
              <Icon size={40} className="text-gold md:size-12" strokeWidth={1} />
              <h3 className="mt-4 text-base font-normal tracking-[0.01em] md:text-lg">
                {badge.title}
              </h3>
              <p className="mt-2 text-sm text-ink-60 md:text-base">{badge.caption}</p>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
