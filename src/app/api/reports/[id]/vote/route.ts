import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { castVote } from "@/lib/services/reports";
import { voteSchema } from "@/lib/validations/report";
import { castMockVote, getMockReportById } from "@/lib/mock-report-store";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/reports/:id/vote
 * Body: { type: "CONFIRM" | "FALSE_ALERT" }
 * Se usuário já votou igual: remove voto (toggle).
 * Se já votou diferente: atualiza.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const limited = rateLimit(request, {
      key: "reports:vote",
      limit: 30,
      windowMs: 60_000,
    });
    if (limited) return limited;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para votar" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = voteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Tipo de voto inválido", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Não pode votar na própria denúncia
    if (process.env.OPA_FORCE_MOCK === "true") {
      const report = getMockReportById(id);
      if (!report) {
        return NextResponse.json(
          { error: "Denúncia não encontrada" },
          { status: 404 }
        );
      }

      if (report.author.username === session.user.username) {
        return NextResponse.json(
          { error: "Você não pode votar na própria denúncia" },
          { status: 403 }
        );
      }

      const result = castMockVote({
        reportId: id,
        userId: session.user.id,
        type: parsed.data.type,
      });

      return NextResponse.json(result);
    }

    const report = await db.report.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Denúncia não encontrada" },
        { status: 404 }
      );
    }

    if (report.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Esta denúncia não aceita votos" },
        { status: 403 }
      );
    }

    if (report.authorId === session.user.id) {
      return NextResponse.json(
        { error: "Você não pode votar na própria denúncia" },
        { status: 403 }
      );
    }

    const result = await castVote({
      reportId: id,
      userId: session.user.id,
      type: parsed.data.type,
      voterTier: session.user.reputationTier,
    });

    // Retorna stats atualizadas
    const updated = await db.report.findUnique({
      where: { id },
      select: {
        votesUp: true,
        votesDown: true,
        credibilityScore: true,
        riskLevel: true,
        verified: true,
      },
    });

    return NextResponse.json({ action: result.action, stats: updated });
  } catch (error) {
    console.error("[POST /api/reports/:id/vote]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
