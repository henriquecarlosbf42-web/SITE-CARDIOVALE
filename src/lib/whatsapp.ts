import { clinic } from "@/lib/data/clinic";
import { firstName, formatCpf } from "@/lib/format";

/** Monta um link wa.me a partir de um telefone brasileiro em qualquer
 * formato ("(12) 90000-0000", "12900000000"...) — retorna null se não
 * tiver dígitos suficientes pra ser um número válido. */
export function whatsappHref(phone: string, message: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;

  const withCountry = digits.length >= 12 ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

/** Mensagem padrão avisando que um resultado de exame foi publicado. */
export function examReadyMessage(params: { patientName: string; examName: string; examDate: string }): string {
  const { patientName, examName, examDate } = params;
  return [
    `Olá, ${firstName(patientName)}. Aqui é da ${clinic.name} (${clinic.legalName}).`,
    "",
    `O resultado do seu exame de ${examName}, realizado em ${examDate}, já está disponível no portal do paciente.`,
    "",
    `Acesse: ${clinic.siteUrl}/login`,
    "",
    "Qualquer dúvida, estamos à disposição.",
  ].join("\n");
}

/** Mensagem com os dados de acesso de uma conta criada pelo médico. */
export function accessCredentialsMessage(params: { patientName: string; cpf: string; password: string }): string {
  const { patientName, cpf, password } = params;
  return [
    `Olá, ${firstName(patientName)}. Aqui é da ${clinic.name} (${clinic.legalName}).`,
    "",
    "Seu acesso ao portal do paciente foi criado. Seguem os dados de entrada:",
    "",
    `CPF: ${formatCpf(cpf)}`,
    `Senha provisória: ${password}`,
    "",
    `Acesse em: ${clinic.siteUrl}/login`,
    "",
    "No primeiro acesso você vai precisar criar uma senha própria, por segurança.",
  ].join("\n");
}
