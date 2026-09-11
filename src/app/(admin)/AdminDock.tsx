"use client";

import { CalendarClock, LayoutDashboard, Stethoscope, UserCog, UserRound, Wrench } from "lucide-react";
import { Dock, type DockItemData } from "@/components/portal/Dock";

const items: DockItemData[] = [
  { href: "/admin", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/admin/pacientes", label: "Pacientes", icon: UserRound },
  { href: "/admin/medicos", label: "Médicos", icon: Stethoscope },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarClock },
  { href: "/admin/cadastros", label: "Cadastros", icon: Wrench },
  { href: "/admin/usuarios", label: "Usuários", icon: UserCog },
];

export function AdminDock() {
  return <Dock items={items} />;
}
