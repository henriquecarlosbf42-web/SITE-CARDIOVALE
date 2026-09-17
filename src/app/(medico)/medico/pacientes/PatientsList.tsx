"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { formatCpf } from "@/lib/format";
import { linkPatientToDoctor } from "./actions";
import type { PatientSearchResult } from "@/lib/data/doctor-portal";

interface Patient {
  id: string;
  full_name: string;
}

interface Props {
  patients: Patient[];
  allPatients: PatientSearchResult[];
}

export function PatientsList({ patients, allPatients }: Props) {
  const [tab, setTab] = useState<"mine" | "search">("mine");
  const [query, setQuery] = useState("");
  const [linkedIds, setLinkedIds] = useState<Set<string>>(new Set());
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const normalized = query.trim().toLowerCase();

  const mineFiltered = normalized
    ? patients.filter((patient) => patient.full_name.toLowerCase().includes(normalized))
    : patients;

  const searchFiltered = normalized
    ? allPatients.filter(
        (patient) =>
          patient.full_name.toLowerCase().includes(normalized) || (patient.cpf ?? "").includes(normalized),
      )
    : allPatients;

  function handleLink(patient: PatientSearchResult) {
    if (!confirm("Deseja vincular esse paciente?")) return;
    setLinkError(null);
    setLinkingId(patient.id);
    startTransition(async () => {
      const result = await linkPatientToDoctor(patient.id);
      setLinkingId(null);
      if (result.error) {
        setLinkError(result.error);
        return;
      }
      setLinkedIds((prev) => new Set(prev).add(patient.id));
    });
  }

  return (
    <div>
      <div className="mx-auto max-w-md">
        <div className="flex gap-1 rounded-full border border-ink-100 bg-white p-1 text-sm shadow-soft">
          <button
            type="button"
            onClick={() => setTab("mine")}
            className={`flex-1 rounded-full py-1.5 font-medium transition-colors ${
              tab === "mine" ? "bg-brand-deep text-white" : "text-ink-600 hover:bg-surface-soft"
            }`}
          >
            Meus pacientes
          </button>
          <button
            type="button"
            onClick={() => setTab("search")}
            className={`flex-1 rounded-full py-1.5 font-medium transition-colors ${
              tab === "search" ? "bg-brand-deep text-white" : "text-ink-600 hover:bg-surface-soft"
            }`}
          >
            Buscar na clínica
          </button>
        </div>

        <div className="border-beam relative mt-3 rounded-full">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tab === "mine" ? "Busque pelo nome do paciente" : "Busque por nome ou CPF"}
            className="w-full rounded-full border border-ink-100 bg-white py-3 pl-11 pr-4 text-center text-sm text-ink-900 shadow-soft outline-none placeholder:text-ink-600 focus:border-brand"
          />
        </div>
      </div>

      {linkError && <p className="mt-3 text-center text-sm text-brand-deep">{linkError}</p>}

      {tab === "mine" ? (
        mineFiltered.length === 0 ? (
          <p className="mt-6 text-center text-sm text-ink-600">
            {patients.length === 0 ? "Nenhum paciente vinculado ainda." : "Nenhum paciente encontrado."}
          </p>
        ) : (
          <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
            {mineFiltered.map((patient) => (
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
        )
      ) : searchFiltered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-600">Nenhum paciente encontrado.</p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {searchFiltered.map((patient) => {
            const status = linkedIds.has(patient.id) ? "mine" : patient.status;
            return (
              <div key={patient.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <span className="font-medium text-ink-900">{patient.full_name}</span>
                  {patient.cpf && <p className="text-xs text-ink-600">{formatCpf(patient.cpf)}</p>}
                </div>

                {status === "mine" && (
                  <Link
                    href={`/medico/pacientes/${patient.id}`}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
                  >
                    <ArrowRight className="size-4" strokeWidth={2} />
                    Acessar Paciente
                  </Link>
                )}

                {status === "available" && (
                  <button
                    type="button"
                    disabled={pending && linkingId === patient.id}
                    onClick={() => handleLink(patient)}
                    className="rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
                  >
                    {pending && linkingId === patient.id ? "Vinculando..." : "Vincular"}
                  </button>
                )}

                {status === "taken" && (
                  <span className="text-sm text-ink-400">Vinculado a outro médico</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
