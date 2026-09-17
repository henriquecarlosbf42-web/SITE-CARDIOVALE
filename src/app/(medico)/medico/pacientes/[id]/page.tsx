import Link from "next/link";
import {
  Activity,
  Download,
  Eye,
  Gauge,
  HeartPulse,
  Footprints,
  Plus,
  Stethoscope,
  Watch,
} from "lucide-react";
import { notFound } from "next/navigation";
import {
  getAppointmentStatuses,
  getDocumentsByExamResult,
  getExamsDirectory,
  getSignedDocumentUrl,
} from "@/lib/data/patient-portal";
import {
  getDoctorRecord,
  getPatientAppointments,
  getPatientById,
  getPatientExamResults,
  getPatientPrescriptions,
} from "@/lib/data/doctor-portal";
import { formatDate, formatDateTime } from "@/lib/format";
import { PublishButton } from "./PublishButton";
import { UploadDocumentButton } from "./UploadDocumentButton";
import { ExamResultMenu } from "./ExamResultMenu";
import { PrescriptionMenu } from "./PrescriptionMenu";
import { WhatsAppExamButton } from "./WhatsAppExamButton";
import { AppointmentMenu } from "@/components/portal/AppointmentMenu";

function examIcon(examName?: string) {
  const key = (examName ?? "").toLowerCase();
  const props = { className: "h-5 w-5", strokeWidth: 1.75 };

  if (key.includes("eletrocardiograma") || key.includes("ecg")) return <Activity {...props} />;
  if (key.includes("ecocardiograma")) return <HeartPulse {...props} />;
  if (key.includes("holter")) return <Watch {...props} />;
  if (key.includes("mapa")) return <Gauge {...props} />;
  if (key.includes("ergométrico") || key.includes("ergometrico")) return <Footprints {...props} />;
  return <Stethoscope {...props} />;
}

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const doctor = await getDoctorRecord();
  if (!doctor) return <p className="text-sm text-ink-600">Cadastro não vinculado ainda.</p>;

  const patient = await getPatientById(id);
  if (!patient) notFound();

  const [appointments, examResults, prescriptions, statuses, exams] = await Promise.all([
    getPatientAppointments(id),
    getPatientExamResults(id),
    getPatientPrescriptions(id),
    getAppointmentStatuses(),
    getExamsDirectory(),
  ]);

  const documents = await getDocumentsByExamResult(examResults.map((r) => r.id));
  const documentsByResult = new Map<string, { id: string; file_name: string; url: string | null }[]>();
  for (const doc of documents) {
    const url = await getSignedDocumentUrl(doc.file_path);
    const list = documentsByResult.get(doc.exam_result_id) ?? [];
    list.push({ id: doc.id, file_name: doc.file_name, url });
    documentsByResult.set(doc.exam_result_id, list);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-card border border-ink-100 bg-surface p-6 text-center shadow-soft">
        <h1 className="text-2xl font-semibold text-ink-900">{patient.full_name}</h1>
        <p className="mt-1 text-sm text-ink-600">
          {patient.phone && <>{patient.phone} · </>}
          {patient.birth_date && `Nascimento: ${formatDate(patient.birth_date)}`}
        </p>
      </div>

      <section>
        <h2 className="text-center text-xl font-bold text-ink-900">Consultas</h2>
        {appointments.length === 0 ? (
          <p className="mt-2 text-sm text-ink-600">Nenhuma consulta registrada.</p>
        ) : (
          <div className="mt-3 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                <span className="text-sm text-ink-900">{formatDateTime(appointment.scheduled_at)}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-deep">
                    {statuses.get(appointment.status_code)?.label ?? appointment.status_code}
                  </span>
                  <AppointmentMenu appointmentId={appointment.id} patientId={patient.id} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Link
            href={`/medico/agenda/novo?paciente=${patient.id}`}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
          >
            <Plus className="size-4" strokeWidth={2} />
            Agendar Consulta
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-center text-xl font-bold text-ink-900">Exames</h2>
        {examResults.length === 0 ? (
          <p className="mt-2 text-sm text-ink-600">Nenhum exame registrado.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {examResults.map((result) => {
              const examName = exams.get(result.exam_id);
              return (
                <div
                  key={result.id}
                  className="flex flex-wrap items-start gap-4 rounded-card border border-ink-100 bg-surface p-4 shadow-soft"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-deep">
                    {examIcon(examName)}
                  </div>

                  <div className="min-w-[220px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink-900">{examName ?? "Exame"}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          result.status === "PUBLICADO" ? "bg-brand-light text-brand-deep" : "bg-ink-100 text-ink-600"
                        }`}
                      >
                        {result.status === "PUBLICADO" ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink-600">{formatDate(result.exam_date)}</p>
                    {result.notes && <p className="mt-2 text-sm text-ink-600">{result.notes}</p>}

                    {(documentsByResult.get(result.id) ?? []).length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-600">
                          Arquivos enviados
                        </p>
                        <div className="mt-1.5 space-y-1.5">
                          {(documentsByResult.get(result.id) ?? []).map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between gap-2 rounded-lg border border-ink-100 bg-surface-soft px-3 py-1.5"
                            >
                              <span className="truncate text-xs text-ink-900">{doc.file_name}</span>
                              <div className="flex shrink-0 items-center gap-1">
                                <a
                                  href={doc.url ?? "#"}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Visualizar"
                                  className="flex h-7 w-7 items-center justify-center rounded-full text-brand-deep transition-colors hover:bg-brand-light"
                                >
                                  <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                                </a>
                                <a
                                  href={doc.url ? `${doc.url}&download=${encodeURIComponent(doc.file_name)}` : "#"}
                                  title="Baixar"
                                  className="flex h-7 w-7 items-center justify-center rounded-full text-brand-deep transition-colors hover:bg-brand-light"
                                >
                                  <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.status === "RASCUNHO" && (
                      <PublishButton examResultId={result.id} patientId={patient.id} />
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {result.status === "PUBLICADO" && (
                      <WhatsAppExamButton
                        phone={patient.phone}
                        patientName={patient.full_name}
                        examName={examName ?? "exame"}
                        examDate={formatDate(result.exam_date)}
                      />
                    )}
                    <UploadDocumentButton examResultId={result.id} patientId={patient.id} />
                    <ExamResultMenu examResultId={result.id} patientId={patient.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Link
            href={`/medico/exames/novo?paciente=${patient.id}`}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
          >
            <Plus className="size-4" strokeWidth={2} />
            Adicionar Resultado
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-center text-xl font-bold text-ink-900">Prescrições</h2>
        {prescriptions.length === 0 ? (
          <p className="mt-2 text-sm text-ink-600">Nenhuma prescrição registrada.</p>
        ) : (
          <div className="mt-3 divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="text-sm text-ink-600">{formatDate(prescription.issued_at)}</p>
                  <p className="mt-1 text-sm font-medium text-ink-900">{prescription.description}</p>
                </div>
                <PrescriptionMenu prescriptionId={prescription.id} patientId={patient.id} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Link
            href={`/medico/prescricoes/novo?paciente=${patient.id}`}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-1 hover:bg-brand"
          >
            <Plus className="size-4" strokeWidth={2} />
            Adicionar Prescrição
          </Link>
        </div>
      </section>
    </div>
  );
}
