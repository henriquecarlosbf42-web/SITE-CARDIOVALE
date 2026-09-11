import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getDoctorDirectory, getExamResults, getExamsDirectory, getPatientRecord } from "@/lib/data/patient-portal";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Exames | Portal do paciente" };

export default async function ExamesPage() {
  const patient = await getPatientRecord();
  if (!patient) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const [results, exams, doctors] = await Promise.all([
    getExamResults(patient.id),
    getExamsDirectory(),
    getDoctorDirectory(),
  ]);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Exames</h1>
      <p className="mt-1 text-center text-sm text-ink-600">
        Só aparecem aqui os resultados já liberados pelo médico.
      </p>

      {results.length === 0 ? (
        <p className="mt-4 text-sm text-ink-600">Nenhum resultado disponível ainda.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {results.map((result) => (
            <div key={result.id} className="rounded-card border border-ink-100 bg-surface p-5 shadow-soft">
              <p className="font-semibold text-ink-900">{exams.get(result.exam_id) ?? "Exame"}</p>
              <p className="mt-1 text-sm text-ink-600">{formatDate(result.exam_date)}</p>
              {result.doctor_id && (
                <p className="mt-1 text-xs text-ink-600">
                  {doctors.get(result.doctor_id)?.fullName ?? "Médico(a)"}
                </p>
              )}
              {result.notes && <p className="mt-3 text-sm text-ink-600">{result.notes}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Link
          href="/agendar-exame"
          className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
        >
          <Plus className="size-4" strokeWidth={2} />
          Agendar Exame
        </Link>
      </div>
    </div>
  );
}
