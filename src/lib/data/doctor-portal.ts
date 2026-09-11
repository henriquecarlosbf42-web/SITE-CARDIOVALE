import { createClient } from "@/lib/supabase/server";
import type {
  Appointments as Appointment,
  Doctors as Doctor,
  ExamResults as ExamResult,
  Patients as Patient,
  Prescriptions as Prescription,
} from "@/types/database";

export async function getDoctorRecord(): Promise<Doctor | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // filtro explícito por user_id: sem ele, a policy "authenticated read
  // active doctors" (que existe pra mostrar nome de médico nas consultas
  // do paciente) faz esse select trazer TODOS os médicos ativos, não só
  // o logado, e o .maybeSingle() quebra com mais de uma linha.
  const { data } = await supabase.from("doctors").select("*").eq("user_id", user.id).maybeSingle();
  return data;
}

export async function getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("scheduled_at", { ascending: false });
  return data ?? [];
}

/** Pacientes distintos que já têm consulta (passada ou futura) com esse médico. */
export async function getDoctorPatients(doctorId: string): Promise<Patient[]> {
  const supabase = await createClient();
  const { data: appts } = await supabase
    .from("appointments")
    .select("patient_id")
    .eq("doctor_id", doctorId);

  const patientIds = [...new Set((appts ?? []).map((a) => a.patient_id))];
  if (patientIds.length === 0) return [];

  const { data } = await supabase.from("patients").select("*").in("id", patientIds).order("full_name");
  return data ?? [];
}

export async function getPatientById(patientId: string): Promise<Patient | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("patients").select("*").eq("id", patientId).maybeSingle();
  return data;
}

export async function getPatientAppointments(patientId: string): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId)
    .order("scheduled_at", { ascending: false });
  return data ?? [];
}

export async function getPatientExamResults(patientId: string): Promise<ExamResult[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exam_results")
    .select("*")
    .eq("patient_id", patientId)
    .order("exam_date", { ascending: false });
  return data ?? [];
}

export async function getAppointmentById(appointmentId: string): Promise<Appointment | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("appointments").select("*").eq("id", appointmentId).maybeSingle();
  return data;
}

export async function getExamResultById(examResultId: string): Promise<ExamResult | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("exam_results").select("*").eq("id", examResultId).maybeSingle();
  return data;
}

export async function getPrescriptionById(prescriptionId: string): Promise<Prescription | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("prescriptions").select("*").eq("id", prescriptionId).maybeSingle();
  return data;
}

export async function getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("prescriptions")
    .select("*")
    .eq("patient_id", patientId)
    .order("issued_at", { ascending: false });
  return data ?? [];
}
