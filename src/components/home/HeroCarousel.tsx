"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { formatPrice } from "@/lib/money";

export type HeroItem = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  price: number;
};

/** Pixels per second the rail drifts on its own. */
const DRIFT = 34;

export function HeroCarousel({ items }: { items: HeroItem[] }) {
  const { locale, t } = useI18n();
  const railRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Three copies so the rail can wrap without the seam ever being on screen.
  const loop = [...items, ...items, ...items];

  /** Scales each card by how close its centre is to the centre of the rail. */
  const paint = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const box = rail.getBoundingClientRect();
    if (box.width === 0) return;

    const centre = box.left + box.width / 2;
    const reach = box.width / 2;

    for (const child of Array.from(rail.children) as HTMLElement[]) {
      const rect = child.getBoundingClientRect();
      // Undo the current scale so the measurement is of the card's layout width.
      const scaled = rect.width || 1;
      const distance = Math.abs(rect.left + scaled / 2 - centre) / reach;
      const raw = Math.max(0, 1 - distance * 1.35);
      // Smoothstep, so the centre card blooms instead of ramping linearly.
      const focus = raw * raw * (3 - 2 * raw);

      child.style.transform = `scale(${(0.66 + 0.44 * focus).toFixed(4)})`;
      child.style.opacity = (0.4 + 0.6 * focus).toFixed(3);

      const caption = child.querySelector<HTMLElement>("[data-caption]");
      if (caption) caption.style.opacity = Math.max(0, (focus - 0.55) * 2.2).toFixed(3);
    }
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*
     * One copy of the list, measured from layout offsets so the transform on
     * each card cannot skew it. scrollWidth/3 would be a gap short and the
     * wrap would visibly jump.
     */
    const measure = () => {
      const cards = rail.children as HTMLCollectionOf<HTMLElement>;
      const start = cards[0]?.offsetLeft ?? 0;
      const next = cards[items.length]?.offsetLeft ?? rail.scrollWidth / 3;
      return next - start;
    };

    let period = measure();

    /*
     * scrollLeft is snapped to whole pixels on write, so a 30px/s drift would
     * be rounded away every frame. The float position lives here instead, and
     * resyncs whenever the reader scrolls the rail themselves.
     */
    let position = period;
    let applied = -1;
    rail.scrollLeft = position;
    paint();

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (Math.abs(rail.scrollLeft - applied) > 1.5) position = rail.scrollLeft;
      // Content travels left → right, so the scroll offset walks backwards.
      if (!pausedRef.current) position -= DRIFT * delta;

      if (position < period * 0.5) position += period;
      else if (position > period * 1.5) position -= period;

      rail.scrollLeft = position;
      applied = rail.scrollLeft;

      paint();
      frame = requestAnimationFrame(tick);
    };

    // With reduced motion the rail sits still and only repaints when scrolled.
    const onScroll = () => paint();
    if (reduced) rail.addEventListener("scroll", onScroll, { passive: true });
    else frame = requestAnimationFrame(tick);

    const onResize = () => {
      period = measure();
      position = rail.scrollLeft;
      paint();
    };
    window.addEventListener("resize", onResize);

    // Drag to throw the rail around.
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    const down = (event: PointerEvent) => {
      if (event.pointerType === "touch") return; // native touch scrolling is better
      dragging = true;
      pausedRef.current = true;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      rail.scrollLeft = startScroll - (event.clientX - startX);
    };
    const up = () => {
      dragging = false;
      pausedRef.current = false;
    };

    rail.addEventListener("pointerdown", down);
    rail.addEventListener("pointermove", move);
    rail.addEventListener("pointerup", up);
    rail.addEventListener("pointercancel", up);

    const hold = () => (pausedRef.current = true);
    const release = () => (pausedRef.current = false);
    rail.addEventListener("mouseenter", hold);
    rail.addEventListener("mouseleave", release);
    rail.addEventListener("touchstart", hold, { passive: true });
    rail.addEventListener("touchend", release);

    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      rail.removeEventListener("pointerdown", down);
      rail.removeEventListener("pointermove", move);
      rail.removeEventListener("pointerup", up);
      rail.removeEventListener("pointercancel", up);
      rail.removeEventListener("mouseenter", hold);
      rail.removeEventListener("mouseleave", release);
      rail.removeEventListener("touchstart", hold);
      rail.removeEventListener("touchend", release);
    };
  }, [paint, items.length]);

  function nudge(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    const step = (rail.firstElementChild as HTMLElement | null)?.offsetWidth ?? 320;
    rail.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={railRef}
        dir="ltr"
        role="region"
        aria-label={t.home.exploreTitle}
        className="rail cursor-grab items-center gap-6 py-4 active:cursor-grabbing md:gap-10"
        style={{ scrollSnapType: "none" }}
      >
        {loop.map((item, index) => {
          const original = index < items.length;
          return (
            <Link
              key={`${item.slug}-${index}`}
              href={`/${locale}/units/${item.slug}`}
              tabIndex={original ? 0 : -1}
              aria-hidden={original ? undefined : true}
              className="rail-item group relative block w-[70vw] max-w-[560px] sm:w-[46vw] md:w-[36vw] lg:w-[30vw]"
            >
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  priority={index === items.length}
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 46vw, 70vw"
                  className="object-contain"
                  draggable={false}
                />
              </div>

              {/* Caption only reads once the card reaches the centre of the rail */}
              <div data-caption className="pointer-events-none mt-3 text-center">
                <p className="text-sm font-light tracking-[0.02em] md:text-base">{item.name}</p>
                <p className="mt-1 text-sm text-ink-40">
                  <span className="me-1">{t.common.from}</span>
                  {formatPrice(item.price, locale)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label={t.common.previous}
        className="absolute left-2 top-[38%] hidden h-11 w-11 place-items-center rounded-full border border-line bg-white/80 text-ink-60 backdrop-blur transition-colors hover:border-gold hover:text-gold md:grid"
      >
        <ChevronLeftIcon size={18} />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label={t.common.next}
        className="absolute right-2 top-[38%] hidden h-11 w-11 place-items-center rounded-full border border-line bg-white/80 text-ink-60 backdrop-blur transition-colors hover:border-gold hover:text-gold md:grid"
      >
        <ChevronRightIcon size={18} />
      </button>
    </div>
  );
}
