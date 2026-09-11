"use client";

import { useActionState, useTransition } from "react";
import { Plus } from "lucide-react";
import type { CatalogFormState } from "./actions";

interface CatalogItem {
  id: string;
  name: string;
  active: boolean;
}

interface Props {
  title: string;
  items: CatalogItem[];
  createAction: (prevState: CatalogFormState, formData: FormData) => Promise<CatalogFormState>;
  toggleAction: (id: string, active: boolean) => Promise<void>;
}

const initialState: CatalogFormState = {};

export function CatalogSection({ title, items, createAction, toggleAction }: Props) {
  const [state, formAction, pending] = useActionState(createAction, initialState);
  const [togglePending, startToggle] = useTransition();

  return (
    <section>
      <h2 className="text-lg font-semibold text-ink-900">{title}</h2>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-ink-600">Nada cadastrado ainda.</p>
      ) : (
        <div className="mt-3 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 p-3">
              <span className={`text-sm ${item.active ? "text-ink-900" : "text-ink-300 line-through"}`}>
                {item.name}
              </span>
              <button
                type="button"
                disabled={togglePending}
                onClick={() => startToggle(() => toggleAction(item.id, !item.active))}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60 ${
                  item.active
                    ? "bg-ink-100 text-ink-600 hover:bg-ink-100/70"
                    : "bg-brand-light text-brand-deep hover:bg-brand-light/70"
                }`}
              >
                {item.active ? "Desativar" : "Reativar"}
              </button>
            </div>
          ))}
        </div>
      )}

      <form action={formAction} className="mt-3 flex gap-2">
        <input
          name="name"
          type="text"
          placeholder="Nome"
          required
          className="min-w-0 flex-1 rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex shrink-0 items-center gap-1 rounded-lg bg-brand-deep px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Adicionar
        </button>
      </form>
      {state.error && <p className="mt-1 text-xs text-brand-deep">{state.error}</p>}
    </section>
  );
}
