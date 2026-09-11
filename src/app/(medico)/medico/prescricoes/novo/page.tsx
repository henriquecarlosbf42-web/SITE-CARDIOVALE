import type { Metadata } from "next";
import { getDoctorRecord, getPatientById } from "@/lib/data/doctor-portal";
import { PrescriptionForm } from "./PrescriptionForm";

export const metadata: Metadata = { title: "Nova prescrição | Portal do médico" };

export default async function NovaPrescricaoPage({
  searchParams,
}: {
  searchParams: Promise<{ paciente?: string }>;
}) {
  const { paciente } = await searchParams;
  const doctor = await getDoctorRecord();

  if (!doctor) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;
  if (!paciente) return <p className="text-sm text-ink-600">Paciente não informado.</p>;

  const patient = await getPatientById(paciente);
  if (!patient) return <p className="text-sm text-ink-600">Paciente não encontrado.</p>;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Nova prescrição</h1>
      <p className="mt-1 text-center text-sm text-ink-600">{patient.full_name}</p>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <PrescriptionForm patientId={patient.id} defaultIssuedAt={today} />
      </div>
    </div>
  );
}
