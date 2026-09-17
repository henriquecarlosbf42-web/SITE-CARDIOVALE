"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HOME_BY_ROLE, type Role } from "@/lib/permissions/roles";

export interface ChangePasswordState {
  error?: string;
}

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Entra de novo." };

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (password !== confirm) {
    return { error: "As senhas não são iguais." };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) {
    return { error: "Não deu pra trocar a senha. Tenta de novo." };
  }

  const { data: profile } = await supabase
    .from("users")
    .update({ must_change_password: false })
    .eq("id", user.id)
    .select("role")
    .single();

  redirect(HOME_BY_ROLE[(profile?.role as Role) ?? "PACIENTE"]);
}
