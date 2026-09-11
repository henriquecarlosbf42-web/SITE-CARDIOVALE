"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AppointmentMenu } from "@/components/portal/AppointmentMenu";
import { formatDateTime } from "@/lib/format";

interface AppointmentRow {
  id: string;
  scheduledAt: string;
  type: string;
  patientId: string;
  patientName: string;
  statusLabel: string;
}

export function AgendaList({ appointments }: { appointments: AppointmentRow[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? appointments.filter((appointment) => appointment.patientName.toLowerCase().includes(normalized))
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
            placeholder="Busque pelo nome do paciente"
            className="w-full rounded-full border border-ink-100 bg-white py-3 pl-11 pr-4 text-center text-sm text-ink-900 shadow-soft outline-none placeholder:text-ink-600 focus:border-brand"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-600">
          {appointments.length === 0 ? "Nenhum atendimento registrado ainda." : "Nenhum atendimento encontrado."}
        </p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {filtered.map((appointment) => (
            <div key={appointment.id} className="flex flex-wrap items-center justify-between gap-2 p-5">
              <div>
                <p className="font-semibold text-ink-900">{formatDateTime(appointment.scheduledAt)}</p>
                <p className="mt-1 text-sm text-ink-600">
                  {appointment.patientName} · {appointment.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-deep">
                  {appointment.statusLabel}
                </span>
                <AppointmentMenu appointmentId={appointment.id} patientId={appointment.patientId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
