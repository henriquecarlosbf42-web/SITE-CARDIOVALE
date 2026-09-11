"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function cancelAppointmentAdmin(appointmentId: string) {
  const supabase = await createClient();
  await supabase.from("appointments").update({ status_code: "CANCELADA" }).eq("id", appointmentId);
  revalidatePath("/admin/agenda");
}

export async function deleteAppointmentAdmin(appointmentId: string) {
  const supabase = await createClient();
  await supabase.from("appointments").delete().eq("id", appointmentId);
  revalidatePath("/admin/agenda");
}
