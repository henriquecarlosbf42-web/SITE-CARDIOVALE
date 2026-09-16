import { createClient } from "@/lib/supabase/server";

export interface PublicExam {
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
}

/** Exames ativos, pra exibir no site público — reflete direto o que é
 * cadastrado em Painel administrativo > Cadastros > Exames. */
export async function getPublicExams(): Promise<PublicExam[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exams")
    .select("slug, name, summary, description")
    .eq("active", true)
    .order("name");
  return data ?? [];
}
