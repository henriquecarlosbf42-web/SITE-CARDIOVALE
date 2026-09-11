import type { Metadata } from "next";
import { getInsurancePlanName, getPatientRecord } from "@/lib/data/patient-portal";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Meus dados | Portal do paciente" };

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-600">{label}</p>
      <p className="mt-1 text-sm text-ink-900">{value || "—"}</p>
    </div>
  );
}

export default async function DadosPage() {
  const patient = await getPatientRecord();
  if (!patient) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const insuranceName = await getInsurancePlanName(patient.insurance_plan_id);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Meus dados</h1>
      <p className="mt-1 text-center text-sm text-ink-600">
        Alguma informação errada? Fale com a recepção da clínica pra corrigir.
      </p>

      <div className="mt-6 grid gap-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft sm:grid-cols-2">
        <Field label="Nome completo" value={patient.full_name} />
        <Field label="CPF" value={patient.cpf} />
        <Field label="Data de nascimento" value={patient.birth_date ? formatDate(patient.birth_date) : null} />
        <Field label="Telefone" value={patient.phone} />
        <Field label="E-mail" value={patient.email} />
        <Field label="Convênio" value={insuranceName} />
        <Field label="Endereço" value={patient.address} />
      </div>
    </div>
  );
}
