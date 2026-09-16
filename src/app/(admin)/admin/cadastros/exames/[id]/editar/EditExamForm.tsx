"use client";

import { useActionState } from "react";
import { updateExam, type CatalogFormState } from "../../../actions";

const initialState: CatalogFormState = {};

interface Props {
  examId: string;
  initialValues: { name: string; summary: string | null; description: string | null };
}

export function EditExamForm({ examId, initialValues }: Props) {
  const updateWithId = updateExam.bind(null, examId);
  const [state, formAction, pending] = useActionState(updateWithId, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink-900">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={initialValues.name}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-ink-900">
          Resumo
        </label>
        <input
          id="summary"
          name="summary"
          type="text"
          defaultValue={initialValues.summary ?? ""}
          placeholder="1 linha, aparece no card da página inicial"
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-ink-900">
          Descrição completa
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={initialValues.description ?? ""}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
