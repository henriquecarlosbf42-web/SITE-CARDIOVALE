"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import type { UserRole } from "@/types/database";
import { toggleUserActive, updateUserRole } from "./actions";

const ROLE_OPTIONS: UserRole[] = ["SUPER_ADMIN", "ADMIN", "RECEPCAO", "MEDICO", "PACIENTE"];

interface UserRow {
  id: string;
  full_name: string;
  role: UserRole;
  active: boolean;
}

export function UsersAdminList({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const normalized = query.trim().toLowerCase();
  const filtered = normalized ? users.filter((u) => u.full_name.toLowerCase().includes(normalized)) : users;

  return (
    <div>
      <div className="mx-auto max-w-md">
        <div className="border-beam relative rounded-full">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busque pelo nome"
            className="w-full rounded-full border border-ink-100 bg-white py-3 pl-11 pr-4 text-center text-sm text-ink-900 shadow-soft outline-none placeholder:text-ink-600 focus:border-brand"
          />
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-md text-center text-xs text-ink-600">
        Trocar o papel pra MEDICO não cria o cadastro de médico (CRM, especialidade) — use &ldquo;Novo Médico&rdquo;
        pra isso. Essa tela é só pra ajustar o acesso de contas já existentes.
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-600">Nenhum usuário encontrado.</p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {filtered.map((user) => (
            <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p className={`text-sm font-medium ${user.active ? "text-ink-900" : "text-ink-300 line-through"}`}>
                {user.full_name}
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={user.role}
                  disabled={pending || user.id === currentUserId}
                  onChange={(event) =>
                    startTransition(() => updateUserRole(user.id, event.target.value as UserRole))
                  }
                  className="rounded-lg border border-ink-100 px-2 py-1.5 text-xs text-ink-900 outline-none focus:border-brand disabled:opacity-60"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={pending || user.id === currentUserId}
                  onClick={() => startTransition(() => toggleUserActive(user.id, !user.active))}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
                    user.active
                      ? "bg-ink-100 text-ink-600 hover:bg-ink-100/70"
                      : "bg-brand-light text-brand-deep hover:bg-brand-light/70"
                  }`}
                >
                  {user.active ? "Desativar" : "Reativar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
