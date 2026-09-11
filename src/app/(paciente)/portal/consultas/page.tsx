import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAppointments, getAppointmentStatuses, getDoctorDirectory, getPatientRecord } from "@/lib/data/patient-portal";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Consultas | Portal do paciente" };

export default async function ConsultasPage({
  searchParams,
}: {
  searchParams: Promise<{ agendado?: string }>;
}) {
  const { agendado } = await searchParams;
  const patient = await getPatientRecord();
  if (!patient) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const [appointments, doctors, statuses] = await Promise.all([
    getAppointments(patient.id),
    getDoctorDirectory(),
    getAppointmentStatuses(),
  ]);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Consultas</h1>

      {agendado && (
        <p className="mt-4 rounded-lg bg-brand-light px-4 py-3 text-center text-sm font-medium text-brand-deep">
          Agendamento confirmado com sucesso!
        </p>
      )}

      {appointments.length === 0 ? (
        <p className="mt-4 text-sm text-ink-600">Nenhuma consulta registrada ainda.</p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex flex-wrap items-center justify-between gap-2 p-5">
              <div>
                <p className="font-semibold text-ink-900">{formatDateTime(appointment.scheduled_at)}</p>
                <p className="mt-1 text-sm text-ink-600">
                  {doctors.get(appointment.doctor_id)?.fullName ?? "Médico(a)"} · {appointment.type}
                </p>
              </div>
              <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-deep">
                {statuses.get(appointment.status_code)?.label ?? appointment.status_code}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Link
          href="/agendar-consulta"
          className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
        >
          <Plus className="size-4" strokeWidth={2} />
          Agendar Consulta
        </Link>
      </div>
    </div>
  );
}
