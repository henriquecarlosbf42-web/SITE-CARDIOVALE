import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamByIdAdmin } from "@/lib/data/admin";
import { EditExamForm } from "./EditExamForm";

export const metadata: Metadata = { title: "Editar exame | Painel administrativo" };

export default async function EditarExamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const exam = await getExamByIdAdmin(id);
  if (!exam) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Editar exame</h1>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <EditExamForm
          examId={exam.id}
          initialValues={{ name: exam.name, summary: exam.summary, description: exam.description }}
        />
      </div>
    </div>
  );
}
