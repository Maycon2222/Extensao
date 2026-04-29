import { db } from "@/lib/db";
import {
  computeCredibilityScore,
  computeRiskLevel,
  shouldBeVerified,
  voteWeightForTier,
} from "@/lib/scoring";
import type { Prisma, FraudCategory, RiskLevel } from "@/generated/prisma";
import { normalizeIdentifier, isValidIdentifier } from "@/lib/normalize";
import type { ListReportsInput } from "@/lib/validations/report";

/**
 * Cria uma denúncia, normalizando o identificador.
 */
export async function createReport(input: {
  authorId: string;
  category: FraudCategory;
  identifierType: "PHONE" | "URL" | "CNPJ";
  identifierRaw: string;
  description: string;
  location: string;
  occurredAt: Date;
}) {
  const normalized = normalizeIdentifier(input.identifierType, input.identifierRaw);
  const validation = isValidIdentifier(input.identifierType, normalized);

  if (!validation.valid) {
    throw new Error(validation.reason ?? "Identificador inválido");
  }

  return db.report.create({
    data: {
      authorId: input.authorId,
      category: input.category,
      identifierType: input.identifierType,
      identifierNormalized: normalized,
      identifierRaw: input.identifierRaw,
      description: input.description,
      location: input.location,
      occurredAt: input.occurredAt,
    },
    include: {
      author: {
        select: { id: true, username: true, name: true, reputationTier: true },
      },
    },
  });
}

/**
 * Lista denúncias com filtros e ordenacao.
 */
export async function listReports(params: ListReportsInput) {
  const { categories, risks, period, sort, limit, cursor } = params;

  const where: Prisma.ReportWhereInput = {
    status: "PUBLISHED",
  };

  if (categories.length > 0) {
    where.category = { in: categories };
  }
  if (risks.length > 0) {
    where.riskLevel = { in: risks as RiskLevel[] };
  }
  if (period !== "all") {
    const now = Date.now();
    const hours = period === "24h" ? 24 : period === "7d" ? 24 * 7 : 24 * 30;
    where.createdAt = { gte: new Date(now - hours * 60 * 60 * 1000) };
  }

  const orderBy: Prisma.ReportOrderByWithRelationInput =
    sort === "voted"
      ? { votesUp: "desc" }
      : sort === "risk"
      ? { credibilityScore: "desc" }
      : { createdAt: "desc" };

  const reports = await db.report.findMany({
    where,
    orderBy,
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          reputationTier: true,
        },
      },
      _count: {
        select: { votes: true, comments: true, evidences: true },
      },
    },
  });

  const hasMore = reports.length > limit;
  const items = hasMore ? reports.slice(0, limit) : reports;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return { items, nextCursor };
}

/**
 * Busca uma denúncia por id com dados completos para a página de detalhe.
 */
export async function getReportById(id: string) {
  return db.report.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          reputationTier: true,
          avatarUrl: true,
        },
      },
      comments: {
        where: { hidden: false },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              reputationTier: true,
              avatarUrl: true,
            },
          },
        },
      },
      evidences: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { votes: true, contestations: true } },
    },
  });
}

/**
 * Casts vote: cria/atualiza/remove voto e recalcula stats.
 */
export async function castVote(input: {
  reportId: string;
  userId: string;
  type: "CONFIRM" | "FALSE_ALERT";
  voterTier: "BRONZE" | "PRATA" | "OURO" | "DIAMANTE";
}) {
  const weight = voteWeightForTier(input.voterTier);

  // Toggle: se já votou igual, remove. Se votou diferente, atualiza. Senao, cria.
  const existing = await db.vote.findUnique({
    where: {
      reportId_userId: {
        reportId: input.reportId,
        userId: input.userId,
      },
    },
  });

  let action: "created" | "updated" | "removed" = "created";

  await db.$transaction(async (tx) => {
    if (existing?.type === input.type) {
      await tx.vote.delete({ where: { id: existing.id } });
      action = "removed";
    } else if (existing) {
      await tx.vote.update({
        where: { id: existing.id },
        data: { type: input.type, weight },
      });
      action = "updated";
    } else {
      await tx.vote.create({
        data: {
          reportId: input.reportId,
          userId: input.userId,
          type: input.type,
          weight,
        },
      });
      action = "created";
    }

    // Recalcula stats ponderadas
    const votes = await tx.vote.findMany({ where: { reportId: input.reportId } });
    const weightedConfirm = votes
      .filter((v) => v.type === "CONFIRM")
      .reduce((s, v) => s + v.weight, 0);
    const weightedFalse = votes
      .filter((v) => v.type === "FALSE_ALERT")
      .reduce((s, v) => s + v.weight, 0);

    const credibilityScore = computeCredibilityScore(weightedConfirm, weightedFalse);

    // Procura denúncias com mesmo identifier para amplificar risco
    const report = await tx.report.findUnique({ where: { id: input.reportId } });
    let related = 0;
    if (report) {
      related = await tx.report.count({
        where: {
          identifierNormalized: report.identifierNormalized,
          identifierType: report.identifierType,
          id: { not: report.id },
          status: "PUBLISHED",
        },
      });
    }

    const riskLevel = computeRiskLevel(
      credibilityScore,
      weightedConfirm + weightedFalse,
      related
    );
    const verified = shouldBeVerified(
      credibilityScore,
      weightedConfirm + weightedFalse
    );

    await tx.report.update({
      where: { id: input.reportId },
      data: {
        votesUp: votes.filter((v) => v.type === "CONFIRM").length,
        votesDown: votes.filter((v) => v.type === "FALSE_ALERT").length,
        credibilityScore,
        riskLevel,
        verified,
      },
    });
  });

  return { action };
}

/**
 * Adiciona comentário e incrementa contador cacheado.
 */
export async function addComment(input: {
  reportId: string;
  authorId: string;
  content: string;
}) {
  return db.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        reportId: input.reportId,
        authorId: input.authorId,
        content: input.content,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            reputationTier: true,
            avatarUrl: true,
          },
        },
      },
    });

    await tx.report.update({
      where: { id: input.reportId },
      data: { commentCount: { increment: 1 } },
    });

    return comment;
  });
}

/**
 * Busca por identificador normalizado com agregacao de risco.
 */
export async function searchReports(rawQuery: string) {
  const trimmed = rawQuery.trim();
  const digits = trimmed.replace(/\D/g, "");

  // Detecta tipo pelo input
  const candidates: Array<{
    type: "PHONE" | "URL" | "CNPJ";
    normalized: string;
  }> = [];

  if (digits.length === 14) {
    candidates.push({ type: "CNPJ", normalized: digits });
  }
  if (digits.length >= 10 && digits.length <= 13) {
    candidates.push({
      type: "PHONE",
      normalized: digits.length >= 12 ? digits : `55${digits}`,
    });
  }
  if (
    /^https?:\/\//i.test(trimmed) ||
    /^[a-z0-9-]+(\.[a-z]{2,})+/i.test(trimmed)
  ) {
    const url = trimmed.toLowerCase();
    const hostname =
      url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    candidates.push({ type: "URL", normalized: hostname });
  }

  if (candidates.length === 0) return { matches: [], query: trimmed };

  const matches = await db.report.findMany({
    where: {
      status: "PUBLISHED",
      OR: candidates.map((c) => ({
        identifierType: c.type,
        identifierNormalized: c.normalized,
      })),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: {
        select: { id: true, username: true, reputationTier: true },
      },
    },
  });

  return { matches, query: trimmed };
}

/**
 * Remove dados sensiveis antes de serializar para o cliente.
 * NUNCA exponha identifierRaw no frontend público.
 */
export function sanitizeReport<T extends { identifierRaw?: string }>(
  report: T
): Omit<T, "identifierRaw"> {
  const { identifierRaw: _omit, ...safe } = report;
  void _omit;
  return safe;
}
