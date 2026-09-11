"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toClinicDateAndTime } from "@/lib/format";
import type { AppointmentType } from "@/types/database";

// Grade fixa por enquanto (sem tabela de expediente por médico ainda):
// segunda a sexta, 08h–18h, de 30 em 30 minutos.
const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 18;
const SLOT_STEP_MINUTES = 30;

// Fuso fixo da clínica — ver mesma observação em (medico)/medico/agenda/actions.ts.
const CLINIC_UTC_OFFSET = "-03:00";

export async function getAvailableSlots(doctorId: string, dateIso: string): Promise<string[]> {
  if (!doctorId || !dateIso) return [];

  const weekday = new Date(`${dateIso}T00:00:00`).getDay();
  if (weekday === 0 || weekday === 6) return [];

  const supabase = await createClient();

  const dayStart = `${dateIso}T00:00:00${CLINIC_UTC_OFFSET}`;
  const dayEnd = `${dateIso}T23:59:59${CLINIC_UTC_OFFSET}`;

  const { data: booked } = await supabase
    .from("appointments")
    .select("scheduled_at")
    .eq("doctor_id", doctorId)
    .neq("status_code", "CANCELADA")
    .gte("scheduled_at", dayStart)
    .lte("scheduled_at", dayEnd);

  const bookedTimes = new Set((booked ?? []).map((a) => toClinicDateAndTime(a.scheduled_at).time));

  const now = toClinicDateAndTime(new Date().toISOString());
  const isToday = dateIso === now.date;

  const slots: string[] = [];
  for (let hour = SLOT_START_HOUR; hour < SLOT_END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_STEP_MINUTES) {
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      if (bookedTimes.has(time)) continue;
      if (isToday && time <= now.time) continue;
      slots.push(time);
    }
  }
  return slots;
}

export interface BookingFormState {
  error?: string;
}

export async function createAppointmentBooking(
  _prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Entra de novo." };

  const { data: patient } = await supabase.from("patients").select("id").eq("user_id", user.id).maybeSingle();
  if (!patient) return { error: "Cadastro de paciente não encontrado. Fale com a recepção." };

  const type = String(formData.get("type") ?? "CONSULTA") as AppointmentType;
  const doctorId = String(formData.get("doctor_id") ?? "");
  const examId = String(formData.get("exam_id") ?? "") || null;
  const insurancePlanId = String(formData.get("insurance_plan_id") ?? "") || null;
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");

  if (!doctorId || !date || !time) {
    return { error: "Escolhe médico, data e horário." };
  }

  const { error } = await supabase.from("appointments").insert({
    patient_id: patient.id,
    doctor_id: doctorId,
    type,
    exam_id: type === "EXAME" ? examId : null,
    insurance_plan_id: insurancePlanId,
    scheduled_at: `${date}T${time}:00${CLINIC_UTC_OFFSET}`,
  });

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Esse horário acabou de ser ocupado. Escolhe outro."
          : "Não deu pra agendar. Tenta de novo.",
    };
  }

  redirect("/portal/consultas?agendado=1");
}
