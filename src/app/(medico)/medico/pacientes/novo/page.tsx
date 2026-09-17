import type { Metadata } from "next";
import { PatientForm } from "./PatientForm";

export const metadata: Metadata = { title: "Novo paciente | Portal do médico" };

export default function NovoPacientePage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Cadastrar paciente</h1>
      <p className="mt-1 text-center text-sm text-ink-600">
        Pra quando o paciente ainda não tem acesso ao portal e você precisa lançar um resultado pra ele.
      </p>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <PatientForm />
      </div>
    </div>
  );
}
