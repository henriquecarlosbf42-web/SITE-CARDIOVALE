"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface PatientFormState {
  error?: string;
}

export async function createPatient(
  _prevState: PatientFormState,
  formData: FormData,
): Promise<PatientFormState> {
  const supabase = await createClient();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const cpf = String(formData.get("cpf") ?? "").replace(/\D/g, "") || null;
  const birthDate = String(formData.get("birth_date") ?? "") || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const insurancePlanId = String(formData.get("insurance_plan_id") ?? "") || null;
  const address = String(formData.get("address") ?? "").trim() || null;

  if (!fullName) {
    return { error: "Preenche o nome do paciente." };
  }

  const { error } = await supabase.from("patients").insert({
    full_name: fullName,
    cpf,
    birth_date: birthDate,
    phone,
    email,
    insurance_plan_id: insurancePlanId,
    address,
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe um paciente cadastrado com esse CPF." : "Não deu pra salvar. Tenta de novo.",
    };
  }

  revalidatePath("/admin/pacientes");
  redirect("/admin/pacientes");
}

export async function updatePatient(
  patientId: string,
  _prevState: PatientFormState,
  formData: FormData,
): Promise<PatientFormState> {
  const supabase = await createClient();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const cpf = String(formData.get("cpf") ?? "").replace(/\D/g, "") || null;
  const birthDate = String(formData.get("birth_date") ?? "") || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const insurancePlanId = String(formData.get("insurance_plan_id") ?? "") || null;
  const address = String(formData.get("address") ?? "").trim() || null;

  if (!fullName) {
    return { error: "Preenche o nome do paciente." };
  }

  const { error } = await supabase
    .from("patients")
    .update({
      full_name: fullName,
      cpf,
      birth_date: birthDate,
      phone,
      email,
      insurance_plan_id: insurancePlanId,
      address,
    })
    .eq("id", patientId);

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe um paciente cadastrado com esse CPF." : "Não deu pra salvar. Tenta de novo.",
    };
  }

  revalidatePath("/admin/pacientes");
  redirect("/admin/pacientes");
}

export async function togglePatientActive(patientId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("patients").update({ active }).eq("id", patientId);
  revalidatePath("/admin/pacientes");
}
