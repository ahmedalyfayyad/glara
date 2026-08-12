import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/i18n";

export function CustomizeBand({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section aria-labelledby="customize-heading">
      <div className="bg-sand px-5 pb-16 pt-20 md:px-10 md:pb-[92px] md:pt-[137px]">
        <div className="mx-auto flex w-full max-w-[1178px] flex-col items-center gap-10 md:gap-[69px]">
          <Reveal className="w-full">
            <h2
              id="customize-heading"
              className="font-display text-center leading-[0.45] text-white"
              style={{ fontSize: "clamp(46px, 12vw, 155px)" }}
            >
              {t.home.customizeTitle}
            </h2>
          </Reveal>

          <p className="max-w-[52ch] text-center text-base font-light leading-[1.6] text-line md:leading-[2.36]">
            {t.home.customizeSubtitle}
          </p>

          <ol className="flex w-full max-w-[1040px] items-start justify-between gap-4 md:gap-8">
            {t.home.customizeSteps.map((step, index) => (
              <Reveal
                key={step.n}
                as="li"
                delay={index * 120}
                className="flex flex-1 flex-col items-center gap-3 md:gap-[15px]"
              >
                <span className="flex h-[84px] w-[42px] items-center justify-center rounded-full border-[1.6px] border-white text-lg font-light text-white md:h-[130px] md:w-[64px] md:text-2xl">
                  {step.n}
                </span>
                <span className="text-center text-sm font-semibold tracking-[0.045em] text-white md:text-xl">
                  {step.title}
                </span>
                <span className="text-center text-xs font-extralight tracking-[0.045em] text-white/90 md:text-base">
                  {step.caption}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <Link
        href={`/${locale}/customize`}
        className="flex h-20 items-center justify-center bg-ink text-base font-light uppercase tracking-[0.05em] text-white underline decoration-1 underline-offset-4 transition-colors hover:text-gold md:h-[97px] md:text-xl"
      >
        {t.home.openLab}
      </Link>
    </section>
  );
}
