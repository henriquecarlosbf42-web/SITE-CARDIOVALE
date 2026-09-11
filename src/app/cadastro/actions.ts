"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface SignUpState {
  error?: string;
  message?: string;
}

export async function signUp(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const cpf = String(formData.get("cpf") ?? "").replace(/\D/g, "");
  const birthDate = String(formData.get("birth_date") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const redirectTo = String(formData.get("redirect") ?? "") || "/portal";

  if (!fullName || !email || !password || !cpf || !birthDate) {
    return { error: "Preenche nome, e-mail, senha, CPF e data de nascimento." };
  }
  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (cpf.length !== 11) {
    return { error: "CPF inválido." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return {
      error: error.message.toLowerCase().includes("already registered")
        ? "Já existe uma conta com esse e-mail."
        : "Não deu pra criar a conta. Tenta de novo.",
    };
  }
  if (!data.user) {
    return { error: "Não deu pra criar a conta. Tenta de novo." };
  }

  if (!data.session) {
    return { message: "Conta criada! Verifica seu e-mail pra confirmar antes de entrar." };
  }

  // se a recepção já tinha um cadastro desse paciente (CPF + nascimento
  // batendo) sem login vinculado, herda esse registro em vez de duplicar
  const { data: claimed } = await supabase.rpc("claim_patient_record", {
    p_cpf: cpf,
    p_birth_date: birthDate,
  });

  if (!claimed) {
    await supabase.from("patients").insert({
      user_id: data.user.id,
      full_name: fullName,
      cpf,
      birth_date: birthDate,
      phone: phone || null,
      email,
    });
  }

  redirect(redirectTo);
}
