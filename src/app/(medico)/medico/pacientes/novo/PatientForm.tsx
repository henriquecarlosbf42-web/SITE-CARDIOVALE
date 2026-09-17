"use client";

import Link from "next/link";
import { useActionState } from "react";
import { MessageCircle } from "lucide-react";
import { DatePickerField } from "@/components/ui/date-picker";
import { clinic } from "@/lib/data/clinic";
import { firstName } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";
import { createPatientByDoctor, type CreatePatientFormState } from "../actions";

const initialState: CreatePatientFormState = {};

export function PatientForm() {
  const [state, formAction, pending] = useActionState(createPatientByDoctor, initialState);

  if (state.alreadyExists) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-ink-900">
          Esse CPF já tem cadastro: <span className="font-medium">{state.alreadyExists.fullName}</span>. Deseja
          acessar esse paciente?
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/medico/exames/novo?paciente=${state.alreadyExists.patientId}`}
            className="flex-1 rounded-full bg-brand-deep px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-brand"
          >
            Lançar resultado de exame
          </Link>
          <Link
            href={`/medico/pacientes/${state.alreadyExists.patientId}`}
            className="flex-1 rounded-full border border-ink-100 bg-white px-6 py-3 text-center text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft"
          >
            Ver ficha do paciente
          </Link>
        </div>
      </div>
    );
  }

  if (state.success) {
    const credentialsMessage = `Olá ${firstName(state.success.fullName)}, seu acesso ao portal da CardioVale foi criado.\n\nCPF (login): ${state.success.cpf}\nSenha: ${state.success.password}\n\nAcesse em: ${clinic.siteUrl}/login\n\nNo primeiro acesso você vai precisar criar uma senha só sua.`;
    const credentialsHref = state.success.phone ? whatsappHref(state.success.phone, credentialsMessage) : null;

    return (
      <div className="space-y-4">
        <p className="text-sm text-ink-900">
          Cadastro criado! Esses são os dados de acesso — a senha padrão é a data de nascimento (dia, mês e ano)
          seguida dos 2 últimos números do CPF, sempre dá pra reconstruir com a ficha do paciente. No primeiro
          acesso, o sistema vai pedir pra ele trocar por uma senha própria.
        </p>
        <div className="space-y-2 rounded-lg border border-ink-100 bg-surface-soft p-4 text-sm">
          <p className="text-ink-900">
            <span className="font-medium">CPF (login):</span> {state.success.cpf}
          </p>
          <p className="text-ink-900">
            <span className="font-medium">Senha:</span> <span className="font-mono">{state.success.password}</span>
          </p>
        </div>

        {credentialsHref ? (
          <a
            href={credentialsHref}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-100 bg-white px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft"
          >
            <MessageCircle className="size-4" strokeWidth={2} />
            Enviar dados de acesso no WhatsApp
          </a>
        ) : (
          <p className="text-center text-xs text-ink-600">
            Cadastre o telefone do paciente pra poder enviar os dados de acesso por WhatsApp.
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/medico/exames/novo?paciente=${state.success.patientId}`}
            className="flex-1 rounded-full bg-brand-deep px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-brand"
          >
            Lançar resultado de exame
          </Link>
          <Link
            href="/medico/pacientes"
            className="flex-1 rounded-full border border-ink-100 bg-white px-6 py-3 text-center text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft"
          >
            Ver pacientes
          </Link>
        </div>
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
        </div>
        <DatePickerField name="birth_date" label="Nascimento" required />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink-900">
          Telefone (WhatsApp)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(12) 90000-0000"
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
        <p className="mt-1.5 text-xs text-ink-600">
          Pra poder enviar os dados de acesso e avisos de exame pelo WhatsApp.
        </p>
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Cadastrando..." : "Cadastrar paciente"}
      </button>
    </form>
  );
}
