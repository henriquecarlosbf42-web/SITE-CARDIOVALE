"use client";

import { useActionState } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import { updateAppointment, type AppointmentFormState } from "../../actions";

const initialState: AppointmentFormState = {};

interface Props {
  appointmentId: string;
  patientId: string;
  initialValues: { type: string; date: string; time: string };
}

export function EditAppointmentForm({ appointmentId, patientId, initialValues }: Props) {
  const updateWithIds = updateAppointment.bind(null, appointmentId, patientId);
  const [state, formAction, pending] = useActionState(updateWithIds, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-ink-900">
          Tipo
        </label>
        <select
          id="type"
          name="type"
          defaultValue={initialValues.type}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        >
          <option value="CONSULTA">Consulta</option>
          <option value="RETORNO">Retorno</option>
          <option value="EXAME">Exame</option>
        </select>
      </div>

      <DatePickerField
        name="date"
        timeName="time"
        label="Data e horário"
        defaultValue={initialValues.date}
        defaultTime={initialValues.time}
        withTime
        required
      />

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
