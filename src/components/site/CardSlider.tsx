"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface CardSliderItem {
  key: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface CardSliderProps {
  items: CardSliderItem[];
}

export function CardSlider({ items }: CardSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // embla só existe depois de montar (via ref) — não dá pra derivar esse
    // estado inicial em render, precisa sincronizar aqui uma vez.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          aria-label="Item anterior"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="!px-3 !py-2 disabled:opacity-30"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          aria-label="Próximo item"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className="!px-3 !py-2 disabled:opacity-30"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {items.map((item) => (
            <div key={item.key} className="min-w-0 shrink-0 grow-0 basis-[70%] pl-4 sm:basis-[42%] lg:basis-1/4">
              <div className="flex h-full flex-col rounded-card border border-ink-100 bg-surface p-5 shadow-soft">
                <item.icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
                <h3 className="mt-3 text-sm font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.key}
            type="button"
            aria-label={`Ir pro item ${item.title}`}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              selected === index ? "bg-brand" : "bg-brand/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
