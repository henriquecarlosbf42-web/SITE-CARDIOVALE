"use client";

import { Building2, CreditCard, Home, MapPin, Stethoscope, HeartPulse } from "lucide-react";
import { Dock, type DockItemData } from "@/components/portal/Dock";

const items: DockItemData[] = [
  { href: "/", label: "Início", icon: Home, exact: true },
  { href: "/sobre", label: "A CardioVale", icon: HeartPulse },
  { href: "/medicos", label: "Médicos", icon: Stethoscope },
  { href: "/convenios", label: "Convênios", icon: CreditCard },
  { href: "/estrutura", label: "Estrutura", icon: Building2 },
  { href: "/localizacao", label: "Como chegar", icon: MapPin },
];

export function PublicDock() {
  return <Dock items={items} />;
}
