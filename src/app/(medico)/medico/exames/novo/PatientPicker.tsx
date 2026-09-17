"use client";

import { useMemo, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { formatCpf } from "@/lib/format";
import { linkPatientToDoctor } from "../../pacientes/actions";
import type { PatientSearchResult } from "@/lib/data/doctor-portal";

interface Props {
  myPatients: { id: string; full_name: string }[];
  allPatients: PatientSearchResult[];
  defaultPatientId?: string;
}

export function PatientPicker({ myPatients, allPatients, defaultPatientId }: Props) {
  const [tab, setTab] = useState<"mine" | "search">("mine");
  const [selectedId, setSelectedId] = useState(defaultPatientId ?? "");
  const [query, setQuery] = useState("");
  const [linkedIds, setLinkedIds] = useState<Set<string>>(new Set());
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const mineList = useMemo(() => {
    const extra = allPatients.filter(
      (patient) => linkedIds.has(patient.id) && !myPatients.some((mine) => mine.id === patient.id),
    );
    return [...myPatients, ...extra];
  }, [myPatients, allPatients, linkedIds]);

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
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
      setSelectedId(patient.id);
      setTab("mine");
    });
  }

  return (
    <div>
      <div className="flex gap-1 rounded-full border border-ink-100 bg-white p-1 text-sm">
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
          Buscar paciente
        </button>
      </div>

      <input type="hidden" name="patient_id" value={selectedId} required />

      {tab === "mine" ? (
        <select
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          className="mt-3 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        >
          <option value="" disabled>
            Selecione...
          </option>
          {mineList.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.full_name}
            </option>
          ))}
        </select>
      ) : (
        <div className="mt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busque por nome ou CPF"
              className="w-full rounded-full border border-ink-100 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 outline-none focus:border-brand"
            />
          </div>

          <div className="mt-3 max-h-64 divide-y divide-ink-100 overflow-y-auto rounded-lg border border-ink-100">
            {filtered.length === 0 ? (
              <p className="p-4 text-center text-sm text-ink-600">Nenhum paciente encontrado.</p>
            ) : (
              filtered.map((patient) => {
                const status = linkedIds.has(patient.id) ? "mine" : patient.status;
                return (
                  <div key={patient.id} className="flex items-center justify-between gap-3 p-3">
                    <div>
                      <p className="text-sm font-medium text-ink-900">{patient.full_name}</p>
                      {patient.cpf && <p className="text-xs text-ink-600">{formatCpf(patient.cpf)}</p>}
                    </div>

                    {status === "mine" && (
                      <button
                        type="button"
                        onClick={() => setSelectedId(patient.id)}
                        className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                          selectedId === patient.id
                            ? "bg-brand-deep text-white"
                            : "border border-ink-100 text-ink-900 hover:bg-surface-soft"
                        }`}
                      >
                        {selectedId === patient.id ? "Selecionado" : "Selecionar"}
                      </button>
                    )}

                    {status === "available" && (
                      <button
                        type="button"
                        disabled={pending && linkingId === patient.id}
                        onClick={() => handleLink(patient)}
                        className="shrink-0 rounded-full bg-brand-deep px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
                      >
                        {pending && linkingId === patient.id ? "Vinculando..." : "Vincular"}
                      </button>
                    )}

                    {status === "taken" && (
                      <span className="shrink-0 text-xs text-ink-400">Vinculado a outro médico</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {linkError && <p className="mt-2 text-sm text-brand-deep">{linkError}</p>}
    </div>
  );
}
