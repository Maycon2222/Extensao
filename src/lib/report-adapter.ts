/**
 * Adaptador entre tipos do banco (Prisma) e tipo usado pelos componentes.
 *
 * O tipo `Report` usado pelos componentes foi inicialmente desenhado para mock data.
 * Este adaptador converte o formato do banco (enums em UPPERCASE) pra esse formato.
 */

import type {
  Report as DbReport,
  FraudCategory as DbFraudCategory,
  IdentifierType as DbIdentifierType,
  RiskLevel as DbRiskLevel,
  ReputationTier as DbReputationTier,
} from "@/generated/prisma";
import type { Report } from "@/lib/mock-data";
import type { FraudCategoryId } from "@/lib/categories";
import type { RiskLevel } from "@/lib/utils";

const CATEGORY_MAP: Record<DbFraudCategory, FraudCategoryId> = {
  PHISHING: "phishing",
  SMS: "sms",
  FAKE_PROFILE: "fake-profile",
  MARKETPLACE: "marketplace",
  FAKE_BOLETO: "fake-boleto",
  PIX: "pix",
  CLONE_SITE: "clone-site",
  CALL: "call",
  MALICIOUS_APP: "malicious-app",
};

const RISK_MAP: Record<DbRiskLevel, RiskLevel> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

const IDENTIFIER_MAP: Record<DbIdentifierType, "phone" | "url" | "cnpj"> = {
  PHONE: "phone",
  URL: "url",
  CNPJ: "cnpj",
};

const REPUTATION_MAP: Record<
  DbReputationTier,
  "Bronze" | "Prata" | "Ouro" | "Diamante"
> = {
  BRONZE: "Bronze",
  PRATA: "Prata",
  OURO: "Ouro",
  DIAMANTE: "Diamante",
};

/**
 * Converte Report do Prisma + author para o formato usado pelos componentes.
 * IMPORTANTE: sempre usa `identifierRaw` aqui — cabe a UI mascarar antes de exibir.
 */
export function adaptReport(
  dbReport: DbReport & {
    author: { id: string; username: string; reputationTier: DbReputationTier };
  }
): Report {
  return {
    id: dbReport.id,
    category: CATEGORY_MAP[dbReport.category],
    identifier: dbReport.identifierRaw,
    identifierType: IDENTIFIER_MAP[dbReport.identifierType],
    description: dbReport.description,
    location: dbReport.location,
    createdAt: dbReport.createdAt,
    votesUp: dbReport.votesUp,
    votesDown: dbReport.votesDown,
    comments: dbReport.commentCount,
    riskLevel: RISK_MAP[dbReport.riskLevel],
    verified: dbReport.verified,
    author: {
      username: dbReport.author.username,
      reputation: REPUTATION_MAP[dbReport.author.reputationTier],
    },
  };
}

/**
 * Inverso: frontend enum → Prisma enum (para criar denúncias).
 */
export function categoryToDb(id: FraudCategoryId): DbFraudCategory {
  const inverse = Object.entries(CATEGORY_MAP).find(
    ([, v]) => v === id
  )?.[0] as DbFraudCategory | undefined;
  return inverse ?? "PHISHING";
}

export function identifierTypeToDb(
  t: "phone" | "url" | "cnpj"
): DbIdentifierType {
  return t === "phone" ? "PHONE" : t === "cnpj" ? "CNPJ" : "URL";
}
