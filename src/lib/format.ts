// Fuso fixo da clínica (São José dos Campos/SP) — evita que o horário
// exibido varie conforme o fuso do servidor onde o código roda.
const CLINIC_TIME_ZONE = "America/Sao_Paulo";

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: CLINIC_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Quebra um timestamptz em data/hora separadas no fuso da clínica, pra
 * pré-preencher formulários de edição — usa Intl em vez dos getters do
 * Date (que refletem o fuso do processo do servidor, não o de Brasília).
 */
export function toClinicDateAndTime(iso: string): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CLINIC_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

export function findNextByDate<T>(items: T[], getIso: (item: T) => string): T | undefined {
  const now = Date.now();
  return items
    .filter((item) => new Date(getIso(item)).getTime() >= now)
    .sort((a, b) => new Date(getIso(a)).getTime() - new Date(getIso(b)).getTime())[0];
}

const TITLE_PREFIX = /^(dr\.?|dra\.?|dr\(a\)\.?)$/i;

/**
 * Nome curto pra saudação/cabeçalho: "Dr. João" (título + primeiro nome,
 * se o full_name já tiver um título tipo "Dr."/"Dra." embutido) ou só o
 * primeiro nome ("Maira") quando não tiver.
 */
export function firstName(fullName: string): string {
  const words = fullName.trim().split(/\s+/);
  if (words.length > 1 && TITLE_PREFIX.test(words[0])) {
    return `${words[0]} ${words[1]}`;
  }
  return words[0] ?? fullName;
}

export function formatCpf(digits: string): string {
  const clean = digits.replace(/\D/g, "");
  const parts = [clean.slice(0, 3), clean.slice(3, 6), clean.slice(6, 9)].filter(Boolean);
  let formatted = parts.join(".");
  if (clean.length > 9) formatted += `-${clean.slice(9, 11)}`;
  return formatted;
}

export function formatDate(iso: string): string {
  // colunas "date" puras (sem hora) vêm como "YYYY-MM-DD" — o construtor
  // Date interpreta esse formato como meia-noite UTC, o que "puxa" a data
  // um dia pra trás em qualquer fuso atrás de UTC (ex: Brasil). Forçando
  // meia-noite LOCAL evita esse deslocamento.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  const date = dateOnly ? new Date(`${iso}T00:00:00`) : new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    timeZone: dateOnly ? undefined : CLINIC_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
