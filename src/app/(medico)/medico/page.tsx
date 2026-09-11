import Link from "next/link";
import { ArrowRight, CalendarClock, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getDoctorAppointments, getDoctorPatients, getDoctorRecord } from "@/lib/data/doctor-portal";
import { findNextByDate, firstName, formatDateTime } from "@/lib/format";

export default async function PortalMedicoPage() {
  const user = await getCurrentUser();
  const doctor = await getDoctorRecord();

  if (!doctor) {
    return (
      <div className="rounded-card border border-ink-100 bg-surface p-6 text-sm text-ink-600 shadow-soft">
        Seu cadastro de médico ainda não foi vinculado a essa conta. Fale com
        o administrativo da clínica.
      </div>
    );
  }

  const [appointments, patients] = await Promise.all([
    getDoctorAppointments(doctor.id),
    getDoctorPatients(doctor.id),
  ]);

  const nextAppointment = findNextByDate(appointments, (a) => a.scheduled_at);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-ink-900">Olá, {firstName(user!.fullName)}</h1>
        <p className="mt-1 text-sm text-ink-600">{doctor.crm}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-2 text-brand">
            <CalendarClock className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-sm font-semibold uppercase tracking-wide">Próximo atendimento</span>
          </div>
          {nextAppointment ? (
            <p className="mt-3 font-semibold text-ink-900">{formatDateTime(nextAppointment.scheduled_at)}</p>
          ) : (
            <p className="mt-3 text-sm text-ink-600">Nenhum atendimento agendado.</p>
          )}
          <Link
            href="/medico/agenda"
            className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
          >
            <ArrowRight className="size-4" strokeWidth={2} />
            Ver Agenda Completa
          </Link>
        </div>

        <div className="rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-2 text-brand">
            <Users className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-sm font-semibold uppercase tracking-wide">Pacientes</span>
          </div>
          <p className="mt-3 font-semibold text-ink-900">{patients.length} paciente(s) vinculado(s)</p>
          <Link
            href="/medico/pacientes"
            className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
          >
            <ArrowRight className="size-4" strokeWidth={2} />
            Ver Todos os Pacientes
          </Link>
        </div>
      </div>
    </div>
  );
}
