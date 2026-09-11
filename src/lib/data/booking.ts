import { createClient } from "@/lib/supabase/server";

export interface SpecialtyOption {
  id: string;
  name: string;
}

export interface ExamOption {
  id: string;
  name: string;
}

export interface DoctorOption {
  id: string;
  fullName: string;
  crm: string;
  specialtyId: string | null;
}

export interface InsurancePlanOption {
  id: string;
  name: string;
}

export async function getSpecialtiesForBooking(): Promise<SpecialtyOption[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("specialties").select("id, name").eq("active", true).order("name");
  return data ?? [];
}

export async function getExamsForBooking(): Promise<ExamOption[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("exams").select("id, name").eq("active", true).order("name");
  return data ?? [];
}

export async function getDoctorsForBooking(): Promise<DoctorOption[]> {
  const supabase = await createClient();
  const { data: doctors } = await supabase
    .from("doctors")
    .select("id, crm, specialty_id, user_id")
    .eq("active", true);

  if (!doctors || doctors.length === 0) return [];

  const { data: users } = await supabase
    .from("users")
    .select("id, full_name")
    .in(
      "id",
      doctors.map((doctor) => doctor.user_id),
    );
  const nameById = new Map((users ?? []).map((user) => [user.id, user.full_name]));

  return doctors.map((doctor) => ({
    id: doctor.id,
    fullName: nameById.get(doctor.user_id) ?? "Médico(a)",
    crm: doctor.crm,
    specialtyId: doctor.specialty_id,
  }));
}

export async function getInsurancePlansForBooking(): Promise<InsurancePlanOption[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("insurance_plans").select("id, name").eq("active", true).order("name");
  return data ?? [];
}
