"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DoctorFormState {
  error?: string;
  success?: { email: string; tempPassword: string };
}

// Não temos ainda uma tela de "esqueci minha senha" — por enquanto a
// senha temporária aparece pro admin logo após criar a conta, pra ele
// repassar pro médico por fora do sistema. Ver pendência no relatório
// da Etapa 9 sobre construir o fluxo de redefinição de senha.
function generateTempPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const ADMIN_STAFF_ROLES = ["SUPER_ADMIN", "ADMIN", "RECEPCAO"];

/**
 * O client de service role ignora RLS — antes de usá-lo pra qualquer
 * operação privilegiada (como criar conta de auth), confirma que quem
 * está chamando é mesmo admin/recepção com a sessão normal (sujeita a
 * RLS).
 */
async function requireAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase.from("users").select("role, active").eq("id", user.id).maybeSingle();
  return Boolean(data?.active && ADMIN_STAFF_ROLES.includes(data.role));
}

export async function createDoctor(
  _prevState: DoctorFormState,
  formData: FormData,
): Promise<DoctorFormState> {
  if (!(await requireAdminSession())) {
    return { error: "Sem permissão." };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const crm = String(formData.get("crm") ?? "").trim();
  const specialtyId = String(formData.get("specialty_id") ?? "") || null;
  const bio = String(formData.get("bio") ?? "").trim();

  if (!fullName || !email || !crm) {
    return { error: "Preenche nome, e-mail e CRM." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "SUPABASE_SERVICE_ROLE_KEY não configurada no servidor — fala com o desenvolvedor." };
  }

  const tempPassword = generateTempPassword();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError || !created.user) {
    return {
      error: createError?.message.toLowerCase().includes("already")
        ? "Já existe uma conta com esse e-mail."
        : "Não deu pra criar a conta do médico.",
    };
  }

  await admin.from("users").update({ role: "MEDICO" }).eq("id", created.user.id);

  const { error: insertError } = await admin.from("doctors").insert({
    user_id: created.user.id,
    crm,
    specialty_id: specialtyId,
    bio: bio || null,
  });

  if (insertError) {
    return {
      error: insertError.code === "23505" ? "Já existe um médico com esse CRM." : "Conta criada, mas não deu pra salvar o cadastro de médico.",
    };
  }

  revalidatePath("/admin/medicos");
  return { success: { email, tempPassword } };
}

export async function updateDoctor(
  doctorId: string,
  _prevState: DoctorFormState,
  formData: FormData,
): Promise<DoctorFormState> {
  const supabase = await createClient();

  const crm = String(formData.get("crm") ?? "").trim();
  const specialtyId = String(formData.get("specialty_id") ?? "") || null;
  const bio = String(formData.get("bio") ?? "").trim();

  if (!crm) {
    return { error: "Preenche o CRM." };
  }

  const { error } = await supabase
    .from("doctors")
    .update({ crm, specialty_id: specialtyId, bio: bio || null })
    .eq("id", doctorId);

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe um médico com esse CRM." : "Não deu pra salvar. Tenta de novo.",
    };
  }

  revalidatePath("/admin/medicos");
  redirect("/admin/medicos");
}

export async function toggleDoctorActive(doctorId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("doctors").update({ active }).eq("id", doctorId);
  revalidatePath("/admin/medicos");
}
