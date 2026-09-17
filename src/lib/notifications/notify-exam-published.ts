import { createAdminClient } from "@/lib/supabase/admin";
import { sendPushToUser } from "./push";

/** Cria a notificação in-app (sino do portal) e dispara o push pro
 * paciente quando um resultado de exame é publicado. Best-effort: erro
 * aqui não pode derrubar o fluxo de publicar o exame, então engole tudo. */
export async function notifyExamResultPublished(examResultId: string): Promise<void> {
  try {
    const admin = createAdminClient();

    const { data: result } = await admin
      .from("exam_results")
      .select("patient_id, exam_id")
      .eq("id", examResultId)
      .maybeSingle();
    if (!result) return;

    const [{ data: patient }, { data: exam }] = await Promise.all([
      admin.from("patients").select("user_id, full_name").eq("id", result.patient_id).maybeSingle(),
      admin.from("exams").select("name").eq("id", result.exam_id).maybeSingle(),
    ]);

    if (!patient?.user_id) return;

    const examName = exam?.name ?? "exame";
    const title = "Seu exame está disponível";
    const body = `O resultado de ${examName} já está disponível no portal.`;

    await admin.from("notifications").insert({
      user_id: patient.user_id,
      type: "RESULTADO_DISPONIVEL",
      title,
      body,
      related_exam_result_id: examResultId,
    });

    await sendPushToUser(patient.user_id, { title, body, url: "/portal/exames" });
  } catch (err) {
    console.error("notifyExamResultPublished failed:", err);
  }
}
