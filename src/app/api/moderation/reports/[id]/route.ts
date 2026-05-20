import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moderationActionSchema } from "@/lib/validations/report";
import { getMockReportById, removeMockReport } from "@/lib/mock-report-store";
import { rateLimit } from "@/lib/rate-limit";

/**
 * PATCH /api/moderation/reports/:id
 * Body: { action: "HIDE" | "UNHIDE" | "REMOVE" | "ARCHIVE" | "PUBLISH", reason? }
 * Requer role MODERATOR ou ADMIN.
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const limited = rateLimit(request, {
      key: "moderation:reports",
      limit: 30,
      windowMs: 60_000,
    });
    if (limited) return limited;

    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")
    ) {
      return NextResponse.json(
        { error: "Acesso restrito a moderadores" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = moderationActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ação inválida", issues: parsed.error.flatten() },
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

      if (parsed.data.action === "REMOVE" || parsed.data.action === "HIDE") {
        removeMockReport(id);
        return NextResponse.json({ success: true, status: "REMOVED" });
      }

      return NextResponse.json({ success: true, status: "PUBLISHED" });
    }

    const report = await db.report.findUnique({ where: { id } });
    if (!report) {
      return NextResponse.json(
        { error: "Denúncia não encontrada" },
        { status: 404 }
      );
    }

    const statusMap = {
      HIDE: "HIDDEN",
      UNHIDE: "PUBLISHED",
      REMOVE: "REMOVED",
      ARCHIVE: "ARCHIVED",
      PUBLISH: "PUBLISHED",
    } as const;

    const newStatus = statusMap[parsed.data.action];

    await db.$transaction([
      db.report.update({
        where: { id },
        data: {
          status: newStatus,
          archivedAt: newStatus === "ARCHIVED" ? new Date() : null,
        },
      }),
      db.moderationLog.create({
        data: {
          moderatorId: session.user.id,
          action: parsed.data.action,
          targetType: "report",
          targetId: id,
          reason: parsed.data.reason ?? null,
        },
      }),
    ]);

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("[PATCH /api/moderation/reports/:id]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
