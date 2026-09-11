"use client";

import { useActionState } from "react";
import { updateDoctor, type DoctorFormState } from "../../actions";

const initialState: DoctorFormState = {};

interface Props {
  doctorId: string;
  specialties: { id: string; name: string }[];
  initialValues: { crm: string; specialty_id: string | null; bio: string | null };
}

export function EditDoctorForm({ doctorId, specialties, initialValues }: Props) {
  const updateWithId = updateDoctor.bind(null, doctorId);
  const [state, formAction, pending] = useActionState(updateWithId, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="crm" className="block text-sm font-medium text-ink-900">
            CRM
          </label>
          <input
            id="crm"
            name="crm"
            type="text"
            required
            defaultValue={initialValues.crm}
            className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="specialty_id" className="block text-sm font-medium text-ink-900">
            Especialidade
          </label>
          <select
            id="specialty_id"
            name="specialty_id"
            defaultValue={initialValues.specialty_id ?? ""}
            className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
          >
            <option value="">Sem especialidade</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-ink-900">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={initialValues.bio ?? ""}
          className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
        />
      </div>

      {state.error && <p className="text-sm text-brand-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
