"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cx } from "@/lib/utils";

export function Accordion({ items }: { items: Array<{ title: string; content: ReactNode }> }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div>
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.title} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`${baseId}-trigger-${index}`}
                aria-expanded={expanded}
                aria-controls={`${baseId}-panel-${index}`}
                onClick={() => setOpen(expanded ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-6 text-start transition-colors hover:text-gold"
              >
                <span className="label-caps">{item.title}</span>
                <ChevronDownIcon
                  size={18}
                  className={cx(
                    "shrink-0 transition-transform duration-300 ease-[var(--ease-luxe)]",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              id={`${baseId}-panel-${index}`}
              role="region"
              aria-labelledby={`${baseId}-trigger-${index}`}
              hidden={!expanded}
              className="pb-7 text-base leading-[1.9] text-ink-70"
              style={expanded ? { animation: "glara-fade 0.45s var(--ease-luxe) both" } : undefined}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
