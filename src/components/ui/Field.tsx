"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cx } from "@/lib/utils";

const control =
  "w-full border-0 border-b border-line bg-transparent py-3 text-base font-light outline-none transition-colors focus:border-gold";

function Shell({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block text-ink-60">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p className="mt-2 text-sm text-[#8a2f2f]">{error}</p>
      ) : hint ? (
        <p className="mt-2 text-sm text-ink-40">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const auto = useId();
  const id = props.id ?? auto;
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cx(control, error && "border-[#8a2f2f]", className)}
      />
    </Shell>
  );
}

export function TextArea({
  label,
  hint,
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const auto = useId();
  const id = props.id ?? auto;
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      <textarea
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cx(control, "min-h-28 resize-y leading-relaxed", error && "border-[#8a2f2f]", className)}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: string; error?: string }) {
  const auto = useId();
  const id = props.id ?? auto;
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      <select {...props} id={id} className={cx(control, "cursor-pointer", className)}>
        {children}
      </select>
    </Shell>
  );
}
