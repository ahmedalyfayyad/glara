import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/i18n";

export function Engineering({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const table = t.home.engineeringTable;

  const certified = (
    <span className="inline-flex items-center gap-2 text-gold">
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold" />
      {table.certified}
    </span>
  );

  return (
    <section className="shell py-16 md:py-24 lg:py-28" aria-labelledby="engineering">
      <Reveal className="text-center">
        <p className="eyebrow text-gold">{t.home.engineeringEyebrow}</p>
        <h2
          id="engineering"
          className="mx-auto mt-6 max-w-[960px] text-[clamp(28px,5vw,48px)] font-light leading-[1.2] tracking-[-0.01em]"
        >
          {t.home.engineeringTitle}
        </h2>
      </Reveal>

      <Reveal className="mt-12 md:mt-16">
        {/* Desktop: the certification table exactly as specified */}
        <table className="hidden w-full border-collapse border border-line text-start md:table">
          <thead>
            <tr>
              <th scope="col" className="w-1/3 border border-line px-8 py-5 text-start text-base font-normal">
                {table.standard}
              </th>
              <th scope="col" className="w-1/3 border border-line px-8 py-5 text-start text-base font-normal">
                {table.specification}
              </th>
              <th scope="col" className="w-1/3 border border-line px-8 py-5 text-start text-base font-normal">
                {table.status}
              </th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.standard}>
                <td className="border border-line px-8 py-6 text-base text-ink">{row.standard}</td>
                <td className="border border-line px-8 py-6 text-base text-ink-70">{row.spec}</td>
                <td className="border border-line px-8 py-6 text-base">{certified}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile: the same rows, stacked so nothing has to scroll sideways */}
        <ul className="space-y-4 md:hidden">
          {table.rows.map((row) => (
            <li key={row.standard} className="border border-line p-5">
              <p className="text-base">{row.standard}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-70">{row.spec}</p>
              <p className="mt-3 text-sm">{certified}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <p className="mt-8 text-center text-sm leading-relaxed text-ink-40 md:text-base">
        {table.note}
      </p>
    </section>
  );
}
