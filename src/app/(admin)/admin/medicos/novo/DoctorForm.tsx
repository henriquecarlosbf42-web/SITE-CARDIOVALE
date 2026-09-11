"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createDoctor, type DoctorFormState } from "../actions";

const initialState: DoctorFormState = {};

export function DoctorForm({ specialties }: { specialties: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createDoctor, initialState);

  if (state.success) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-ink-900">
          Médico criado! Repassa esses dados de acesso pra ele — não tem como mostrar essa senha de novo depois.
        </p>
        <div className="space-y-2 rounded-lg border border-ink-100 bg-surface-soft p-4 text-sm">
          <p className="text-ink-900">
            <span className="font-medium">E-mail:</span> {state.success.email}
          </p>
          <p className="text-ink-900">
            <span className="font-medium">Senha temporária:</span>{" "}
            <span className="font-mono">{state.success.tempPassword}</span>
          </p>
        </div>
        <Link
          href="/admin/medicos"
          className="block w-full rounded-full bg-brand-deep px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-brand"
        >
          Ver lista de médicos
        </Link>
      </div>
    );
  }

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
          placeholder="Dr. Fulano de Tal"
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink-900">
          E-mail de acesso
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
        <p className="mt-1 text-xs text-ink-600">
          A conta é criada com uma senha temporária, que aparece na próxima tela pra você repassar pro médico.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="crm" className="block text-sm font-medium text-ink-900">
            CRM
          </label>
          <input
            id="crm"
            name="crm"
            type="text"
            required
            placeholder="CRM 12.345 SP"
            className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="specialty_id" className="block text-sm font-medium text-ink-900">
            Especialidade
          </label>
          <select
            id="specialty_id"
            name="specialty_id"
            defaultValue=""
            className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
          >
            <option value="">Sem especialidade</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-ink-900">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Criando..." : "Criar médico"}
      </button>
    </form>
  );
}
