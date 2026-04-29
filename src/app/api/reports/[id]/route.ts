import { NextResponse } from "next/server";
import { getReportById, sanitizeReport } from "@/lib/services/reports";

/**
 * GET /api/reports/:id
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    try {
      const report = await getReportById(id);

      if (!report) {
        return NextResponse.json(
          { error: "Denúncia não encontrada" },
          { status: 404 }
        );
      }

      if (report.status === "REMOVED") {
        return NextResponse.json(
          { error: "Esta denúncia foi removida" },
          { status: 410 }
        );
      }

      return NextResponse.json(sanitizeReport(report));
    } catch (dbError) {
      console.warn("[GET /api/reports/:id] DB indisponivel:", (dbError as Error).message);
      return NextResponse.json(
        { error: "Serviço temporariamente indisponivel", dbAvailable: false },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("[GET /api/reports/:id]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
