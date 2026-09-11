import type { Metadata } from "next";
import { getDoctorDirectory, getPatientRecord, getPrescriptions } from "@/lib/data/patient-portal";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Prescrições | Portal do paciente" };

export default async function PrescricoesPage() {
  const patient = await getPatientRecord();
  if (!patient) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const [prescriptions, doctors] = await Promise.all([
    getPrescriptions(patient.id),
    getDoctorDirectory(),
  ]);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Prescrições</h1>

      {prescriptions.length === 0 ? (
        <p className="mt-4 text-sm text-ink-600">Nenhuma prescrição registrada ainda.</p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="p-5">
              <p className="text-sm text-ink-600">{formatDate(prescription.issued_at)}</p>
              <p className="mt-1 font-medium text-ink-900">{prescription.description}</p>
              <p className="mt-1 text-xs text-ink-600">
                {doctors.get(prescription.doctor_id)?.fullName ?? "Médico(a)"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
