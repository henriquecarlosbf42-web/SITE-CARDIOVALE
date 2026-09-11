"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

interface Patient {
  id: string;
  full_name: string;
}

export function PatientsList({ patients }: { patients: Patient[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? patients.filter((patient) => patient.full_name.toLowerCase().includes(normalized))
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
            placeholder="Busque pelo nome do paciente"
            className="w-full rounded-full border border-ink-100 bg-white py-3 pl-11 pr-4 text-center text-sm text-ink-900 shadow-soft outline-none placeholder:text-ink-600 focus:border-brand"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-600">
          {patients.length === 0 ? "Nenhum paciente vinculado ainda." : "Nenhum paciente encontrado."}
        </p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {filtered.map((patient) => (
            <div key={patient.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <span className="font-medium text-ink-900">{patient.full_name}</span>
              <Link
                href={`/medico/pacientes/${patient.id}`}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
              >
                <ArrowRight className="size-4" strokeWidth={2} />
                Acessar Paciente
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
