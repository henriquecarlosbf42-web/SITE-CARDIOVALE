"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { notifyExamResultPublished } from "@/lib/notifications/notify-exam-published";

export interface ExamResultFormState {
  error?: string;
  success?: {
    patientId: string;
    patientName: string;
    phone: string | null;
    examName: string;
    examDate: string;
  };
}

async function requireDoctorId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: doctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  return doctor?.id ?? null;
}

export async function createExamResult(
  _prevState: ExamResultFormState,
  formData: FormData,
): Promise<ExamResultFormState> {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return { error: "Cadastro de médico não encontrado." };

  const patientId = String(formData.get("patient_id") ?? "");
  const examId = String(formData.get("exam_id") ?? "");
  const examDate = String(formData.get("exam_date") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  const publish = formData.get("intent") === "publish";

  if (!patientId || !examId || !examDate) {
    return { error: "Preenche paciente, exame e data." };
  }

  const { data: examResult, error: insertError } = await supabase
    .from("exam_results")
    .insert({
      patient_id: patientId,
      exam_id: examId,
      doctor_id: doctorId,
      exam_date: examDate,
      notes: notes || null,
      status: publish ? "PUBLICADO" : "RASCUNHO",
      released_at: publish ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (insertError || !examResult) {
    return { error: "Não deu pra salvar o resultado. Tenta de novo." };
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  for (const file of files) {
    const path = `${patientId}/${examResult.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("medical-documents")
      .upload(path, file, { contentType: file.type || undefined });

    if (!uploadError) {
      await supabase.from("medical_documents").insert({
        exam_result_id: examResult.id,
        file_path: path,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
      });
    }
  }

  revalidatePath(`/medico/pacientes/${patientId}`);

  if (publish) {
    await notifyExamResultPublished(examResult.id);

    const [{ data: patient }, { data: exam }] = await Promise.all([
      supabase.from("patients").select("full_name, phone").eq("id", patientId).maybeSingle(),
      supabase.from("exams").select("name").eq("id", examId).maybeSingle(),
    ]);

    return {
      success: {
        patientId,
        patientName: patient?.full_name ?? "",
        phone: patient?.phone ?? null,
        examName: exam?.name ?? "exame",
        examDate,
      },
    };
  }

  redirect(`/medico/pacientes/${patientId}`);
}

export async function publishExamResult(examResultId: string, patientId: string) {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return;

  await supabase
    .from("exam_results")
    .update({ status: "PUBLICADO", released_at: new Date().toISOString() })
    .eq("id", examResultId)
    .eq("doctor_id", doctorId);

  await notifyExamResultPublished(examResultId);

  revalidatePath(`/medico/pacientes/${patientId}`);
}

export async function updateExamResult(
  examResultId: string,
  patientId: string,
  _prevState: ExamResultFormState,
  formData: FormData,
): Promise<ExamResultFormState> {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return { error: "Cadastro de médico não encontrado." };

  const examId = String(formData.get("exam_id") ?? "");
  const examDate = String(formData.get("exam_date") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  const publish = formData.get("intent") === "publish";

  if (!examId || !examDate) {
    return { error: "Preenche exame e data." };
  }

  const { error } = await supabase
    .from("exam_results")
    .update({
      exam_id: examId,
      exam_date: examDate,
      notes: notes || null,
      status: publish ? "PUBLICADO" : "RASCUNHO",
      released_at: publish ? new Date().toISOString() : null,
    })
    .eq("id", examResultId)
    .eq("doctor_id", doctorId);

  if (error) {
    return { error: "Não deu pra salvar as alterações. Tenta de novo." };
  }

  revalidatePath(`/medico/pacientes/${patientId}`);
  redirect(`/medico/pacientes/${patientId}`);
}

export async function deleteExamResult(examResultId: string, patientId: string) {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return;

  const { data: docs } = await supabase
    .from("medical_documents")
    .select("file_path")
    .eq("exam_result_id", examResultId);

  if (docs && docs.length > 0) {
    await supabase.storage.from("medical-documents").remove(docs.map((doc) => doc.file_path));
  }

  await supabase.from("medical_documents").delete().eq("exam_result_id", examResultId);
  await supabase.from("exam_results").delete().eq("id", examResultId).eq("doctor_id", doctorId);

  revalidatePath(`/medico/pacientes/${patientId}`);
}

export async function addExamDocument(examResultId: string, patientId: string, formData: FormData) {
  const supabase = await createClient();
  const doctorId = await requireDoctorId(supabase);
  if (!doctorId) return;

  const { data: examResult } = await supabase
    .from("exam_results")
    .select("id, patient_id")
    .eq("id", examResultId)
    .eq("doctor_id", doctorId)
    .maybeSingle();
  if (!examResult) return;

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  for (const file of files) {
    const path = `${examResult.patient_id}/${examResultId}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("medical-documents")
      .upload(path, file, { contentType: file.type || undefined, upsert: true });

    if (!uploadError) {
      await supabase.from("medical_documents").insert({
        exam_result_id: examResultId,
        file_path: path,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
      });
    }
  }

  revalidatePath(`/medico/pacientes/${patientId}`);
}
