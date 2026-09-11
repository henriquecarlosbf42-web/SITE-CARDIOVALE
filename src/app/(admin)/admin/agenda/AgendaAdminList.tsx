"use client";

import { useState, useTransition } from "react";
import { Search, Trash2, X } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { cancelAppointmentAdmin, deleteAppointmentAdmin } from "./actions";

interface AppointmentRow {
  id: string;
  scheduledAt: string;
  type: string;
  patientName: string;
  doctorName: string;
  statusLabel: string;
  statusCode: string;
}

export function AgendaAdminList({ appointments }: { appointments: AppointmentRow[] }) {
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? appointments.filter(
        (a) =>
          a.patientName.toLowerCase().includes(normalized) || a.doctorName.toLowerCase().includes(normalized),
      )
    : appointments;

  return (
    <div>
      <div className="mx-auto max-w-md">
        <div className="border-beam relative rounded-full">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busque por paciente ou médico"
            className="w-full rounded-full border border-ink-100 bg-white py-3 pl-11 pr-4 text-center text-sm text-ink-900 shadow-soft outline-none placeholder:text-ink-600 focus:border-brand"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-600">
          {appointments.length === 0 ? "Nenhuma consulta registrada ainda." : "Nenhuma consulta encontrada."}
        </p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {filtered.map((appointment) => (
            <div key={appointment.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div>
                <p className="text-sm font-semibold text-ink-900">{formatDateTime(appointment.scheduledAt)}</p>
                <p className="mt-1 text-sm text-ink-600">
                  {appointment.patientName} · {appointment.doctorName} · {appointment.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-deep">
                  {appointment.statusLabel}
                </span>
                {appointment.statusCode !== "CANCELADA" && (
                  <button
                    type="button"
                    title="Cancelar"
                    disabled={pending}
                    onClick={() => startTransition(() => cancelAppointmentAdmin(appointment.id))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-100 text-ink-600 transition-colors hover:bg-surface-soft disabled:opacity-60"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                )}
                <button
                  type="button"
                  title="Excluir"
                  disabled={pending}
                  onClick={() => {
                    if (!confirm("Excluir essa consulta? Essa ação não pode ser desfeita.")) return;
                    startTransition(() => deleteAppointmentAdmin(appointment.id));
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-100 text-brand-deep transition-colors hover:bg-brand-light disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
