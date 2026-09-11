import Link from "next/link";
import { CalendarClock, FileHeart, Stethoscope, UserRound } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardCounts } from "@/lib/data/admin";
import { firstName } from "@/lib/format";

export default async function PainelAdminPage() {
  const [user, counts] = await Promise.all([getCurrentUser(), getDashboardCounts()]);

  const cards = [
    { label: "Pacientes cadastrados", value: counts.patients, icon: UserRound, href: "/admin/pacientes" },
    { label: "Médicos ativos", value: counts.doctors, icon: Stethoscope, href: "/admin/medicos" },
    { label: "Consultas hoje", value: counts.appointmentsToday, icon: CalendarClock, href: "/admin/agenda" },
    { label: "Resultados em rascunho", value: counts.examResultsDraft, icon: FileHeart, href: "/admin/agenda" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-card border border-ink-100 bg-surface p-6 text-center shadow-soft">
        <h1 className="text-2xl font-semibold text-ink-900">Olá, {user ? firstName(user.fullName) : ""}</h1>
        <p className="mt-1 text-sm text-ink-600">{user?.role}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-card border border-ink-100 bg-surface p-6 shadow-soft transition-colors hover:border-brand"
          >
            <div className="flex items-center gap-2 text-brand">
              <card.icon className="h-5 w-5" strokeWidth={1.75} />
              <span className="text-sm font-semibold uppercase tracking-wide">{card.label}</span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-ink-900">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
