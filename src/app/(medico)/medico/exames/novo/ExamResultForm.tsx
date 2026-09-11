"use client";

import { useActionState } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import { createExamResult, type ExamResultFormState } from "../actions";
import { ExamFilesDropzone } from "./ExamFilesDropzone";

const initialState: ExamResultFormState = {};

interface Props {
  patients: { id: string; full_name: string }[];
  exams: { id: string; name: string }[];
  defaultPatientId?: string;
}

export function ExamResultForm({ patients, exams, defaultPatientId }: Props) {
  const [state, formAction, pending] = useActionState(createExamResult, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="patient_id" className="block text-sm font-medium text-ink-900">
          Paciente
        </label>
        <select
          id="patient_id"
          name="patient_id"
          required
          defaultValue={defaultPatientId ?? ""}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        >
          <option value="" disabled>
            Selecione...
          </option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="exam_id" className="block text-sm font-medium text-ink-900">
          Exame
        </label>
        <select
          id="exam_id"
          name="exam_id"
          required
          defaultValue=""
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        >
          <option value="" disabled>
            Selecione...
          </option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </select>
      </div>

      <DatePickerField name="exam_date" label="Data do exame" required />

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-ink-900">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-900">Anexar arquivo (PDF ou imagem)</label>
        <div className="mt-1.5">
          <ExamFilesDropzone name="files" />
        </div>
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
          {pending ? "Salvando..." : "Publicar resultado"}
        </button>
      </div>
    </form>
  );
}
