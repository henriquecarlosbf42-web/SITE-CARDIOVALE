import type { CardSliderItem } from "@/components/site/CardSlider";

interface CardGridProps {
  items: CardSliderItem[];
}

export function CardGrid({ items }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.key} className="flex h-full flex-col rounded-card border border-ink-100 bg-surface p-5 shadow-soft">
          <item.icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
          <h3 className="mt-3 text-sm font-semibold text-ink-900">{item.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-ink-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
