"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { insurancePlans } from "@/lib/data/insurance-plans";

function PlanRow() {
  return (
    <div className="flex shrink-0 items-center gap-4 pr-4" aria-hidden>
      {insurancePlans.map((plan) => (
        <div
          key={plan.file}
          className="flex h-16 w-32 shrink-0 items-center justify-center rounded-card border border-ink-100 bg-white p-3 shadow-soft"
        >
          <Image
            src={`/images/convenios/${plan.file}`}
            alt=""
            width={1550}
            height={1020}
            className="h-full w-full object-contain"
          />
        </div>
      ))}
    </div>
  );
}

export function InsuranceMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let frame: number;
    const step = () => {
      if (!pausedRef.current && !draggingRef.current) {
        const half = track.scrollWidth / 2;
        track.scrollLeft += 0.6;
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half;
        }
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    draggingRef.current = true;
    startXRef.current = event.clientX;
    startScrollRef.current = track.scrollLeft;
    track.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = startScrollRef.current - (event.clientX - startXRef.current);
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  return (
    <section className="border-y border-ink-100 bg-surface py-8">
      <p className="mx-auto mb-5 max-w-6xl px-6 text-center text-xs font-semibold uppercase tracking-wide text-ink-600">
        Convênios atendidos
      </p>
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        className="flex cursor-grab overflow-x-auto scroll-smooth active:cursor-grabbing [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <PlanRow />
        <PlanRow />
      </div>
    </section>
  );
}
