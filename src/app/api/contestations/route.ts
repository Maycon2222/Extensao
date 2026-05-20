import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { contestationSchema } from "@/lib/validations/report";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/contestations
 * Cria pedido de contestação (Art. 18 LGPD).
 * Pode ser feito com ou sem conta (contestante externo).
 */
export async function POST(request: Request) {
  try {
    const limited = rateLimit(request, {
      key: "contestations:create",
      limit: 5,
      windowMs: 60_000,
    });
    if (limited) return limited;

    const session = await auth();
    const body = await request.json();
    const parsed = contestationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const report = await db.report.findUnique({
      where: { id: parsed.data.reportId },
      select: { id: true, status: true },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Denúncia não encontrada" },
        { status: 404 }
      );
    }

    // Checa se já existe contestação aberta
    const existing = await db.contestation.findFirst({
      where: {
        reportId: parsed.data.reportId,
        status: { in: ["OPEN", "UNDER_REVIEW"] },
        contestantEmail: parsed.data.contestantEmail,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "Você já possui uma contestação em andamento para esta denúncia",
        },
        { status: 409 }
      );
    }

    const contestation = await db.contestation.create({
      data: {
        reportId: parsed.data.reportId,
        contestantId: session?.user?.id ?? null,
        contestantName: parsed.data.contestantName,
        contestantDoc: parsed.data.contestantDoc,
        contestantEmail: parsed.data.contestantEmail,
        argument: parsed.data.argument,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(contestation, { status: 201 });
  } catch (error) {
    console.error("[POST /api/contestations]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
