"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, X } from "lucide-react";
import { updatePatientPhone } from "../actions";

export function PatientPhoneField({ patientId, phone }: { patientId: string; phone: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-1 text-ink-600 hover:text-brand-deep"
      >
        {phone || "Adicionar telefone"}
        <Pencil className="h-3 w-3" strokeWidth={1.75} />
      </button>
    );
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updatePatientPhone(patientId, value);
      if (result.error) {
        setError(result.error);
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
      <input
        type="tel"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="(12) 90000-0000"
        autoFocus
        className="w-36 rounded-lg border border-ink-100 px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand"
      />
      <button
        type="button"
        onClick={save}
        disabled={pending}
        title="Salvar"
        className="flex h-6 w-6 items-center justify-center rounded-full text-brand-deep hover:bg-brand-light disabled:opacity-60"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => {
          setEditing(false);
          setValue(phone ?? "");
          setError(null);
        }}
        title="Cancelar"
        className="flex h-6 w-6 items-center justify-center rounded-full text-ink-400 hover:bg-surface-soft"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      {error && <span className="w-full text-xs text-brand-deep">{error}</span>}
    </span>
  );
}
