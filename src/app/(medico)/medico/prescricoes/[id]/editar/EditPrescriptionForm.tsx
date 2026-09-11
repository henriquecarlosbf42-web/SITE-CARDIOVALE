"use client";

import { useActionState } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import { updatePrescription, type PrescriptionFormState } from "../../actions";

const initialState: PrescriptionFormState = {};

interface Props {
  prescriptionId: string;
  patientId: string;
  initialValues: { description: string; issued_at: string };
}

export function EditPrescriptionForm({ prescriptionId, patientId, initialValues }: Props) {
  const updateWithIds = updatePrescription.bind(null, prescriptionId, patientId);
  const [state, formAction, pending] = useActionState(updateWithIds, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <DatePickerField name="issued_at" label="Data" defaultValue={initialValues.issued_at} required />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-ink-900">
          Prescrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          defaultValue={initialValues.description}
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
