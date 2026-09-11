"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient();
  await supabase.from("users").update({ role }).eq("id", userId);
  revalidatePath("/admin/usuarios");
}

export async function toggleUserActive(userId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("users").update({ active }).eq("id", userId);
  revalidatePath("/admin/usuarios");
}
