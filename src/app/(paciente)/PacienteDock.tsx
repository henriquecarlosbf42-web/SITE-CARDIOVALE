"use client";

import { Activity, CalendarClock, ClipboardList, FileText, Home, UserRound } from "lucide-react";
import { Dock, type DockItemData } from "@/components/portal/Dock";

const items: DockItemData[] = [
  { href: "/portal", label: "Início", icon: Home, exact: true },
  { href: "/portal/consultas", label: "Consultas", icon: CalendarClock },
  { href: "/portal/exames", label: "Exames", icon: Activity },
  { href: "/portal/documentos", label: "Documentos", icon: FileText },
  { href: "/portal/prescricoes", label: "Prescrições", icon: ClipboardList },
  { href: "/portal/dados", label: "Meus dados", icon: UserRound },
];

export function PacienteDock() {
  return <Dock items={items} />;
}
