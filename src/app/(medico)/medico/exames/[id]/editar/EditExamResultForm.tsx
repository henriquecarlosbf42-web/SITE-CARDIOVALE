"use client";

import { useActionState } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import { updateExamResult, type ExamResultFormState } from "../../actions";

const initialState: ExamResultFormState = {};

interface Props {
  examResultId: string;
  patientId: string;
  exams: { id: string; name: string }[];
  initialValues: { exam_id: string; exam_date: string; notes: string | null };
}

export function EditExamResultForm({ examResultId, patientId, exams, initialValues }: Props) {
  const updateWithIds = updateExamResult.bind(null, examResultId, patientId);
  const [state, formAction, pending] = useActionState(updateWithIds, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="exam_id" className="block text-sm font-medium text-ink-900">
          Exame
        </label>
        <select
          id="exam_id"
          name="exam_id"
          required
          defaultValue={initialValues.exam_id}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        >
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </select>
      </div>

      <DatePickerField name="exam_date" label="Data do exame" defaultValue={initialValues.exam_date} required />

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-ink-900">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={initialValues.notes ?? ""}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={pending}
          className="rounded-full border border-ink-100 bg-white px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft disabled:opacity-60"
        >
          Salvar como rascunho
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending}
          className="rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar e publicar"}
        </button>
      </div>
    </form>
  );
}
