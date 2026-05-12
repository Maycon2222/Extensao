import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addComment } from "@/lib/services/reports";
import { commentSchema } from "@/lib/validations/report";
import {
  addMockComment,
  getMockComments,
  getMockReportById,
} from "@/lib/mock-report-store";

/**
 * POST /api/reports/:id/comments
 * Body: { content: string }
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (process.env.OPA_FORCE_MOCK === "true") {
      const report = getMockReportById(id);
      if (!report) {
        return NextResponse.json(
          { error: "Denúncia não encontrada" },
          { status: 404 }
        );
      }

      const comment = addMockComment({
        reportId: id,
        userId: session.user.id,
        username: session.user.username,
        reputationTier: session.user.reputationTier,
        content: parsed.data.content,
      });

      return NextResponse.json(comment, { status: 201 });
    }

    const report = await db.report.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Denúncia não encontrada" },
        { status: 404 }
      );
    }

    if (report.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Esta denúncia não aceita comentários" },
        { status: 403 }
      );
    }

    const comment = await addComment({
      reportId: id,
      authorId: session.user.id,
      content: parsed.data.content,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reports/:id/comments]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

/**
 * GET /api/reports/:id/comments
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (process.env.OPA_FORCE_MOCK === "true") {
      return NextResponse.json({ items: getMockComments(id) });
    }

    const comments = await db.comment.findMany({
      where: { reportId: id, hidden: false },
      orderBy: { createdAt: "desc" },
      take: 50,
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
    return NextResponse.json({ items: comments });
  } catch (error) {
    console.error("[GET /api/reports/:id/comments]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
