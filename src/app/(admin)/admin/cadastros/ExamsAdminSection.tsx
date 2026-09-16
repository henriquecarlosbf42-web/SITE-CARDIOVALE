"use client";

import { useActionState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { createExam, toggleExamActive, type CatalogFormState } from "./actions";

interface ExamItem {
  id: string;
  name: string;
  active: boolean;
}

const initialState: CatalogFormState = {};

export function ExamsAdminSection({ items }: { items: ExamItem[] }) {
  const [state, formAction, pending] = useActionState(createExam, initialState);
  const [togglePending, startToggle] = useTransition();

  return (
    <section>
      <h2 className="text-lg font-semibold text-ink-900">Exames</h2>
      <p className="mt-1 text-xs text-ink-600">
        O que estiver ativo aqui aparece direto na página inicial do site.
      </p>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-ink-600">Nada cadastrado ainda.</p>
      ) : (
        <div className="mt-3 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 p-3">
              <span className={`text-sm ${item.active ? "text-ink-900" : "text-ink-300 line-through"}`}>
                {item.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={togglePending}
                  onClick={() => startToggle(() => toggleExamActive(item.id, !item.active))}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60 ${
                    item.active
                      ? "bg-ink-100 text-ink-600 hover:bg-ink-100/70"
                      : "bg-brand-light text-brand-deep hover:bg-brand-light/70"
                  }`}
                >
                  {item.active ? "Desativar" : "Reativar"}
                </button>
                <Link
                  href={`/admin/cadastros/exames/${item.id}/editar`}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-ink-100 text-ink-600 transition-colors hover:bg-surface-soft"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <form action={formAction} className="mt-4 space-y-2 rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
        <input
          name="name"
          type="text"
          placeholder="Nome do exame"
          required
          className="w-full rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand"
        />
        <input
          name="summary"
          type="text"
          placeholder="Resumo (1 linha, aparece no card)"
          className="w-full rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand"
        />
        <textarea
          name="description"
          rows={3}
          placeholder="Descrição completa"
          className="w-full rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1 rounded-lg bg-brand-deep px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          {pending ? "Salvando..." : "Adicionar exame"}
        </button>
      </form>
      {state.error && <p className="mt-1 text-xs text-brand-deep">{state.error}</p>}
    </section>
  );
}
