import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/permissions/roles";

export interface CurrentUser {
  id: string;
  email: string | null;
  role: Role;
  fullName: string;
  mustChangePassword: boolean;
}

/**
 * Usuário autenticado + papel (tabela `users`). Retorna null se não
 * houver sessão ou se a linha em `users` ainda não existir (perfil
 * criado depois do primeiro login, ou por um admin).
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name, must_change_password")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    role: profile.role as Role,
    fullName: profile.full_name,
    mustChangePassword: profile.must_change_password,
  };
}
