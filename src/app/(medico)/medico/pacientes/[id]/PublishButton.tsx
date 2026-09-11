"use client";

import { useTransition } from "react";
import { publishExamResult } from "../../exames/actions";

export function PublishButton({ examResultId, patientId }: { examResultId: string; patientId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => publishExamResult(examResultId, patientId))}
      className="mt-3 rounded-full bg-brand-deep px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
    >
      {pending ? "Publicando..." : "Publicar resultado"}
    </button>
  );
}
