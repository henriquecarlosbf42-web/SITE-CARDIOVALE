import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppointmentById, getDoctorRecord, getPatientById } from "@/lib/data/doctor-portal";
import { toClinicDateAndTime } from "@/lib/format";
import { EditAppointmentForm } from "./EditAppointmentForm";

export const metadata: Metadata = { title: "Editar consulta | Portal do médico" };

export default async function EditarConsultaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const doctor = await getDoctorRecord();
  if (!doctor) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const appointment = await getAppointmentById(id);
  if (!appointment || appointment.doctor_id !== doctor.id) notFound();

  const patient = await getPatientById(appointment.patient_id);
  if (!patient) notFound();

  const { date, time } = toClinicDateAndTime(appointment.scheduled_at);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Editar consulta</h1>
      <p className="mt-1 text-center text-sm text-ink-600">{patient.full_name}</p>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <EditAppointmentForm
          appointmentId={appointment.id}
          patientId={patient.id}
          initialValues={{ type: appointment.type, date, time }}
        />
      </div>
    </div>
  );
}
