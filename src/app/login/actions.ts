"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HOME_BY_ROLE, type Role } from "@/lib/permissions/roles";

export interface SignInState {
  error?: string;
}

export async function signIn(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "Preenche CPF (ou e-mail) e senha." };
  }

  const supabase = await createClient();

  // paciente entra com CPF; médico/administrativo continuam com e-mail.
  // um CPF (11 dígitos) é resolvido pro e-mail vinculado antes de
  // autenticar, já que o Supabase Auth só aceita e-mail/senha.
  const digits = identifier.replace(/\D/g, "");
  let email = identifier;

  if (digits.length === 11) {
    const { data: resolvedEmail } = await supabase.rpc("resolve_patient_login_email", { p_cpf: digits });
    if (!resolvedEmail) {
      return { error: "CPF ou senha incorretos." };
    }
    email = resolvedEmail;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "CPF/e-mail ou senha incorretos." };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, active")
    .eq("id", data.user.id)
    .single();

  if (!profile || !profile.active) {
    await supabase.auth.signOut();
    return { error: "Conta sem acesso liberado. Fale com a clínica." };
  }

  const redirectTo = String(formData.get("redirect") ?? "") || HOME_BY_ROLE[profile.role as Role];
  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
