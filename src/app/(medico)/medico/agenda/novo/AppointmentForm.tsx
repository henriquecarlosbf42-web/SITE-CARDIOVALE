"use client";

import { useActionState } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import { createAppointment, type AppointmentFormState } from "../actions";

const initialState: AppointmentFormState = {};

interface Props {
  patientId: string;
  defaultDate: string;
}

export function AppointmentForm({ patientId, defaultDate }: Props) {
  const [state, formAction, pending] = useActionState(createAppointment, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="patient_id" value={patientId} />

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-ink-900">
          Tipo
        </label>
        <select
          id="type"
          name="type"
          defaultValue="CONSULTA"
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        >
          <option value="CONSULTA">Consulta</option>
          <option value="RETORNO">Retorno</option>
          <option value="EXAME">Exame</option>
        </select>
      </div>

      <DatePickerField name="date" timeName="time" label="Data e horário" defaultValue={defaultDate} withTime required />

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Agendando..." : "Agendar consulta"}
      </button>
    </form>
  );
}
