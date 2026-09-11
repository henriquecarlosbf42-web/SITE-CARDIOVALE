"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentType } from "@/types/database";

export interface AppointmentFormState {
  error?: string;
}

// A clínica opera em horário de Brasília (sem horário de verão desde
// 2019, então o offset é sempre -03:00). O banco guarda tudo em UTC —
// sem esse offset explícito, "14:00" digitado pelo médico seria lido
// como 14:00 UTC (11:00 em Brasília), 3h adiantado.
const CLINIC_UTC_OFFSET = "-03:00";

async function requireDoctorId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: doctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  return doctor?.id ?? null;
}

export async function createAppointment(
  _prevState: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return { error: "Cadastro de médico não encontrado." };

  const patientId = String(formData.get("patient_id") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const type = String(formData.get("type") ?? "CONSULTA") as AppointmentType;

  if (!patientId || !date || !time) {
    return { error: "Preenche a data e o horário." };
  }

  const { error } = await supabase.from("appointments").insert({
    patient_id: patientId,
    doctor_id: doctorId,
    scheduled_at: `${date}T${time}:00`,
    type,
  });

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Já existe uma consulta marcada nesse horário."
          : "Não deu pra agendar. Tenta de novo.",
    };
  }

  revalidatePath(`/medico/pacientes/${patientId}`);
  revalidatePath("/medico/agenda");
  redirect(`/medico/pacientes/${patientId}`);
}

export async function updateAppointment(
  appointmentId: string,
  patientId: string,
  _prevState: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return { error: "Cadastro de médico não encontrado." };

  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const type = String(formData.get("type") ?? "CONSULTA") as AppointmentType;

  if (!date || !time) {
    return { error: "Preenche a data e o horário." };
  }

  const { error } = await supabase
    .from("appointments")
    .update({
      scheduled_at: `${date}T${time}:00${CLINIC_UTC_OFFSET}`,
      type,
    })
    .eq("id", appointmentId)
    .eq("doctor_id", doctorId);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Já existe uma consulta marcada nesse horário."
          : "Não deu pra salvar as alterações. Tenta de novo.",
    };
  }

  revalidatePath(`/medico/pacientes/${patientId}`);
  revalidatePath("/medico/agenda");
  redirect(`/medico/pacientes/${patientId}`);
}

export async function cancelAppointment(appointmentId: string, patientId: string) {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return;

  await supabase
    .from("appointments")
    .update({ status_code: "CANCELADA" })
    .eq("id", appointmentId)
    .eq("doctor_id", doctorId);

  revalidatePath(`/medico/pacientes/${patientId}`);
  revalidatePath("/medico/agenda");
}

export async function deleteAppointment(appointmentId: string, patientId: string) {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return;

  await supabase.from("appointments").delete().eq("id", appointmentId).eq("doctor_id", doctorId);

  revalidatePath(`/medico/pacientes/${patientId}`);
  revalidatePath("/medico/agenda");
}
