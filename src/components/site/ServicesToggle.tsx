"use client";

import { useState } from "react";
import { Activity, Stethoscope } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { CardSliderItem } from "@/components/site/CardSlider";
import { CardGrid } from "@/components/site/CardGrid";
import { exams } from "@/lib/data/exams";
import { specialties } from "@/lib/data/specialties";

const examItems: CardSliderItem[] = exams.map((exam) => ({
  key: exam.slug,
  icon: Activity,
  title: exam.name,
  description: exam.description,
}));

const consultationItems: CardSliderItem[] = specialties.map((specialty) => ({
  key: specialty.name,
  icon: Stethoscope,
  title: specialty.name,
  description: specialty.description,
}));

const options = [
  { id: "exames", label: "Exames cardiológicos", icon: Activity, items: examItems },
  { id: "consultas", label: "Consulta com cardiologista", icon: Stethoscope, items: consultationItems },
] as const;

export function ServicesToggle() {
  const [active, setActive] = useState<(typeof options)[number]["id"]>("exames");
  const current = options.find((option) => option.id === active)!;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {options.map((option) => {
          const isActive = option.id === active;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActive(option.id)}
              aria-pressed={isActive}
              className={`group flex items-center gap-3 rounded-full border px-5 py-3 transition-all duration-300 sm:px-6 sm:py-3.5 ${
                isActive
                  ? "border-transparent bg-gradient-to-r from-brand to-brand-deep text-white shadow-soft"
                  : "border-ink-100 bg-white text-ink-900 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-soft"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-white/20" : "bg-brand-light text-brand-deep"
                }`}
              >
                <option.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-semibold sm:text-base">{option.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="mt-10"
        >
          <CardGrid items={current.items} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
