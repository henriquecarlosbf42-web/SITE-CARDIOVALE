import type { Metadata } from "next";
import { getAllInsurancePlans } from "@/lib/data/admin";
import { PatientForm } from "./PatientForm";

export const metadata: Metadata = { title: "Novo paciente | Painel administrativo" };

export default async function NovoPacientePage() {
  const insurancePlans = await getAllInsurancePlans();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Novo paciente</h1>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <PatientForm insurancePlans={insurancePlans} />
      </div>
    </div>
  );
}
