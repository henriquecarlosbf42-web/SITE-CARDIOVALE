import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllPatients } from "@/lib/data/admin";
import { PatientsAdminList } from "./PatientsAdminList";

export const metadata: Metadata = { title: "Pacientes | Painel administrativo" };

export default async function AdminPacientesPage() {
  const patients = await getAllPatients();

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Pacientes</h1>
      <p className="mt-1 text-center text-sm text-ink-600">{patients.length} cadastrados</p>

      <div className="mt-6">
        <PatientsAdminList
          patients={patients.map((p) => ({
            id: p.id,
            full_name: p.full_name,
            cpf: p.cpf,
            phone: p.phone,
            active: p.active,
          }))}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <Link
          href="/admin/pacientes/novo"
          className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
        >
          <Plus className="size-4" strokeWidth={2} />
          Novo Paciente
        </Link>
      </div>
    </div>
  );
}
