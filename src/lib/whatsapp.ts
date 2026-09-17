/** Monta um link wa.me a partir de um telefone brasileiro em qualquer
 * formato ("(12) 90000-0000", "12900000000"...) — retorna null se não
 * tiver dígitos suficientes pra ser um número válido. */
export function whatsappHref(phone: string, message: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;

  const withCountry = digits.length >= 12 ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}
