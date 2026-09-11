"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { deleteExamResult } from "../../exames/actions";

export function ExamResultMenu({ examResultId, patientId }: { examResultId: string; patientId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="relative">
      <button
        type="button"
        title="Mais opções"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-100 text-ink-600 transition-colors hover:bg-surface-soft"
      >
        <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -6, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -6, scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-ink-100 bg-surface p-1 shadow-soft"
            >
              <Link
                href={`/medico/exames/${examResultId}/editar`}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-900 transition-colors hover:bg-surface-soft"
              >
                <Pencil className="h-4 w-4" strokeWidth={1.75} />
                Editar
              </Link>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (!confirm("Excluir esse resultado de exame? Essa ação não pode ser desfeita.")) return;
                  setOpen(false);
                  startTransition(() => {
                    void deleteExamResult(examResultId, patientId);
                  });
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-brand-deep transition-colors hover:bg-brand-light disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                Excluir
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
