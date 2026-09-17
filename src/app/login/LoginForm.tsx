"use client";

import { useActionState, useState } from "react";
import { signIn, type SignInState } from "./actions";

const initialState: SignInState = {};

function formatCpf(digits: string) {
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean);
  let formatted = parts.join(".");
  if (digits.length > 9) formatted += `-${digits.slice(9, 11)}`;
  return formatted;
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  // digita número, formata como CPF; assim que aparece letra/@ ou passa
  // de 11 dígitos, vira e-mail puro (médico/administrativo usam e-mail).
  const [identifier, setIdentifier] = useState("");
  const [isEmailMode, setIsEmailMode] = useState(false);

  function handleIdentifierChange(raw: string) {
    if (raw.length === 0) {
      setIsEmailMode(false);
      setIdentifier("");
      return;
    }

    const digitsOnly = raw.replace(/\D/g, "");
    const hasLetterOrAt = /[a-zA-Z@]/.test(raw);

    if (isEmailMode || hasLetterOrAt || digitsOnly.length > 11) {
      setIsEmailMode(true);
      setIdentifier(raw);
      return;
    }

    setIdentifier(formatCpf(digitsOnly));
  }

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-ink-900">
          CPF
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder={isEmailMode ? "seu@email.com" : "000.000.000-00"}
          value={identifier}
          onChange={(event) => handleIdentifierChange(event.target.value)}
          required
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
        <p className="mt-1.5 text-xs text-ink-600">Médico ou administrativo? Entra com o e-mail cadastrado.</p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink-900">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
