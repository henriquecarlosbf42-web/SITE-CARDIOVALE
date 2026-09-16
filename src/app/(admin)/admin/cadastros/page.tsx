import type { Metadata } from "next";
import { getAllExams, getAllInsurancePlans, getAllSpecialties } from "@/lib/data/admin";
import { CatalogSection } from "./CatalogSection";
import { ExamsAdminSection } from "./ExamsAdminSection";
import { createInsurancePlan, createSpecialty, toggleInsurancePlanActive, toggleSpecialtyActive } from "./actions";

export const metadata: Metadata = { title: "Cadastros | Painel administrativo" };

export default async function AdminCadastrosPage() {
  const [specialties, exams, insurancePlans] = await Promise.all([
    getAllSpecialties(),
    getAllExams(),
    getAllInsurancePlans(),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Cadastros</h1>

      <CatalogSection
        title="Especialidades"
        items={specialties}
        createAction={createSpecialty}
        toggleAction={toggleSpecialtyActive}
      />

      <ExamsAdminSection items={exams} />

      <CatalogSection
        title="Convênios"
        items={insurancePlans}
        createAction={createInsurancePlan}
        toggleAction={toggleInsurancePlanActive}
      />
    </div>
  );
}
