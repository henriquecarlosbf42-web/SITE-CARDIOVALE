import type { Metadata } from "next";
import { getAllSpecialties } from "@/lib/data/admin";
import { DoctorForm } from "./DoctorForm";

export const metadata: Metadata = { title: "Novo médico | Painel administrativo" };

export default async function NovoMedicoPage() {
  const specialties = await getAllSpecialties();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Novo médico</h1>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <DoctorForm specialties={specialties} />
      </div>
    </div>
  );
}
