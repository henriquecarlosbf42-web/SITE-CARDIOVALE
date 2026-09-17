"use client";

import Link from "next/link";
import { useActionState } from "react";
import { MessageCircle } from "lucide-react";
import { DatePickerField } from "@/components/ui/date-picker";
import { formatDate, firstName } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";
import { clinic } from "@/lib/data/clinic";
import type { PatientSearchResult } from "@/lib/data/doctor-portal";
import { createExamResult, type ExamResultFormState } from "../actions";
import { ExamFilesDropzone } from "./ExamFilesDropzone";
import { PatientPicker } from "./PatientPicker";

const initialState: ExamResultFormState = {};

interface Props {
  patients: { id: string; full_name: string }[];
  allPatients: PatientSearchResult[];
  exams: { id: string; name: string }[];
  defaultPatientId?: string;
}

export function ExamResultForm({ patients, allPatients, exams, defaultPatientId }: Props) {
  const [state, formAction, pending] = useActionState(createExamResult, initialState);

  if (state.success) {
    const { patientId, patientName, phone, examName, examDate } = state.success;
    const message = `Olá ${firstName(patientName)}, seu resultado de ${examName} (${formatDate(examDate)}) já está disponível no portal da CardioVale. Acesse: ${clinic.siteUrl}/login`;
    const href = phone ? whatsappHref(phone, message) : null;

    return (
      <div className="space-y-4">
        <p className="text-sm text-ink-900">
          Resultado publicado! O paciente já pode ver no portal dele.
        </p>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand"
          >
            <MessageCircle className="size-4" strokeWidth={2} />
            Avisar no WhatsApp
          </a>
        ) : (
          <p className="text-center text-xs text-ink-600">
            Esse paciente não tem telefone cadastrado — adiciona na ficha dele pra poder avisar por WhatsApp.
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/medico/pacientes/${patientId}`}
            className="flex-1 rounded-full border border-ink-100 bg-white px-6 py-3 text-center text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft"
          >
            Ver ficha do paciente
          </Link>
          <Link
            href={`/medico/exames/novo?paciente=${patientId}`}
            className="flex-1 rounded-full border border-ink-100 bg-white px-6 py-3 text-center text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft"
          >
            Lançar outro exame
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-ink-900">Paciente</label>
        <PatientPicker myPatients={patients} allPatients={allPatients} defaultPatientId={defaultPatientId} />
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
