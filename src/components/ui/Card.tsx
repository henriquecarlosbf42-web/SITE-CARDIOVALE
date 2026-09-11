import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-ink-100 bg-surface p-6 shadow-soft ${className}`}
      {...props}
    />
  );
}
