import Link from "next/link";
import { Bell, CalendarClock, FileHeart, Stethoscope } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getAppointments,
  getAppointmentStatuses,
  getDoctorDirectory,
  getExamResults,
  getExamsDirectory,
  getNotifications,
  getPatientRecord,
} from "@/lib/data/patient-portal";
import { formatDateTime, formatDate, findNextByDate, firstName } from "@/lib/format";

export default async function PortalDashboardPage() {
  const user = await getCurrentUser();
  const patient = await getPatientRecord();

  if (!patient) {
    return (
      <div className="rounded-card border border-ink-100 bg-surface p-6 text-sm text-ink-600 shadow-soft">
        Seu cadastro de paciente ainda não foi vinculado a essa conta. Fale
        com a recepção da CardioVale pra liberar o acesso completo.
      </div>
    );
  }

  const [appointments, examResults, notifications, doctors, exams, statuses] = await Promise.all([
    getAppointments(patient.id),
    getExamResults(patient.id),
    getNotifications(user!.id),
    getDoctorDirectory(),
    getExamsDirectory(),
    getAppointmentStatuses(),
  ]);

  const nextAppointment = findNextByDate(appointments, (a) => a.scheduled_at);
  const recentResults = examResults.slice(0, 3);
  const unreadNotifications = notifications.filter((n) => !n.read_at);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-ink-900">Olá, {firstName(user!.fullName)}</h1>
        <p className="mt-1 text-sm text-ink-600">Aqui está um resumo da sua jornada com a CardioVale.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-2 text-brand">
            <CalendarClock className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-sm font-semibold uppercase tracking-wide">Próxima consulta</span>
          </div>
          {nextAppointment ? (
            <div className="mt-3">
              <p className="font-semibold text-ink-900">{formatDateTime(nextAppointment.scheduled_at)}</p>
              <p className="mt-1 text-sm text-ink-600">
                {doctors.get(nextAppointment.doctor_id)?.fullName ?? "Médico(a) a confirmar"}
              </p>
              <p className="mt-1 text-xs text-ink-600">
                {statuses.get(nextAppointment.status_code)?.label ?? nextAppointment.status_code}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink-600">Nenhuma consulta agendada.</p>
          )}
        </div>

        <div className="rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-2 text-brand">
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-sm font-semibold uppercase tracking-wide">Notificações</span>
          </div>
          {unreadNotifications.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {unreadNotifications.slice(0, 3).map((n) => (
                <li key={n.id} className="text-sm text-ink-900">
                  {n.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-600">Nenhuma notificação nova.</p>
          )}
        </div>
      </div>

      <div>
        <div className="text-center">
          <h2 className="flex items-center justify-center gap-2 text-lg font-semibold text-ink-900">
            <FileHeart className="h-5 w-5 text-brand" strokeWidth={1.75} />
            Resultados disponíveis
          </h2>
          <Link href="/portal/exames" className="mt-1 inline-block text-sm font-medium text-brand-deep hover:underline">
            Ver todos →
          </Link>
        </div>
        {recentResults.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {recentResults.map((result) => (
              <div key={result.id} className="rounded-card border border-ink-100 bg-surface p-5 shadow-soft">
                <p className="font-semibold text-ink-900">{exams.get(result.exam_id) ?? "Exame"}</p>
                <p className="mt-1 text-sm text-ink-600">{formatDate(result.exam_date)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-600">Nenhum resultado liberado ainda.</p>
        )}
      </div>

      <div className="text-center">
        <h2 className="flex items-center justify-center gap-2 text-lg font-semibold text-ink-900">
          <Stethoscope className="h-5 w-5 text-brand" strokeWidth={1.75} />
          Histórico de consultas
        </h2>
        {appointments.length > 0 ? (
          <Link href="/portal/consultas" className="mt-2 inline-block text-sm font-medium text-brand-deep hover:underline">
            Ver as {appointments.length} consultas →
          </Link>
        ) : (
          <p className="mt-2 text-sm text-ink-600">Nenhuma consulta registrada ainda.</p>
        )}
      </div>
    </div>
  );
}
