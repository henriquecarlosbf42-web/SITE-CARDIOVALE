import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDoctorRecord, getExamResultById, getPatientById } from "@/lib/data/doctor-portal";
import { createClient } from "@/lib/supabase/server";
import { EditExamResultForm } from "./EditExamResultForm";

export const metadata: Metadata = { title: "Editar resultado | Portal do médico" };

export default async function EditarResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const doctor = await getDoctorRecord();
  if (!doctor) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const examResult = await getExamResultById(id);
  if (!examResult || examResult.doctor_id !== doctor.id) notFound();

  const patient = await getPatientById(examResult.patient_id);
  if (!patient) notFound();

  const supabase = await createClient();
  const { data: exams } = await supabase.from("exams").select("id, name").order("name");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Editar resultado de exame</h1>
      <p className="mt-1 text-center text-sm text-ink-600">{patient.full_name}</p>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <EditExamResultForm
          examResultId={examResult.id}
          patientId={patient.id}
          exams={exams ?? []}
          initialValues={{
            exam_id: examResult.exam_id,
            exam_date: examResult.exam_date,
            notes: examResult.notes,
          }}
        />
      </div>
    </div>
  );
}
