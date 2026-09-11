import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllInsurancePlans, getPatientByIdAdmin } from "@/lib/data/admin";
import { EditPatientForm } from "./EditPatientForm";

export const metadata: Metadata = { title: "Editar paciente | Painel administrativo" };

export default async function EditarPacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [patient, insurancePlans] = await Promise.all([getPatientByIdAdmin(id), getAllInsurancePlans()]);
  if (!patient) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Editar paciente</h1>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <EditPatientForm
          patientId={patient.id}
          insurancePlans={insurancePlans}
          initialValues={{
            full_name: patient.full_name,
            cpf: patient.cpf,
            birth_date: patient.birth_date,
            phone: patient.phone,
            email: patient.email,
            insurance_plan_id: patient.insurance_plan_id,
            address: patient.address,
          }}
        />
      </div>
    </div>
  );
}
