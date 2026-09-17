"use client";

import { useActionState } from "react";
import { changePassword, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = {};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink-900">
          Nova senha
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

      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-ink-900">
          Confirmar nova senha
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
}
