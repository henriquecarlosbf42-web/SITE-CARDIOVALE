import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-deep text-white hover:bg-brand shadow-soft",
  secondary:
    "bg-brand-light text-brand-deep hover:bg-brand-light/70",
  ghost:
    "bg-transparent text-brand-deep hover:bg-brand-light",
  outline:
    "border-2 border-brand-deep bg-white text-brand-deep shadow-soft hover:bg-brand-deep hover:text-white",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
