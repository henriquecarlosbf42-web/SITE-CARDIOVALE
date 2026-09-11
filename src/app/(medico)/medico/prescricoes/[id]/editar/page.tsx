import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDoctorRecord, getPatientById, getPrescriptionById } from "@/lib/data/doctor-portal";
import { EditPrescriptionForm } from "./EditPrescriptionForm";

export const metadata: Metadata = { title: "Editar prescrição | Portal do médico" };

export default async function EditarPrescricaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const doctor = await getDoctorRecord();
  if (!doctor) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const prescription = await getPrescriptionById(id);
  if (!prescription || prescription.doctor_id !== doctor.id) notFound();

  const patient = await getPatientById(prescription.patient_id);
  if (!patient) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Editar prescrição</h1>
      <p className="mt-1 text-center text-sm text-ink-600">{patient.full_name}</p>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <EditPrescriptionForm
          prescriptionId={prescription.id}
          patientId={patient.id}
          initialValues={{
            description: prescription.description,
            issued_at: prescription.issued_at.slice(0, 10),
          }}
        />
      </div>
    </div>
  );
}
