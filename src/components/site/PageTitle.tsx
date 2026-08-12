import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

/**
 * The oversized serif page title from the artboards — "Units", "Cart", "Checkout".
 * Scales with the viewport and caps at the artboard size.
 */
export function PageTitle({
  children,
  eyebrow,
  subtitle,
  className,
  size = "xl",
}: {
  children: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  className?: string;
  size?: "xl" | "md";
}) {
  return (
    <header className={cx("shell pt-10 text-center md:pt-16", className)}>
      {eyebrow && <p className="eyebrow mb-5 text-gold">{eyebrow}</p>}
      <h1
        className="font-display leading-[0.95] tracking-[-0.01em]"
        style={{ fontSize: size === "xl" ? "clamp(56px, 15vw, 190px)" : "clamp(40px, 9vw, 108px)" }}
      >
        {children}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-6 max-w-[56ch] text-base leading-[1.8] text-ink-60">{subtitle}</p>
      )}
    </header>
  );
}
