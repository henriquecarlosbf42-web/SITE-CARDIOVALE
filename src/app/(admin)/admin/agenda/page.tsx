import type { Metadata } from "next";
import { getAppointmentStatuses } from "@/lib/data/patient-portal";
import { getAllAppointmentsAdmin, getAllDoctors, getAllPatients } from "@/lib/data/admin";
import { AgendaAdminList } from "./AgendaAdminList";

export const metadata: Metadata = { title: "Agenda | Painel administrativo" };

export default async function AdminAgendaPage() {
  const [appointments, patients, doctors, statuses] = await Promise.all([
    getAllAppointmentsAdmin(),
    getAllPatients(),
    getAllDoctors(),
    getAppointmentStatuses(),
  ]);

  const patientNameById = new Map(patients.map((p) => [p.id, p.full_name]));
  const doctorNameById = new Map(doctors.map((d) => [d.id, d.fullName]));

  const rows = appointments.map((appointment) => ({
    id: appointment.id,
    scheduledAt: appointment.scheduled_at,
    type: appointment.type,
    patientName: patientNameById.get(appointment.patient_id) ?? "Paciente",
    doctorName: doctorNameById.get(appointment.doctor_id) ?? "Médico(a)",
    statusLabel: statuses.get(appointment.status_code)?.label ?? appointment.status_code,
    statusCode: appointment.status_code,
  }));

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Agenda</h1>
      <p className="mt-1 text-center text-sm text-ink-600">{appointments.length} consultas registradas</p>

      <div className="mt-6">
        <AgendaAdminList appointments={rows} />
      </div>
    </div>
  );
}
