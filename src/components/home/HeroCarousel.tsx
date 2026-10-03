"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { formatPrice } from "@/lib/money";

export type HeroItem = {
  slug: string;
  name: string;
  tagline: string;
  collection: string;
  image: string;
  price: number;
  swatches: Array<{ key: string; swatch: string }>;
};

/** Radians per second. One full orbit takes about eighteen seconds. */
const SPEED = (Math.PI * 2) / 18;
/** How far a drag has to travel to spin the ring once, in pixels. */
const DRAG_PER_TURN = 900;

type Placed = { index: number; depth: number };

export function HeroCarousel({ items }: { items: HeroItem[] }) {
  const { locale, t } = useI18n();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const angleRef = useRef(0);
  const pausedRef = useRef(false);
  const [front, setFront] = useState(0);

  /**
   * Lays the units out on an ellipse seen from slightly above: the one nearest
   * the camera is biggest, brightest and on top, the far side shrinks back and
   * blurs out. Everything is written straight onto the nodes each frame — going
   * through React state here would drop frames on a phone.
   */
  const place = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || items.length === 0) return;

    const { width } = stage.getBoundingClientRect();
    if (width === 0) return;

    const radiusX = width * 0.3;
    const radiusY = width * 0.035;
    const step = (Math.PI * 2) / items.length;
    const placed: Placed[] = [];

    for (let i = 0; i < items.length; i++) {
      const node = cardRefs.current[i];
      if (!node) continue;

      const a = angleRef.current + i * step;
      const x = Math.sin(a) * radiusX;
      // cos(a) is 1 at the front of the orbit and -1 at the back.
      const depth = (Math.cos(a) + 1) / 2;
      const y = -Math.cos(a) * radiusY;

      const scale = 0.46 + depth * 0.74;
      node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      node.style.opacity = (0.2 + depth * 0.8).toFixed(3);
      node.style.filter = depth > 0.82 ? "none" : `blur(${((1 - depth) * 3.4).toFixed(2)}px)`;
      node.style.zIndex = String(Math.round(depth * 100));
      node.style.pointerEvents = depth > 0.6 ? "auto" : "none";

      placed.push({ index: i, depth });
    }

    const nearest = placed.reduce((best, cur) => (cur.depth > best.depth ? cur : best), placed[0]);
    if (nearest) setFront((current) => (current === nearest.index ? current : nearest.index));
  }, [items.length]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!pausedRef.current) angleRef.current += SPEED * delta;
      place();
      frame = requestAnimationFrame(tick);
    };

    place();
    if (!reduced) frame = requestAnimationFrame(tick);

    const onResize = () => place();
    window.addEventListener("resize", onResize);

    // Drag anywhere on the stage to spin the orbit by hand.
    let dragging = false;
    let startX = 0;
    let startAngle = 0;

    const down = (event: PointerEvent) => {
      dragging = true;
      pausedRef.current = true;
      startX = event.clientX;
      startAngle = angleRef.current;
      stage.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      angleRef.current = startAngle + ((event.clientX - startX) / DRAG_PER_TURN) * Math.PI * 2;
      place();
    };
    const up = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      pausedRef.current = false;
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    };

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
    };
  }, [place]);

  /** Brings a unit to the front of the orbit by the shortest way round. */
  const bringForward = useCallback(
    (index: number) => {
      const step = (Math.PI * 2) / items.length;
      const target = -index * step;
      const turns = Math.round((angleRef.current - target) / (Math.PI * 2));
      angleRef.current = target + turns * Math.PI * 2;
      place();
    },
    [items.length, place],
  );

  function nudge(direction: -1 | 1) {
    bringForward((front + direction + items.length) % items.length);
  }

  const focused = items[front];

  return (
    <div className="relative select-none">
      <div
        ref={stageRef}
        /* The far side of the orbit swings past the viewport on a narrow phone;
           those cards are blurred and faded anyway, so clip rather than shrink
           the ring and lose the depth. */
        className="relative mx-auto h-[300px] w-full cursor-grab overflow-hidden touch-pan-y active:cursor-grabbing sm:h-[360px] lg:h-[440px]"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        role="region"
        aria-label={t.home.exploreTitle}
      >
        {items.map((item, index) => (
          <Link
            key={item.slug}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            href={`/${locale}/units/${item.slug}`}
            onFocus={() => bringForward(index)}
            onMouseEnter={() => bringForward(index)}
            aria-label={item.name}
            className="absolute start-1/2 top-1/2 -ms-[32vw] -mt-[14vw] block w-[64vw] max-w-[520px] transition-[filter] duration-300 will-change-transform sm:-ms-[23vw] sm:-mt-[10vw] sm:w-[46vw] lg:-ms-[16vw] lg:-mt-[7vw] lg:w-[32vw]"
            style={{ transform: "translate3d(0,0,0) scale(0.5)", opacity: 0 }}
            draggable={false}
          >
            <div className="relative aspect-4/3 w-full">
              <Image
                src={item.image}
                alt=""
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 64vw"
                className="object-contain drop-shadow-[0_26px_42px_rgba(26,26,26,0.14)]"
                draggable={false}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* The unit at the front of the orbit names itself */}
      {focused && (
        <div className="relative z-[120] mx-auto -mt-2 max-w-[42ch] px-5 text-center">
          <div key={focused.slug} style={{ animation: "glara-fade-up 0.55s var(--ease-luxe) both" }}>
            <p className="eyebrow text-gold">{focused.collection}</p>
            <h2 className="mt-2 text-lg font-light tracking-[0.02em] md:text-2xl">{focused.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-60 md:text-base">{focused.tagline}</p>

            <div className="mt-3 flex items-center justify-center gap-4">
              <p className="text-sm text-ink-40">
                <span className="me-1">{t.common.from}</span>
                <span className="text-ink">{formatPrice(focused.price, locale)}</span>
              </p>
              {focused.swatches.length > 0 && (
                <span className="flex gap-1.5" aria-hidden="true">
                  {focused.swatches.slice(0, 4).map((finish) => (
                    <span
                      key={finish.key}
                      className="h-3 w-3 rounded-full border border-line"
                      style={{ backgroundColor: finish.swatch }}
                    />
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label={t.common.previous}
        className="absolute left-2 top-[38%] z-[130] hidden h-11 w-11 place-items-center rounded-full border border-line bg-white/80 text-ink-60 backdrop-blur transition-colors hover:border-gold hover:text-gold md:grid"
      >
        <ChevronLeftIcon size={18} />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label={t.common.next}
        className="absolute right-2 top-[38%] z-[130] hidden h-11 w-11 place-items-center rounded-full border border-line bg-white/80 text-ink-60 backdrop-blur transition-colors hover:border-gold hover:text-gold md:grid"
      >
        <ChevronRightIcon size={18} />
      </button>
    </div>
  );
}
