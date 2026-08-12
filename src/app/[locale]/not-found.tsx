import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import en from "@/i18n/dictionaries/en";

/**
 * not-found.tsx cannot read route params, so this renders in English with the
 * links pointing at the default locale. Every other 404 path keeps its locale.
 */
export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-[clamp(72px,16vw,180px)] leading-none text-line">404</p>
      <h1 className="mt-6 font-display text-3xl md:text-4xl">{en.notFound.title}</h1>
      <p className="mt-4 max-w-[44ch] text-base text-ink-60">{en.notFound.body}</p>
      <Link href="/en" className={buttonClass("solid", "md", "mt-9")}>
        {en.notFound.cta}
      </Link>
    </div>
  );
}
