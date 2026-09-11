"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { DatePickerField } from "@/components/ui/date-picker";
import type { DoctorOption, ExamOption, InsurancePlanOption, SpecialtyOption } from "@/lib/data/booking";
import type { AppointmentType } from "@/types/database";
import { createAppointmentBooking, getAvailableSlots, type BookingFormState } from "./actions";

const TYPE_LABEL: Record<AppointmentType, string> = {
  CONSULTA: "Consulta",
  RETORNO: "Retorno",
  EXAME: "Exame",
};

interface Props {
  defaultType: AppointmentType;
  specialties: SpecialtyOption[];
  exams: ExamOption[];
  doctors: DoctorOption[];
  insurancePlans: InsurancePlanOption[];
  patientName: string;
  patientPhone: string | null;
  patientEmail: string | null;
  defaultInsurancePlanId: string | null;
}

const initialState: BookingFormState = {};

export function BookingWizard({
  defaultType,
  specialties,
  exams,
  doctors,
  insurancePlans,
  patientName,
  patientPhone,
  patientEmail,
  defaultInsurancePlanId,
}: Props) {
  const [type, setType] = useState<AppointmentType>(defaultType);
  const [specialtyId, setSpecialtyId] = useState<string | null>(null);
  const [examId, setExamId] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [insurancePlanId, setInsurancePlanId] = useState<string | null>(defaultInsurancePlanId);
  const [stepIndex, setStepIndex] = useState(0);

  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, startSlotsTransition] = useTransition();

  const steps = useMemo(
    () =>
      type === "EXAME"
        ? (["tipo", "exame", "medico", "data", "horario", "dados", "confirmacao"] as const)
        : (["tipo", "especialidade", "medico", "data", "horario", "dados", "confirmacao"] as const),
    [type],
  );
  const step = steps[stepIndex];

  const filteredDoctors = type === "EXAME" ? doctors : doctors.filter((d) => d.specialtyId === specialtyId);

  useEffect(() => {
    if (!doctorId || !date) return;
    startSlotsTransition(async () => {
      const result = await getAvailableSlots(doctorId, date);
      setSlots(result);
    });
  }, [doctorId, date]);

  const visibleSlots = doctorId && date ? slots : [];

  const [state, formAction, pending] = useActionState(createAppointmentBooking, initialState);

  function canContinue() {
    switch (step) {
      case "especialidade":
        return Boolean(specialtyId);
      case "exame":
        return Boolean(examId);
      case "medico":
        return Boolean(doctorId);
      case "data":
        return Boolean(date);
      case "horario":
        return Boolean(time);
      default:
        return true;
    }
  }

  function goNext() {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  }
  function goBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  const doctorName = doctors.find((d) => d.id === doctorId)?.fullName;
  const specialtyName = specialties.find((s) => s.id === specialtyId)?.name;
  const examName = exams.find((e) => e.id === examId)?.name;
  const insurancePlanName = insurancePlans.find((p) => p.id === insurancePlanId)?.name;

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center gap-1.5">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-brand-deep" : "bg-ink-100"}`}
          />
        ))}
      </div>

      <div className="rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        {step === "tipo" && (
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Que tipo de atendimento?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(Object.keys(TYPE_LABEL) as AppointmentType[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setType(option);
                    setSpecialtyId(null);
                    setExamId(null);
                    setDoctorId(null);
                  }}
                  className={`rounded-xl border px-4 py-4 text-center text-sm font-medium transition-colors ${
                    type === option
                      ? "border-brand-deep bg-brand-light text-brand-deep"
                      : "border-ink-100 text-ink-900 hover:border-brand"
                  }`}
                >
                  {TYPE_LABEL[option]}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "especialidade" && (
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Qual especialidade?</h2>
            <div className="mt-4 space-y-2">
              {specialties.map((specialty) => (
                <button
                  key={specialty.id}
                  type="button"
                  onClick={() => {
                    setSpecialtyId(specialty.id);
                    setDoctorId(null);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    specialtyId === specialty.id
                      ? "border-brand-deep bg-brand-light text-brand-deep"
                      : "border-ink-100 text-ink-900 hover:border-brand"
                  }`}
                >
                  {specialty.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "exame" && (
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Qual exame?</h2>
            <div className="mt-4 space-y-2">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => setExamId(exam.id)}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    examId === exam.id
                      ? "border-brand-deep bg-brand-light text-brand-deep"
                      : "border-ink-100 text-ink-900 hover:border-brand"
                  }`}
                >
                  {exam.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "medico" && (
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Com qual médico(a)?</h2>
            {filteredDoctors.length === 0 ? (
              <p className="mt-3 text-sm text-ink-600">Nenhum médico disponível pra essa opção no momento.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => {
                      setDoctorId(doctor.id);
                      setTime("");
                    }}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      doctorId === doctor.id
                        ? "border-brand-deep bg-brand-light text-brand-deep"
                        : "border-ink-100 text-ink-900 hover:border-brand"
                    }`}
                  >
                    <span>{doctor.fullName}</span>
                    <span className="text-xs text-ink-600">{doctor.crm}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "data" && (
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Qual dia?</h2>
            <p className="mt-1 text-sm text-ink-600">Atendimento de segunda a sexta.</p>
            <div className="mt-4">
              <DatePickerField
                name="date_picker"
                defaultValue={date || null}
                onChange={(value) => {
                  setDate(value);
                  setTime("");
                }}
              />
            </div>
          </div>
        )}

        {step === "horario" && (
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Qual horário?</h2>
            {loadingSlots ? (
              <p className="mt-3 text-sm text-ink-600">Carregando horários...</p>
            ) : visibleSlots.length === 0 ? (
              <p className="mt-3 text-sm text-ink-600">
                Nenhum horário livre nesse dia. Volta e escolhe outra data.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {visibleSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`rounded-lg border px-2 py-2 text-center text-sm font-medium transition-colors ${
                      time === slot
                        ? "border-brand-deep bg-brand-light text-brand-deep"
                        : "border-ink-100 text-ink-900 hover:border-brand"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "dados" && (
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Seus dados</h2>
            <div className="mt-4 space-y-3 rounded-lg border border-ink-100 bg-surface-soft p-4 text-sm">
              <p className="text-ink-900">
                <span className="font-medium">Nome:</span> {patientName}
              </p>
              {patientPhone && (
                <p className="text-ink-900">
                  <span className="font-medium">Telefone:</span> {patientPhone}
                </p>
              )}
              {patientEmail && (
                <p className="text-ink-900">
                  <span className="font-medium">E-mail:</span> {patientEmail}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="insurance_plan_id" className="block text-sm font-medium text-ink-900">
                Convênio pra essa consulta
              </label>
              <select
                id="insurance_plan_id"
                value={insurancePlanId ?? ""}
                onChange={(event) => setInsurancePlanId(event.target.value || null)}
                className="mt-1.5 w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand"
              >
                <option value="">Particular</option>
                {insurancePlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === "confirmacao" && (
          <form action={formAction}>
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="doctor_id" value={doctorId ?? ""} />
            <input type="hidden" name="exam_id" value={examId ?? ""} />
            <input type="hidden" name="insurance_plan_id" value={insurancePlanId ?? ""} />
            <input type="hidden" name="date" value={date} />
            <input type="hidden" name="time" value={time} />

            <h2 className="text-lg font-semibold text-ink-900">Confirme seu agendamento</h2>
            <div className="mt-4 space-y-2 rounded-lg border border-ink-100 bg-surface-soft p-4 text-sm text-ink-900">
              <p>
                <span className="font-medium">Tipo:</span> {TYPE_LABEL[type]}
              </p>
              {type === "EXAME" ? (
                <p>
                  <span className="font-medium">Exame:</span> {examName}
                </p>
              ) : (
                <p>
                  <span className="font-medium">Especialidade:</span> {specialtyName}
                </p>
              )}
              <p>
                <span className="font-medium">Médico(a):</span> {doctorName}
              </p>
              <p>
                <span className="font-medium">Data:</span> {date.split("-").reverse().join("/")} às {time}
              </p>
              <p>
                <span className="font-medium">Convênio:</span> {insurancePlanName ?? "Particular"}
              </p>
            </div>

            {state.error && <p className="mt-3 text-sm text-brand-deep">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="mt-5 w-full rounded-full bg-brand-deep px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-60"
            >
              {pending ? "Agendando..." : "Confirmar agendamento"}
            </button>
          </form>
        )}
      </div>

      {step !== "confirmacao" && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="rounded-full border border-ink-100 bg-white px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft disabled:opacity-40"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue()}
            className="rounded-full bg-brand-deep px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      )}

      {step === "confirmacao" && stepIndex > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border border-ink-100 bg-white px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft"
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
