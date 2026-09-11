import type { Metadata } from "next";
import { FileText } from "lucide-react";
import {
  getDocumentsByExamResult,
  getExamResults,
  getPatientRecord,
  getSignedDocumentUrl,
} from "@/lib/data/patient-portal";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Documentos | Portal do paciente" };

export default async function DocumentosPage() {
  const patient = await getPatientRecord();
  if (!patient) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const results = await getExamResults(patient.id);
  const documents = await getDocumentsByExamResult(results.map((r) => r.id));
  const documentsWithUrl = await Promise.all(
    documents.map(async (doc) => ({ ...doc, url: await getSignedDocumentUrl(doc.file_path) })),
  );

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Documentos</h1>

      {documentsWithUrl.length === 0 ? (
        <p className="mt-4 text-sm text-ink-600">Nenhum documento anexado ainda.</p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {documentsWithUrl.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
                <div>
                  <p className="font-medium text-ink-900">{doc.file_name}</p>
                  <p className="text-xs text-ink-600">{formatDate(doc.created_at)}</p>
                </div>
              </div>
              {doc.url && (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-brand-deep hover:underline"
                >
                  Abrir →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
