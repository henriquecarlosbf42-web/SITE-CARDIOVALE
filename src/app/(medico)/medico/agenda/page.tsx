import type { Metadata } from "next";
import { getAppointmentStatuses } from "@/lib/data/patient-portal";
import { getDoctorAppointments, getDoctorPatients, getDoctorRecord } from "@/lib/data/doctor-portal";
import { AgendaList } from "./AgendaList";

export const metadata: Metadata = { title: "Agenda | Portal do médico" };

export default async function AgendaPage() {
  const doctor = await getDoctorRecord();
  if (!doctor) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const [appointments, patients, statuses] = await Promise.all([
    getDoctorAppointments(doctor.id),
    getDoctorPatients(doctor.id),
    getAppointmentStatuses(),
  ]);
  const patientNameById = new Map(patients.map((patient) => [patient.id, patient.full_name]));

  const rows = appointments.map((appointment) => ({
    id: appointment.id,
    scheduledAt: appointment.scheduled_at,
    type: appointment.type,
    patientId: appointment.patient_id,
    patientName: patientNameById.get(appointment.patient_id) ?? "Paciente",
    statusLabel: statuses.get(appointment.status_code)?.label ?? appointment.status_code,
  }));

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Agenda</h1>

      <div className="mt-6">
        <AgendaList appointments={rows} />
      </div>
    </div>
  );
}
