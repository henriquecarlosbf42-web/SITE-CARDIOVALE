"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Search } from "lucide-react";
import { togglePatientActive } from "./actions";

interface PatientRow {
  id: string;
  full_name: string;
  cpf: string | null;
  phone: string | null;
  active: boolean;
}

export function PatientsAdminList({ patients }: { patients: PatientRow[] }) {
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? patients.filter(
        (patient) =>
          patient.full_name.toLowerCase().includes(normalized) || (patient.cpf ?? "").includes(normalized),
      )
    : patients;

  return (
    <div>
      <div className="mx-auto max-w-md">
        <div className="border-beam relative rounded-full">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busque por nome ou CPF"
            className="w-full rounded-full border border-ink-100 bg-white py-3 pl-11 pr-4 text-center text-sm text-ink-900 shadow-soft outline-none placeholder:text-ink-600 focus:border-brand"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-600">
          {patients.length === 0 ? "Nenhum paciente cadastrado ainda." : "Nenhum paciente encontrado."}
        </p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {filtered.map((patient) => (
            <div key={patient.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className={`text-sm font-medium ${patient.active ? "text-ink-900" : "text-ink-300 line-through"}`}>
                  {patient.full_name}
                </p>
                <p className="mt-0.5 text-xs text-ink-600">
                  {patient.cpf || "CPF não informado"} {patient.phone && `· ${patient.phone}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => startTransition(() => togglePatientActive(patient.id, !patient.active))}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
                    patient.active
                      ? "bg-ink-100 text-ink-600 hover:bg-ink-100/70"
                      : "bg-brand-light text-brand-deep hover:bg-brand-light/70"
                  }`}
                >
                  {patient.active ? "Desativar" : "Reativar"}
                </button>
                <Link
                  href={`/admin/pacientes/${patient.id}/editar`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-100 text-ink-600 transition-colors hover:bg-surface-soft"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
