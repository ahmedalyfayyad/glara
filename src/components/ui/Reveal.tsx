"use client";

import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { cx } from "@/lib/utils";

/**
 * Only the handful of HTML tags this wrapper is ever asked for. react-three-fiber
 * widens the JSX namespace with three.js elements whose children are typed
 * `never`, so an open `ElementType` here stops type-checking once r3f is present.
 */
type RevealTag = "div" | "span" | "section" | "article" | "ul" | "ol" | "li" | "p" | "h2" | "h3";

type RevealElementProps = {
  ref: Ref<HTMLElement | null>;
  "data-visible": boolean;
  style?: { transitionDelay: string };
  className: string;
  children: ReactNode;
};

/**
 * Fades a block in the first time it enters the viewport. Content is rendered
 * server-side either way — only the opacity/transform is deferred, so nothing
 * disappears for users with JS off or reduced motion on.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: RevealTag;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Element = Tag as unknown as (props: RevealElementProps) => ReactNode;

  return (
    <Element
      ref={ref}
      data-visible={visible}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cx("reveal", className)}
    >
      {children}
    </Element>
  );
}
