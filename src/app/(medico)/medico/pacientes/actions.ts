"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CreatePatientFormState {
  error?: string;
  success?: { cpf: string; password: string; patientId: string };
}

async function requireDoctorSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("users").select("role, active").eq("id", user.id).maybeSingle();
  if (!profile?.active || profile.role !== "MEDICO") return null;

  const { data: doctor } = await supabase.from("doctors").select("id").eq("user_id", user.id).maybeSingle();
  return doctor?.id ?? null;
}

// senha padrão: nascimento (DDMMAAAA) + 2 últimos dígitos do CPF — dá
// pra reconstruir a qualquer momento com o que já está na ficha, sem
// precisar de um fluxo de "esqueci minha senha" pra esse caso.
function defaultPassword(birthDate: string, cpf: string) {
  const [year, month, day] = birthDate.split("-");
  return `${day}${month}${year}${cpf.slice(-2)}`;
}

export async function createPatientByDoctor(
  _prevState: CreatePatientFormState,
  formData: FormData,
): Promise<CreatePatientFormState> {
  const doctorId = await requireDoctorSession();
  if (!doctorId) return { error: "Sem permissão." };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const cpf = String(formData.get("cpf") ?? "").replace(/\D/g, "");
  const birthDate = String(formData.get("birth_date") ?? "");

  if (!fullName || cpf.length !== 11 || !birthDate) {
    return { error: "Preenche nome, CPF (11 dígitos) e data de nascimento." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "SUPABASE_SERVICE_ROLE_KEY não configurada no servidor — fala com o desenvolvedor." };
  }

  const { data: existing } = await admin
    .from("patients")
    .select("id, user_id")
    .eq("cpf", cpf)
    .maybeSingle();

  if (existing?.user_id) {
    return { error: "Já existe um cadastro com login pra esse CPF." };
  }

  const password = defaultPassword(birthDate, cpf);
  const syntheticEmail = `paciente.${cpf}@cardiovale.internal`;

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: syntheticEmail,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError || !created.user) {
    return { error: "Não deu pra criar o cadastro. Tenta de novo." };
  }

  let patientId: string;

  if (existing) {
    const { error: updateError } = await admin
      .from("patients")
      .update({ user_id: created.user.id, full_name: fullName, birth_date: birthDate, email: syntheticEmail })
      .eq("id", existing.id);
    if (updateError) return { error: "Conta criada, mas não deu pra vincular o cadastro já existente." };
    patientId = existing.id;
  } else {
    const { data: patient, error: insertError } = await admin
      .from("patients")
      .insert({ user_id: created.user.id, full_name: fullName, cpf, birth_date: birthDate, email: syntheticEmail })
      .select("id")
      .single();
    if (insertError || !patient) return { error: "Conta criada, mas não deu pra salvar o cadastro de paciente." };
    patientId = patient.id;
  }

  // sem isso o paciente não aparece na lista do médico nem dá pra
  // lançar exame pra ele — as duas coisas dependem de já existir uma
  // consulta com esse médico.
  await admin.from("appointments").insert({
    patient_id: patientId,
    doctor_id: doctorId,
    type: "CONSULTA",
    status_code: "ATENDIDA",
    scheduled_at: new Date().toISOString(),
  });

  revalidatePath("/medico/pacientes");

  return { success: { cpf, password, patientId } };
}
