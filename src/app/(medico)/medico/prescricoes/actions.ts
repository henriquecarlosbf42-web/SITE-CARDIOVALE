"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface PrescriptionFormState {
  error?: string;
}

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

export async function createPrescription(
  _prevState: PrescriptionFormState,
  formData: FormData,
): Promise<PrescriptionFormState> {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return { error: "Cadastro de médico não encontrado." };

  const patientId = String(formData.get("patient_id") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const issuedAt = String(formData.get("issued_at") ?? "");

  if (!patientId || !description || !issuedAt) {
    return { error: "Preenche a data e a prescrição." };
  }

  const { error } = await supabase.from("prescriptions").insert({
    patient_id: patientId,
    doctor_id: doctorId,
    description,
    issued_at: issuedAt,
  });

  if (error) {
    return { error: "Não deu pra salvar a prescrição. Tenta de novo." };
  }

  revalidatePath(`/medico/pacientes/${patientId}`);
  redirect(`/medico/pacientes/${patientId}`);
}

export async function updatePrescription(
  prescriptionId: string,
  patientId: string,
  _prevState: PrescriptionFormState,
  formData: FormData,
): Promise<PrescriptionFormState> {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return { error: "Cadastro de médico não encontrado." };

  const description = String(formData.get("description") ?? "").trim();
  const issuedAt = String(formData.get("issued_at") ?? "");

  if (!description || !issuedAt) {
    return { error: "Preenche a data e a prescrição." };
  }

  const { error } = await supabase
    .from("prescriptions")
    .update({ description, issued_at: issuedAt })
    .eq("id", prescriptionId)
    .eq("doctor_id", doctorId);

  if (error) {
    return { error: "Não deu pra salvar as alterações. Tenta de novo." };
  }

  revalidatePath(`/medico/pacientes/${patientId}`);
  redirect(`/medico/pacientes/${patientId}`);
}

export async function deletePrescription(prescriptionId: string, patientId: string) {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return;

  await supabase.from("prescriptions").delete().eq("id", prescriptionId).eq("doctor_id", doctorId);

  revalidatePath(`/medico/pacientes/${patientId}`);
}
