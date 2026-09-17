import type { Metadata } from "next";
import Link from "next/link";
import { getDoctorPatients, getDoctorRecord, getPatientsForSearch } from "@/lib/data/doctor-portal";
import { createClient } from "@/lib/supabase/server";
import { ExamResultForm } from "./ExamResultForm";

export const metadata: Metadata = { title: "Novo resultado | Portal do médico" };

export default async function NovoResultadoPage({
  searchParams,
}: {
  searchParams: Promise<{ paciente?: string }>;
}) {
  const { paciente } = await searchParams;
  const doctor = await getDoctorRecord();

  if (!doctor) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const [patients, allPatients] = await Promise.all([
    getDoctorPatients(doctor.id),
    getPatientsForSearch(doctor.id),
  ]);

  const supabase = await createClient();
  const { data: exams } = await supabase.from("exams").select("id, name").order("name");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Novo resultado de exame</h1>
      <p className="mt-1 text-center text-sm text-ink-600">
        Salve como rascunho pra revisar depois, ou publique direto pra liberar pro paciente.
      </p>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <ExamResultForm
          patients={patients}
          allPatients={allPatients}
          exams={exams ?? []}
          defaultPatientId={paciente}
        />
      </div>

      <p className="mt-4 text-center text-sm text-ink-600">
        Paciente não está na lista?{" "}
        <Link href="/medico/pacientes/novo" className="font-medium text-brand-deep hover:underline">
          Cadastrar novo paciente
        </Link>
      </p>
    </div>
  );
}
