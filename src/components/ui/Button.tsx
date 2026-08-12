import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";
import { SpinnerIcon } from "@/components/icons";

type Variant = "solid" | "gold" | "outline" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border text-center align-middle uppercase tracking-[0.16em] transition-[background-color,color,border-color,opacity] duration-500 ease-[var(--ease-luxe)] disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  solid: "border-ink bg-ink text-white hover:bg-transparent hover:text-ink",
  gold: "border-gold bg-gold text-white hover:bg-gold-dark hover:border-gold-dark",
  outline: "border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white",
  quiet: "border-transparent bg-transparent text-ink-60 hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[11px]",
  md: "h-12 px-8 text-xs",
  lg: "h-14 px-10 text-xs",
};

export function buttonClass(variant: Variant = "solid", size: Size = "md", className?: string) {
  return cx(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "solid",
  size = "md",
  loading = false,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={buttonClass(variant, size, className)}
    >
      {loading && <SpinnerIcon size={16} />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "solid",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
