import { z } from "zod";

export const FRAUD_CATEGORY = [
  "PHISHING",
  "SMS",
  "FAKE_PROFILE",
  "MARKETPLACE",
  "FAKE_BOLETO",
  "PIX",
  "CLONE_SITE",
  "CALL",
  "MALICIOUS_APP",
] as const;

export const IDENTIFIER_TYPE = ["PHONE", "URL", "CNPJ"] as const;

export const RISK_LEVEL = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export const createReportSchema = z.object({
  category: z.enum(FRAUD_CATEGORY),
  identifierType: z.enum(IDENTIFIER_TYPE),
  identifier: z
    .string()
    .min(3, "Identificador muito curto")
    .max(500, "Identificador muito longo"),
  description: z
    .string()
    .min(30, "Descrição deve ter ao menos 30 caracteres")
    .max(500, "Descrição muito longa"),
  location: z.string().min(2).max(120),
  occurredAt: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"))
    .transform((v) => new Date(v)),
});

export const listReportsSchema = z.object({
  categories: z
    .string()
    .optional()
    .transform((v) =>
      v ? (v.split(",").filter((c) => FRAUD_CATEGORY.includes(c as typeof FRAUD_CATEGORY[number])) as typeof FRAUD_CATEGORY[number][]) : []
    ),
  risks: z
    .string()
    .optional()
    .transform((v) =>
      v ? (v.split(",").filter((r) => RISK_LEVEL.includes(r as typeof RISK_LEVEL[number])) as typeof RISK_LEVEL[number][]) : []
    ),
  period: z.enum(["24h", "7d", "30d", "all"]).optional().default("all"),
  sort: z.enum(["recent", "voted", "risk"]).optional().default("recent"),
  limit: z.coerce.number().int().min(1).max(100).optional().default(30),
  cursor: z.string().optional(),
});

export const voteSchema = z.object({
  type: z.enum(["CONFIRM", "FALSE_ALERT"]),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(5, "Comentário muito curto")
    .max(500, "Máximo 500 caracteres"),
});

export const searchSchema = z.object({
  q: z.string().min(2, "Busca muito curta").max(500),
});

export const contestationSchema = z.object({
  reportId: z.string(),
  contestantName: z.string().min(2).max(120),
  contestantDoc: z.string().min(11).max(30),
  contestantEmail: z.string().email(),
  argument: z
    .string()
    .min(50, "Argumentacao deve ter ao menos 50 caracteres")
    .max(2000, "Máximo 2000 caracteres"),
});

export const moderationActionSchema = z.object({
  action: z.enum(["HIDE", "UNHIDE", "REMOVE", "ARCHIVE", "PUBLISH"]),
  reason: z.string().min(5).max(500).optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ListReportsInput = z.infer<typeof listReportsSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ContestationInput = z.infer<typeof contestationSchema>;
export type ModerationActionInput = z.infer<typeof moderationActionSchema>;
