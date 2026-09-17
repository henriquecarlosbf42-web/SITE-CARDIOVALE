import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getDoctorPatients, getDoctorRecord } from "@/lib/data/doctor-portal";
import { PatientsList } from "./PatientsList";

export const metadata: Metadata = { title: "Pacientes | Portal do médico" };

export default async function PacientesPage() {
  const doctor = await getDoctorRecord();
  if (!doctor) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const patients = await getDoctorPatients(doctor.id);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Pacientes</h1>
      <p className="mt-1 text-center text-sm text-ink-600">Só aparecem aqui pacientes com quem você já teve consulta.</p>

      <div className="mt-6">
        <PatientsList patients={patients.map((patient) => ({ id: patient.id, full_name: patient.full_name }))} />
      </div>

      <div className="mt-4 flex justify-center">
        <Link
          href="/medico/pacientes/novo"
          className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
        >
          <Plus className="size-4" strokeWidth={2} />
          Cadastrar Paciente
        </Link>
      </div>
    </div>
  );
}
