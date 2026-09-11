"use client";

import { useActionState } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import { createPatient, type PatientFormState } from "../actions";

const initialState: PatientFormState = {};

export function PatientForm({ insurancePlans }: { insurancePlans: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createPatient, initialState);

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
            placeholder="000.000.000-00"
            className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
          />
        </div>
        <DatePickerField name="birth_date" label="Nascimento" />
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
          defaultValue=""
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
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar paciente"}
      </button>
    </form>
  );
}
