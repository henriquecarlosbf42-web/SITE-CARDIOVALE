"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { GoogleIcon } from "@/components/site/GoogleIcon";
import type { Review } from "@/lib/data/reviews";

function ReviewCard({ review }: { review: Review }) {
  const initial = review.name.trim().charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-xs rounded-card border border-ink-100 bg-surface p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex" aria-hidden>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${index < review.rating ? "fill-brand text-brand" : "text-ink-300"}`}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <GoogleIcon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">&ldquo;{review.body}&rdquo;</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-semibold text-brand-deep">
          {initial}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink-900">{review.name}</p>
          <p className="text-xs text-ink-600">Avaliação no Google</p>
        </div>
      </div>
    </div>
  );
}

function ReviewsColumn({
  reviews,
  duration = 18,
  reverse = false,
  className = "",
}: {
  reviews: Review[];
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (reviews.length === 0) return null;

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ translateY: reverse ? "-50%" : "0%" }}
        animate={prefersReducedMotion ? undefined : { translateY: reverse ? "0%" : "-50%" }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-4"
      >
        {[0, 1].map((rep) =>
          reviews.map((review, index) => <ReviewCard key={`${rep}-${index}`} review={review} />),
        )}
      </motion.div>
    </div>
  );
}

function chunk<T>(items: T[], parts: number): T[][] {
  const size = Math.ceil(items.length / parts);
  return Array.from({ length: parts }, (_, index) => items.slice(index * size, index * size + size));
}

export function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  const [columnA, columnB, columnC] = chunk(reviews, 3);

  return (
    <div className="flex max-h-[34rem] justify-center gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <ReviewsColumn reviews={columnA} duration={40} className="flex-1" />
      <ReviewsColumn
        reviews={columnB}
        duration={46}
        reverse
        className="hidden flex-1 sm:block"
      />
      <ReviewsColumn reviews={columnC} duration={43} className="hidden flex-1 lg:block" />
    </div>
  );
}
