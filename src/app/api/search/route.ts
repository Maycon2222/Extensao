import { NextResponse } from "next/server";
import { searchReports, sanitizeReport } from "@/lib/services/reports";
import { searchSchema } from "@/lib/validations/report";
import { computeRiskLevel } from "@/lib/scoring";

/**
 * GET /api/search?q=...
 * Busca por telefone, URL ou CNPJ normalizando o input.
 * Retorna: { query, matches, aggregate: { riskLevel, score } }
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = searchSchema.safeParse({ q: url.searchParams.get("q") });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Query inválida", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { matches, query } = await searchReports(parsed.data.q);

    if (matches.length === 0) {
      return NextResponse.json({
        query,
        matches: [],
        aggregate: { riskLevel: "LOW", score: 0 },
      });
    }

    // Calcula score agregado
    const weights = { LOW: 15, MEDIUM: 40, HIGH: 65, CRITICAL: 90 };
    const avgRisk =
      matches.reduce((s, r) => s + weights[r.riskLevel], 0) / matches.length;
    const confirmed = matches.reduce((s, r) => s + r.votesUp, 0);
    const score = Math.min(
      100,
      Math.round(avgRisk + Math.min(confirmed / 5, 20))
    );
    const aggregateRisk = computeRiskLevel(score, confirmed, matches.length);

    return NextResponse.json({
      query,
      matches: matches.map(sanitizeReport),
      aggregate: { riskLevel: aggregateRisk, score },
    });
  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
