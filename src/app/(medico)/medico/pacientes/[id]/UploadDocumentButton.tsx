"use client";

import { useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Upload, UploadCloud, X } from "lucide-react";
import { addExamDocument } from "../../exames/actions";

export function UploadDocumentButton({ examResultId, patientId }: { examResultId: string; patientId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();

  function sendFiles(files: FileList | File[]) {
    const valid = Array.from(files).filter((file) => file.size > 0);
    if (valid.length === 0) return;

    const formData = new FormData();
    for (const file of valid) formData.append("files", file);

    startTransition(() => {
      void addExamDocument(examResultId, patientId, formData);
    });
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        title="Anexar arquivo"
        disabled={pending}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-100 text-ink-600 transition-colors hover:bg-surface-soft disabled:opacity-60"
      >
        <Upload className="h-4 w-4" strokeWidth={1.75} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-card border border-ink-100 bg-surface p-6 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink-900">Anexar arquivo do exame</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-surface-soft"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  if (event.currentTarget.files) sendFiles(event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  if (event.dataTransfer.files) sendFiles(event.dataTransfer.files);
                }}
                disabled={pending}
                className={`mt-4 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors disabled:opacity-60 ${
                  dragging ? "border-brand-deep bg-brand-light/40" : "border-ink-100 hover:border-brand"
                }`}
              >
                <UploadCloud className="h-7 w-7 text-brand-deep" strokeWidth={1.5} />
                <p className="text-sm">
                  <span className="font-semibold text-brand-deep">Clique para enviar</span>{" "}
                  <span className="text-ink-600">ou arraste e solte</span>
                </p>
                <p className="text-xs text-ink-600">PDF, JPG ou PNG</p>
              </button>

              {pending && <p className="mt-3 text-center text-xs text-ink-600">Enviando...</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
