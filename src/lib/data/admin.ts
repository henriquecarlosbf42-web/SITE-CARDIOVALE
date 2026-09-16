import { createClient } from "@/lib/supabase/server";
import type {
  Appointments as Appointment,
  Doctors as Doctor,
  Exams as Exam,
  InsurancePlans as InsurancePlan,
  Patients as Patient,
  Specialties as Specialty,
  Users as AppUser,
} from "@/types/database";

export interface DashboardCounts {
  patients: number;
  doctors: number;
  appointmentsToday: number;
  examResultsDraft: number;
}

function todayRangeIso() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  const supabase = await createClient();
  const { start, end } = todayRangeIso();

  const [patients, doctors, appointmentsToday, examResultsDraft] = await Promise.all([
    supabase.from("patients").select("id", { count: "exact", head: true }),
    supabase.from("doctors").select("id", { count: "exact", head: true }),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .gte("scheduled_at", start)
      .lt("scheduled_at", end),
    supabase.from("exam_results").select("id", { count: "exact", head: true }).eq("status", "RASCUNHO"),
  ]);

  return {
    patients: patients.count ?? 0,
    doctors: doctors.count ?? 0,
    appointmentsToday: appointmentsToday.count ?? 0,
    examResultsDraft: examResultsDraft.count ?? 0,
  };
}

export async function getAllPatients(): Promise<Patient[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("patients").select("*").order("full_name");
  return data ?? [];
}

export async function getPatientByIdAdmin(id: string): Promise<Patient | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("patients").select("*").eq("id", id).maybeSingle();
  return data;
}

export interface DoctorWithProfile extends Doctor {
  fullName: string;
  email: string | null;
}

export async function getAllDoctors(): Promise<DoctorWithProfile[]> {
  const supabase = await createClient();
  const { data: doctors } = await supabase.from("doctors").select("*").order("created_at", { ascending: false });
  if (!doctors || doctors.length === 0) return [];

  const { data: users } = await supabase
    .from("users")
    .select("id, full_name")
    .in(
      "id",
      doctors.map((d) => d.user_id),
    );
  const nameById = new Map((users ?? []).map((u) => [u.id, u.full_name]));

  return doctors.map((doctor) => ({ ...doctor, fullName: nameById.get(doctor.user_id) ?? "—", email: null }));
}

export async function getDoctorByIdAdmin(id: string): Promise<DoctorWithProfile | null> {
  const supabase = await createClient();
  const { data: doctor } = await supabase.from("doctors").select("*").eq("id", id).maybeSingle();
  if (!doctor) return null;
  const { data: user } = await supabase.from("users").select("full_name").eq("id", doctor.user_id).maybeSingle();
  return { ...doctor, fullName: user?.full_name ?? "—", email: null };
}

export async function getAllSpecialties(): Promise<Specialty[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("specialties").select("*").order("name");
  return data ?? [];
}

export async function getAllExams(): Promise<Exam[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("exams").select("*").order("name");
  return data ?? [];
}

export async function getExamByIdAdmin(id: string): Promise<Exam | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("exams").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAllInsurancePlans(): Promise<InsurancePlan[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("insurance_plans").select("*").order("name");
  return data ?? [];
}

export async function getAllAppointmentsAdmin(): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("appointments").select("*").order("scheduled_at", { ascending: false });
  return data ?? [];
}

export async function getAllUsers(): Promise<AppUser[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("users").select("*").order("full_name");
  return data ?? [];
}
