"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { toggleDoctorActive } from "./actions";

interface DoctorRow {
  id: string;
  fullName: string;
  crm: string;
  specialtyName: string | null;
  active: boolean;
}

export function DoctorsAdminList({ doctors }: { doctors: DoctorRow[] }) {
  const [pending, startTransition] = useTransition();

  if (doctors.length === 0) {
    return <p className="mt-6 text-center text-sm text-ink-600">Nenhum médico cadastrado ainda.</p>;
  }

  return (
    <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
      {doctors.map((doctor) => (
        <div key={doctor.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className={`text-sm font-medium ${doctor.active ? "text-ink-900" : "text-ink-300 line-through"}`}>
              {doctor.fullName}
            </p>
            <p className="mt-0.5 text-xs text-ink-600">
              {doctor.crm} {doctor.specialtyName && `· ${doctor.specialtyName}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => toggleDoctorActive(doctor.id, !doctor.active))}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
                doctor.active
                  ? "bg-ink-100 text-ink-600 hover:bg-ink-100/70"
                  : "bg-brand-light text-brand-deep hover:bg-brand-light/70"
              }`}
            >
              {doctor.active ? "Desativar" : "Reativar"}
            </button>
            <Link
              href={`/admin/medicos/${doctor.id}/editar`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-100 text-ink-600 transition-colors hover:bg-surface-soft"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
