"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CatalogFormState {
  error?: string;
}

export async function createSpecialty(
  _prevState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Preenche o nome." };

  const { error } = await supabase.from("specialties").insert({ name });
  if (error) {
    return { error: error.code === "23505" ? "Já existe uma especialidade com esse nome." : "Não deu pra salvar." };
  }

  revalidatePath("/admin/cadastros");
  return {};
}

export async function toggleSpecialtyActive(id: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("specialties").update({ active }).eq("id", id);
  revalidatePath("/admin/cadastros");
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createExam(_prevState: CatalogFormState, formData: FormData): Promise<CatalogFormState> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return { error: "Preenche o nome." };

  const { error } = await supabase.from("exams").insert({
    name,
    slug: slugify(name),
    summary: summary || null,
    description: description || null,
  });
  if (error) {
    return { error: error.code === "23505" ? "Já existe um exame com esse nome." : "Não deu pra salvar." };
  }

  revalidatePath("/admin/cadastros");
  revalidatePath("/");
  return {};
}

export async function updateExam(
  id: string,
  _prevState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return { error: "Preenche o nome." };

  const { error } = await supabase
    .from("exams")
    .update({ name, summary: summary || null, description: description || null })
    .eq("id", id);
  if (error) {
    return { error: error.code === "23505" ? "Já existe um exame com esse nome." : "Não deu pra salvar." };
  }

  revalidatePath("/admin/cadastros");
  revalidatePath("/");
  return {};
}

export async function toggleExamActive(id: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("exams").update({ active }).eq("id", id);
  revalidatePath("/admin/cadastros");
  revalidatePath("/");
}

export async function createInsurancePlan(
  _prevState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Preenche o nome." };

  const { error } = await supabase.from("insurance_plans").insert({ name });
  if (error) {
    return { error: error.code === "23505" ? "Já existe um convênio com esse nome." : "Não deu pra salvar." };
  }

  revalidatePath("/admin/cadastros");
  return {};
}

export async function toggleInsurancePlanActive(id: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("insurance_plans").update({ active }).eq("id", id);
  revalidatePath("/admin/cadastros");
}
