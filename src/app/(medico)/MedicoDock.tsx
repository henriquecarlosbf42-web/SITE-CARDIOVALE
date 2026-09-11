"use client";

import { CalendarClock, Home, Users } from "lucide-react";
import { Dock, type DockItemData } from "@/components/portal/Dock";

const items: DockItemData[] = [
  { href: "/medico", label: "Início", icon: Home, exact: true },
  { href: "/medico/agenda", label: "Agenda", icon: CalendarClock },
  { href: "/medico/pacientes", label: "Pacientes", icon: Users },
];

export function MedicoDock() {
  return <Dock items={items} />;
}
