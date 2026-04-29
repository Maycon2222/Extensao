/**
 * Normalizacao de identificadores para matching consistente no banco.
 *
 * REGRA: sempre armazene o valor normalizado e compare por ele.
 * A exibição pública usa sempre a versao mascarada (ver @/lib/utils).
 */

/**
 * Normaliza telefone brasileiro para o formato de 13 digitos 55DDD9XXXXXXXX.
 * Aceita varios formatos: (11)99999-9999, +5511999999999, 11999999999, etc.
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  // já vem com 55 (12 ou 13 digitos)
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }

  // sem código país (10 ou 11 digitos)
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits; // retorna como está, tratamento fica no caller
}

/**
 * Normaliza CNPJ: apenas digitos, valida comprimento.
 */
export function normalizeCnpj(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 14) return digits;
  return digits;
}

/**
 * Normaliza URL para o hostname minusculo (sem www, sem path, sem query).
 * Facilita matching entre variantes do mesmo domínio.
 */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    let host = url.hostname;
    if (host.startsWith("www.")) host = host.slice(4);
    return host;
  } catch {
    return trimmed.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

/**
 * Normaliza um identificador baseado no tipo.
 */
export function normalizeIdentifier(
  type: "PHONE" | "URL" | "CNPJ",
  raw: string
): string {
  switch (type) {
    case "PHONE":
      return normalizePhone(raw);
    case "CNPJ":
      return normalizeCnpj(raw);
    case "URL":
      return normalizeUrl(raw);
  }
}

/**
 * Valida se um identificador normalizado e valido para o tipo.
 */
export function isValidIdentifier(
  type: "PHONE" | "URL" | "CNPJ",
  normalized: string
): { valid: boolean; reason?: string } {
  switch (type) {
    case "PHONE":
      if (normalized.length < 12 || normalized.length > 13) {
        return { valid: false, reason: "Telefone deve ter 10 ou 11 digitos (+ DDD)" };
      }
      return { valid: true };
    case "CNPJ":
      if (normalized.length !== 14) {
        return { valid: false, reason: "CNPJ deve ter 14 digitos" };
      }
      return { valid: true };
    case "URL":
      if (normalized.length < 3 || !normalized.includes(".")) {
        return { valid: false, reason: "URL inválida" };
      }
      return { valid: true };
  }
}
