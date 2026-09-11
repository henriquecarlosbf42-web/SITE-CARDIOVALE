"use client";

import { useActionState } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import { createPrescription, type PrescriptionFormState } from "../actions";

const initialState: PrescriptionFormState = {};

interface Props {
  patientId: string;
  defaultIssuedAt: string;
}

export function PrescriptionForm({ patientId, defaultIssuedAt }: Props) {
  const [state, formAction, pending] = useActionState(createPrescription, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="patient_id" value={patientId} />

      <DatePickerField name="issued_at" label="Data" defaultValue={defaultIssuedAt} required />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-ink-900">
          Prescrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          placeholder="Medicamento, dosagem, orientações..."
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar prescrição"}
      </button>
    </form>
  );
}
