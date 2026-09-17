"use client";

import { useActionState } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import { signUp, type SignUpState } from "./actions";

const initialState: SignUpState = {};

export function CadastroForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  if (state.message) {
    return <p className="text-sm text-ink-900">{state.message}</p>;
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-ink-900">
          Nome completo
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
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
          autoComplete="email"
          required
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink-900">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
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
            required
            className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
          />
          <p className="mt-1.5 text-xs text-ink-600">Você vai usar o CPF pra entrar depois.</p>
        </div>

        <DatePickerField name="birth_date" label="Nascimento" required />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink-900">
          Telefone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(12) 90000-0000"
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
