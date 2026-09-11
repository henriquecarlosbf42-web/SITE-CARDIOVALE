import { createClient } from "@/lib/supabase/server";
import type {
  Appointments as Appointment,
  ExamResults as ExamResult,
  MedicalDocuments as MedicalDocument,
  Notifications as Notification,
  Patients as Patient,
  Prescriptions as Prescription,
} from "@/types/database";

export async function getPatientRecord(): Promise<Patient | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("patients").select("*").maybeSingle();
  return data;
}

/** id do médico -> nome + CRM. Consultada uma vez e reaproveitada nas páginas do portal. */
export async function getDoctorDirectory(): Promise<Map<string, { fullName: string; crm: string }>> {
  const supabase = await createClient();
  const { data: doctors } = await supabase.from("doctors").select("id, crm, user_id");
  if (!doctors || doctors.length === 0) return new Map();

  const { data: users } = await supabase
    .from("users")
    .select("id, full_name")
    .in(
      "id",
      doctors.map((d) => d.user_id),
    );
  const nameById = new Map((users ?? []).map((u) => [u.id, u.full_name]));

  return new Map(
    doctors.map((d) => [d.id, { fullName: nameById.get(d.user_id) ?? "Médico(a)", crm: d.crm }]),
  );
}

export async function getInsurancePlanName(id: string | null): Promise<string | null> {
  if (!id) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("insurance_plans").select("name").eq("id", id).maybeSingle();
  return data?.name ?? null;
}

export async function getExamsDirectory(): Promise<Map<string, string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("exams").select("id, name");
  return new Map((data ?? []).map((e) => [e.id, e.name]));
}

export async function getAppointmentStatuses(): Promise<Map<string, { label: string; color: string | null }>> {
  const supabase = await createClient();
  const { data } = await supabase.from("appointment_status").select("code, label, color");
  return new Map((data ?? []).map((s) => [s.code, { label: s.label, color: s.color }]));
}

export async function getAppointments(patientId: string): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId)
    .order("scheduled_at", { ascending: false });
  return data ?? [];
}

export async function getExamResults(patientId: string): Promise<ExamResult[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exam_results")
    .select("*")
    .eq("patient_id", patientId)
    .order("exam_date", { ascending: false });
  return data ?? [];
}

export async function getSignedDocumentUrl(filePath: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from("medical-documents")
    .createSignedUrl(filePath, 60 * 10); // 10 minutos
  return data?.signedUrl ?? null;
}

export async function getDocumentsByExamResult(examResultIds: string[]): Promise<MedicalDocument[]> {
  if (examResultIds.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("medical_documents")
    .select("*")
    .in("exam_result_id", examResultIds)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getPrescriptions(patientId: string): Promise<Prescription[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("prescriptions")
    .select("*")
    .eq("patient_id", patientId)
    .order("issued_at", { ascending: false });
  return data ?? [];
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}
