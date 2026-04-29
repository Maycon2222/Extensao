import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Mascara telefone: apenas DDD + primeiros 1 digito + últimos 4 digitos visiveis.
 * Ex: (11) 99999-3456 vira (11) 9XXXX-3456
 */
export function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return raw;
  const ddd = digits.slice(0, 2);
  const first = digits.slice(2, 3);
  const last4 = digits.slice(-4);
  const middleLen = digits.length - 2 - 1 - 4;
  const stars = "*".repeat(Math.max(middleLen, 4));
  return `(${ddd}) ${first}${stars}-${last4}`;
}

/**
 * Mascara CNPJ: preserva primeiros 2 e últimos 4 digitos.
 * Ex: 12.345.678 barra 0001-90 vira 12.XXX.XXX barra XXX1-90
 */
export function maskCnpj(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 14) return raw;
  return `${digits.slice(0, 2)}.***.***/***${digits.slice(11, 12)}-${digits.slice(12, 14)}`;
}

/**
 * Mascara URL: mantem domínio principal, oculta parametros e subpath.
 */
export function maskUrl(raw: string): string {
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return url.hostname;
  } catch {
    return raw;
  }
}

/**
 * Detecta automaticamente o tipo de identificador a partir do texto.
 */
export function detectIdentifierType(
  raw: string
): "phone" | "url" | "cnpj" | "unknown" {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (
    /^https?:\/\//i.test(trimmed) ||
    /^[a-z0-9-]+(\.[a-z]{2,})+/i.test(trimmed)
  ) {
    return "url";
  }
  if (digits.length === 14) return "cnpj";
  if (digits.length >= 10 && digits.length <= 13) return "phone";
  return "unknown";
}

/**
 * Formata "tempo atrás" em portugues.
 */
export function timeAgo(date: Date | string): string {
  const then = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "segundos"],
    [60, "minutos"],
    [24, "horas"],
    [30, "dias"],
    [12, "meses"],
    [Number.POSITIVE_INFINITY, "anos"],
  ];

  let value = seconds;
  let unit = "segundos";

  for (const [divisor, label] of intervals) {
    if (value < divisor) {
      unit = label;
      break;
    }
    value = Math.floor(value / divisor);
    unit = label;
  }

  if (value < 1) return "agora mesmo";

  // singular
  const singular: Record<string, string> = {
    segundos: "segundo",
    minutos: "minuto",
    horas: "hora",
    dias: "dia",
    meses: "mês",
    anos: "ano",
  };
  const label = value === 1 ? singular[unit] ?? unit : unit;
  return `há ${value} ${label}`;
}

/**
 * Formata número grande em estilo pt-BR abreviado.
 * 1234 -> 1,2 mil  |  12345 -> 12,3 mil  |  1234567 -> 1,2 mi
 */
export function formatCompactNumber(value: number): string {
  if (value < 1000) return value.toString();
  if (value < 1_000_000) {
    const thousands = value / 1000;
    return `${thousands.toFixed(thousands < 10 ? 1 : 0).replace(".", ",")} mil`;
  }
  const millions = value / 1_000_000;
  return `${millions.toFixed(1).replace(".", ",")} mi`;
}

/**
 * Calcula nivel de risco baseado em votos confirmados e número de denúncias.
 */
export type RiskLevel = "low" | "medium" | "high" | "critical";

export function calculateRiskLevel(
  confirmedVotes: number,
  totalReports: number
): RiskLevel {
  const score = confirmedVotes + totalReports * 2;
  if (score >= 100) return "critical";
  if (score >= 40) return "high";
  if (score >= 15) return "medium";
  return "low";
}
