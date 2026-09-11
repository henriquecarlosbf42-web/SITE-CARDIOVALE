"use client";

import { useActionState } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import { updatePatient, type PatientFormState } from "../../actions";

const initialState: PatientFormState = {};

interface Props {
  patientId: string;
  insurancePlans: { id: string; name: string }[];
  initialValues: {
    full_name: string;
    cpf: string | null;
    birth_date: string | null;
    phone: string | null;
    email: string | null;
    insurance_plan_id: string | null;
    address: string | null;
  };
}

export function EditPatientForm({ patientId, insurancePlans, initialValues }: Props) {
  const updateWithId = updatePatient.bind(null, patientId);
  const [state, formAction, pending] = useActionState(updateWithId, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-ink-900">
          Nome completo
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          defaultValue={initialValues.full_name}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-ink-900">
            CPF
          </label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            inputMode="numeric"
            defaultValue={initialValues.cpf ?? ""}
            className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
          />
        </div>
        <DatePickerField name="birth_date" label="Nascimento" defaultValue={initialValues.birth_date} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink-900">
            Telefone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={initialValues.phone ?? ""}
            className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-900">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={initialValues.email ?? ""}
            className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
          />
        </div>
      </div>

      <div>
        <label htmlFor="insurance_plan_id" className="block text-sm font-medium text-ink-900">
          Convênio
        </label>
        <select
          id="insurance_plan_id"
          name="insurance_plan_id"
          defaultValue={initialValues.insurance_plan_id ?? ""}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        >
          <option value="">Particular</option>
          {insurancePlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-ink-900">
          Endereço
        </label>
        <input
          id="address"
          name="address"
          type="text"
          defaultValue={initialValues.address ?? ""}
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
