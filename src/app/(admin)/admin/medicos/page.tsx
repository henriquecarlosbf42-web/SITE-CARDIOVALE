import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllDoctors, getAllSpecialties } from "@/lib/data/admin";
import { DoctorsAdminList } from "./DoctorsAdminList";

export const metadata: Metadata = { title: "Médicos | Painel administrativo" };

export default async function AdminMedicosPage() {
  const [doctors, specialties] = await Promise.all([getAllDoctors(), getAllSpecialties()]);
  const specialtyNameById = new Map(specialties.map((s) => [s.id, s.name]));

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Médicos</h1>
      <p className="mt-1 text-center text-sm text-ink-600">{doctors.length} cadastrados</p>

      <DoctorsAdminList
        doctors={doctors.map((d) => ({
          id: d.id,
          fullName: d.fullName,
          crm: d.crm,
          specialtyName: d.specialty_id ? specialtyNameById.get(d.specialty_id) ?? null : null,
          active: d.active,
        }))}
      />

      <div className="mt-4 flex justify-center">
        <Link
          href="/admin/medicos/novo"
          className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
        >
          <Plus className="size-4" strokeWidth={2} />
          Novo Médico
        </Link>
      </div>
    </div>
  );
}
