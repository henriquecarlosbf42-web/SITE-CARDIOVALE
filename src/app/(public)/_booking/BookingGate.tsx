import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getPatientRecord } from "@/lib/data/patient-portal";
import {
  getDoctorsForBooking,
  getExamsForBooking,
  getInsurancePlansForBooking,
  getSpecialtiesForBooking,
} from "@/lib/data/booking";
import type { AppointmentType } from "@/types/database";
import { BookingWizard } from "./BookingWizard";

export async function BookingGate({ type, currentPath }: { type: AppointmentType; currentPath: string }) {
  const user = await getCurrentUser();

  if (!user) {
    const redirectParam = encodeURIComponent(currentPath);
    return (
      <div className="mx-auto max-w-md rounded-card border border-ink-100 bg-surface p-8 text-center shadow-soft">
        <h2 className="text-lg font-semibold text-ink-900">Entra ou cria sua conta pra agendar</h2>
        <p className="mt-2 text-sm text-ink-600">
          O agendamento online é só pra quem já tem acesso ao portal do paciente — leva menos de um minuto.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/cadastro?redirect=${redirectParam}`}
            className="rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand"
          >
            Criar conta
          </Link>
          <Link
            href={`/login?redirect=${redirectParam}`}
            className="rounded-full border border-ink-100 bg-white px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft"
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "PACIENTE") {
    return (
      <div className="mx-auto max-w-md rounded-card border border-ink-100 bg-surface p-8 text-center shadow-soft">
        <p className="text-sm text-ink-600">
          O agendamento online é exclusivo pra contas de paciente. Sua conta está logada como {user.role.toLowerCase()}.
        </p>
      </div>
    );
  }

  const patient = await getPatientRecord();

  if (!patient) {
    return (
      <div className="mx-auto max-w-md rounded-card border border-ink-100 bg-surface p-8 text-center shadow-soft">
        <p className="text-sm text-ink-600">
          Seu cadastro de paciente ainda não foi encontrado. Fale com a recepção da CardioVale pra liberar o acesso.
        </p>
      </div>
    );
  }

  const [specialties, exams, doctors, insurancePlans] = await Promise.all([
    getSpecialtiesForBooking(),
    getExamsForBooking(),
    getDoctorsForBooking(),
    getInsurancePlansForBooking(),
  ]);

  return (
    <BookingWizard
      defaultType={type}
      specialties={specialties}
      exams={exams}
      doctors={doctors}
      insurancePlans={insurancePlans}
      patientName={patient.full_name}
      patientPhone={patient.phone}
      patientEmail={patient.email}
      defaultInsurancePlanId={patient.insurance_plan_id}
    />
  );
}
