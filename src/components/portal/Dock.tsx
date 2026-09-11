"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface DockItemData {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function Dock({ items }: { items: readonly DockItemData[] }) {
  const mouseX = useMotionValue(Infinity);
  const pathname = usePathname();

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto flex h-16 items-end gap-3 rounded-2xl border border-ink-100 bg-surface/85 px-4 pb-3 shadow-soft backdrop-blur"
    >
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <DockItem key={item.href} mouseX={mouseX} label={item.label} active={active}>
            <Link
              href={item.href}
              aria-label={item.label}
              className="flex h-full w-full grow items-center justify-center"
            >
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          </DockItem>
        );
      })}
    </motion.div>
  );
}

function DockItem({
  mouseX,
  children,
  label,
  active,
}: {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
  label: string;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 64, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="group relative">
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
      <motion.div
        ref={ref}
        style={{ width }}
        className={`aspect-square w-10 rounded-full transition-colors ${
          active ? "bg-brand-deep text-white" : "bg-brand-light text-brand-deep"
        }`}
      >
        {children}
      </motion.div>
    </div>
  );
}
