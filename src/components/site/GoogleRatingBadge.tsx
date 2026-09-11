import { Star } from "lucide-react";
import { googleRating } from "@/lib/data/reviews";

export function GoogleRatingBadge() {
  const fullStars = Math.floor(googleRating.score);
  const hasHalfStar = googleRating.score % 1 >= 0.25 && googleRating.score % 1 < 0.75;

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-semibold text-ink-900">
          {googleRating.score.toString().replace(".", ",")}
        </span>
        <div className="flex" aria-hidden>
          {Array.from({ length: 5 }).map((_, index) => {
            const filled = index < fullStars || (index === fullStars && hasHalfStar);
            return (
              <Star
                key={index}
                className={`h-5 w-5 ${filled ? "fill-brand text-brand" : "text-ink-300"}`}
                strokeWidth={1.5}
              />
            );
          })}
        </div>
        <span className="text-sm text-ink-600">({googleRating.count})</span>
      </div>
      <p className="text-xs text-ink-600">
        {googleRating.category} · avaliações no Google
      </p>
    </div>
  );
}
