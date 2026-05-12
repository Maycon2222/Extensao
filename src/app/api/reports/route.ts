import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createReport,
  listReports,
  sanitizeReport,
} from "@/lib/services/reports";
import {
  createReportSchema,
  listReportsSchema,
} from "@/lib/validations/report";
import { addMockReport } from "@/lib/mock-report-store";

/**
 * GET /api/reports
 * Lista denúncias públicas com filtros.
 * Query params: categories, risks, period, sort, limit, cursor
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = listReportsSchema.safeParse({
      categories: url.searchParams.get("categories") ?? undefined,
      risks: url.searchParams.get("risks") ?? undefined,
      period: url.searchParams.get("period") ?? undefined,
      sort: url.searchParams.get("sort") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parametros invalidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    try {
      const { items, nextCursor } = await listReports(parsed.data);
      return NextResponse.json({
        items: items.map(sanitizeReport),
        nextCursor,
      });
    } catch (dbError) {
      console.warn("[GET /api/reports] DB indisponivel:", (dbError as Error).message);
      // Fallback: retorna lista vazia em vez de 500 quando o banco não está disponível
      return NextResponse.json({ items: [], nextCursor: null, dbAvailable: false });
    }
  } catch (error) {
    console.error("[GET /api/reports]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

/**
 * POST /api/reports
 * Cria nova denúncia (requer autenticação).
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (process.env.OPA_FORCE_MOCK === "true") {
      const report = addMockReport({
        authorUsername: session.user.username,
        category: parsed.data.category,
        identifierType: parsed.data.identifierType,
        identifier: parsed.data.identifier,
        description: parsed.data.description,
        location: parsed.data.location,
        occurredAt: parsed.data.occurredAt,
      });

      return NextResponse.json(
        {
          ...report,
          mockMode: true,
        },
        { status: 201 }
      );
    }

    const report = await createReport({
      authorId: session.user.id,
      category: parsed.data.category,
      identifierType: parsed.data.identifierType,
      identifierRaw: parsed.data.identifier,
      description: parsed.data.description,
      location: parsed.data.location,
      occurredAt: parsed.data.occurredAt,
    });

    return NextResponse.json(sanitizeReport(report), { status: 201 });
  } catch (error) {
    console.error("[POST /api/reports]", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
