import Link from "next/link";
import { ShieldPlus, FileText, CheckCircle2, Clock3 } from "lucide-react";
import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReportCard } from "@/components/report-card";
import { adaptReport } from "@/lib/report-adapter";
import { getMockReportsByAuthor } from "@/lib/mock-report-store";
import type { Report } from "@/lib/mock-data";

export default async function MinhasDenunciasPage() {
  const user = await requireAuth();
  let reports: Report[] = [];

  try {
    if (process.env.OPA_FORCE_MOCK === "true") {
      reports = getMockReportsByAuthor(user.username);
    } else {
      const items = await db.report.findMany({
        where: { authorId: user.id, status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              reputationTier: true,
            },
          },
        },
      });
      reports = items.map((report) => adaptReport(report));
    }
  } catch (error) {
    console.warn("[minhas-denuncias] DB indisponivel:", (error as Error).message);
    reports = getMockReportsByAuthor(user.username);
  }

  const verifiedCount = reports.filter((report) => report.verified).length;
  const pendingCount = reports.length - verifiedCount;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
            Minhas denuncias
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe as denuncias que voce publicou na plataforma.
          </p>
        </div>
        <Link href="/denunciar">
          <Button size="lg" className="gap-2">
            <ShieldPlus className="size-4" aria-hidden="true" />
            Nova denuncia
          </Button>
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard icon={FileText} label="Publicadas" value={reports.length} />
        <SummaryCard icon={CheckCircle2} label="Verificadas" value={verifiedCount} />
        <SummaryCard icon={Clock3} label="Aguardando validacao" value={pendingCount} />
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldPlus className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold">Voce ainda nao publicou denuncias.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Registre uma tentativa de golpe para proteger outras pessoas.
            </p>
          </div>
          <Link href="/denunciar">
            <Button>Criar primeira denuncia</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums">{value}</p>
      </div>
    </Card>
  );
}
