/**
 * Algoritmo de credibilidade e nivel de risco.
 *
 * Princípios:
 * - Voto tem peso variavel conforme reputação do votante.
 * - Denúncia nova comeca com credibilidade neutra, não negativa.
 * - Decay temporal: votos mais recentes pesam ligeiramente mais.
 * - Threshold de verificação requer volume mínimo + consenso.
 */

import type { ReputationTier, RiskLevel } from "@/generated/prisma";

/**
 * Peso do voto baseado na reputação do votante.
 * Ouro/Diamante votam com mais peso por já terem histórico confirmado.
 */
export function voteWeightForTier(tier: ReputationTier): number {
  switch (tier) {
    case "DIAMANTE":
      return 3.0;
    case "OURO":
      return 2.0;
    case "PRATA":
      return 1.25;
    case "BRONZE":
    default:
      return 1.0;
  }
}

/**
 * Calcula a reputação de usuário baseada em estatísticas.
 */
export function computeReputationTier(stats: {
  reportsPublished: number;
  reportsVerified: number;
  votesCorrect: number;
  accountAgeDays: number;
}): ReputationTier {
  const { reportsPublished, reportsVerified, votesCorrect, accountAgeDays } = stats;

  if (
    reportsVerified >= 20 &&
    votesCorrect >= 200 &&
    accountAgeDays >= 180
  ) {
    return "DIAMANTE";
  }
  if (
    reportsVerified >= 5 &&
    votesCorrect >= 50 &&
    accountAgeDays >= 60
  ) {
    return "OURO";
  }
  if (reportsPublished >= 3 && votesCorrect >= 10 && accountAgeDays >= 14) {
    return "PRATA";
  }
  return "BRONZE";
}

/**
 * Calcula score de credibilidade (0-100) de uma denúncia.
 *
 * Leva em conta:
 * - Total ponderado de votos "confirmar" vs "falso alerta"
 * - Volume total de votos (mais votos = mais confiança)
 * - Usando Wilson score lower bound para evitar overconfidence com poucos votos
 */
export function computeCredibilityScore(
  weightedConfirm: number,
  weightedFalse: number
): number {
  const total = weightedConfirm + weightedFalse;
  if (total === 0) return 50; // neutro quando não há votos

  const p = weightedConfirm / total;
  const z = 1.96; // 95% confidence
  const denominator = 1 + (z * z) / total;
  const center = (p + (z * z) / (2 * total)) / denominator;
  const margin =
    (z * Math.sqrt((p * (1 - p)) / total + (z * z) / (4 * total * total))) /
    denominator;

  const wilsonLower = Math.max(0, center - margin);
  return Math.round(wilsonLower * 100);
}

/**
 * Mapeia score de credibilidade + volume total para nivel de risco.
 */
export function computeRiskLevel(
  credibilityScore: number,
  totalWeightedVotes: number,
  relatedReportsCount: number
): RiskLevel {
  // Muito poucos votos e sem relatos similares = risco baixo por padrão
  if (totalWeightedVotes < 3 && relatedReportsCount < 2) return "LOW";

  const combined =
    credibilityScore * 0.7 +
    Math.min(totalWeightedVotes, 50) * 0.2 +
    Math.min(relatedReportsCount * 5, 30) * 0.1;

  if (combined >= 75) return "CRITICAL";
  if (combined >= 55) return "HIGH";
  if (combined >= 30) return "MEDIUM";
  return "LOW";
}

/**
 * Determina se denúncia deve ser marcada como "verificada".
 */
export function shouldBeVerified(
  credibilityScore: number,
  totalWeightedVotes: number
): boolean {
  return credibilityScore >= 70 && totalWeightedVotes >= 10;
}
